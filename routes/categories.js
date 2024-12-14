const express = require('express');
const { allCategory } = require('../controllers/categoryController');
const router = express.Router();

// 전체 카테고리 조회
router.get('/', allCategory);

module.exports = router;
