const express = require('express');
const router = express.Router();
const db = require('./index');

// 회원가입
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    res.status(201).json({ message: '회원가입 성공', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원가입 실패' });
  }
});

// 회원 정보 조회
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error("DB 조회 중 에러 발생:", err); // 에러 로그 추가
        res.status(500).json({ error: 'DB 조회 실패' });
    }
});

module.exports = router;
