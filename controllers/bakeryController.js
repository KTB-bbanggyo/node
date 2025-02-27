const db = require('../models');
const Bakery = db.Bakery;

exports.getAllBakeries = async (req, res) => {
  try {
    const bakeries = await Bakery.findAll();
    res.json(bakeries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '빵집 정보를 가져오는 중 오류 발생' });
  }
};

exports.getBakeryById = async (req, res) => {
  try {
    const bakery = await Bakery.findByPk(req.params.id);
    if (!bakery) {
      return res.status(404).json({ message: '빵집을 찾을 수 없습니다' });
    }
    res.json(bakery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '빵집 정보를 가져오는 중 오류 발생' });
  }
};
