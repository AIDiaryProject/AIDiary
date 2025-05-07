import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try { //서버에서 로그인 정보 비교(user.js의 login)
      // const res = await axios.post('http://localhost:5000/users/login', {
      const res = await axios.post('https://aidiary.onrender.com/users/login', {
        id,
        password,
      });

      // 로그인 성공 시
      const { token } = res.data;
      localStorage.setItem('token', token);
      alert('로그인 성공!');
      navigate('/');
      window.location.reload(); //페이지 새로고침
    } catch (err) {
      console.error('로그인 에러:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('서버 오류로 로그인 실패');
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className='login'>
      <h1 className='login__title'>로그인</h1>
        <div className='login__item-div'>
          <input
            type="text"
            placeholder="아이디"
            value={id}
            className='login__input'
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className='login__item-div'>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            className='login__input'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className='login__button'>로그인</button>
    </form>
  );
};

export default Login;
