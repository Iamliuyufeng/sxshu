import React from 'react';
import EchartsRingChart from '../components/donuts/EchartsRingChart.jsx';
import centerImg from '../assets/image/anli.png'
import caseStore from '../store/case'
import RingLegend from './RingLegend.jsx';

// 中心背景图（替换为你的实际图片URL）
const RingChartDemo = ({
  images = [],
  ringData
}) => {
  const colors = ['#00DBD5','#B947FF', '#FF8600', '#FFD500', '#47A1FF']
  return (
    <div className='ring-with-legend'>
        <div className='ring-container'>
          { images }
          <img src={centerImg}></img>
          <EchartsRingChart style={{
              width: '260px',
              height: '260px'
          }} 
          innerRadius='73%'
          outerRadius='85%'
          colors={colors}
          data={ringData}
          ></EchartsRingChart>
        </div>
        <div className='legend-list'>
          {ringData && ringData.map((data, index) => {
            return <RingLegend color={colors[index % 5]} label={data.name} value={data.value}></RingLegend>
          })}
        </div>
    </div>
  );
};

export default RingChartDemo;