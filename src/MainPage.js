import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginUser from './Park/LoginUser';

const MainPage = () => {
    const navigate = useNavigate();
    const { user, login } = LoginUser();

    return (
        <div>
            안녕하세요. 로그인 정보 : {user?.nickname}, {user?.password}, {user?.id}<br />
            <button onClick={() => {navigate('/handdiary')}}>직접일기(Test.js)</button>
            <button onClick={() => {navigate('/aidiary')}}>AI일기</button>
            <button onClick={() => {navigate('/register')}}>회원가입</button>
            <button onClick={() => {navigate('/login')}}>로그인</button>
            <button onClick={() => {navigate('/userlist')}}>회원목록</button>
            <button onClick={() => {navigate('/Mypagelist')}}>글목록</button>
        </div>
    );
};

export default MainPage;