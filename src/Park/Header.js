import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import "bootstrap-icons/font/bootstrap-icons.css";
import ClipLoader from "react-spinners/ClipLoader";
import LoginUser from "./LoginUser";
import Profile from "./Profile";

const Header = () => {
    const navigate = useNavigate();
    const { user, login, loading } = LoginUser();

    const [showDropdown, setShowDropdown] = useState(false);

    const LoginMenu = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                {/* <div style={{backgroundColor:'white', borderRadius:'50px', width:'2.5rem', height:'2.5rem', border:'1px solid black', margin:'0 0.5rem 0 0'}} /> */}
                    <Profile id={user?.profile} size={40}/>
                    <p>{user.nickname}</p>
                </div>

                {showDropdown && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '3.5rem',
                            right: 0,
                            width:'7rem',
                            backgroundColor: 'white',
                            border: '1px solid gray',
                            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
                            padding: '0.5rem',
                            zIndex: 10,
                        }}
                    >
                        <div style={{ padding: '0.3rem 0', cursor: 'pointer', textAlign:'center'}} onClick={() => navigate('/MypageInfo')}>내정보</div>
                        <hr style={{margin:'0rem'}}/>
                        <div style={{ padding: '0.3rem 0', cursor: 'pointer', textAlign:'center'}} onClick={() => {handleLogout()}}>로그아웃</div>
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

    return (
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
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">사이트이름</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/HandDiary">직접 쓴 일기</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/AiDiary">AI 일기</a>
                </li>
                {/* <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
                </li> */}
                {/* <li class="nav-item">
                <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                </li> */}
            </ul>
            <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
            </div>
        </div>
    </nav>
    );
};

export default Header;

// const Title = styled.h1`
//   font-family: "Nanum Pen Script", serif;
//   font-weight: 500;
//   font-style: normal;
//   font-size: 2.5rem;
//   margin: 0.5rem 0 0 0;

//   @media (max-width: 1024px) {
//     font-size: 1.8rem;
//   }
// `;

// const MenuButton = styled.button`
//   padding: 5px 10px;
//   min-width: 50px;
//   font-size: 1.2rem;
//   background-color: white;
//   border: none;
//   margin: 0 0.1rem;
//   cursor: pointer;
//   font-family: "Merienda", serif;
//   font-weight: 700;
//   font-style: normal;
//   color: black;

//   position: relative; /* ::after를 기준으로 position 설정 */
//   &:hover {
//     color: gray;
//   }

//   /* 밑줄 애니메이션 */
//   &::after {
//     content: '';
//     position: absolute;
//     bottom: 0; /* 버튼의 글씨 바로 아래 */
//     left: 50%; /* 중앙에서 시작 */
//     width: 0%; /* 초기 너비 0% */
//     height: 2px; /* 밑줄 두께 */
//     background-color: gray; /* 밑줄 색상 */
//     transform: translateX(-50%); /* 가운데 정렬 */
//     transition: width 0.3s ease-out; /* 부드러운 확장 애니메이션 */
//   }

//   &:hover::after {
//     width: 80%; /* 마우스를 올리면 너비가 버튼 전체로 확장 */
//   }
// `;

// const HR = styled.hr`
//   height : 0.2rem;
//   background-color : gray;
//   border : 0;
//   margin: 1rem 0 0 0;
// `