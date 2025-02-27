const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 사용자 프로필 조회
router.get('/:userId/profile', userController.getUserProfile);

// 찜한 빵집 목록 조회
router.get('/:userId/favorites', userController.getFavorites);

// 찜한 빵집 등록
router.post('/:userId/favorites', userController.addFavorite);

// 사용자 선호도 수집
router.post('/:userId/preferences', userController.collectPreference);

// 사용자 선호도 업데이트
router.put('/:userId/preferences', userController.updatePreference);

module.exports = router;
