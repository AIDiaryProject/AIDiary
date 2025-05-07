import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginUser from '../Park/LoginUser';
import axios from 'axios';

const DiaryCheckGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user } = LoginUser();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!user?.id) return;

      const res = await axios.get('https://aidiary.onrender.com/diaryDB');
      const myDiaries = res.data.filter(item => item.user_id === user.id);

      const now = new Date();
      const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const hasTodayDiary = myDiaries.some(diary => {
        const diaryDate = new Date(diary.date);
        const diaryFormatted = `${diaryDate.getFullYear()}-${String(diaryDate.getMonth() + 1).padStart(2, '0')}-${String(diaryDate.getDate()).padStart(2, '0')}`;
        return diaryFormatted === todayDate;
      });

      if (hasTodayDiary) {
        alert("오늘 일기를 이미 작성하셨습니다!");
        navigate("/Mypagelist");
      } else {
        setChecking(false);  // ✅ 검사 통과 → children 렌더링
      }
    };

    check();
  }, [user]);

  if (checking) { // ❗검사 중이면 로딩
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', minHeight: '90vh' }}>
        <div className="spinner" />
        <p>일기 작성 여부 확인 중...</p>
      </div>
    );
  }
  return children; // ✅ 통과 시에만 자식 컴포넌트 렌더링
};

export default DiaryCheckGuard;
