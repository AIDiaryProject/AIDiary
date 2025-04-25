import React, { useState } from 'react';
import { useNavigate, useLocation  } from "react-router-dom";
import WeatherInfo from "./WeatherInfo";
import DustInfo from "./DustInfo";
import LoginUser from "../Park/LoginUser";
import axios from "axios";
import { useEnv } from "./EnvContext";

const ResultHanddiary = () => {
    const navigate = useNavigate();
    const { weather : weahterInfo, air } = useEnv();
    const isLoading = !weahterInfo || !air;
    const [saving, setSaving] = useState(false);
    const { state } = useLocation();
    if (!state) {
        return <p>잘못된 접근입니다.</p>;
    }
    const { title, content, weather, comment, date, emotionLabel, emotionScore, Character} = state;
    const { user } = LoginUser();

    const dbSave = async () => {
        try {
            setSaving(true);
            await axios.post('https://aidiary.onrender.com/diaryDB/diarysave', {
                title,
                content,
                weather,
                date,
                comment,
                user_id: user?.id,
                emotionLabel,
                emotionScore,
            });
            alert('DB저장 성공!');
            navigate("/Mypagelist", { state: { refresh: true } });
        } catch (err) {
            console.error(err);
            alert('DB저장 실패!');
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className='result-wrapper'>
            <div className="content-container">
                <div className='main-content'>
                    <h1><strong>제목:</strong> {title}</h1>
                    <p><strong>날짜:</strong> {date}</p>
                    {weather && <p><strong>날씨:</strong> {weather}</p>}
                    <p><strong>내용:</strong></p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>

                    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                        <h1>{Character}의 코멘트 💬</h1>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{comment}</p>
                    </div>
                    <button 
                        type="button" 
                        class="btn result-button"
                        onClick={dbSave}
                        disabled={saving}
                    >
                        {saving ? "DB 저장 중..." : "저장하기"}
                    </button>
                    {/* <button onClick={() => { console.log('title: ', title, 'content : ', content, 'weather :', weather, 'date :', date) }}>console.log</button> */}
                </div>
                <div className="side-content">
                    {isLoading ? (
                        <p className="loading-text">🔄 날씨 및 미세먼지 정보를 불러오는 중...</p>
                        ) : (
                        <>
                            <WeatherInfo />
                            <DustInfo />
                        </>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ResultHanddiary;
