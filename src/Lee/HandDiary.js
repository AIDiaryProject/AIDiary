import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const HandDiary = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [includeWeather, setIncludeWeather] = useState(false);
  const [weather, setWeather] = useState('');
  const [userEmotionLabel, setUserEmotionLabel] = useState('보통');
  const [userEmotionScore, setUserEmotionScore] = useState(3);
  const [loading, setLoading] = useState(false);

  const emotionOptions = [
    { id: 0, label: "최악" },
    { id: 1, label: "분노" },
    { id: 2, label: "슬픔" },
    { id: 3, label: "보통" },
    { id: 4, label: "기쁨" },
    { id: 5, label: "행복" },
    { id: 6, label: "최고" },
  ];

  const handelSubmit = async () => {
    setLoading(true);

    let message = `다음은 사용자가 작성한 일기야. 공감해주고 따뜻한 코멘트를 남겨줘.\n\n제목: ${title}\n\n 오늘 나의 기분은 ${userEmotionLabel}.\n\n내용: ${content}`;
    if (includeWeather && weather.trim()) {
      message += `\n오늘의 날씨는 ${weather}야.`;
    }
    try {
      const res = await fetch("https://aidiary.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          diary: "너는 다정하고 따뜻한 코멘트를 남겨주는 일기 친구야. 일기를 쓴 사람에게 응원이나 위로가 담긴 말을 해줘."
        })
      });

      if (!res.ok) throw new Error("GPT API 호출 실패");

      const data = await res.json();
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      navigate('/resulthanddiary', {
        state: {
          title,
          content,
          weather: includeWeather ? weather : null,
          date: formattedDate,
          emotionLabel: userEmotionLabel,
          emotionScore: userEmotionScore,
          comment: data.reply?.content || "코멘트 응답 없음",
        }
      });
    } catch (error) {
      console.error("🔥 오류:", error);
      alert("GPT 응답에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => { navigate('/') }}>홈화면</button>
      <h2>✍️ 직접 일기 쓰기</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        maxLength='10'
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="오늘의 일기를 작성하세요"
        rows={10}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

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
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="예: 맑음, 흐림"
            style={{ marginLeft: '1rem' }}
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

      <button onClick={handelSubmit} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? "GPT 응답 중..." : "GPT 코멘트 받기"}
      </button>
    </div>
  );
};

export default HandDiary;
