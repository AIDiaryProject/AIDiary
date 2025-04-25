import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import LoginUser from '../Park/LoginUser'; // 로그인 유저 정보 가져오기

const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
    const [diaryList, setDiaryList] = useState([]);
    const { user } = LoginUser();
  
    const fetchDiary = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get('https://aidiary.onrender.com/diaryDB');
        const myDiaries = res.data.filter(item => item.user_id === user.id);
        setDiaryList(myDiaries);
      } catch (err) {
        console.error("일기 불러오기 실패:", err);
      }
    };
  
    useEffect(() => {
      fetchDiary(); // 최초 1회
    }, [user?.id]);
  
    return (
      <DiaryContext.Provider value={{ diaryList, refresh: fetchDiary }}>
        {children}
      </DiaryContext.Provider>
    );
  };

export const useDiaryContext = () => useContext(DiaryContext);
