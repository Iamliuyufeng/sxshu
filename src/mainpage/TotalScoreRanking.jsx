import React, { useState, useEffect } from 'react'
import SectionBox from '../components/section/SectionBox'
import ProgressBar from '../components/progressbar/ProgressBar'
import imageTop3 from '../assets/image/top3.png'
import imageTop5 from '../assets/image/top5.png'
import homeStore from '../store/home'
// const scoreList = [{
//     rank: 1,
//     name: '风电场001',
//     value: 98
// },{
//     rank: 2,
//     name: '那方看开风电场',
//     value: 96.1
// }, {
//     rank: 3,
//     name: '那方看开风电场',
//     value: 96.2
// }, {
//     rank: 4,
//     name: '那方看开风电场',
//     value: 87.1
// },{
//     rank: 5,
//     name: '那方看开风电场',
//     value: 88.0
// }]
const FarmList = ({
    list
}) => {
    return <div className='farm-list'>
        {list && list.map((item,index) => {
            return <div className="farm-item" key={index} style={{
                backgroundImage: index < 3 ? `url("${imageTop3}")`: `url("${imageTop5}")`
            }}>
                <div className="farm-rank">{item.rank}</div>
                <div className="farm-name">{item.name}</div>
                <div className="farm-progress"><ProgressBar value={item.value}></ProgressBar></div>
                <div className="farm-value">{item.value}</div>
            </div>
        })}
    </div>
}

function transformData(data) {
  const result = [];
  for (let i = 0; i < Math.min(data.length, 5); i++) {
    const item = data[i];
    result.push({
      rank: i + 1,
      id: item.farm_id,
      name: item.farm_name,
      dq_ratio: item.dq_ratio,
      value: item.dq_score
    });
  }
  return result;
}

const TotalScoreRanking = () => {
    const dataRankingTotalScore = homeStore(state => state.dataRankingTotalScore);
    const fetchRankingTotalScore = homeStore(state => state.fetchRankingTotalScore);
    // 1. 添加状态管理当前排序方式（默认 'desc'）
    const [sortOrder, setSortOrder] = useState('desc');
    
    // 2. 点击事件处理函数
    const handleSortChange = (order) => {
        setSortOrder(order);
        fetchRankingTotalScore(order); // 调用 API 获取新数据
    };
    // 3. 组件挂载时默认获取正数排名
    useEffect(() => {
        fetchRankingTotalScore('desc');
    }, []); // 空依赖数组确保只执行一次
    const scoreList = transformData(dataRankingTotalScore);
    console.log(dataRankingTotalScore);
    return <SectionBox title='场站数据质量TOP5' 
            extra={
                <div className="total-score-btn-box">
                    <div 
                        className={`score-btn ${sortOrder === 'desc' ? 'active' : ''}`}
                        onClick={() => handleSortChange('desc')}
                    >
                        前五
                    </div>
                    <div 
                        className={`score-btn ${sortOrder === 'asc' ? 'active' : ''}`}
                        onClick={() => handleSortChange('asc')}
                    >
                        后五
                    </div>
                </div>
            }
            content={<FarmList list={scoreList}></FarmList>} contentStyle={{ padding: '20px 14px' }}></SectionBox>
}

export default TotalScoreRanking