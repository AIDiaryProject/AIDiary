import React, { useEffect, useState } from 'react';
import LoginUser from "../Park/LoginUser";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MypageList = () => {
    const [data, setData] = useState([]); //일기데이터 저장
    const [selectedItem, setSelectedItem] = useState(null); //모달 보여줄 항목
    const [showModal, setShowModal] = useState(false); //모달 상태

    const { user } = LoginUser();
    const nickname = user?.nickname; //사용자 닉네임 확인

    useEffect(() => { //사용자 닉네임과 비교해 일기 출력
        axios.get('https://aidiary.onrender.com/diaryDB')
        .then((res) => {
            const filteredData = res.data.filter(item => item.nickname === nickname);
            setData(filteredData);
        })
        console.log(data);
    },[nickname]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
        console.log(item);
    };

    const handleClose = () => setShowModal(false);

    return (
        <div>
            <p>안녕하세요</p>
            <ul className="list-group">
                {data.map((item, index) => (
                    <li 
                        key={index}
                        className='list-group-item list-group-item-action'
                        onClick={() => handleItemClick(item)}    
                    >
                        <h3>{item.title}</h3>
                        <p>{item.date.slice(0,10)}</p>
                    </li>
                ))}
            </ul>
            {showModal && selectedItem && (
                <div 
                    className='modal show fade d-block'  
                    tabIndex='-1'
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{selectedItem.title}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    data-bs-dismiss="modal" 
                                    aria-label="Close" 
                                    onClick={handleClose}
                                />
                            </div>
                            <div className='modal-body'>
                                <p>날짜: {selectedItem.date.slice(0,10)}</p>
                                {selectedItem.weather && <p>날씨: {selectedItem.weather}</p>}
                                {selectedItem.mood && <p>기분: {selectedItem.mood}</p>}
                                <p>내용:</p>
                                <p>{selectedItem.content}</p>
                                {selectedItem.comment && <p>코멘트: {selectedItem.comment}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MypageList;