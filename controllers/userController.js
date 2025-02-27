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

// 사용자의 입력 문장과 찜한 빵집을 AI API로 전송하는 함수
exports.sendToAI = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "프롬프트 문장이 필요합니다." });
    }

    const user = await User.findByPk(userId, {
      include: [{
        model: Bakery,
        as: 'favorites',
        through: { attributes: [] }
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const favoriteBakeries = user.favorites.map(bakery => bakery.name);

    // AI 요청 문자열 구성
    const formattedPrompt = encodeURIComponent(
      `${prompt}\n사용자가 찜한 빵집이야. 참고해. 꼭 찜한 빵집들 위주로 추천할 필요는 없어.\n{${favoriteBakeries.join(", ")}}`
    );

    //const aiUrl = `http://ai-server-url.com/recommend?prompt=${formattedPrompt}`;
    const aiUrl = `http://lb-bbanggyo-master-azone-1386370116.ap-northeast-2.elb.amazonaws.com:8000/recommend?prompt=${formattedPrompt}`;

    // AI API 호출 (GET 요청)
    const aiResponse = await axios.get(aiUrl);

    return res.json({ 
      message: "AI에 성공적으로 데이터를 보냈습니다.",
      aiResponse: aiResponse.data
    });

  } catch (error) {
    console.error("AI 전송 중 오류 발생:", error);
    return res.status(500).json({ message: "AI 전송 중 오류 발생" });
  }
};