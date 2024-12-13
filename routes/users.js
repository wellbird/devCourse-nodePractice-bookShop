const express = require('express');
const router = express.Router();
const { signup, signin, passwordResetRequest, passwordReset } = require('../controllers/userController');

// 회원가입
router.post('/signup', signup);

// 로그인
router.post('/signin', signin);

// 비밀번호 초기화
router.post('/reset', passwordResetRequest);
router.put('/reset', passwordReset);

module.exports = router;
