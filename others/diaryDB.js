const express = require('express');
const router = express.Router();
const db = require('./index');

// DB저장
router.post('/diarysave', async (req, res) => {
    const { title, content, weather, mood, date, comment, nickname } = req.body;

    try {
      console.log('요청된 title, content, weather, mood, date, comment, nickname 값 : \n', title, content, weather, mood, date, comment, nickname);
  
      const [result] = await db.execute(
        'INSERT INTO diaryDB (title, content, weather, mood, date, comment, nickname) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, content, weather, mood, date, comment, nickname]
      );
      res.status(201).json({ message: '일기 저장 성공', userId: result.insertId });
    } catch (err) {
      console.error('DB저장 에러', err);
      res.status(500).json({ error: 'DB저장 실패' });
    }
  });

  module.exports = router;