const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "인증 토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 사용자 정보를 req.user에 저장
    next(); // 다음 미들웨어 또는 라우터로 넘어감
  } catch (err) {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

module.exports = authMiddleware;