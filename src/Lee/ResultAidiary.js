import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WeatherInfo from "./WeatherInfo";
import DustInfo from "./DustInfo";
import LoginUser from "../Park/LoginUser";
import axios from "axios";
import { useEnv } from "./EnvContext";

const ResultAiDiary = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { weather : weahterInfo, air } = useEnv();
  const isLoading = !weahterInfo || !air;
  const [saving, setSaving] = useState(false);

  if (!state) {
    return <p>잘못된 접근입니다.</p>;
  };

  const { title, content, weather, date, emotionLabel, emotionScore } = state;
  const { user } = LoginUser();

  const dbSave = async () => {
    try {
      setSaving(true);
      await axios.post('https://aidiary.onrender.com/diaryDB/diarysave', {
        title,
        content,
        weather,
        date,
        comment: null,
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

  const addPoints = async (userId, amount, type) => {
    try {
      const response = await axios.patch('https://aidiary.onrender.com/users/add-point', {
        userId,
        amount,
        type,
      });
  
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('포인트 처리 실패');
    }
  };

  const handleSaveAndAddPoints = async () => {
    try {
      await dbSave(); // DB 저장 먼저
      await addPoints(user?.id, 100, 'plus'); // DB 저장 성공했을 때만 포인트 추가
    } catch (error) {
      console.error("저장 또는 포인트 추가 중 에러 발생:", error);
    }
  };

  return (
    <div className="result-wrapper">
      <div className="content-container">
        <div className="main-content">
          <h1>{title}</h1>
          <p>🗓️ {date}</p>
          {weather && <p>☀️ 날씨: {weather}</p>}
          <p>기분: {emotionLabel}</p>
          <h2>📝 최종 일기</h2>
          <div className="diary-content">
            {content}
          </div>
          <button 
            type="button" 
            class="btn result-button"
            onClick={handleSaveAndAddPoints}
            disabled={saving}
          >
            {saving ? "DB 저장 중..." : "저장하기"}
          </button>
          {/* <button onClick={() => { console.log('title: ', title, 'content : ', content, 'weather :', weather, 'date :', date, 'user_id', user?.id, 'emotion', emotionLabel) }}>console.log</button> */}
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

export default ResultAiDiary;
