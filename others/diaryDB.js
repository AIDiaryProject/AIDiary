const express = require('express');
const router = express.Router();
const db = require('./index');

// DB저장
router.post('/diarysave', async (req, res) => {
    const { title, content, weather, mood, date, comment, nickname } = req.body; //사용자 요청 정보 받음

    try {
      console.log('요청된 title, content, weather, mood, date, comment, nickname 값 : \n', title, content, weather, mood, date, comment, nickname);
  
      const [result] = await db.execute( //db.execute: SQL 쿼리를 실행하는 함수. db.excute는 결과값을 배열([rows, fields])로 반환하므로 [result]로 선언
        'INSERT INTO diaryDB (title, content, weather, mood, date, comment, nickname) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, content, weather, mood, date, comment, nickname]
      );
      res.status(201).json({ message: '일기 저장 성공', userId: result.insertId }); //응답 데이터를 json 형식으로 반환. 201은 http 상태 코드(201: 요청 성공, 그 결과로 리소스 생성 및 반환)
    } catch (err) {
      console.error('회원가입 에러', err);
      res.status(500).json({ error: '회원가입 실패' });
    }
  });