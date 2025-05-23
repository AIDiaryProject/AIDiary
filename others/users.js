const express = require('express');
const router = express.Router();
const db = require('./index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

// 회원가입
router.post('/register', async (req, res) => {
  const { id, password, nickname, profile, item, point } = req.body; //사용자 요청 정보 받음

  try {
    const hashedPassword = await bcrypt.hash(password, 10); //비밀번호 암호화, 10은 Salting Round로 내부적으로 해시 연산을 반복할 횟수(복잡도가 높을수록 보안 ↑, 성능 ↓)
    console.log('요청된 id, password, hashedPassword, nickname, profile, item, point 값 : \n', id, password, hashedPassword, nickname, profile, item, point);

    const [result] = await db.execute( //db.execute: SQL 쿼리를 실행하는 함수. db.excute는 결과값을 배열([rows, fields])로 반환하므로 [result]로 선언
      'INSERT INTO users (id, password, nickname, profile, item, point) VALUES (?, ?, ?, ?, ?, ?)',
      [id, hashedPassword, nickname, profile, item, point]
    );
    
    res.status(201).json({ message: '회원가입 성공', userId: result.insertId }); //응답 데이터를 json 형식으로 반환. 201은 http 상태 코드(201: 요청 성공, 그 결과로 리소스 생성 및 반환)
  } catch (err) {
    console.error('회원가입 에러', err);
    res.status(500).json({ error: '서버 오류 : 회원가입 실패' });
  }
});

// 회원가입 시 ID 중복 확인
router.get('/check-id', async (req, res) => {
  const { id } = req.query;
  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (err) {
    console.error('ID 중복 확인 에러:', err);
    res.status(500).json({ error: '서버 오류 : ID 중복 확인 실패' });
  }
});

// 닉네임 중복 확인
router.get('/check-nickname', async (req, res) => {
  const { nickname } = req.query;
  try {
    const [rows] = await db.execute('SELECT nickname FROM users WHERE nickname = ?', [nickname]);
    if (rows.length > 0) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (err) {
    console.error('닉네임 중복 확인 에러:', err);
    res.status(500).json({ error: '서버 오류 : 닉네임 중복 확인 실패' });
  }
});

// 닉네임 변경 (로그인 필요)
router.patch('/change-nickname', authMiddleware, async (req, res) => {
  const userId = req.user.id; // authMiddleware 통해서 인증된 사용자 ID
  const { newNickname } = req.body;

  try { // 닉네임 중복 확인
    const [existing] = await db.execute('SELECT nickname FROM users WHERE nickname = ?', [newNickname]);
    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 사용 중인 닉네임입니다.' });
    }

    // 닉네임 변경
    await db.execute('UPDATE users SET nickname = ? WHERE id = ?', [newNickname, userId]);
    res.json({ message: '닉네임이 성공적으로 변경되었습니다.' });
  } catch (err) {
    console.error('닉네임 변경 오류:', err);
    res.status(500).json({ error: '서버 오류 : 닉네임 변경 실패' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { id, password } = req.body;

  try {
    // 아이디로 사용자 조회
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: '서버 오류 : 존재하지 않는 ID입니다.' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password); //password를 암호화하여 user.password와 비교.
    if (!isMatch) {
      return res.status(401).json({ error: '서버 오류 : 비밀번호가 틀렸습니다.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); //expiresIn: '1h' 인증 유효기간 1시간

    res.json({ message: '로그인 성공', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류 : 로그인 실패' });
  }
});

// 회원 정보 조회
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error("서버 오류 : DB 조회 중 에러 발생:", err); // 에러 로그 추가
        res.status(500).json({ error: '서버 오류 : DB 조회 실패' });
    }
});

// 프로필 변경
router.patch('/change-profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { newProfile } = req.body;

  try {
    const [rows] = await db.execute('SELECT item FROM users WHERE id = ?', [userId]); // item은 이미 JSON 타입으로 저장되어 있으므로 바로 사용 가능
    const userItem = rows[0]?.item || [];

    console.log('DB에서 읽어온 item:', userItem); // 배열 형태로 나와야 함

    if (!Array.isArray(userItem)) {
      return res.status(500).json({ error: '서버 오류 : DB item 필드가 배열이 아닙니다.' });
    }

    if (!userItem.includes(newProfile)) { // 선택한 프로필이 보유한 아이템인지 확인
      return res.status(400).json({ error: '서버 오류 : 선택한 친구는 아는 친구가 아닙니다.' });
    }

    await db.execute('UPDATE users SET profile = ? WHERE id = ?', [newProfile, userId]); // 프로필 변경
    res.json({ message: '새로운 친구와 동행합니다.' });

  } catch (err) {
    console.error('프로필 변경 오류:', err);
    res.status(500).json({ error: '서버 오류 : 프로필 변경 실패' });
  }
});

// 프로필 구매
router.post('/buy-profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { profileId, price } = req.body;

  try {
    const [rows] = await db.execute('SELECT item, point FROM users WHERE id = ?', [userId]); // 1. 사용자 정보 조회
    const user = rows[0];

    if (!user) return res.status(404).json({ error: '서버 오류 : 사용자를 찾을 수 없습니다.' });

    const itemArray = user.item || [];
    const currentPoint = user.point;

    if (itemArray.includes(profileId)) { // 2. 이미 보유 중인지 확인
      return res.status(400).json({ error: '서버 오류 : 이미 알고 있는 친구입니다.' });
    }

    if (currentPoint < price) { // 3. 포인트 부족 시
      return res.status(400).json({ error: '서버 오류 : 보유 열매가 부족합니다.' });
    }

    const newItemArray = [...itemArray, profileId]; // 4. 새로운 item 배열 구성

    await db.execute( // 5. DB 업데이트
      'UPDATE users SET item = ?, point = ? WHERE id = ?',
      [JSON.stringify(newItemArray), currentPoint - price, userId]
    );

    res.json({
      message: '프로필 구매 성공',
      newItem: newItemArray,
      newPoint: currentPoint - price
    });
  } catch (err) {
    console.error('프로필 구매 오류:', err);
    res.status(500).json({ error: '서버 오류로 구매 실패' });
  }
});

// 포인트 추가
router.patch('/add-point', authMiddleware, async (req, res) => {
  const { userId, amount, type } = req.body;

  if (!userId || typeof amount !== 'number' || amount <= 0 || !['plus', 'minus'].includes(type)) {
    return res.status(400).json({ error: 'userId, amount, type 값을 정확히 전달해야 합니다.' });
  }

  // type에 따라 amount를 음수로 변환
  const finalAmount = type === 'minus' ? -amount : amount;

  try {
    await db.execute('UPDATE users SET point = point + ? WHERE id = ?', [finalAmount, userId]);
    //res.json({ message: `열매가 ${type === 'plus' ? '추가' : '차감'}되었습니다.` });
  } catch (err) {
    console.error('포인트 처리 오류:', err);
    res.status(500).json({ error: '서버 오류로 열매 지급에 오류가 발생했습니다.' });
  }
});

// 로그인한 사용자만 접근 가능한 API
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.execute('SELECT id, nickname, profile, item, point, diarydate FROM users WHERE id = ?', [userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류 : 사용자 정보 조회 실패' });
  }
});

module.exports = router;
