// controllers/bakeryController.js
const db = require('../models');
const { QueryTypes } = require('sequelize');

// ====== 기존 단일 빵집 및 찜 로직 ======
const Bakery = db.Bakery;                // 단일 빵집 테이블
const FavoriteBackery = db.FavoriteBackery;  // 찜 테이블

// ====== 메모리 변수에 빵집 리스트 저장/조회 ======
let temporaryBakeryList = [];

/**
 * 1) 빵집 리스트(JSON) 받기 (저장 X, DB X) 
 *    → 일단 서버 메모리 변수(temporaryBakeryList)에 보관
 */
exports.receiveBakeries = async (req, res) => {
  try {
    const bakeriesArray = req.body;  // [{...}, {...}, ...]

    if (!Array.isArray(bakeriesArray) || bakeriesArray.length === 0) {
      return res.status(400).json({ message: '빵집 리스트가 비어있거나 배열이 아닙니다.' });
    }

    // 메모리 변수에 저장
    temporaryBakeryList = bakeriesArray;

    return res.status(200).json({
      message: '✅ 빵집 리스트를 잘 받았습니다! (서버 메모리에 저장)',
      data: bakeriesArray
    });
  } catch (err) {
    console.error('❌ 빵집 리스트 수신 중 오류 발생:', err);
    return res.status(500).json({ message: '빵집 리스트 수신 중 오류 발생' });
  }
};

/**
 * 2) 현재 서버 메모리에 저장된 빵집 리스트 반환
 *    → 위 receiveBakeries에서 저장한 temporaryBakeryList 사용
 */
exports.sendBakeries = async (req, res) => {
  try {
    // 저장된 리스트가 없는 경우 처리
    if (!Array.isArray(temporaryBakeryList) || temporaryBakeryList.length === 0) {
      return res.status(404).json({ message: '서버 메모리에 저장된 빵집 리스트가 없습니다.' });
    }

    return res.status(200).json({
      message: '✅ 서버 메모리에 저장된 빵집 리스트입니다.',
      data: temporaryBakeryList
    });
  } catch (err) {
    console.error('❌ 빵집 리스트 조회 중 오류 발생:', err);
    return res.status(500).json({ message: '빵집 리스트 조회 중 오류 발생' });
  }
};


// ====== 기존 찜 로직 그대로 ======

/**
 * 3) 특정 유저가 단일 빵집을 찜 등록
 */
exports.addFavoriteBakery = async (req, res) => {
  try {
    const { user_id, bakery_id } = req.body;
    if (!user_id || !bakery_id) {
      return res.status(400).json({ message: 'user_id, bakery_id 모두 필요합니다.' });
    }

    // 이미 있는지 확인
    const exists = await FavoriteBackery.findOne({ where: { user_id, bakery_id } });
    if (exists) {
      return res.status(409).json({ message: '이미 찜한 빵집입니다.' });
    }

    // 찜 등록
    await FavoriteBackery.create({ user_id, bakery_id });
    return res.status(201).json({ message: '✅ 빵집 찜 등록 완료!' });
  } catch (err) {
    console.error('❌ 찜 등록 중 오류 발생:', err);
    return res.status(500).json({ message: '찜 등록 중 오류 발생' });
  }
};

/**
 * 4) 특정 유저가 찜한 빵집 조회
 */
exports.getUserFavoriteBakeries = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'userId 파라미터가 필요합니다.' });
    }

    const favorites = await db.sequelize.query(`
      SELECT b.bakery_id, b.name, b.address, b.phone, b.rating, b.keywords
      FROM FavoriteBackery f
      JOIN Bakery b ON f.bakery_id = b.bakery_id
      WHERE f.user_id = :userId
    `, {
      replacements: { userId },
      type: QueryTypes.SELECT
    });

    if (!favorites.length) {
      return res.status(404).json({ message: '찜한 빵집이 없습니다.' });
    }

    return res.status(200).json(favorites);
  } catch (err) {
    console.error('❌ 찜 목록 조회 중 오류 발생:', err);
    return res.status(500).json({ message: '찜 목록 조회 중 오류 발생' });
  }
};
