const express = require('express');
const router = express.Router();

// 회원가입
router.post('/signup', (req, res) => {});

// 로그인
router.post('/signin');

// 비밀번호 초기화
router.post('/reset');
router.put('/reset');

module.exports = router;
