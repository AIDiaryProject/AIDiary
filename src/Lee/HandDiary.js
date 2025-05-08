import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import LoginUser from '../Park/LoginUser';
import Characters from "./Characters";
import Profile from "../Park/Profile";

const HandDiary = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [includeWeather, setIncludeWeather] = useState(false);
  const [userWeather, setUserWeather] = useState('');
  const [userEmotionLabel, setUserEmotionLabel] = useState('보통');
  const [userEmotionScore, setUserEmotionScore] = useState(3);
  const [loading, setLoading] = useState(false);
  const [Character, setCharacter] = useState("");
  const [trait, setTrait] = useState("");
  const [number, setNumber] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

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
    setTrait(selectedCharacter.trait);
    setNumber(selectedCharacter.number);
  }, [user]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해 주세요!");
      return;
    }
  
    if (!content.trim()) {
      alert("내용을 입력해 주세요!");
      return;
    }
  
    setLoading(true);

    const selectedCharacter = Characters.find(c => c.number === user?.profile);
    const prompt = selectedCharacter?.prompt || "너는 다정하고 따뜻한 친구야. 위로와 응원을 담아 일기에 코멘트를 남겨줘.";

    let message = `다음은 사용자가 작성한 일기야. 공감해주고 따뜻한 코멘트를 남겨줘.\n\n제목: ${title}\n\n 오늘 나의 기분은 ${userEmotionLabel}.\n\n내용: ${content}`;
    if (includeWeather && userWeather.trim()) {
      message += `\n오늘의 날씨는 ${userWeather}야.`;
    }
    try {
      const res = await fetch("https://aidiary.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          prompt,
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
          weather: includeWeather ? userWeather : null,
          date: formattedDate,
          emotionLabel: userEmotionLabel,
          emotionScore: userEmotionScore,
          comment: data.reply?.content || "코멘트 응답 없음",
          Character,
          number,
        }
      });
      setIsGenerated(true);
    } catch (error) {
      console.error("🔥 오류:", error);
      alert("GPT 응답에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  const changeProfile = () => {
    navigate("/MypageInfo");
  }

  return (
    <div className="diary-wrapper">
      <h2>자유롭게 작성하는 나의 일기</h2>
      <hr/>
      <label htmlFor="basic-url" className="form-label">제목 </label>
      <span>{title.length}/20</span>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="form-control diary-input"
        maxLength={20}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="오늘의 일기를 작성하세요"
        rows={10}
        className="form-control diary-text-area"
      />

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
                className="btn btn-outline-primary emotion-label" 
                htmlFor={`radio-${emotion.id}`}
              >
                {emotion.label}
              </label>
            </>
          ))}
        </div>
      </div>

      <div>
        <p style={{display:'flex',justifyContent:'center', alignItems:'center'}}>코멘트를 달아 줄 친구예요</p>
        <div style={{display:"flex", alignItems:'center' }}>  
          <Profile id={number} size={110} />
          <p className="diary-text">
            {Character}의 성격:<br/>{trait}<br/>
            <button
              onClick={changeProfile} 
              disabled={loading || isGenerated} 
              type="button"
              className="btn btn-primary diary-button"
            >
              동행 친구 선택하러 가기
            </button>
          </p>
        </div>
        <button
          onClick={handleSubmit} 
          disabled={loading || isGenerated} 
          type="button"
          className="btn btn-primary diary-button"
        >
          {loading ? "친구의 코멘트를 기다리는 중..." : "친구의 코멘트 받기"}
        </button>
      </div>
    </div>
  );
};

export default HandDiary;
