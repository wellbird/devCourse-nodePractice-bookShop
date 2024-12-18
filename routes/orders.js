const express = require('express');
const { order, getOrders, getOrderDetail } = require('../controllers/orderController');
const router = express.Router();

// 주문 하기
router.post('/', order);

// 주문 목록 조회
router.get('/', getOrders);

// 주문 상세 상품 조회
router.delete('/:id', getOrderDetail);

module.exports = router;
