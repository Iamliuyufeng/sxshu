import React, { useState, useEffect, useRef } from 'react';
import { Segmented, DatePicker, Table, Select } from 'antd';
import dayjs from 'dayjs';
import { getCssAlignedGradientColor } from '../utils/utils';
// 导入独立的浮层组件
import GlobalPopoverQuality from './GlobalPopoverQuality'; // 路径根据实际项目调整
import ProvinceAppealForm from '../appeal/ProvinceAppealForm';
import AppealCreateModal from '../appeal/AppealCreateModal.jsx';

import { randomScores } from '../store/mock';

import homeStore from '../store/home'
import globalStore from '../store/globals'
import appealStore from '../store/appeal'

import slideImage from '../assets/image/slider.png'
import { list } from '../utils/colclient';
import StationAppealConfirmModal from '../appeal/StationAppealConfirmModal';
import StationAppealEditModal from '../appeal/StationAppealEditModal';
const { RangePicker } = DatePicker;

const RegionalDataQuality = () => {
  // 1. 定义状态：存储Table的scroll.y像素值
  const [tableScrollY, setTableScrollY] = useState(0);
  const scores = homeStore(state => state.scores);
  const countryScores = homeStore(state => state.countryScores);
  const fetchDataQualityByDomain = homeStore(state => state.fetchDataQualityByDomain);
  const fetchDataQualityProvinces = homeStore(state => state.fetchDataQualityProvinces);
  const rootRef = useRef(null)
  const [tableWidth, setTableWidth] = useState('535px');
  
  const [clickedRecord, setClickedRecord] = useState({});
  const [clickedObject, setClickedObject] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const [segName, setSegName] = useState('全国')
  const [currentProvince, setCurrentProvince] = useState('')
  const [currentProvinceName, setCurrentProvinceName] = useState('')
  
  const leftShow = homeStore(state => state.leftShow)
  const setScores = homeStore(state => state.setScores)
  const provinces = globalStore(state => state.provinces)
  const createAppeal = appealStore(state => state.createAppeal)

  // 新增：存储时间范围，默认值是本月1号到现在
  const defaultStartDate = dayjs().startOf('month').format('YYYY-MM-DD');
  const defaultEndDate = dayjs().format('YYYY-MM-DD');
  const [timeRange, setTimeRange] = useState([defaultStartDate, defaultEndDate]);


  // 处理单元格点击事件
  const handleCellClick = (e) => {
    // 更新浮层位置（基于鼠标点击的坐标，也可以用元素的位置）
    setPopoverPosition({
      x: e.clientX,
      y: e.clientY
    });
    setPopoverVisible(true);
  };

  const columnRender = (value, record, label) => {
    return <div className="hot-cell" style={{
      backgroundColor: getCssAlignedGradientColor(value),
    }} onClick={e => {
      if (label === '总得分') {
        return;
      }
      setClickedObject([label, value, columns.find(t => t.title === label).dataIndex]);
      setClickedRecord(record);
      handleCellClick(e)
    }}>
      {value}
    </div>
  }

  const columns = [
    {
      width: !currentProvince ? '56px': '160px',
      dataIndex: 'name',
      className: 'column-name',
      align: 'left',
      render: val => {
        if (currentProvince) {
          if (val.startsWith(currentProvinceName)) {
            return val.substring(currentProvinceName.length)
          } else {
            return val
          }
        } else {
          return val
        }
        // if (val.startsWith(currentProvince)) {
        //   return val.substring(currentProvince.length)
        // }
      }
    },
    {
      className: 'column-score',
      width: '20%',
      render: (value, record) => {
        return columnRender(value, record, '总得分')
      },
      title: '总得分',
      sorter: {
        compare: (a, b) => a.total - b.total
      },
      dataIndex: 'total',
    },
    {
      title: '电量',
      render: (value, record) => {
        return columnRender(value, record, '电量')
      },
      width: '20%',
      className: 'column-score',
      dataIndex: 'energy',
      sorter: {
        compare: (a, b) => a.energy - b.energy
      },
    },
    {
      title: '状态',
      render: (value, record) => {
        return columnRender(value, record, '状态')
      },
      width: '20%',
      className: 'column-score',
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => a.status - b.status
      },
    },
    {
      title: '故障',
      render: (value, record) => {
        return columnRender(value, record, '故障')
      },
      width: '20%',
      className: 'column-score',
      dataIndex: 'fault',
      sorter: {
        compare: (a, b) => a.error - b.error
      },
    },
    {
      title: '一次接线图',
      render: (value, record) => {
        return columnRender(value, record, '一次接线图')
      },
      width: '20%',
      className: 'column-score',
      dataIndex: 'pwd',
      sorter: {
        compare: (a, b) => a.line - b.line
      },
    }
  ];

  // 2. 定义ref：绑定table-container和图片元素
  const tableContainerRef = useRef(null)

  // 3. useEffect：计算高度（组件挂载+窗口大小变化时触发）
  useEffect(() => {
    // 定义计算高度的函数
    const calculateTableHeight = () => {
      const qulityTable = document.querySelector('.table-container')

      if (qulityTable) {
        const containerHeight = qulityTable.clientHeight;
        // 获取图片的实际高度（像素值）
        setTableScrollY(Math.max(0, containerHeight - 46));
      }
    };

    calculateTableHeight();

    // 监听窗口大小变化，重新计算高度（适配响应式）
    window.addEventListener('resize', calculateTableHeight);

    // 清理函数：移除事件监听，避免内存泄漏
    return () => {
      window.removeEventListener('resize', calculateTableHeight);
    };
  }, []); // 空依赖：仅在组件挂载时执行（若有依赖数据，可添加到依赖数组）

  // 新增：关闭浮层的方法
  const handlePopoverClose = appeal => {
    setPopoverVisible(false);
    if (appeal) {
      if (segName === '全国') {
        createAppeal({
          province: clickedRecord.name,
          appealType: clickedObject[2]
        })
      } else {
        createAppeal({
          province: currentProvince,
          site: clickedRecord.name,
          appealType: clickedObject[2]
        })
      } 
      // if (clickedRecord) {
      //   createAppealHome({
      //     provinceAppealObject: { 
      //       province: clickedRecord.name, 
      //       appealType: clickedObject[2],
      //       score: clickedRecord[clickedObject[2]]
      //     }
      //   })
    }
  };

  const setProvince = async province => {
    setCurrentProvince(province)
    // const sites = await list('sites', {
    //   province
    // })
    // console.log(sites);
    // setScores(randomScores(sites.list.map(it => it.name)))
  }
  
  // 监听 省份code
  useEffect(() => {
    // 执行查询
    handleQuery()
  }, [currentProvince]);

  useEffect(() => {
    if (rootRef.current) {
      setTableWidth((rootRef.current.clientWidth - 20) + 'px')
    }
  }, [leftShow])
  console.log(scores, countryScores);
  const resultScore = segName === '全国' ? countryScores : scores;
  const newScores = resultScore.map(item => {
    const name = !currentProvince ? item?.name || item?.province_name : item.farm_name;
    return {
      name: name,
      ...item,
      total: item?.total?.dq_score,
      status: item?.status?.dq_score,
      fault: item?.fault?.dq_score,
      pwd: item?.pwd?.dq_score,
      energy: item?.energy?.dq_score,
    }
  })

  // 处理 RangePicker 的 onChange 事件
  const handleTimeRangeChange = (dates, dateStrings) => {
    setTimeRange(dateStrings); // 存储字符串 ["2024-01-01", "2024-01-31"]
  };
  // 处理“查询”按钮的 onClick 事件
  const handleQuery = (tabName) => {
    const currentTab = tabName || segName;
    const [startTime, endTime] = timeRange;
    let params = {
      startTime,
      endTime,
      province: currentProvince
    }
    if (currentTab === '全国') {
      params.province = '';
      fetchDataQualityProvinces(params); // 调用 API 并传入时间范围
    } else {
      params.pageSize = 100;
      params.page = 1;
      fetchDataQualityByDomain(params); // 调用 API 并传入时间范围
    }
    console.log('区域数据质量请求参数----------------', params)
    
  };
  console.log(newScores, provinces);
  return <div className='reginal-data-quality' ref={rootRef}>
    <div className='toolbar'>
      <Segmented
        value={segName}
        onChange={val => {
          if (val === '全国') {
            setCurrentProvince('')
            console.log(provinces);
            // setScores(randomScores(provinces.map(it => it.label)))
          } else {
            // 切换到省份，默认选中第一个
            const firstProvince = provinces?.[0];
            if (firstProvince) {
              setCurrentProvince(firstProvince.value)
              setCurrentProvinceName(firstProvince.label)
            }
          }
          setSegName(val)
        }}
        options={['全国', '省份']}
      />
      {segName === '省份' && <Select style={{ width: 90, height: 32 }} value={currentProvince} onChange={val => {
        const province = provinces.find(p => p.value === val);
        setProvince(val)
        setCurrentProvinceName(province?.label || '')
      }} options={provinces}></Select>}
      <RangePicker
          style={{ width: '260px' }}
          onChange={handleTimeRangeChange}
          value={[dayjs(defaultStartDate), dayjs(defaultEndDate)]}
      />
      <button className="main" onClick={() => handleQuery()}>查询</button> 
    </div>

    <div className="table-container" ref={tableContainerRef}>
      <Table
        scroll={{
          y: tableScrollY
        }}
        style={{
          width: tableWidth //leftShow ? 'calc(100vw - 960px)' : 'calc(100vw - 553px)'
        }}
        className='quality-table'
        rowHoverable={false}
        columns={columns} dataSource={newScores} pagination={false} />
      <img className='slider-img' src={slideImage} style={{}}></img>
    </div>

    {/* 替换为独立的浮层组件，传递所需props */}
    <GlobalPopoverQuality
      visible={popoverVisible}
      position={popoverPosition}
      clickedRecord={clickedRecord}
      clickedObject={clickedObject}
      getCssAlignedGradientColor={getCssAlignedGradientColor}
      onClose={handlePopoverClose}
    />

    <AppealCreateModal ></AppealCreateModal>
    <StationAppealEditModal></StationAppealEditModal>
  </div>
}

export default RegionalDataQuality;