const db = require('../models');
const User = db.User;
const Bakery = db.Bakery;
const Favorite = db.Favorite;

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '사용자 프로필 조회 중 오류 발생' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{
        model: Bakery,
        as: 'favorites',
        through: { attributes: [] }
      }]
    });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '찜한 빵집 목록 조회 중 오류 발생' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { bakeryId } = req.body;

    // 사용자 & 빵집 존재 여부 확인
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });

    const bakery = await Bakery.findByPk(bakeryId);
    if (!bakery) return res.status(404).json({ message: '빵집을 찾을 수 없습니다' });

    // 중복 등록 방지
    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId, bakeryId }
    });
    if (!created) {
      return res.status(400).json({ message: '이미 찜한 빵집입니다' });
    }
    res.json({ message: '찜한 빵집으로 등록되었습니다' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '찜한 빵집 등록 중 오류 발생' });
  }
};

exports.collectPreference = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { preference } = req.body; // 예: "바삭한 식감, 고소한 맛 선호"
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });

    const newPreferences = { ...user.preferences, initialPreference: preference };
    await user.update({ preferences: newPreferences });
    res.json({ message: '선호도가 수집되었습니다', preferences: newPreferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '선호도 수집 중 오류 발생' });
  }
};

exports.updatePreference = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { preference } = req.body; // 예: "최근 찜한 빵집 정보를 반영"
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });

    const newPreferences = { ...user.preferences, updatedPreference: preference };
    await user.update({ preferences: newPreferences });
    res.json({ message: '선호도가 업데이트되었습니다', preferences: newPreferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '선호도 업데이트 중 오류 발생' });
  }
};
