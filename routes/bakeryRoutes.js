const express = require('express');
const router = express.Router();
const bakeryController = require('../controllers/bakeryController');

// 빵집 전체 목록 조회
router.get('/', bakeryController.getAllBakeries);

// 특정 빵집 정보 조회
router.get('/:id', bakeryController.getBakeryById);

module.exports = router;
