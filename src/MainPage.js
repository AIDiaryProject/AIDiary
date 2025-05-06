import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginUser from './Park/LoginUser';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Park/Park.scss'
import useWidth from './Park/useWidth';

const MainPage = () => {
    const navigate = useNavigate();
    const { user, login } = LoginUser();
    const [loadingTarget, setLoadingTarget] = useState(null);
    const [des, setDes] = useState(null);

    const width = useWidth();

    const introduce = [
        {
            title: '자유일기', 
            sub : '당신의 이야기에 따듯한 친구들이 답해줘요.', 
            description : '당신의 일기를 직접 작성하세요. 다양한 친구들이 당신의 일기에 조언과 위로, 응원을 전해줍니다.'
        }, 
        {
            title: '마법일기', 
            sub : '느낌과 키워드만 전하세요. 이야기는 우리가 써드릴게요.', 
            description : '제목과 기분, 몇 가지 단어만으로 친구들이 당신만의 특별한 일기를 완성해 드립니다.'
        },
        {
            title: '마이페이지', 
            sub : '마음의 흔적을 모아보는 나만의 공간', 
            description : '지금까지의 소중한 이야기를 간직하고, 새로운 친구들을 만나보세요.'
        },
    ];

    const cardClick = (description) => {
        des == description ? setDes(null) : setDes(description);
    }

    const printDes = () => {
        if (des == null) {
            return (
            login ?
                <div className='main__comment__none-bubble'>
                    {user?.nickname} 님, 환영합니다.
                </div>
                :
                <div className='main__comment__none-bubble'>
                    로그인하고 다양한 서비스를 즐겨보세요.
                </div>
            )
        }

        if (des.startsWith('당신의')) {
            return (
            <div className={`main__comment__speech-bubble tail-left`}>
                {des}
            </div>)
          } else if (des.startsWith('제목과')) {
                return (
                    <div className={`main__comment__speech-bubble tail-center`}>
                        {des}
                    </div>)
          } else if (des.startsWith('지금까지의')) {
                return (
                    <div className={`main__comment__speech-bubble tail-right`}>
                        {des}
                    </div>)
          } else {
            return (
                <div className='main__comment__none-bubble'>
                    '{user?.nickname}'님, 환영합니다.
                </div>
            )
          }
    }

    return (
        <div className='main'>
            <div className='main__top-div'>

                <div className='main__top-left-div'>
                    <div className='main__top-left-text'>
                        <p className='main__sub-title'>마음의 숲에서 만나는 나의 이야기</p>
                        <p className='main__short-text'>하루 끝, 나에게 말을 거는 작은 숲</p>
                        <p className='main__short-text'>당신의 이야기를 함께 들어줄 친구들이 있어요</p>
                    </div>
                    {login ? 
                    <div className='main__top-button-div'>
                        <button className='main__top-button' onClick={() => {navigate('/HandDiary')}}>자유일기</button>
                        <button className='main__top-button' onClick={() => {navigate('/AiDiary')}}>마법일기</button>
                    </div>
                    :
                    <div className='main__top-button-div'>
                        <button className='main__top-button' onClick={() => {navigate('/auth#login')}}>로그인</button>
                        <button className='main__top-button' onClick={() => {navigate('/auth#register')}}>회원가입</button>
                    </div>
                    }
                </div>
                <img src={`/profile/main_all.png`} alt={`all`} className="floating-image"/>
            </div>
            
            <div className="main__grid">
                {introduce.map((a) => (
                <div key={a} className="card main__card" onClick={() => {cardClick(a.description)}}>
                    <div className="card-body d-flex flex-column align-items-center">
                        <h5 className="card-title mt-2">{a.title}</h5>
                        <p className="card-text">
                            {a.sub}
                        </p>
                    </div>
                </div>
                ))}
            </div>

            <div className='main__comment'>
                <div className='main__comment__bubble-block'>
                    {printDes()}
                </div>
            </div>
        </div>
    );
};

export default MainPage;