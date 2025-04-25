import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDiaryContext } from './DiaryContext';
import LoginUser from '../Park/LoginUser';
import axios from 'axios';
import './Lee.scss';

const CheckDiary = ({ to, children, className, disabled, loadingTarget, setLoadingTarget }) => {
  const navigate = useNavigate();
  const { refresh } = useDiaryContext();
  const { user } = LoginUser();

  const isMyButtonLoading = loadingTarget === to;

  const handleClick = async (e) => {
    e.preventDefault();
    if (disabled || !user?.id || loadingTarget) return;

    setLoadingTarget(to); // ✅ 현재 버튼을 로딩 대상으로 설정

    try {
      await refresh();

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
        navigate(to);
      }
    } catch (error) {
      console.error("CheckDiary 실패:", error);
      alert("일기 확인 중 문제가 발생했습니다.");
    } finally {
      setLoadingTarget(null); // ✅ 로딩 해제
    }
  };

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <button
      onClick={handleClick}
      disabled={!!loadingTarget} // ✅ 클릭 중이면 모두 비활성화
      className={`nav-link header-top-button ${loadingTarget === to || currentPath === to ? 'active-link' : '' }`}
    >
      {isMyButtonLoading ? '확인 중...' : children}
    </button>
  );
};

export default CheckDiary;
