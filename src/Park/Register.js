import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [id, setId] = useState(''); //입력된 id
  const [isIdChecked, setIsIdChecked] = useState(false); //id 사용 가능 여부
  const [idError, setIdError] = useState(''); //id 에러 메세지 출력

  const [nickname, setNickname] = useState(''); //입력된 닉네임
  const [isNicknameChecked, setIsNicknameChecked] = useState(false); //닉네임 사용 가능 여부
  const [nicknameError, setNicknameError] = useState(''); //닉네임 에러 메세지 출력

  const [password, setPassword] = useState(''); //입력된 비밀번호
  const [passwordCheck, setPasswordCheck] = useState(''); //비밀번호 일치 여부
  const [passwordError, setPasswordError] = useState(''); //비밀번호 에러 메세지 출력
  const [showPassword, setShowPassword] = useState(false); //입력된 비밀번호 출력/숨기기
  
  //ID 중복확인
  const checkIdDuplicate = async () => {
    try {
      // const res = await axios.get(`http://localhost:5000/users/check-id?id=${id}`);
      const res = await axios.get(`https://aidiary.onrender.com/users/check-id?id=${id}`);
      if (res.data.available) {
        alert('사용 가능한 아이디입니다.');
        setIsIdChecked(true);
      } else {
        alert('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      }
    } catch (err) {
      console.error(err);
      alert('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  //닉네임 중복확인
  const checkNicknameDuplicate = async () => {
    try {
      // const res = await axios.get(`http://localhost:5000/users/check-nickname?nickname=${nickname}`);
      const res = await axios.get(`https://aidiary.onrender.com/users/check-nickname?nickname=${nickname}`);
      if (res.data.available) {
        alert('사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      } else {
        alert('이미 사용 중인 닉네임입니다.');
        setIsNicknameChecked(false);
      }
    } catch (err) {
      console.error(err);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  //회원가입 완료
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdChecked) {
      alert('아이디 중복 확인을 먼저 해주세요.');
      return;
    };

    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 먼저 해주세요.');
      return;
    };

    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.\n비밀번호를 확인해주세요.');
      return;
    };

    if (password.length < 1) {
      alert('입력된 비밀번호가 없습니다..\n비밀번호를 입력해주세요.');
      return;
    };

    try {
      // await axios.post('http://localhost:5000/users/register', {
        await axios.post('https://aidiary.onrender.com/users/register', {
        id,
        password,
        nickname,
        profile : 1,
        point : 300,
        item : [1,2,3],
      });
      alert('회원가입 성공!');
      // 초기화
      setId('');
      setPassword('');
      setPasswordCheck('');
      setNickname('');
      setIsIdChecked(false);
      setIsNicknameChecked(false);
    } catch (err) {
      console.error(err);
      alert('회원가입 실패!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='register'>
      <h1 className='register__title'>회원가입</h1>
      <div className='register__item-div'>
        <input //아이디 입력란
          type="text"
          placeholder="아이디 (4자 ~ 16자)"
          value={id}
          className='register__input'
          minLength="4"
          maxlength="16"

          onChange={(e) => {
            const value = e.target.value;
            const regex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; //정규식
            if (regex.test(value)) { //regex.test(문자열) : regex라는 정규식 패턴에 맞는 문자열인지 test()가 검사. 참인 경우 true, 거짓인 경우 fasle 반환
              setId(value);
              setIsIdChecked(false);
              setIdError(' ');
            } else {
              setIdError('id는 영어, 일부 특수문자만 사용 가능합니다.');
            }
          }}
        />
        <button className='register__button' type="button" onClick={checkIdDuplicate} disabled={id.length < 1 ? 'disable' : ''}>중복확인</button>
      </div>
      <p className='register__error-text'>{idError}</p>

      <div className='register__item-div'>
        <input //비밀번호 입력란
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호 (8자 ~ 20자)"
          minLength="8"
          maxlength="20"
          value={password}
          className='register__input'
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            const regex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; //정규식
            if (regex.test(value)) { //regex.test(문자열) : regex라는 정규식 패턴에 맞는 문자열인지 test()가 검사. 참인 경우 true, 거짓인 경우 fasle 반환
              setPassword(value);
              setPasswordError('');
            } else {
              setPasswordError('비밀번호는 영어, 숫자, 일부 특수문자만 사용 가능합니다.');
            }
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className='register__button'
        >{showPassword ? <i class="bi bi-eye-fill" /> : <i class="bi bi-eye-slash-fill" />}</button>
      </div>
      <p className='register__error-text'>{passwordError}</p>

      <div className='register__item-div'>
        <input //비밀번호 확인란
          type="password"
          placeholder="비밀번호 확인"
          minLength="8"
          maxlength="20"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          className='register__input'
        />
      </div>

      <div className='register__item-div'>
        <input //닉네임 입력란
          type="text"
          placeholder="닉네임(10자 이하)"
          minLength="1"
          maxlength="10"
          value={nickname}
          className='register__input'
          onKeyDown={(e) => { //공백(스페이스바) 차단
            if (e.key === ' ') {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            const specialCharRegex  = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            if (!specialCharRegex.test(value) || value=='') {
              setNickname(value);
              setIsNicknameChecked(false);
              setNicknameError('');
            } else {
              setNicknameError('닉네임은 한글, 영어, 숫자만 사용 가능합니다.');
            }
          }}
        />
        <button className='register__button' type="button" onClick={checkNicknameDuplicate} disabled={nickname.length < 1 ? 'disable' : ''}>중복확인</button>
      </div>
      <p className='register__error-text'>{nicknameError}</p>

      <button className='register__submit' type="submit">가입하기</button>
    </form>
  );
};

export default Register;
