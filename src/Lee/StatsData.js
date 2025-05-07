import React, { useState, useEffect } from 'react';
import LoginUser from "../Park/LoginUser";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Bar, BarChart } from 'recharts';

const StatsData = () => {
    const [data, setData] = useState([]); //일기데이터 저장

    const [expandedChart, setExpandedChart] = useState(null); //선택한 차트

    const { user } = LoginUser();
    const id = user?.id; //사용자 id 확인
    useEffect(() => { //사용자 닉네임과 비교해 일기 출력

        axios.get('https://aidiary.onrender.com/diaryDB')
            .then((res) => {
                const filteredData = res.data.filter(item => item.user_id === id);
                setData(filteredData);
            })
        console.log(data);
    }, [id]);

    //감정레벨 설정
    const emotionLevels = [
        { id: 0, label: "최악" },
        { id: 1, label: "분노" },
        { id: 2, label: "슬픔" },
        { id: 3, label: "보통" },
        { id: 4, label: "기쁨" },
        { id: 5, label: "행복" },
        { id: 6, label: "최고" },
    ];

    //통계 구분
    const stats = [
        { id: 0, label: "날짜별 감정" },
        { id: 1, label: "감정별 빈도수" },
        { id: 2, label: "요일별 작성 빈도" },
        { id: 3, label: "작성율" },
    ];

    //날짜별 감정
    const scores = data.map(item => item.emotionScore);
    const label = data.map(item => item.emotionLabel);
    const date = data.map(item => item.date.slice(0, 10));
    const chartData = label.map((labelItem, index) => ({
        date: date[index],
        label: labelItem,
        value: parseFloat(scores[index])
    }));

    //감정별 빈도수
    //감정별 빈도수 계산
    const emotionCount = {};
    chartData.forEach(item => {
        const label = item.label || '없음';
        emotionCount[label] = (emotionCount[label] || 0) + 1;
    });
    //감정 데이터 사용하기 위해 변환
    const pieData = emotionLevels
        .map(level => ({
            name: level.label,
            value: emotionCount[level.label] || 0
        }))
        .filter(item => item.value > 0); // 사용된 감정만 표시
    //색상 정의
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#ff6666'];

    //요일별 작성 빈도
    //요일 추출
    const getDayName = (dateStr) => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const day = new Date(dateStr).getDay(); // 0~6
        return days[day];
    };
    //요일별 빈도수 집계
    const weekdayCount = {};
    date.forEach(dateStr => {
        const dayName = getDayName(dateStr);
        weekdayCount[dayName] = (weekdayCount[dayName] || 0) + 1;
    });

    // 차트용 데이터 변환 (순서 고정)
    const weekdayData = ['일', '월', '화', '수', '목', '금', '토'].map(day => ({
        name: day,
        value: weekdayCount[day] || 0
    }));

    //작성율
    // 작성한 날짜 목록 (중복 제거)
    const uniqueDates = [...new Set(date.map(d => d.slice(0, 10)))]; // YYYY-MM-DD
    const totalWrittenDays = uniqueDates.length;
    // 작성 시작일 ~ 오늘까지 경과 일수 계산
    const firstDiaryDate = new Date(uniqueDates.sort()[0]);
    const today = new Date();
    const diffTime = today.getTime() - firstDiaryDate.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    // 작성율 계산
    const writeRate = Math.round((totalWrittenDays / totalDays) * 100);
    //차트용 데이터 변환
    const written = totalWrittenDays; // 작성한 날짜 수
    const unwritten = totalDays - totalWrittenDays; // 작성 안 한 날짜 수
    const writeRatePieData = [
        { name: '작성', value: written },
        { name: '미작성', value: unwritten }
    ];
    const PIE_COLORS = ['#82ca9d', '#ff9999']; // 작성: 녹색, 미작성: 빨강

    //카드 클릭 핸들러
    const openChartModal = (chartName) => {
        setExpandedChart(chartName);
    };

    const closeChartModal = () => {
        setExpandedChart(null);
    };


    return (
        <div className='myPageList'>
            <h1 className='myPageList__title'>통계</h1>
            <hr />
            <p>날짜별 감정{stats.id}</p>
            <div className='myPageList__card' onClick={() => openChartModal('emotionLine')}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                        />
                        <YAxis
                            domain={[0, 6]}
                            ticks={[0, 1, 2, 3, 4, 5, 6]}
                            tickFormatter={(value) => {
                                const level = emotionLevels.find(level => level.id === value);
                                return level?.label || '';
                            }}
                        />
                        <Tooltip
                            formatter={(value, label, props) => [`감정: ${props.payload.label}`]}
                            labelFormatter={(label) => `날짜: ${label}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <hr />
            <p>감정별 빈도수</p>
            <div className='myPageList__card' onClick={() => openChartModal('emotionPie')}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value}회`, `감정: ${name}`, '']} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <hr />
            <p>요일별 작성 빈도</p>
            <div className='myPageList__card' onClick={() => openChartModal('weekBar')}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weekdayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" label={{ value: '요일', position: 'insideBottom', offset: -5 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                            formatter={(value) => [`${value}회`, '']}
                        />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <hr />
            <p>작성율</p>
            <div className='myPageList__card' onClick={() => openChartModal('writeRate')}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={writeRatePieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            dataKey="value"
                        >
                            {writeRatePieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}일`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {expandedChart && (
                <div className="chart-modal-overlay" onClick={closeChartModal}>
                    <div className="chart-modal-content" onClick={closeChartModal}>
                        <div className="modal-header">  
                            <div className="modal-title-block">
                                <h1 className="modal-title">
                                {stats.find(stat => {
                                    if (expandedChart === 'emotionLine') return stat.id === 0;
                                    if (expandedChart === 'emotionPie') return stat.id === 1;
                                    if (expandedChart === 'weekBar') return stat.id === 2;
                                    if (expandedChart === 'writeRate') return stat.id === 3;
                                    return false;
                                })?.label}
                                </h1>
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                            />
                        </div>
                        {expandedChart === 'emotionLine' && (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                    />
                                    <YAxis
                                        domain={[0, 6]}
                                        ticks={[0, 1, 2, 3, 4, 5, 6]}
                                        tickFormatter={(value) => {
                                            const level = emotionLevels.find(level => level.id === value);
                                            return level?.label || '';
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value, label, props) => [`감정: ${props.payload.label}`]}
                                        labelFormatter={(label) => `날짜: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8884d8"
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                        {expandedChart === 'emotionPie' && (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value}회`, `감정: ${name}`, '']} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        {expandedChart === 'weekBar' && (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={weekdayData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" label={{ value: '요일', position: 'insideBottom', offset: -5 }} />
                                    <YAxis allowDecimals={false} label={{ value: '작성 수', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        formatter={(value) => [`${value}회`, '']}
                                    />
                                    <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {expandedChart === 'writeRate' && (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={writeRatePieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        dataKey="value"
                                    >
                                        {writeRatePieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}일`} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsData;