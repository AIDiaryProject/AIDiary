import React from 'react';
import Profile from './Profile';
import LoginUser from './LoginUser';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

const MypageSideMenu = () => {
    const { user, loading } = LoginUser();
    const navigate = useNavigate();

    return (
        <div>
            <div style={{border:'1px solid black', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1rem', margin:'0.5rem'}}>
                {loading ? <ClipLoader color={"skyblue"} size={30} /> : <>
                <Profile id={user?.profile} size={80}/> 
                <p style={{margin:'0'}}>{user?.nickname}</p> </>}
            </div>

            <div style={{borderRight:'1px solid black', borderLeft:'1px solid black', margin:'0.5rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0'}}>
                <div style={{cursor:'pointer', borderTop:'1px solid black', width:'100%', textAlign:'center', padding:'0.7rem'}} onClick={() => {navigate('/Mypageinfo')}}>회원 정보</div>
                <div style={{cursor:'pointer', borderTop:'1px solid black', width:'100%', textAlign:'center', padding:'0.7rem'}} onClick={() => {navigate('/Mypagelist')}}>일기 목록</div>
                <div style={{cursor:'pointer', borderTop:'1px solid black', width:'100%', textAlign:'center', padding:'0.7rem'}} onClick={() => {navigate('/StatsData')}}>일기 통계</div>
                <div style={{cursor:'pointer', borderTop:'1px solid black', borderBottom:'1px solid black', width:'100%', textAlign:'center', padding:'0.7rem'}} onClick={() => {navigate('/PointShop')}}>포인트 샵</div>
            </div>
        </div>
    );
};

export default MypageSideMenu;