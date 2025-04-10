import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [porfile, setPorfile] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://aidiary.onrender.com/users/register', {
        id,
        password,
        nickname,
        porfile,
      });
      alert('회원가입 성공!');
      setId('');
      setPassword('');
      setNickname('');
      setPorfile(1);
    } catch (err) {
      console.error(err);
      alert('회원가입 실패!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      /><br />
      <button type="submit">가입하기</button>
    </form>
  );
};

export default Register;