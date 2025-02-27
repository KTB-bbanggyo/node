const db = require('../models');
const Bakery = db.Bakery;

// ✅ 빵집 전체 목록 조회
exports.getAllBakeries = async (req, res) => {
  try {
    const bakeries = await Bakery.findAll();
    res.json(bakeries);
  } catch (err) {
    console.error('❌ 빵집 정보를 가져오는 중 오류 발생:', err);
    res.status(500).json({ message: '빵집 정보를 가져오는 중 오류 발생' });
  }
};

// ✅ 특정 빵집 정보 조회
exports.getBakeryById = async (req, res) => {
  try {
    const bakery = await Bakery.findByPk(req.params.id);
    if (!bakery) {
      return res.status(404).json({ message: '빵집을 찾을 수 없습니다' });
    }
    res.json(bakery);
  } catch (err) {
    console.error('❌ 빵집 정보를 가져오는 중 오류 발생:', err);
    res.status(500).json({ message: '빵집 정보를 가져오는 중 오류 발생' });
  }
};

// 빵집 정보 가져오는 API from AI
exports.addBakery = async (req, res) => {
  try {
    const { name, address, description, rating } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({ message: '이름과 주소는 필수 입력 항목입니다.' });
    }

    const newBakery = await Bakery.create({
      name,
      address,
      description: description || null,
      rating: rating || 0
    });

    res.status(201).json({ message: '✅ 빵집 저장 완료!', bakery: newBakery });
  } catch (err) {
    console.error('❌ 빵집 저장 중 오류 발생:', err);
    res.status(500).json({ message: '빵집 저장 중 오류 발생' });
  }
};

// 빵집 정보 조회 API to front
exports.getSavedBakeries = async (req, res) => {
  try {
    const savedBakeries = await Bakery.findAll();
    
    if (!savedBakeries.length) {
      return res.status(404).json({ message: '저장된 빵집 정보가 없습니다.' });
    }

    res.json(savedBakeries);
  } catch (err) {
    console.error('❌ 저장된 빵집 정보를 가져오는 중 오류 발생:', err);
    res.status(500).json({ message: '저장된 빵집 정보를 가져오는 중 오류 발생' });
  }
};
