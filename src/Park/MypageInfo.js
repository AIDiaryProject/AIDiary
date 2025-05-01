import React, { useState } from 'react';
import LoginUser from './LoginUser';
import Profile from './Profile';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import Characters from '../Lee/Characters';

const MypageInfo = () => {
    const { user, loading } = LoginUser();

    const [nicknameModal, setNicknameModal] = useState(false); //닉네임 모달창
    const [profileModal, setProfileModal] = useState(false); //프로필 모달창

    const [changeNickname, setChangeNickname] = useState(''); //입력된 변경할 닉네임
    const [isNicknameChecked, setIsNicknameChecked] = useState(false); //닉네임 중복확인 눌렀는지
    const [nicknameError, setNicknameError] = useState(''); //닉네임 에러 메세지 출력

    //닉네임 중복확인
    const checkNicknameDuplicate = async () => {
        if(nicknameError!='') {
            alert('사용할 수 없는 형식의 닉네임입니다.');
            return 0;
        }

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
    
            alert('새로운 친구와 동행합니다.');
            window.location.reload(); // 새로고침으로 변경 사항 반영
        } catch (err) {
            console.error('프로필 변경 실패:', err);
            alert(err.response?.data?.error || '변경 중 오류가 발생했습니다.');
        }
    };

    //포인트 추가 및 감소
    const addPoints = async (userId, amount, type) => {
        try {
          const response = await axios.patch('https://aidiary.onrender.com/users/add-point', {
            userId,
            amount,
            type,
          });
      
          alert(response.data.message);
          window.location.reload();
        } catch (error) {
          console.error(error);
          alert('포인트 처리 실패');
        }
      };

      if(loading) return <ClipLoader color={"skyblue"} size={30} />

    return (
        <div className='info'>
            <h1 className='info__title'>회원 정보</h1>
            
            <div className="info__card">
                <div className="info__row">
                    <div className="info__row__label">아이디</div>
                    <div className="info__row__value">{user?.id}</div>
                    <div className='info__row__space'/>
                </div>
                <div className="info__row">
                    <div className="info__row__label">닉네임</div>
                    <div className="info__row__value">
                    {user?.nickname}
                    <button className="info__row__change-button" onClick={() => setNicknameModal(true)}>변경</button>
                    </div>
                    <div className='info__row__space'/>
                </div>
                <div className="info__row">
                    <div className="info__row__label">친구</div>
                    <div className="info__row__value">
                    <div className='info__row__value__profile'>
                        <Profile id={user?.profile} size={60} bgcolor={true}/>
                        <p className='info__row__value__profile__name'>{Characters.find(c => c?.number === user?.profile)?.name}</p>
                    </div>
                    <button className="info__row__change-button" onClick={() => setProfileModal(true)}>변경</button>
                    </div>
                    <div className='info__row__space'/>
                </div>
                <div className="info__row">
                    <div className="info__row__label">보유 포인트</div>
                    <div className="info__row__value">
                    {user?.point}P
                    <button className="btn btn-sm btn-outline-success" style={{margin:'0rem 0.5rem'}} onClick={() => addPoints(user?.id, 100, 'plus')}>+100</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => addPoints(user?.id, 100, 'minus')}>-100</button>
                    </div>
                    <div className='info__row__space'/>
                </div>
            </div>
            
            {/* 닉네임 모달창 modal-heade*/}
            {nicknameModal && <div 
                className='modal show fade d-block'  
                tabIndex='-1'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={() => {setNicknameModal(false)}}
            >
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header info__modal-header'>
                            <button className='info__hidden'>X</button>
                            <h5 className='modal-title info__modal-title'>닉네임 변경</h5>
                            <button className='info__modal-close' onClick={() => {setNicknameModal(false)}}>X</button>
                        </div>
                        <div className='modal-body info__modal-content'>
                            <p className='info__description-nickname'>현재 닉네임</p>
                            <p className='info__now-nickname'>{user?.nickname}</p>
                            <input 
                            type="text"
                            placeholder="변경할 닉네임 입력"
                            className='info__input-nickname'
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
                            <p className='info__nickname-error'>{nicknameError}<br/></p>

                            <div> 
                                <button 
                                className='info__modal-button-nickname'
                                onClick={checkNicknameDuplicate} 
                                disabled={changeNickname.length < 1 ? 'disable' : ''}>
                                    닉네임 중복확인
                                </button>
                                <button 
                                className='info__modal-button-nickname'
                                onClick={changeNicknameHandler} 
                                disabled={isNicknameChecked ? '' : 'disable'}>
                                    변경하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

            {/* 프로필 모달창 */}
            {profileModal && <div 
                className='modal show fade d-block'  
                tabIndex='-1'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={() => {setProfileModal(false)}}
            >
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header info__modal-header'>
                        <button className='info__hidden'>X</button>
                            <h5 className='modal-title info__modal-title'>숲의 친구 선택</h5>
                            <button className='info__modal-close' onClick={() => {setProfileModal(false)}}>X</button>
                        </div>
                        <div className='modal-body info__modal-content'>
                            <div className="info__profile__container">
                            {user?.item?.map((profileId) => {
                                const isCurrent = user.profile === profileId;

                                return (
                                <div key={profileId} className="info__profile__item">
                                    <Profile 
                                    id={profileId} 
                                    size={80} 
                                    />
                                    <button 
                                    className="info__modal-button-profile" 
                                    onClick={() => handleProfileChange(profileId)} 
                                    disabled={isCurrent}
                                    >
                                    {isCurrent ? '동행 중' : '동행하기'}
                                    </button>
                                </div>
                                );
                            })}
                            </div>

                        </div>
                    </div>
                </div>
            </div>}

        </div>
    );
};

export default MypageInfo;