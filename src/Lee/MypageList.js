import React, { useEffect, useState } from 'react';
import LoginUser from "../Park/LoginUser";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const MypageList = () => {
    const [data, setData] = useState([]); //일기데이터 저장
    const [selectedItem, setSelectedItem] = useState(null); //모달 보여줄 항목
    const [showModal, setShowModal] = useState(false); //모달 상태
    const [startDate, setStartDate] = useState(null); //datepicker

    const [searchInput, setSearchInput] = useState(""); //입력 중인 텍스트
    const [searchTerm, setSearchTerm] = useState("");  //실제 검색어
    const [searchType, setSearchType] = useState("title"); //제목, 내용, 제목+내용

    const [currentPage, setCurrentPage] = useState(1); //페이지
    const itemsPerPage = 5; // 한 페이지당 보여줄 게시물 수

    const { user } = LoginUser();
    const id = user?.id; //사용자 id 확인

    useEffect(() => { //사용자 닉네임과 비교해 일기 출력
        axios.get('https://aidiary.onrender.com/diaryDB')
        .then((res) => {
            const filteredData = res.data.filter(item => item.user_id === id);
            setData(filteredData);
        })
        console.log(data);
    },[id]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
        console.log(item);
    };

    const handleClose = () => setShowModal(false);

    const formatYMD = (date) => { //toISOString()은 UTC 기준이라 하루 밀리는 문제가 생길 수 있음
        return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' + //getMonth()는 0 부터 시작
        String(date.getDate()).padStart(2, '0');
    };
      
    const DateFilteredData = data.filter(item => {
        const matchesDate = !startDate || formatYMD(startDate) === item.date.slice(0, 10);

        // 검색어 필터
        const term = searchTerm.toLowerCase();
        const title = item.title.toLowerCase();
        const content = item.content.toLowerCase();
      
        let matchesSearch = true;
        if (term) {
          if (searchType === "title") {
            matchesSearch = title.includes(term);
          } else if (searchType === "content") {
            matchesSearch = content.includes(term);
          } else if (searchType === "both") {
            matchesSearch = title.includes(term) || content.includes(term);
          }
        }
      
        return matchesDate && matchesSearch;
    });

    
    useEffect(() => { //검색시 페이지 1로 초기화
        setCurrentPage(1);
    }, [startDate, searchTerm, searchType]);

    const startIndex = (currentPage - 1) * itemsPerPage; //현재 페이지 시작 인덱스
    const endIndex = startIndex + itemsPerPage; //현재 페이지의 끝 인덱스
    const pagedData = DateFilteredData.slice(startIndex, endIndex); //현재 페이지 보여줄 게시물
    const totalPages = Math.ceil(DateFilteredData.length / itemsPerPage); //전체 페이지 계산
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); //페이지 번호 생성

    return (
        <div>
            {/* 날짜 검색 */}
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="날짜를 선택하세요"
                className="form-control mb-3 mt-3"
                isClearable
                withPortal
            />
            {/* 검색 */}
            <div className="input-group mb-3">
                <label 
                    className="input-group-text" 
                    htmlFor="searchType"
                    style={{ width: "10%" }}
                >
                    검색 기준
                </label>
                {/* 제목, 내용, 제목+내용 선택 */}
                <select
                    className="form-select"
                    id="searchType"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ width: "15%" }}
                >
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="both">제목 + 내용</option>
                </select>
                {/* 검색어 */}
                <input
                    type="text"
                    className="form-control"
                    placeholder="검색어를 입력하세요"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setSearchTerm(searchInput); // 실제 검색어에 반영
                    }
                    }}
                    style={{ width: "65%" }}
                />
                {/* 검색 아이콘 */}
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm(searchInput)}
                    title="검색"
                    style={{ width: "5%" }}
                >
                    <i className="bi bi-search"></i>
                </button>
                {/* 취소 아이콘 */}
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => {setSearchTerm(''); setSearchInput("");}}
                    title="검색"
                    style={{ width: "5%" }}
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>
            {/* 게시글 목록 */}
            <ul className="list-group">
                {pagedData.map((item, index) => (
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
            {/* 게시글 모달 */}
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
                                <p>기분: {selectedItem.emotionLabel}</p>
                                <p>내용:</p>
                                <p>{selectedItem.content}</p>
                                {selectedItem.comment && <p>코멘트: {selectedItem.comment}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* 페이지 버튼 */}
            <nav className="mt-3">
                <ul className="pagination justify-content-center">
                {pageNumbers.map((num) => (
                    <li key={num} className={`page-item ${num === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(num)}>{num}</button>
                    </li>
                ))}
                </ul>
            </nav>
        </div>
    );
};

export default MypageList;