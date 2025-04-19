import React, { useState } from 'react';
import LoginUser from './LoginUser';
import Profile from './Profile';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MypageInfo = () => {
    const { user } = LoginUser();

    const [nicknameModal, setNicknameModal] = useState(false); //닉네임 모달창
    const [profileModal, setProfileModal] = useState(false); //프로필 모달창

    const [changeNickname, setChangeNickname] = useState(''); //입력된 변경할 닉네임
    const [isNicknameChecked, setIsNicknameChecked] = useState(false); //닉네임 중복확인 눌렀는지
    const [nicknameError, setNicknameError] = useState(''); //닉네임 에러 메세지 출력

    //닉네임 중복확인
    const checkNicknameDuplicate = async () => {
        try {
        // const res = await axios.get(`http://localhost:5000/users/check-nickname?nickname=${nickname}`);
        const res = await axios.get(`https://aidiary.onrender.com/users/check-nickname?nickname=${changeNickname}`);
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

    //닉네임 변경
    const changeNicknameHandler = async () => {
        try {
            const token = localStorage.getItem('token'); // JWT 토큰 가져오기
            const res = await axios.patch('https://aidiary.onrender.com/users/change-nickname', {
                newNickname: changeNickname
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            alert('닉네임이 성공적으로 변경되었습니다.');
            setNicknameModal(false); // 모달 닫기
            window.location.reload(); // 새로고침해서 반영
        } catch (err) {
            console.error('닉네임 변경 실패:', err);
            alert(err.response?.data?.error || '닉네임 변경 중 오류가 발생했습니다.');
        }
    };

    //프로필 변경
    const handleProfileChange = async (newProfileId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch('https://aidiary.onrender.com/users/change-profile', {
                newProfile: newProfileId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            alert('프로필이 변경되었습니다.');
            window.location.reload(); // 새로고침으로 변경 사항 반영
        } catch (err) {
            console.error('프로필 변경 실패:', err);
            alert(err.response?.data?.error || '프로필 변경 중 오류가 발생했습니다.');
        }
    };

    //포인트 추가 및 감소
    const addPoints = async (userId, amount, type) => {
        try {
          const response = await axios.patch('http://localhost:포트번호/users/add-point', {
            userId,
            amount,
            type,
          });
      
          alert(response.data.message);
        } catch (error) {
          console.error(error);
          alert('포인트 처리 실패');
        }
      };

    return (
        <div>
            아이디 : {user?.id} <br />
            닉네임 : {user?.nickname} <button onClick={() => {setNicknameModal(true)}}> 닉네임 변경 </button><br />
            프로필 : {user?.profile} <button onClick={() => {setProfileModal(true)}}> 프로필 변경 </button><br />
            <Profile id={user?.profile} size={100}/><br />
            포인트 : {user?.point}  <br /> 
            <button onClick={() => {addPoints(user?.id, 100, 'plus')}}> 100포인트 증가 </button>
            <button onClick={() => {addPoints(user?.id, 100, 'minus')}}> 100포인트 감소 </button>
            최근 일기 : {user?.diarydate} <br />
            <button onClick={() => {console.log(user?.item)}}>item 배열 확인</button>
            
            {/* 닉네임 모달창 */}
            {nicknameModal && <div 
                className='modal show fade d-block'  
                tabIndex='-1'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header' style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid black'}}>
                            <p></p>
                            <h5 className='modal-title'>닉네임 변경</h5>
                            <button onClick={() => {setNicknameModal(false)}} style={{border:'0px solid black', fontWeight:'bold', fontSize:'1.2rem', margin:'0 0 0.5rem 0'}}>X</button>
                        </div>
                        <div className='modal-body' style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <p>현재 닉네임 : {user?.nickname}</p>
                            <p>변경 닉네임 : {changeNickname} </p>
                            <p style={{margin:0, color:'red', fontSize:'0.7rem'}}>{nicknameError}<br/></p>
                            <input 
                            type="text"
                            placeholder="변경할 닉네임 입력"
                            onChange={(e) => {
                                const value = e.target.value;
                                const specialCharRegex  = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
                                if (!specialCharRegex.test(value) || value=='') {
                                  setChangeNickname(value);
                                  setIsNicknameChecked(false);
                                  setNicknameError('');
                                } else {
                                  setNicknameError('닉네임은 한글, 영어, 숫자만 사용 가능합니다.');
                                }
                              }}
                            />

                            <button onClick={checkNicknameDuplicate} disabled={changeNickname.length < 1 ? 'disable' : ''}>닉네임 중복확인</button>
                            <button onClick={changeNicknameHandler} disabled={isNicknameChecked ? '' : 'disable'}>변경하기</button>
                        </div>
                    </div>
                </div>
            </div>}

            {/* 프로필 모달창 */}
            {profileModal && <div 
                className='modal show fade d-block'  
                tabIndex='-1'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header' style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid black'}}>
                            <p></p>
                            <h5 className='modal-title'>프로필 변경</h5>
                            <button onClick={() => {setProfileModal(false)}} style={{border:'0px solid black', fontWeight:'bold', fontSize:'1.2rem', margin:'0 0 0.5rem 0'}}>X</button>
                        </div>
                        <div className='modal-body' style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <div>
                                <h5>보유 프로필</h5>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {user?.item?.map((profileId) => (
                                        <div key={profileId} style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => handleProfileChange(profileId)}>
                                            <Profile id={profileId} size={80} />
                                            {user.profile === profileId && <span>(사용중)</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

        </div>
    );
};

export default MypageInfo;