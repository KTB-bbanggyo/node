// routes/bakery.js

const express = require('express');
const router = express.Router();
const bakeryController = require('../controllers/bakeryController');

// (1) 빵집 리스트(JSON) 받기 → 메모리에 저장 + 외부 API 호출
// Request Body 예: { prompt: "...", bakeries: [ { ... }, { ... } ] }
router.post('/bakery', bakeryController.receiveBakeries);

// (2) 저장된 빵집 리스트 조회
router.get('/bakery', bakeryController.sendBakeries);

// (3) 특정 유저가 빵집 찜 등록
router.post('/favorite', bakeryController.addFavoriteBakery);

// (4) 특정 유저가 찜한 빵집 목록 조회
router.get('/favorite/:userId', bakeryController.getUserFavoriteBakeries);

module.exports = router;
