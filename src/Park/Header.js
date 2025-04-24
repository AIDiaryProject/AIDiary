import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import ClipLoader from "react-spinners/ClipLoader";
import LoginUser from "./LoginUser";
import Profile from "./Profile";
// import '../App.scss';
import './Park.scss'

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, login, loading } = LoginUser();

    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
    
    const currentPath = location.pathname;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 991);
        };

        window.addEventListener('resize', handleResize);

        // 초기화도 한 번 호출 (혹시 크기 변경 외의 이유로 상태 초기화가 필요한 경우 대비)
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isMobile) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [isMobile]);

    const LoginMenu = () => {
        return (
            <div style={{position:'relative'}}>
                {!isMobile && <div className="login-container" onClick={() => setShowDropdown(!showDropdown)}>
                    <Profile id={user?.profile} size={40}/>
                </div>}

                {showDropdown && (
                    <div className="header-dropdown">
                        <div className="row-center-container"> 
                            <Profile id={user?.profile} size={45}/>
                            <p className="header-dropdown-nickname">{user.nickname}</p>
                        </div>

                        <div className="header-dropdown-point" onClick={() => navigate('/PointShop')}> 
                            <i class="bi bi-p-circle-fill fs-5" />
                            <p className="header-dropdown-text">보유 포인트 : {user?.point}P</p>
                        </div>

                        <div> 
                            <div className="header-dropdown-menu" onClick={() => navigate('/MypageInfo')}> <i class="bi bi-person fs-5"/> &nbsp;회원 정보</div>
                            <div className="header-dropdown-menu" onClick={() => navigate('/Mypagelist')}> <i class="bi bi-list fs-5"/> &nbsp;일기 목록</div>
                            <div className="header-dropdown-menu" onClick={() => navigate('/StatsData')}> <i class="bi bi-bar-chart fs-5"/> &nbsp;일기 통계</div>
                            <div className="header-dropdown-menu" onClick={() => {handleLogout()}}> <i class="bi bi-box-arrow-right fs-5"/> &nbsp;로그아웃</div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('로그아웃되었습니다.');
        window.location.reload(); //페이지 새로고침
      };

    return ( //navbar navbar-expand-lg bg-body-tertiary
    <nav class="navbar navbar-expand-lg header-style">
        <div class="container-fluid">
            <a class="navbar-brand" href="/" style={{color:'#75472f', fontWeight:'900'}}>사이트이름</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <a className={`nav-link header-top-button ${currentPath==='/HandDiary' ? 'active-link' : ''}`} 
                    style={currentPath === '/HandDiary' ? { pointerEvents: 'none' } : {}} href="/HandDiary">직접 쓴 일기</a>
                    </li>
                    <li className="nav-item">
                    <a className={`nav-link header-top-button ${currentPath==='/AiDiary' ? 'active-link' : ''}`} 
                    style={currentPath === '/AiDiary' ? { pointerEvents: 'none' } : {}} href="/AiDiary">AI 일기</a>
                    </li>

                    {login && (
                    <li className="nav-item d-lg-none"> {/* 모바일 전용 로그인 메뉴 */}
                        {LoginMenu()}
                    </li>
                    )}
                </ul>

                {/* 데스크탑 전용 로그인 메뉴 */}
                {loading ? (
                    <ClipLoader color={"skyblue"} size={30} />
                ) : (
                    login ? (
                    <div className="d-none d-lg-block">{LoginMenu()}</div>
                    ) : (
                    <a className="nav-link header-top-button" href="/login">로그인</a>
                    )
                )}
            </div>
        </div>
    </nav>
    );
};

export default Header;

    // <div>
    //     <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'skyblue'}}>
    //         <div style={{margin: '0 0 0 1rem'}}>
    //             <h2 style={{cursor: 'pointer'}} onClick={() => {navigate('/')}} >사이트이름</h2>
    //         </div>

    //         <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
    //             <button style={{margin: '0.2rem'}} onClick={() => {navigate('/HandDiary')}}>직접 쓴 일기</button>
    //             <button style={{margin: '0.2rem'}} onClick={() => {navigate('/AiDiary')}}>AI 일기</button>
    //         </div>
            
    //         <div style={{backgroundColor:'white', padding:'0.2rem', margin:'0 1rem 0 0'}}>
    //             {loading ? <ClipLoader color={"skyblue"} size={30} /> : (login ? LoginMenu() : <button onClick={() => {navigate('/login')}}>로그인</button>)}
    //         </div>
    //     </div>
    //     <hr style={{margin:'0rem'}}/>
    // </div>

    
    // <nav class="navbar navbar-expand-lg bg-body-tertiary">
    //     <div class="container-fluid">
    //         <a class="navbar-brand" href="/">사이트이름</a>
    //         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    //             <span class="navbar-toggler-icon"></span>
    //         </button>

    //         <div class="collapse navbar-collapse" id="navbarSupportedContent">
    //             <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    //                 <li class="nav-item">
    //                     <a class="nav-link active" aria-current="page" href="/HandDiary">직접 쓴 일기</a>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a class="nav-link" href="/AiDiary">AI 일기</a>
    //                 </li>
    //             </ul>
    //             {loading ? (
    //                 <ClipLoader color={"skyblue"} size={30} />
    //             ) : (
    //                 login ? LoginMenu() : <a class="nav-link" href="/login">로그인</a>
    //             )}
    //         </div>
    //     </div>
    // </nav>