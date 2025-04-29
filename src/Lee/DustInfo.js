import React from 'react';
import { useEnv } from './EnvContext';

const DustInfo = () => {
    const { air } = useEnv();
    if(!air) return null;
    return (
        <div className='info-wrapper'>
            <h2>오늘의 미세먼지 정보</h2>
            <p>📅 <strong>측정 시간:</strong> {air.dataTime}</p>
            <p>🌫️ <strong>미세먼지(PM10):</strong> {air.pm10.value}㎍/㎥ ({air.pm10.grade})</p>
            <p>🌁 <strong>초미세먼지(PM2.5):</strong> {air.pm25.value}㎍/㎥ ({air.pm25.grade})</p>
        </div>
    );
};

export default DustInfo;
