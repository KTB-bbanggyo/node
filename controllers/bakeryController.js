const axios = require('axios');
const db = require('../models');
const { QueryTypes } = require('sequelize');

const Bakery = db.Bakery;
const FavoriteBakery = db.FavoriteBakery;

// 서버 메모리 캐시
let temporaryBakeryList = [];

// 1. 빵집 리스트 받기 (서버 메모리에 저장)
exports.receiveBakeries = async (req, res) => {
  try {
    const { prompt, bakeries } = req.body;

    if (!Array.isArray(bakeries) || bakeries.length === 0) {
      return res.status(400).json({ message: 'bakeries가 비어있거나 배열이 아닙니다.' });
    }

    temporaryBakeryList = bakeries;

    let externalResponseData = null;
    if (prompt) {
      try {
        const response = await axios.get(`http://lb-bbanggyo-master-azone-1386370116.ap-northeast-2.elb.amazonaws.com:8000/recommend?prompt=${encodeURIComponent(prompt)}`);
        externalResponseData = response.data;
      } catch (error) {
        console.error('❌ 외부 API 호출 오류:', error.message);
        externalResponseData = null;
      }
    }

    return res.status(200).json({
      message: '✅ 빵집 리스트 저장 완료!',
      promptUsed: prompt || null,
      data: {
        storedBakeries: bakeries,
        externalRecommend: externalResponseData
      }
    });
  } catch (err) {
    console.error('❌ 빵집 리스트 수신 오류:', err);
    return res.status(500).json({ message: '서버 내부 오류' });
  }
};

// 2. 서버 메모리에 저장된 빵집 리스트 반환
exports.sendBakeries = async (req, res) => {
  try {
    if (!temporaryBakeryList.length) {
      return res.status(404).json({ message: '저장된 빵집 리스트가 없습니다.' });
    }
    return res.status(200).json({ message: '✅ 저장된 빵집 리스트', data: temporaryBakeryList });
  } catch (err) {
    console.error('❌ 빵집 리스트 조회 오류:', err);
    return res.status(500).json({ message: '서버 내부 오류' });
  }
};

// 3. 특정 유저가 단일 빵집 찜
exports.addFavoriteBakery = async (req, res) => {
  try {
    const { user_id, bakery_id } = req.body;
    if (!user_id || !bakery_id) {
      return res.status(400).json({ message: 'user_id, bakery_id 모두 필요합니다.' });
    }

    const exists = await FavoriteBakery.findOne({ where: { user_id, bakery_id } });
    if (exists) {
      return res.status(409).json({ message: '이미 찜한 빵집입니다.' });
    }

    await FavoriteBakery.create({ user_id, bakery_id });
    return res.status(201).json({ message: '✅ 빵집 찜 등록 완료!' });
  } catch (err) {
    console.error('❌ 찜 등록 오류:', err);
    return res.status(500).json({ message: '서버 내부 오류' });
  }
};

// 4. 특정 유저가 찜한 빵집 조회
exports.getUserFavoriteBakeries = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'userId 파라미터가 필요합니다.' });
    }

    const favorites = await db.sequelize.query(`
      SELECT b.bakery_id, b.name, b.address, b.phone, b.rating, b.keywords
      FROM FavoriteBakery f
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
    console.error('❌ 찜 목록 조회 오류:', err);
    return res.status(500).json({ message: '서버 내부 오류' });
  }
};
