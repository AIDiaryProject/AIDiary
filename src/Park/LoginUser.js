import { useState, useEffect } from 'react';
import axios from 'axios';

const useLoginUser = () => {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLogin(false);
          throw new Error('로그인되지 않음');
        }

        const res = await axios.get('https://aidiary.onrender.com/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
        setLogin(true);
      } catch (err) {
        console.error('사용자 정보 요청 실패:', err);
        setUser(null);
      }
    };

    getUserInfo();
  }, []);

  return { user, login };
};

export default useLoginUser;