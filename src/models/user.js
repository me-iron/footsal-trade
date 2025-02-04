const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 연결
const db = new sqlite3.Database(path.join(__dirname, '../../footsal.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    // 사용자 테이블 생성
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phone_number TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// 사용자 생성
const createUser = (user) => {
  return new Promise((resolve, reject) => {
    const { id, phoneNumber, password } = user;
    db.run(
      'INSERT INTO users (id, phone_number, password) VALUES (?, ?, ?)',
      [id, phoneNumber, password],
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

// 휴대전화번호로 사용자 찾기
const findUserByPhone = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE phone_number = ?',
      [phoneNumber],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

module.exports = {
  createUser,
  findUserByPhone
};
