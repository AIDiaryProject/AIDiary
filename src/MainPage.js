import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginUser from './Park/LoginUser';
import CheckDiary from './Lee/CheckDiary';

const MainPage = () => {
    const navigate = useNavigate();
    const { user, login } = LoginUser();
    const [loadingTarget, setLoadingTarget] = useState(null);

    return (
        <div>
            <CheckDiary
            to="/handdiary"
            loadingTarget={loadingTarget}
            setLoadingTarget={setLoadingTarget}
            >
            직접 일기
            </CheckDiary>
            <CheckDiary
            to="/aidiary"
            loadingTarget={loadingTarget}
            setLoadingTarget={setLoadingTarget}
            >
            AI 일기
            </CheckDiary>
            <button onClick={() => {navigate('/handdiary')}}>직접일기(Test.js)</button>
            <button onClick={() => {navigate('/aidiary')}}>AI일기</button>
            <button onClick={() => {navigate('/register')}}>회원가입</button>
            <button onClick={() => {navigate('/login')}}>로그인</button>
            <button onClick={() => {navigate('/userlist')}}>회원목록</button>
            <button onClick={() => {navigate('/Mypagelist')}}>글목록</button>
            <button onClick={() => {navigate('/StatsData')}}>통계</button>
            <button onClick={() => {navigate('/PointShop')}}>포인트샵</button>
        </div>
    );
};

export default MainPage;