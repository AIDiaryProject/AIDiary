import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const AiDiary = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [includeWeather, setIncludeWeather] = useState(false);
  const [userWeather, setUserWeather] = useState('');
  const [userEmotionLabel, setUserEmotionLabel] = useState('보통');
  const [userEmotionScore, setUserEmotionScore] = useState(4);
  const [generatedDiary, setGeneratedDiary] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  const emotionOptions = [
    { id: 1, label: "기쁨" },
    { id: 2, label: "슬픔" },
    { id: 3, label: "화남" },
    { id: 4, label: "보통" },
    { id: 5, label: "피곤" },
    { id: 6, label: "불안" },
    { id: 7, label: "상쾌" },
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

  return (
    <div>
      <button onClick={() => { navigate('/') }}>홈화면</button>
      <h2>키워드를 기반으로 일기 자동 생성</h2>
      <input
        value={title}
        onChange={handleTitleChange}
        placeholder="제목을 입력하세요"
      />
      <br />
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeWeather}
            onChange={(e) => setIncludeWeather(e.target.checked)}
          />
          날씨 포함
        </label>
        {includeWeather && (
          <input
            type="text"
            placeholder="예: 맑음, 흐림"
            value={userWeather}
            onChange={(e) => setUserWeather(e.target.value)}
          />
        )}
      </div>
      <div>
        <label>
          기분 선택
        </label>
        <div>
          <p>오늘의 기분을 선택해 주세요:</p>
          {emotionOptions.map((emotion) => (
            <label key={emotion.id} style={{ display: 'block', marginBottom: '4px' }}>
              <input
                type="radio"
                name="emotion"
                value={emotion.id}
                checked={userEmotionScore === emotion.id}
                onChange={() => {
                  setUserEmotionScore(emotion.id);
                  setUserEmotionLabel(emotion.label);
                }}
              />
              {emotion.label}
            </label>
          ))}
        </div>
      </div>
      {keywords.map((keyword, index) => (
        <input
          key={index}
          value={keyword}
          onChange={(e) => handleKeywordChange(index, e.target.value)}
          placeholder={`키워드 ${index + 1}`}
        />
      ))}
      {keywords.length < 5 && <button onClick={addKeywordInput}>키워드 추가</button>}
      <br />
      <button onClick={handelSubmit} disabled={loading || isGenerated}>
        {loading ? "생성 중..." : isGenerated ? "생성 완료!" : "일기 생성"}
      </button>
      {generatedDiary && (
        <div style={{ marginTop: "1rem" }}>
          <h3>✏️ 생성된 일기 (수정)</h3>
          <textarea
            value={generatedDiary}
            onChange={(e) => setGeneratedDiary(e.target.value)}
            rows={15}
            cols={80}
            style={{ width: "100%" }}
          />
          <button onClick={handleComplete}>✅ 완료</button>
        </div>
      )}
    </div>
  );
}

export default AiDiary;
