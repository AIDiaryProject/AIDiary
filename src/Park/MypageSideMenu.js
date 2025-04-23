import React from 'react';
import Profile from './Profile';
import LoginUser from './LoginUser';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import '../App.scss';

const MypageSideMenu = () => {
    const { user, loading } = LoginUser();
    const navigate = useNavigate();

    return (
        <div className="sidemenu">
            <div className="sidemenu__profile-box">
                {loading ? (
                    <ClipLoader color={"skyblue"} size={30} />
                ) : (
                    <>
                        <Profile id={user?.profile} size={80} />
                        <p className="sidemenu__nickname">{user?.nickname}</p>
                    </>
                )}
            </div>

            <div className="sidemenu__menu-box">
                <div className="sidemenu__menu-item" onClick={() => navigate('/Mypageinfo')}>회원 정보</div>
                <div className="sidemenu__menu-item" onClick={() => navigate('/Mypagelist')}>일기 목록</div>
                <div className="sidemenu__menu-item" onClick={() => navigate('/StatsData')}>일기 통계</div>
                <div className="sidemenu__menu-item" onClick={() => navigate('/PointShop')}>포인트 샵</div>
            </div>
        </div>
    );
};

export default MypageSideMenu;