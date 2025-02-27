const express = require('express');
const router = express.Router();
const bakeryController = require('../controllers/bakeryController');

/**
 * @route POST /ai/bakery
 * @desc 사용자의 프롬프트 및 찜한 빵집 정보를 AI에 전달하고 응답을 반환
 * @access Public
 */
router.post('/ai/bakery', bakeryController.processBakeryRequest);

// 2. 특정 유저가 빵집 찜 등록
router.post('/favorite', bakeryController.addFavoriteBakery);

// 3. 특정 유저가 찜한 빵집 목록 조회
router.get('/favorite/:userId', bakeryController.getUserFavoriteBakeries);

module.exports = router;
