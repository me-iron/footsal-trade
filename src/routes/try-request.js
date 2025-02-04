const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
  createTryRequest, 
  getTryRequestsByProduct, 
  getTryRequestsByUser,
  updateTryRequestStatus,
  getProduct
} = require('../models/product');

const router = express.Router();

// 시착/거래 신청
router.post('/', async (req, res) => {
  try {
    const { productId, userId, requestType, phoneNumber } = req.body;

    // 필수 필드 검증
    if (!productId || !userId || !requestType || !phoneNumber) {
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    // 상품 존재 여부 확인
    const product = await getProduct(productId);
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    // 이미 판매 완료된 상품인지 확인
    if (product.status === 'SOLD') {
      return res.status(400).json({ message: '이미 판매 완료된 상품입니다.' });
    }

    // 신청 생성
    const request = {
      id: uuidv4(),
      productId,
      userId,
      requestType,
      phoneNumber
    };

    await createTryRequest(request);

    res.status(201).json({ message: '신청이 완료되었습니다.', requestId: request.id });
  } catch (error) {
    console.error('Try request creation error:', error);
    res.status(500).json({ message: '신청 중 오류가 발생했습니다.' });
  }
});

// 상품별 신청 목록 조회
router.get('/product/:productId', async (req, res) => {
  try {
    const requests = await getTryRequestsByProduct(req.params.productId);
    res.json(requests);
  } catch (error) {
    console.error('Try requests fetch error:', error);
    res.status(500).json({ message: '신청 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 사용자별 신청 목록 조회
router.get('/user/:userId', async (req, res) => {
  try {
    const requests = await getTryRequestsByUser(req.params.userId);
    res.json(requests);
  } catch (error) {
    console.error('Try requests fetch error:', error);
    res.status(500).json({ message: '신청 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 신청 상태 업데이트
router.put('/:requestId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: '올바르지 않은 상태값입니다.' });
    }

    await updateTryRequestStatus(req.params.requestId, status);
    res.json({ message: '상태가 업데이트되었습니다.' });
  } catch (error) {
    console.error('Try request status update error:', error);
    res.status(500).json({ message: '상태 업데이트 중 오류가 발생했습니다.' });
  }
});

module.exports = router; 