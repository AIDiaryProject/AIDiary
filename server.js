require('dotenv').config(); // 환경 변수 로드

const express = require('express');
const cors = require('cors');
const usersRouter = require('./others/users');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter); // '/api/users' 경로로 라우터 설정

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
