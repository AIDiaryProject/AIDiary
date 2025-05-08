import React, { useState } from 'react';
import { useNavigate, useLocation  } from "react-router-dom";
import WeatherInfo from "./WeatherInfo";
import DustInfo from "./DustInfo";
import LoginUser from "../Park/LoginUser";
import axios from "axios";
import { useEnv } from "./EnvContext";
import Profile from "../Park/Profile";

const ResultHanddiary = () => {
    const navigate = useNavigate();
    const { weather : weahterInfo, air } = useEnv();
    const isLoading = !weahterInfo || !air;
    const [saving, setSaving] = useState(false);

    const { state } = useLocation();
    if (!state) {
        return <p>잘못된 접근입니다.</p>;
    }
    const { title, content, weather, comment, date, emotionLabel, emotionScore, Character, number} = state;
    const { user } = LoginUser();

    const dbSave = async () => {
        try {
            setSaving(true);
            const response = await axios.post('https://aidiary.onrender.com/diaryDB/diarysave', {
                title,
                content,
                weather,
                date,
                comment,
                user_id: user?.id,
                emotionLabel,
                emotionScore,
                commenter: number,
            });
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const addPoints = async (userId, amount, type) => {
        try {
            const response = await axios.patch('https://aidiary.onrender.com/users/add-point', {
            userId,
            amount,
            type,
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('포인트 처리 실패~~~~~~~~~~~~~~~~~');
        }
    };
    
    const handleSaveAndAddPoints = async () => {
        try {
            const res = await dbSave();
            if (res.status === 201 || res.status === 200) {
                let pointAdded = false;
    
                try {
                    await addPoints(user?.id, 100, 'plus');
                    pointAdded = true;
                } catch (pointErr) {
                    console.error("포인트 추가 실패:", pointErr);
                    // 이 부분에서 alert는 addPoints 내부에도 있지만, 명확하게 별도 메시지 추가 가능
                    alert("일기는 저장되었지만, 포인트를 지급하는 데 실패했어요.");
                }
    
                // 저장은 성공했으므로 공통 안내
                if (pointAdded) {
                    alert("자유일기가 마음숲에 저장 되었어요! 포인트도 지급되었어요 🍎");
                }
                navigate("/Mypagelist", { state: { refresh: true } });
            }
        } catch (error) {
            console.error("저장 또는 포인트 추가 중 에러 발생:", error);
            alert('자유일기를 마음숲에 저장하는데 실패 했어요...');
        }
    };

    return (
        <div className='result-wrapper'>
            <div className="content-container">
                <div className='main-content mb-3'>
                    <h2>자유롭게 작성하는 나의 일기</h2>
                    <hr/>
                    <h1><strong>제목:</strong> {title}</h1>
                    <p><strong>날짜:</strong> {date}</p>
                    {weather && <p><strong>날씨:</strong> {weather}</p>}
                    <p><strong>내용:</strong></p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>

                    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                        <h1><Profile id={number} size={60} />{Character}의 코멘트</h1>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{comment}</p>
                    </div>
                    <button 
                        type="button" 
                        class="btn result-button"
                        onClick={handleSaveAndAddPoints}
                        disabled={saving}
                    >
                        {saving ? "일기 저장 중..." : "일기 저장"}
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
