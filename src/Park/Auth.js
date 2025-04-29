import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import "./Park.scss";

const Auth = () => {
  const [isActive, setIsActive] = useState(false); //로그인, 회원가입 전환 토글

  const toggle = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="auth-wrapper">
      <section className={`auth ${isActive ? "auth-active" : ""}`}>
        {/* 좌측, 회원가입 */}
        <div className="auth__left">
          {/* <img className='auth__img' src="//unsplash.it/600" alt="" /> */}
          <img className='auth__img' src="/logo_all.png" alt="" />
          <div className='auth__content'>
            <Register />
            <p className='auth__text'>
              이미 계정이 있으신가요?
              <a href="#login" onClick={toggle} className='auth__register-link'>
                로그인
              </a>
            </p>
          </div>
        </div>

        {/* 우측, 로그인 */}
        <div className="auth__right">
          {/* <img className='auth__img' src="//unsplash.it/600" alt="" /> */}
          <img className='auth__img' src="/logo_all.png" alt="" />
          <div className='auth__content'>
            <Login />
            <p className='auth__text'>
              혹시 계정이 없으신가요?
              <a href="#register" onClick={toggle} className='auth__login-link'>
                회원가입
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;
