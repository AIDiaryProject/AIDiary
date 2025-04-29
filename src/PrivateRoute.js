import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token"); // 예시: 토큰으로 로그인 상태 판단
  return isLoggedIn ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;