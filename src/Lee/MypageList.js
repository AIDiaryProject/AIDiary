import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './Lee.scss';
import { useDiaryContext } from "../Lee/DiaryContext";

const MypageList = () => {
    const { diaryList, refresh } = useDiaryContext();
    const [selectedItem, setSelectedItem] = useState(null); //모달 보여줄 항목
    const [showModal, setShowModal] = useState(false); //모달 상태
    const [startDate, setStartDate] = useState(null); //datepicker

    const [searchInput, setSearchInput] = useState(""); //입력 중인 텍스트
    const [searchTerm, setSearchTerm] = useState("");  //실제 검색어
    const [searchType, setSearchType] = useState("title"); //제목, 내용, 제목+내용

    const [currentPage, setCurrentPage] = useState(1); //페이지
    const itemsPerPage = 10; // 한 페이지당 보여줄 게시물 수

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
      
    const DateFilteredData = diaryList
    .filter(item => {
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
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); //최근 날짜 순 정렬

    
    useEffect(() => { //검색시 페이지 1로 초기화
        setCurrentPage(1);
    }, [startDate, searchTerm, searchType]);

    const startIndex = (currentPage - 1) * itemsPerPage; //현재 페이지 시작 인덱스
    const endIndex = startIndex + itemsPerPage; //현재 페이지의 끝 인덱스
    const pagedData = DateFilteredData.slice(startIndex, endIndex); //현재 페이지 보여줄 게시물
    const totalPages = Math.ceil(DateFilteredData.length / itemsPerPage); //전체 페이지 계산
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); //페이지 번호 생성

    const { state } = useLocation();
    useEffect(() => {
        if (state?.refresh) refresh(); // diaryList를 강제 갱신
      }, [state]);

    return (
        <div className='info'>
            <h1 className='info__title'>일기 목록</h1>
            <hr/>
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
                        <div className='list-each'>
                            <h1>{item.title}</h1>
                            <p>{item.date.slice(0,10)}</p>
                        </div>
                    </li>
                ))}
            </ul>
            {/* 게시글 모달 */}
            {showModal && selectedItem && (
                <div className='modal-wrapper'>
                    <div 
                        className='modal-overlay'
                        tabIndex='-1'
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={handleClose}
                    >
                        <div 
                            className='modal-dialog custom-modal-size'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h1 className='modal-title'>{selectedItem.title}</h1>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        aria-label="Close" 
                                        onClick={handleClose}
                                    />
                                </div>
                                <div className="modal-body">
                                    <div className="modal-diary">
                                        <h2>{selectedItem.date.slice(0,10)}</h2>
                                        {selectedItem.weather && <h2>날씨 {selectedItem.weather}</h2>}
                                        <h2>기분: {selectedItem.emotionLabel}</h2>
                                        {selectedItem.content.split('\n').map((line, index) => (
                                            <h2 key={index}>
                                                {line}
                                            </h2>
                                        ))}
                                    </div>

                                    {selectedItem.comment && (
                                        <div className="modal-comment">
                                            <h2>코멘트: {selectedItem.comment}</h2>
                                        </div>
                                    )}
                                </div>

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