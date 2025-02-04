const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { createProduct, createMatch, getProduct, getAllProducts } = require('../models/product');
const upload = require('../middleware/upload');
const router = express.Router();

// 상품 등록
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const {
      userId,
      brand,
      model,
      size,
      price,
      condition,
      description,
      plabUrl,
      location,
      address,
      matchDatetime
    } = req.body;

    // 필수 필드 검증
    if (!userId || !brand || !model || !size || !price || !condition || !plabUrl) {
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    // 이미지 파일 경로 저장
    const images = req.files ? req.files.map(file => file.path) : [];

    // 상품 생성
    const productId = uuidv4();
    const product = {
      id: productId,
      userId,
      brand,
      model,
      size: parseFloat(size),
      price: parseInt(price),
      condition,
      description,
      images
    };

    await createProduct(product);

    // 매치 정보 생성
    const match = {
      id: uuidv4(),
      productId,
      plabUrl,
      location,
      address,
      matchDatetime: new Date(matchDatetime)
    };

    await createMatch(match);

    // 생성된 상품 정보 조회
    const createdProduct = await getProduct(productId);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: '상품 등록 중 오류가 발생했습니다.' });
  }
});

// 모든 상품 조회
router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: '상품 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 특정 상품 조회
router.get('/:id', async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: '상품 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router; 