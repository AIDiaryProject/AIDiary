import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import WeatherInfo from "./WeatherInfo";
import DustInfo from "./DustInfo";
import LoginUser from "../Park/LoginUser";
import axios from "axios";

const ResultAiDiary = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  if (!state) {
    return <p>잘못된 접근입니다.</p>;
  }
  const { title, content, weather, date, emotionLabel, emotionScore } = state;
  const { user } = LoginUser();

  const dbSave = async () => {
    try {
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
      // 초기화
    } catch (err) {
      console.error(err);
      alert('DB저장 실패!');
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>홈으로</button>
      <h2>{title}</h2>
      <p>🗓️ {date}</p>
      {weather && <p>☀️ 날씨: {weather}</p>}
      <p>기분: {emotionLabel}</p>

      <h3>📝 최종 일기</h3>
      <div style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
        {content}
      </div>
      <button onClick={() => { dbSave() }}>DB제출</button>
      <button onClick={() => { console.log('title: ', title, 'content : ', content, 'weather :', weather, 'date :', date, 'user_id', user?.id, 'emotion', emotionLabel) }}>console.log</button>
      <WeatherInfo />
      <DustInfo />
    </div>
  );
};

export default ResultAiDiary;
