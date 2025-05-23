import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Lee.scss';
import LoginUser from '../Park/LoginUser';
import Characters from "./Characters";
import Profile from "../Park/Profile";

const AiDiary = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [includeWeather, setIncludeWeather] = useState(false);
  const [userWeather, setUserWeather] = useState('');
  const [userEmotionLabel, setUserEmotionLabel] = useState('보통');
  const [userEmotionScore, setUserEmotionScore] = useState(3);
  const [generatedDiary, setGeneratedDiary] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [Character, setCharacter] = useState("");
  const [number, setNumber] = useState("");

  const { user } = LoginUser();

  const emotionOptions = [
    { id: 0, label: "최악" },
    { id: 1, label: "분노" },
    { id: 2, label: "슬픔" },
    { id: 3, label: "보통" },
    { id: 4, label: "기쁨" },
    { id: 5, label: "행복" },
    { id: 6, label: "최고" },
  ];

  useEffect(() => {
    if (!user) return;
    const selectedCharacter = Characters.find(c => c?.number === user.profile);
    setCharacter(selectedCharacter?.name);
    setNumber(selectedCharacter.number);
  }, [user]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handelSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해 주세요!");
      return;
    }
  
    const filledKeywords = keywords.filter(k => k.trim() !== "");
    if (filledKeywords.length === 0) {
      alert("키워드를 한 개 이상 입력해 주세요!");
      return;
    }

    setLoading(true);
    let message = `제목은 "${title}"이고, 다음 키워드를 바탕으로 일기를 작성해줘: 오늘 나의 기분은 ${userEmotionLabel}. ${keywords.filter(k => k.trim()).join(", ")}.`;
    if (includeWeather && userWeather.trim()) {
      message += `오늘의 날씨는 ${userWeather}.`;
    }
    const diaryContext = "너는 친절한 일기 작성 도우미야. 사용자에게 공감하며 자연스럽고 따뜻한 일기를 대신 써줘.";

    try {
      const response = await fetch("https://aidiary.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          prompt: diaryContext
        })
      });
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      const data = await response.json(); // ✅ JSON 변환 필요
      console.log("📦 fetch 응답:", data);
      setGeneratedDiary(data.reply?.content || "GPT 응답이 없습니다.");
      setIsGenerated(true);
    } catch (error) {
      console.error("🔥 fetch 오류:", error);
      alert("GPT 응답에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    navigate("/resultaidiary", {
      state: {
        title,
        content: generatedDiary,
        weather: includeWeather ? userWeather : null,
        date: formattedDate,
        emotionLabel: userEmotionLabel,
        emotionScore: userEmotionScore,
        number,
      }
    });
  };

  const removeKeyword = (indexToRemove) => {
    const updatedKeywords = keywords.filter((_, idx) => idx !== indexToRemove);
    setKeywords(updatedKeywords);
  };


  const addKeywordInputAfter = (index) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index + 1, 0, ""); // index 바로 다음에 추가
    setKeywords(newKeywords);
  };
  
  return (
    <div className="diary-wrapper">
      <h2>숲의 마법으로 작성하는 나의 일기</h2>
      <hr/>
      <div>
        <label htmlFor="basic-url" className="form-label diary-title-label">제목 </label>
        <span>{title.length}/20</span>
        <input
          type="text" 
          className="form-control diary-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
          disabled={loading || isGenerated}
          maxLength={20}
        />
      </div>

      <div>
        {keywords.map((keyword, index) => (
          <div key={index} className="flex-div">
            <input
              className="form-control diary-input-keyword"
              value={keyword}
              onChange={(e) => handleKeywordChange(index, e.target.value)}
              placeholder={`주문 키워드 ${index + 1}`}
              disabled={loading || isGenerated}
            />
            
            {/* 버튼 그룹 */}
            <div className="button-group">
              {/* 추가 버튼은 "마지막 키워드"에만 표시 (단, 최대 5개까지만) */}
              {index === keywords.length - 1 && keywords.length < 5 && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => addKeywordInputAfter(index)}
                  disabled={loading || isGenerated}
                >
                  추가
                </button>
              )}

              {/* 삭제 버튼은 2번째부터 항상 표시 */}
              {keywords.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeKeyword(index)}
                  disabled={loading || isGenerated}
                >
                  삭제
                </button>
              )} 
            </div>
          </div>
        ))}
      </div>  

      <div className="form-check flex-div">
        <label className="form-check-label diary-text" htmlFor="checkDefault">
          <input
            className="form-check-input"
            type="checkbox"
            id="checkDefault"
            checked={includeWeather}
            onChange={(e) => setIncludeWeather(e.target.checked)}
            disabled={loading || isGenerated}
          />
          날씨 포함
        </label>
        {includeWeather && (
          <input
            type="text"
            className="form-control diary-input-weather"
            aria-describedby="basic-addon1"
            placeholder="예: 맑음, 흐림"
            value={userWeather}
            onChange={(e) => setUserWeather(e.target.value)}
            disabled={loading || isGenerated}
          />
        )}
      </div>

      <div className="emotion-div">
        <label className="diary-text">오늘 나의 기분은?</label>
        <div
          className="btn-group emotion-button-group"
          role="group" 
          aria-label="Basic radio toggle button group"
        >  
          {emotionOptions.map((emotion) => (
            <>
              <input
                className="btn-check"
                type="radio" 
                name="btnradio"
                autoComplete="off"
                id={`radio-${emotion.id}`}
                checked={userEmotionScore === emotion.id}
                onChange={() => {
                  setUserEmotionScore(emotion.id);
                  setUserEmotionLabel(emotion.label);
                }}
                disabled={loading || isGenerated}
              />
              <label 
                className="btn emotion-label"
                htmlFor={`radio-${emotion.id}`}
              >
                {emotion.label}
              </label>
            </>
          ))}
        </div>
      </div>

      <div>
        <button 
          type="button" 
          class="btn diary-button"
          onClick={handelSubmit} 
          disabled={loading || isGenerated}
        >
          {loading ? "생성 중..." : isGenerated ? "생성 완료!" : "마법 일기 생성"}
        </button>
      </div>

      <div>
        {generatedDiary && (
          <div>
            <h2><Profile id={number} size={60} />{Character}의 마법 일기</h2>
            <p>마법일기를 최종적으로 수정 가능해요</p>
            <textarea
              className="form-control diary-text-area" 
              id="exampleFormControlTextarea1"
              value={generatedDiary}
              onChange={(e) => setGeneratedDiary(e.target.value)}
              rows={15}
              cols={80}
            />
            <button 
              type="button" 
              class="btn diary-button"
              onClick={handleComplete}
            >
               작성 완료
            </button>
          </div>
        )}
      </div>   
    </div>
  );
}

export default AiDiary;
