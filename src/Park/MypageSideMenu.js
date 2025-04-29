import React from 'react';
import Profile from './Profile';
import LoginUser from './LoginUser';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import './Park.scss';

const MypageSideMenu = () => {
    const { user, loading } = LoginUser();
    const navigate = useNavigate();

    return (
        <div>
            <h1 className='side-title'>마이페이지</h1>
            <div className="sidemenu">
                <div className="sidemenu__profile-box">
                    {loading ? (
                        <ClipLoader color={"skyblue"} size={30} />
                    ) : (
                        <>
                            <Profile id={user?.profile} size={120} square={true} bgcolor={true}/>
                            <p className="sidemenu__nickname">{user?.nickname}</p>
                            <p className="sidemenu__id">({user?.id ? `${user.id.slice(0, 4)}${'*'.repeat(user.id.length - 4)}`: ''})</p>

                            <div className="sidemenu__point-shop"> 
                                {/* <i class="bi bi-p-circle-fill fs-5 sidemenu__point-logo"/> */}
                                <img src={`/apple.png`} alt={`열매`} style={{
                                    width: '1rem',
                                    height: '1rem',
                                    objectFit: 'cover',
                                }}/>
                                <p className="sidemenu__point-text">보유 열매</p>
                            </div>
                            <p className="sidemenu__point-text">{user?.point}개</p>
                        </>
                    )}
                </div>

                <div className="sidemenu__menu-box">
                    <div className="sidemenu__menu-item" onClick={() => navigate('/Mypageinfo')}>
                        <div></div>
                        <div><i class="bi bi-person fs-5"/> &nbsp;회원 정보</div>
                        <p className='sidemenu__arrow'>ᐳ</p>
                    </div>

                    <div className="sidemenu__menu-item" onClick={() => navigate('/Mypagelist')}>
                        <div></div>
                        <div><i class="bi bi-list fs-5"/> &nbsp;일기 목록</div>
                        <p className='sidemenu__arrow'>ᐳ</p>
                    </div>

                    <div className="sidemenu__menu-item" onClick={() => navigate('/StatsData')}>
                        <div></div>
                        <div><i class="bi bi-bar-chart fs-5"/> &nbsp;일기 통계</div>
                        <p className='sidemenu__arrow'>ᐳ</p>
                    </div>

                    <div className="sidemenu__menu-item" onClick={() => navigate('/PointShop')}>
                        <div></div>
                        <div><i class="bi bi-tree fs-5"/> &nbsp;숲의 친구</div>
                        <p className='sidemenu__arrow'>ᐳ</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MypageSideMenu;