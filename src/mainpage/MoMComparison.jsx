// 同环比情况模块
import React, { useEffect, useState, useRef } from 'react'
import SectionBox from '../components/section/SectionBox'
import { Segmented, DatePicker, Table, Select } from 'antd'
import dayjs from 'dayjs'
import homeStore from '../store/home'
import globalStore from '../store/globals'

import useTableScrollHeightRef from '../utils/useTableScrollHeight'

const columns = [
  {
    width: '56px',
    title: '序号',
    dataIndex: 'serialNumber',
    className: 'column-name',
  },
  {
    className: 'column-score',
    width: '96px',
    title: '场站名称',
    dataIndex: 'farm_name',
  },
  {
    title: '场站得分',
    width: '52px',
    className: 'column-score',
    dataIndex: 'current_dq_score'
  },
  {
    title: '同比得分',
    width: '52px',
    className: 'column-score',
    dataIndex: 'baseline_dq_score'
  },
  {
    title: '同比排名',
    width: '52px',
    className: 'column-score',
    dataIndex: 'baseline_dq_ranking',
  },
  {
    title: '场站排名',
    width: '52px',
    className: 'column-score',
    dataIndex: 'current_dq_ranking',
  }
];


const Content = ({ compare }) => {
  const tableRef = useRef(null)
  const [tableScrollY] = useTableScrollHeightRef(tableRef, 116)
  const rankingTotalScoreCompare = homeStore(state => state.rankingTotalScoreCompare)
  const fetchRankingTotalScoreCompare = homeStore(state => state.fetchRankingTotalScoreCompare);
  const provinces = globalStore(state => state.provinces)
  const [viewType, setViewType] = useState('全国'); // '全国' 或 '省份'
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // 页面初始化：设置默认时间为当前年月
  useEffect(() => {
    if (!selectedDate) {
      const now = dayjs();
      setSelectedDate(now);
    }
  }, [selectedDate]);

  // 初始化或切换视图时触发数据请求
  useEffect(() => {
    if (selectedDate) {
      const params = {
        year: selectedDate.year(),
        month: selectedDate.month() + 1, // dayjs月份从0开始，需要+1
        compare: compare,
        province: viewType === '全国' ? '' : (selectedProvince || provinces[0]?.value)
      };
      fetchRankingTotalScoreCompare(params);
    }
  }, [viewType, selectedProvince, selectedDate, compare]);

  // 新增序号
  const tableList = rankingTotalScoreCompare.map((r, index) => {
    return {
      ...r,
      serialNumber: index + 1
    }
  })

  return <div className='mom-comparison' ref={tableRef}>
    <div className="position">
      <Segmented
        value={viewType}
        onChange={(ev) => {
          setViewType(ev);
          // 切换到省份时，默认选中第一个省份
          if (ev === '省份' && provinces.length > 0 && !selectedProvince) {
            setSelectedProvince(provinces[0].value);
          }
        }}
        options={['全国', '省份']}
      />
      {/* 只在切换到省份时显示Select组件 */}
      {viewType === '省份' && (
        <Select
          style={{ width: 90, height: 32 }}
          options={provinces}
          value={selectedProvince || provinces[0]?.value}
          onChange={setSelectedProvince}
        />
      )}
      <DatePicker
        size='small'
        style={{ width: 120, height: '32px' }}
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        picker="month"
      />
    </div>
    <Table
      className='sx-table mom-table'
      scroll={{
        y: tableScrollY
      }}
      columns={columns} dataSource={tableList} pagination={false}></Table>
  </div>
}

const MoMComparison = () => {
  const [compare, setCompare] = useState('yoy');
  // 移除 fetchRankingTotalScoreCompare，由 Content 组件内部统一管理 API 调用
  const handleChange = (order) => {
    setCompare(order);
  };
  return <SectionBox
              extra={
                <div className="total-score-btn-box">
                    <div 
                        className={`score-btn ${compare === 'yoy' ? 'active' : ''}`}
                        onClick={() => handleChange('yoy')}
                    >
                        同比
                    </div>
                    <div 
                        className={`score-btn ${compare === 'mom' ? 'active' : ''}`}
                        onClick={() => handleChange('mom')}
                    >
                        环比
                    </div>
                </div>
            }
      title='同环比情况' content={<Content compare={compare}></Content>} >
  </SectionBox>
}

export default MoMComparison