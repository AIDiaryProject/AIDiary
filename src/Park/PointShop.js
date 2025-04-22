import React from 'react';
import LoginUser from './LoginUser';
import Profile from './Profile';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";

const PointShop = () => { //user.profile : 사용중 / user.item : 보유중
    const { user, loading } = LoginUser();
    const product = Array.from({ length: 10 }, (_, i) => i + 1); //상품 목록 배열 (1~n)

    // 프로필별 가격 설정
    const profilePrices = {
        1: 100, 2: 150, 3: 200, 4: 250, 5: 300,
        6: 350, 7: 400, 8: 450, 9: 500, 10: 550
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

      if(loading) return <ClipLoader color={"skyblue"} size={30} />

    return (
        <div style={{backgroundColor:'#F5F7FA', width:'100%'}}>
            <h3 style={{color:'#ba9378', fontWeight:'bold'}}>포인트샵</h3>
            <p>보유 포인트 : {user?.point}</p>
            {product.map((a, index) => {
                return( 
                    <div>
                        <Profile id={a}/>
                        {/* <button onClick={() => {alert(`${a}번 사진 구매!`)}}> 구매 </button> */}
                        <button
                            onClick={() => buyProfile(a)}
                            disabled={user?.item.includes(a)}
                            style={{backgroundColor:'#ffd768', border:'0', padding:'1rem', borderRadius:'10px', fontWeight:'bold', color:'#5d576b'}}
                        >
                          {user?.item.includes(a) ? '보유중' : `구매 (${profilePrices[a]}P)`}
                        </button>
                        <p style={{color:'#1f93ff', fontWeight:'bold'}}>{user?.item.includes(a) ? '보유중' : ''}</p>
                    </div>
                )
            })}
        </div>
    );
};

export default PointShop;