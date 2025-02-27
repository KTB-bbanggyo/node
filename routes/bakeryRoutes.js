// routes/bakery.js
const express = require('express');
const router = express.Router();
const bakeryController = require('../controllers/bakeryController');

// (A) 빵집 리스트(JSON) 받아서 즉시 반환 (DB 저장 X)
router.post('/passthrough', bakeryController.passBakeries);

// (B) 빵집 찜 등록
router.post('/favorite', bakeryController.addFavoriteBakery);

// (C) 찜 목록 조회
router.get('/favorite/:userId', bakeryController.getUserFavoriteBakeries);

module.exports = router;
