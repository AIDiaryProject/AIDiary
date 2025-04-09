import React from 'react';
import { useNavigate } from 'react-router-dom';

const Test = () => {
    const navigate = useNavigate();

    return (
        <div>
            테스트 페이지입니다.
            <button onClick={() => {navigate('/')}}>홈으로</button>
        </div>
    );
};

export default Test;