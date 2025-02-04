const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../footsal.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    // 상품 테이블 생성
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        size REAL NOT NULL,
        price INTEGER NOT NULL,
        condition TEXT NOT NULL,
        description TEXT,
        images TEXT,
        status TEXT DEFAULT 'AVAILABLE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // 매치 정보 테이블 생성
    db.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        plab_url TEXT NOT NULL,
        location TEXT NOT NULL,
        address TEXT NOT NULL,
        match_datetime DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    // 시착/거래 신청 테이블 생성
    db.run(`
      CREATE TABLE IF NOT EXISTS try_requests (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        request_type TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        phone_number TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
  }
});

// 상품 생성
const createProduct = (product) => {
  return new Promise((resolve, reject) => {
    const { id, userId, brand, model, size, price, condition, description, images } = product;
    
    db.run(
      `INSERT INTO products (
        id, user_id, brand, model, size, price, condition, description, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, brand, model, size, price, condition, description, JSON.stringify(images)],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// 매치 정보 생성
const createMatch = (match) => {
  return new Promise((resolve, reject) => {
    const { id, productId, plabUrl, location, address, matchDatetime } = match;
    
    db.run(
      `INSERT INTO matches (
        id, product_id, plab_url, location, address, match_datetime
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, productId, plabUrl, location, address, matchDatetime],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// 상품 조회
const getProduct = (productId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT p.*, m.plab_url, m.location, m.address, m.match_datetime
       FROM products p
       LEFT JOIN matches m ON p.id = m.product_id
       WHERE p.id = ?`,
      [productId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row && row.images) {
            row.images = JSON.parse(row.images);
          }
          resolve(row);
        }
      }
    );
  });
};

// 모든 상품 조회
const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT p.*, m.plab_url, m.location, m.address, m.match_datetime
       FROM products p
       LEFT JOIN matches m ON p.id = m.product_id
       ORDER BY p.created_at DESC`,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          rows.forEach(row => {
            if (row.images) {
              row.images = JSON.parse(row.images);
            }
          });
          resolve(rows);
        }
      }
    );
  });
};

// 시착/거래 신청 생성
const createTryRequest = (request) => {
  return new Promise((resolve, reject) => {
    const { id, productId, userId, requestType, phoneNumber } = request;
    
    db.run(
      `INSERT INTO try_requests (
        id, product_id, user_id, request_type, phone_number
      ) VALUES (?, ?, ?, ?, ?)`,
      [id, productId, userId, requestType, phoneNumber],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// 상품별 시착/거래 신청 목록 조회
const getTryRequestsByProduct = (productId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT tr.*, u.phone_number as user_phone
       FROM try_requests tr
       LEFT JOIN users u ON tr.user_id = u.id
       WHERE tr.product_id = ?
       ORDER BY tr.created_at DESC`,
      [productId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

// 사용자별 시착/거래 신청 목록 조회
const getTryRequestsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT tr.*, p.brand, p.model, p.size, p.price, p.status as product_status,
              m.location, m.match_datetime
       FROM try_requests tr
       LEFT JOIN products p ON tr.product_id = p.id
       LEFT JOIN matches m ON p.id = m.product_id
       WHERE tr.user_id = ?
       ORDER BY tr.created_at DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

// 시착/거래 신청 상태 업데이트
const updateTryRequestStatus = (requestId, status) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE try_requests SET status = ? WHERE id = ?',
      [status, requestId],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

module.exports = {
  createProduct,
  createMatch,
  getProduct,
  getAllProducts,
  createTryRequest,
  getTryRequestsByProduct,
  getTryRequestsByUser,
  updateTryRequestStatus
}; 