const express = require('express');
const router = express.Router();
const db = require('./index');
const authMiddleware = require('./authMiddleware');

// DB저장
router.post('/diarysave', async (req, res) => {
    const { title, content, weather, date, comment, user_id, emotionLabel, emotionScore } = req.body;

    try {
      console.log('요청된 title, content, weather, date, comment, user_id, emotionLabel, emotionScore 값 : \n', title, content, weather, date, comment, user_id, emotionLabel, emotionScore);
  
      const [result] = await db.execute(
        'INSERT INTO diaryDB (title, content, weather, date, comment, user_id, emotionLabel, emotionScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, content, weather, date, comment, user_id, emotionLabel, emotionScore]
      );
      res.status(201).json({ message: '일기 저장 성공', userId: result.insertId });
    } catch (err) {
      console.error('DB저장 에러', err);
      res.status(500).json({ error: 'DB저장 실패' });
    }
  });

// 일기 데이터 조회
{/*
router.get('/', async (req, res) => {
  try {
      const [rows] = await db.execute('SELECT * FROM diaryDB');
      res.json(rows);
  } catch (err) {
      console.error("DB 조회 중 에러 발생:", err); // 에러 로그 추가
      res.status(500).json({ error: 'DB 조회 실패' });
  }
});
*/}

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.query.user_id;

  try {
    let rows;

    if (userId) {
      // user_id가 전달된 경우: 해당 유저의 일기만 조회
      [rows] = await db.execute(
        'SELECT * FROM diaryDB WHERE user_id = ?', 
        [userId]
      );
    } else {
      // 전달되지 않으면 전체 일기 반환
      [rows] = await db.execute('SELECT * FROM diaryDB');
    }

    res.json(rows);
  } catch (err) {
    console.error("DB 조회 중 에러 발생:", err);
    res.status(500).json({ error: 'DB 조회 실패' });
  }
});

module.exports = router;