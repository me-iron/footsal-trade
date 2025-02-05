const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const tryRequestRoutes = require('./routes/try-request');

const app = express();

// CORS 설정
app.use(cors({
  origin: ['https://new-footsal-trade.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 미들웨어
app.use(express.json());

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 라우터
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/try-requests', tryRequestRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Footsal Trade API' });
});

// Vercel의 서버리스 환경을 위한 export
module.exports = app;
