import React from 'react';
import { useNavigate, useLocation  } from "react-router-dom";
import WeatherInfo from "./WeatherInfo";
import DustInfo from "./DustInfo";
import LoginUser from "../Park/LoginUser";
import axios from "axios";

const ResultHanddiary = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    if (!state) {
        return <p>잘못된 접근입니다.</p>;
    }
    const { title, content, weather, mood, comment, date } = state;
    const { user } = LoginUser();
    const nickname = user?.nickname;

    const dbSave = async () => { //title, content, wather, mood, date, comment, nickname
        try {
            await axios.post('https://aidiary.onrender.com/diaryDB/diarysave', {
                title,
                content,
                weather,
                mood,
                date,
                comment,
                nickname
            });
            alert('DB저장 성공!');
            // 초기화
        } catch (err) {
            console.error(err);
            alert('DB저장 실패!');
        }
    };
    return (
        <div>
            <button onClick={() => navigate("/")}>홈으로</button>
            <h2>📘 작성한 일기</h2>
            <p><strong>제목:</strong> {title}</p>
            <p><strong>날짜:</strong> {date}</p>
            {weather && <p><strong>날씨:</strong> {weather}</p>}
            {mood && <p><strong>기분:</strong> {mood}</p>}
            <p><strong>내용:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>

            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>GPT의 코멘트 💬</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{comment}</p>
            </div>
            <button onClick={() => { dbSave() }}>DB제출</button>
            <button onClick={() => { console.log('title: ', title, 'content : ', content, 'weather :', weather, 'mood :', mood, 'date :', date, 'nickname: ', nickname) }}>console.log</button>
            <WeatherInfo />
            <DustInfo />
        </div>
    );
};

export default ResultHanddiary;
