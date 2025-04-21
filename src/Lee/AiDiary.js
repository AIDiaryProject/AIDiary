import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

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

  const emotionOptions = [
    { id: 0, label: "최악" },
    { id: 1, label: "분노" },
    { id: 2, label: "슬픔" },
    { id: 3, label: "보통" },
    { id: 4, label: "기쁨" },
    { id: 5, label: "행복" },
    { id: 6, label: "최고" },
  ];

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const addKeywordInput = () => {
    if (keywords.length < 5) {
      setKeywords([...keywords, ""]);
    }
  };

  const handelSubmit = async () => {
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
          diary: diaryContext
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
      }
    });
  };

  const removeKeyword = (indexToRemove) => {
    const updatedKeywords = keywords.filter((_, idx) => idx !== indexToRemove);
    setKeywords(updatedKeywords);
  };

  return (
    <div className="diary-wrapper">
      <h2>키워드를 기반으로 일기 자동 생성</h2>

      <div>
        <label htmlFor="basic-url" class="form-label">제목</label>
        <input
          type="text" 
          className="form-control title-input"
          aria-describedby="basic-addon1"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
          disabled={loading || isGenerated}
        />
      </div>

      <div className="form-check weather-form">
        <label className="form-check-label" htmlFor="checkDefault">
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
            className="form-control weather-input"
            aria-describedby="basic-addon1"
            placeholder="예: 맑음, 흐림"
            value={userWeather}
            onChange={(e) => setUserWeather(e.target.value)}
            disabled={loading || isGenerated}
          />
        )}
      </div>

      <div className="emotion-section">
        <span>오늘 나의 기분은?</span>
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
                className="btn btn-outline-primary emotion-btn" 
                htmlFor={`radio-${emotion.id}`}
              >
                {emotion.label}
              </label>
            </>
          ))}
        </div>
      </div>

      <div className="keyword-group">
        {keywords.map((keyword, index) => (
          <div key={index} className="keyword-delete">
            <input
              className="form-control keyword-input"
              value={keyword}
              onChange={(e) => handleKeywordChange(index, e.target.value)}
              placeholder={`키워드 ${index + 1}`}
              disabled={loading || isGenerated}
            />
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => removeKeyword(index)}
              disabled={loading || isGenerated}
            >
              삭제
            </button>
          </div>
        ))}
        {keywords.length < 5 && (
          <button
            type="button"
            className="btn btn-primary create-button"
            onClick={addKeywordInput}
            disabled={loading || isGenerated}
          >
            키워드 추가
          </button>
        )}
      </div>

      <div>
        <button 
          type="button" 
          class="btn btn-primary create-button"
          onClick={handelSubmit} 
          disabled={loading || isGenerated}
        >
          {loading ? "생성 중..." : isGenerated ? "생성 완료!" : "일기 생성"}
        </button>
      </div>

      <div className="create-diary-group">
        {generatedDiary && (
          <div>
            <h2>✏️ 생성된 일기 (수정)</h2>
            <textarea
              className="form-control create-diary-textarea" 
              id="exampleFormControlTextarea1"
              value={generatedDiary}
              onChange={(e) => setGeneratedDiary(e.target.value)}
              rows={15}
              cols={80}
            />
            <button 
              type="button" 
              class="btn btn-primary create-button"
              onClick={handleComplete}
            >
              수정 완료!
            </button>
          </div>
        )}
      </div>   
    </div>
  );
}

export default AiDiary;
