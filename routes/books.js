const express = require('express');
const { allBooks, bookDetail } = require('../controllers/bookController');
const router = express.Router();

// 전체 도서 & 카테고리별 도서
router.get('/', allBooks);

// 개별 도서
router.get('/:id', bookDetail);

router.get('/category');

module.exports = router;
