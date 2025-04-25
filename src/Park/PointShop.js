import React, { useState } from 'react';
import LoginUser from './LoginUser';
import Profile from './Profile';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Park.scss'
import Characters from '../Lee/Characters';

const PointShop = () => { //user.profile : 사용중 / user.item : 보유중
    const { user, loading } = LoginUser();
    const product = Array.from({ length: 9 }, (_, i) => i + 1); //상품 목록 배열 (1~n)

    const [showModal, setShowModal] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    // 프로필별 가격 설정
    const profilePrices = {
        1: 100, 2: 100, 3: 100, 4: 200, 5: 200,
        6: 200, 7: 300, 8: 300, 9: 300
    };

    const buyProfile = async (profileId) => {
        const price = profilePrices[profileId];
    
        try {
          const response = await axios.post('https://aidiary.onrender.com/users/buy-profile', {
            profileId,
            price
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
    
          alert(`${profileId}번 프로필 구매 성공!`);
          window.location.reload();
        } catch (error) {
          alert(error.response?.data?.error || '구매 실패');
        }
      };

      const clickCard = (id) => {
        const char = Characters.find(c => c.number === id);
        setSelectedCharacter(char);
        setShowModal(true);
      }

      if(loading) return <ClipLoader color={"skyblue"} size={30} />

    return (
        <div className='shop'>
          <h3 className='shop__title'>포인트샵</h3>
          <div className="shop__point"> 
              <i class="bi bi-p-circle-fill fs-5 shop__point-logo"/>
              <p className="shop__point-text">보유 포인트 : </p>
              <p className="shop__point-text">{user?.point}</p>
          </div>

          <div className="shop__grid">
            {product.map((a) => (
              <div key={a} className="card shop__card" onClick={() => {clickCard(a)}}>
                <div className="card-body d-flex flex-column align-items-center">
                  <Profile id={a} size={110} />
                  <h5 className="card-title mt-2">{Characters.find(c => c?.number === a)?.name}</h5>
                  <p className="card-text">
                    {Characters.find(c => c?.number === a)?.type}
                  </p>
                  <button
                    className="shop__button"
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      buyProfile(a);
                    }}
                    disabled={user?.item.includes(a)}
                  >
                    {user?.item.includes(a) ? '보유중' : `구매 (${profilePrices[a]}P)`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showModal && <div 
                className='modal show fade d-block'  
                tabIndex='-1'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header shop__modal-header'>
                        <button className='shop__modal-hidden'>X</button>
                            <h5 className='modal-title shop__modal-title'>소개</h5>
                            <button className='shop__modal-close' onClick={() => {setShowModal(false)}}>X</button>
                        </div>
                        <div className='modal-body shop__modal-content'>
                          <br />
                          <Profile id={selectedCharacter.number} size={150} square={true}/>
                          <p className='shop__modal-name'>{selectedCharacter.name}</p>
                          <p className='shop__modal-type'>{selectedCharacter.type}</p>
                          <p className='shop__modal-description'>
                            {selectedCharacter.trait.split(/(?<=[.!])\s*/).map((sentence, index) => ( //소개문구에서 .혹은 !가 나오면 줄바꿈
                              sentence.trim() && (
                                <React.Fragment key={index}>
                                  {sentence.trim()}
                                  <br />
                                </React.Fragment>
                              )
                            ))}
                          </p>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default PointShop;

        // <div className='shop'>
        //     <h3 className='shop__title'>포인트샵</h3>
        //     <p>보유 포인트 : {user?.point}</p>
        //     {product.map((a, index) => {
        //         return( 
        //             <div>
        //                 <Profile id={a}/>
        //                 {/* <button onClick={() => {alert(`${a}번 사진 구매!`)}}> 구매 </button> */}
        //                 <button
        //                     onClick={() => buyProfile(a)}
        //                     disabled={user?.item.includes(a)}
        //                     style={{backgroundColor:'#ffd768', border:'0', padding:'1rem', borderRadius:'10px', fontWeight:'bold', color:'#5d576b'}}
        //                 >
        //                   {user?.item.includes(a) ? '보유중' : `구매 (${profilePrices[a]}P)`}
        //                 </button>
        //                 <p style={{color:'#1f93ff', fontWeight:'bold'}}>{user?.item.includes(a) ? '보유중' : ''}</p>
        //             </div>
        //         )
        //     })}
        // </div>