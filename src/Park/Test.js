import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import "./Park.scss";

const Test = () => {
  const [isActive, setIsActive] = useState(false); //로그인, 회원가입 전환 토글

  const toggle = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="auth-wrapper">
      <section className={`auth ${isActive ? "auth-active" : ""}`}>
        {/* 좌측, 회원가입 */}
        <div className="auth__left">
          <img src="//unsplash.it/600" alt="" />
          <div className="auth__form auth__form-signup">
            {/* <h1 className="auth__form-title">회원가입</h1> */}
            {/* <form>
              <input type="text" placeholder="아이디" />
              <input type="text" placeholder="닉네임" />
              <input type="password" placeholder="비밀번호" />
              <input type="password" placeholder="비밀번호 확인" />
              <input type="submit" value="회원가입" />
            </form> */}
            <Register />
            <p>
              이미 계정이 있으신가요?
              <a href="#login" onClick={toggle}>
                로그인
              </a>
            </p>
          </div>
        </div>

        {/* 우측, 로그인 */}
        <div className="auth__right">
          <img src="//unsplash.it/600" alt="" />
          <div className="auth__form auth__form-signin">
            {/* <h1>로그인</h1> */}
            {/* <form>
              <input type="text" placeholder="아이디" />
              <input type="password" placeholder="비밀번호" />
              <input type="submit" value="로그인" />
            </form> */}
            <Login />
            <p>
              혹시 계정이 없으신가요?
              <a href="#register" onClick={toggle}>
                회원가입
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Test;
