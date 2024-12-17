const express = require('express');
const { addToCart, getCartItems, removeCartItem } = require('../controllers/cartController');
const router = express.Router();

// 장바구니 담기
router.post('/', addToCart);

// 장바구니 조회
router.get('/', getCartItems);

// 장바구니 삭제
router.delete('/:id', removeCartItem);

module.exports = router;
