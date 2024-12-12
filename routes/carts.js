const express = require('express');
const router = express.Router();

// 장바구니 담기
router.post('/', (req, res) => {});

// 장바구니 조회
router.get('/', (req, res) => {});

// 장바구니 삭제
router.delete('/:id', (req, res) => {});

// 장바구니에서 선택한주문 예상 상품 목록 조회
// router.get('/', (req, res) => {});

module.exports = router;
