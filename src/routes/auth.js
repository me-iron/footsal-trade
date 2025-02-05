const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');

const router = express.Router();

// 휴대전화번호 유효성 검사
const validatePhoneNumber = (phoneNumber) => {
  const regex = /^010-\d{4}-\d{4}$/;
  return regex.test(phoneNumber);
};

// 비밀번호 유효성 검사
const validatePassword = (password) => {
  return password.length === 6 && /^\d+$/.test(password);
};

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // 입력값 검증
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: '올바른 휴대전화번호 형식이 아닙니다.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: '비밀번호는 6자리 숫자여야 합니다.' });
    }

    // 기존 사용자 확인
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: '이미 등록된 휴대전화번호입니다.' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = new User({
      id: uuidv4(),
      phoneNumber,
      password: hashedPassword
    });
    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, userId: user.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // 입력값 검증
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: '올바른 휴대전화번호 형식이 아닙니다.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: '비밀번호는 6자리 숫자여야 합니다.' });
    }

    // 사용자 찾기
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ message: '등록되지 않은 사용자입니다.' });
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
