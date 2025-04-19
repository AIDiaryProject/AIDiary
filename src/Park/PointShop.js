import React from 'react';
import LoginUser from './LoginUser';
import Profile from './Profile';

const PointShop = () => { //user.profile : 사용중 / user.item : 보유중
    const { user } = LoginUser();
    const product = Array.from({ length: 10 }, (_, i) => i + 1); //상품 목록 배열 (1~n)

    const buyProfile = async (profileId, price) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/buy-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ profileId, price })
            });
    
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || '구매 실패');
            } else {
                alert('구매 성공!');
                window.location.reload(); // 또는 상태 업데이트로 최신 정보 반영
            }
        } catch (err) {
            console.error('구매 에러:', err);
        }
    };

    return (
        <div>
            포인트샵입니다.
            ==============
            {product.map((a, index) => {
                return( 
                    <div>
                        <Profile id={a}/>
                        {/* <button onClick={() => {alert(`${a}번 사진 구매!`)}}> 구매 </button> */}
                        <button onClick={() => buyProfile(a, 100)}>구매 (100P)</button>
                        <p style={{color:'blue', fontWeight:'bold'}}>{user?.item.includes(a) ? '보유중' : ''}</p>
                    </div>
                )
            })}
        </div>
    );
};

export default PointShop;