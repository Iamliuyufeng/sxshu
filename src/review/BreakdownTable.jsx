import React, { useEffect, useState, useMemo } from 'react'
import { DatePicker, Table, Tag, Space, Select, Button } from 'antd'
import { useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'

import CommonTablePage from '../components/common-table/ComonTablePage'

import useTableScrollHeight from '../utils/useTableScrollHeight'
import BreakdownDetailModal from './BreakdownDetailModal'
import BreakdownDetailModal2 from './BreakdownDetailModal2'
import useStore from '../store/globals'

import './style.less'

const { RangePicker } = DatePicker;

// const ReviewTable = () => {
//   const tableScrollY = useTableScrollHeight('table-container', 96);
//   const breakDownTableData = reviewStore(state => state.breakDownTableData);
//   const [reviewItem, setReviewItem] = useState({})
//   const [detailModalVisible, setDetailModalVisible] = useState(false);
//   const [detailModalVisible2, setDetailModalVisible2] = useState(false);
//   const renderCell = label => {
//     return (value, record, index) => {
//       console.log('', value, record)
//       return <Button type='link' onClick={() => {
//         setReviewItem({ ...record, 
//           currentLabel: label,
//           currentValue: value
//         })
//         if (label === '准确性') {
//           setDetailModalVisible2(true)
//         } else {
//           setDetailModalVisible(true)
//         }
//       }}>{value}</Button>
//     };
//   }
  

//   const columns = [
//     {
//       title: '序号',
//       dataIndex: 'serialNumber',
//       width: '60px',
//       align: 'center',
//     },
//     {
//       title: '省份',
//       width: '240px',
//       dataIndex: 'province',
//     },
//     {
//       title: '场站名称',
//       dataIndex: 'stationName',
//     },
//     {
//       title: '总得分',
//       dataIndex: 'totalScore',
//       width: '140px',
//       align: 'center',
//       sorter: (a, b) => a.totalScore - b.totalScore,
//     },
//     {
//       title: '完整性(%)',
//       dataIndex: 'integrity',
//       align: 'center',
//       render: renderCell('完整性'),
//       width: '140px',
//       sorter: (a, b) => a.totalScore - b.totalScore,
//     },
//     {
//       title: '一致性(%)',
//       dataIndex: 'consistency',
//       align: 'center',
//       render: renderCell('一致性'),
//       width: '140px',
//       sorter: (a, b) => a.totalScore - b.totalScore,
//     },
//     {
//       title: '唯一性(%)',
//       dataIndex: 'uniqueness',
//       render: renderCell('唯一性'),
//       align: 'center',
//       width: '140px',
//       sorter: (a, b) => a.totalScore - b.totalScore,
//     },
//     {
//       title: '有效性(%)',
//       dataIndex: 'validity',
//       render: renderCell('有效性'),
//       align: 'center',
//       width: '140px',
//       sorter: (a, b) => a.totalScore - b.totalScore,
//     },
//     {
//       title: '准确性(%)',
//       dataIndex: 'accuracy',
//       render: renderCell('准确性'),
//       align: 'center',
//       width: '140px',
//       sorter: (a, b) => a.totalScore - b.totalScore,
//     },
//   ];

//   return <div className='table-page'>
//     <div className='content-container'>
//       <div className="action-bar">
//         <div>省份</div>
//         <Select style={{ width: '120px' }}></Select>
//         <div>场站名称</div>
//         <Select style={{ width: '280px' }}></Select>
//         <div>报告状态</div>
//         <RangePicker style={{ width: '260px' }} />
//         <div>查询时间</div>
//         <button className="main">查询</button>
//         <button className="reset">重置</button>
//         <button style={{
//           marginLeft: 'auto'
//         }}>报告上传</button>
//       </div>
//       <div className="table-container">
//         <Table
//           className='sx-table-normal'
//           scroll={{
//             y: tableScrollY
//           }}
//           pagination={{
//             showQuickJumper: true,
//             pageSize: 20,
//             // 显示总条数（关键：实现共xx条信息，自定义显示文案）
//             showTotal: (total, range) => {
//               // total：总条数；range：当前页的条数范围，如[1,10]
//               return `共 ${total} 条记录，当前显示 ${range[0]}-${range[1]} 条`;
//               // 极简版：直接返回`共 ${total} 条`即可
//               // return `共 ${total} 条`;
//             },
//             showSizeChanger: true
//           }}
//           columns={columns} dataSource={breakDownTableData} ></Table>
//       </div>

//       <BreakdownDetailModal reviewItem={reviewItem} visible={detailModalVisible} onClose={() => {
//         setDetailModalVisible(false)
//       }}></BreakdownDetailModal>


//       <BreakdownDetailModal2 reviewItem={reviewItem} visible={detailModalVisible2} onClose={() => {
//         setDetailModalVisible2(false)
//       }}></BreakdownDetailModal2>

//     </div>
//   </div>
// }

const BreakDownTablePage = () => {
  // 获取 URL 参数
  const [searchParams] = useSearchParams();

  // 获取省份数据
  const provinces = useStore(state => state.provinces);
  // 获取场站数据
  const farms = useStore(state => state.farms);
  // 获取获取场站列表方法
  const fetchFarmList = useStore(state => state.fetchFarmList);

  // API 前缀
  const API_PREFIX = window.API_PREFIX;
  // 请求 URL
  // const requestUrl = `${API_PREFIX}/data-quality/breakdown-list`;
  const requestUrl = `${API_PREFIX}/data-quality/by-dimension`

  // 查询参数状态
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [domain, setDomain] = useState(null);
  const [timeRange, setTimeRange] = useState([]);
  const [queryKey, setQueryKey] = useState(0);

  // 初始化：从 URL 参数回显，或默认当月1号到现在
  useEffect(() => {
    const provinceParam = searchParams.get('province');
    const farmIdParam = searchParams.get('farm_id');
    const startDateParam = searchParams.get('start_date');
    const endDateParam = searchParams.get('end_date');
    const domainparams = searchParams.get('dataIndex');

    // 检查值是否有效（非 null、非 undefined、非字符串 "undefined"）
    const isValidValue = (val) => val !== null && val !== undefined && val !== 'undefined' && val !== '';

    // 设置 业务域
    setDomain(isValidValue(domainparams) ? domainparams : null)

    // 设置省份（使用 null 表示未选择）
    if (isValidValue(provinceParam)) {
      setSelectedProvince(provinceParam);
      // 加载该省份的场站列表
      fetchFarmList(provinceParam);
    } else {
      setSelectedProvince(null);
    }

    // 设置场站（使用 null 表示未选择）
    if (isValidValue(farmIdParam)) {
      setSelectedStation(farmIdParam);
    } else {
      setSelectedStation(null);
    }

    // 设置时间范围
    if (startDateParam && endDateParam) {
      setTimeRange([startDateParam, endDateParam]);
    } else if (timeRange.length === 0) {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      setTimeRange([formatDate(firstDay), formatDate(now)]);
    }
  }, [searchParams]);

  // 构建查询参数
  const query = useMemo(() => {
    const result = { queryKey };
    if (selectedProvince) result.province = selectedProvince;
    if (selectedStation) result.farm_id = selectedStation;
    if (timeRange && timeRange.length === 2) {
      result.start_date = timeRange[0];
      result.end_date = timeRange[1];
      result.domain = domain;
    }
    return result;
  }, [queryKey, selectedProvince, selectedStation, timeRange]);

  // 省份改变时重置场站并调用接口
  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedStation(null);
    fetchFarmList(value);
  };

  // 查询按钮点击
  const handleQuery = () => {
    setQueryKey(prev => prev + 1);
  };

  // 重置按钮点击
  const handleReset = () => {
    setSelectedProvince(null);
    setSelectedStation(null);
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    setTimeRange([formatDate(firstDay), formatDate(now)]);
  };

  const [reviewItem, setReviewItem] = useState({})
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailModalVisible2, setDetailModalVisible2] = useState(false);

  // 维度映射：标签 -> dimension 值
  const dimensionMap = {
    '完整性': 'completeness',
    '一致性': 'consistency',
    '唯一性': 'uniqueness',
    '有效性': 'validity',
    '准确性': 'accuracy',
    '总得分': 'total'
  }

  const renderCell = label => {
    return (value, record, index) => {
      const rawValue = label === '总得分' ? value?.dq_score : value?.dq_ratio;
      // 判断是否为有效数值（非 null、非 undefined、类型为 number）
      const displayValue = typeof rawValue === 'number' ? (rawValue * 100).toFixed(2) + '%' : '-';
      return <Button type='link' onClick={() => {
        // 设置 reviewItem，携带请求所需的参数
        const [startDate, endDate] = timeRange || [];
        setReviewItem({
          ...record,
          currentLabel: label,
          currentValue: displayValue,
          // 传递请求参数给 Modal（page 和 pageSize 由 Modal 内部管理）
          queryParams: {
            startTime: startDate,
            endTime: endDate,
            farmId: record.farm_id,
            dimension: dimensionMap[label] || label,
            domain: domain
          }
        })
        setDetailModalVisible(true)
      }}>{displayValue}</Button>
    };
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'serialNumber',
      width: '60px',
      align: 'center',
    },
    {
      title: '省份',
      width: '240px',
      dataIndex: 'province',
    },
    {
      title: '场站名称',
      dataIndex: 'farm_name',
    },
    {
      title: '总得分',
      dataIndex: 'total',
      width: '140px',
      align: 'center',
      render: (value) => value?.dq_score,
      sorter: (a, b) => a.totalScore - b.totalScore,
    },
    {
      title: '完整性(%)',
      dataIndex: 'completeness',
      align: 'center',
      render: renderCell('完整性'),
      width: '140px',
      sorter: (a, b) => a.totalScore - b.totalScore,
    },
    {
      title: '一致性(%)',
      dataIndex: 'consistency',
      align: 'center',
      render: renderCell('一致性'),
      width: '140px',
      sorter: (a, b) => a.totalScore - b.totalScore,
    },
    {
      title: '唯一性(%)',
      dataIndex: 'uniqueness',
      render: renderCell('唯一性'),
      align: 'center',
      width: '140px',
      sorter: (a, b) => a.totalScore - b.totalScore,
    },
    {
      title: '有效性(%)',
      dataIndex: 'validity',
      render: renderCell('有效性'),
      align: 'center',
      width: '140px',
      sorter: (a, b) => a.totalScore - b.totalScore,
    },
    {
      title: '准确性(%)',
      dataIndex: 'accuracy',
      render: renderCell('准确性'),
      align: 'center',
      width: '140px',
      sorter: (a, b) => a.totalScore - b.totalScore,
    },
  ];

  return <>
    <CommonTablePage actionBar={
    <>
      <div>省份</div>
        <Select style={{ width: '120px' }}
                options={provinces}
                value={selectedProvince}
                onChange={handleProvinceChange}></Select>
        <div>场站名称</div>
        <Select style={{ width: '280px' }}
                options={farms}
                value={selectedStation}
                onChange={setSelectedStation}></Select>
        <div>时间范围</div>
        <RangePicker style={{ width: '260px' }}
                    value={timeRange.length === 2 ? [dayjs(timeRange[0]), dayjs(timeRange[1])] : undefined}
                    onChange={(_, dateStrings) => setTimeRange(dateStrings)} />
        <button className="main" onClick={handleQuery}>查询</button>
        <button className="reset" onClick={handleReset}>重置</button>
        <button style={{
          marginLeft: 'auto'
        }}>报告上传</button>
    </>
    } storeName='break-down' columns={columns} requestUrl={requestUrl} query={query} pageSizeKey="page_size"></CommonTablePage>

    <BreakdownDetailModal reviewItem={reviewItem} visible={detailModalVisible} onClose={() => {
        setDetailModalVisible(false)
    }}></BreakdownDetailModal>

    <BreakdownDetailModal2 reviewItem={reviewItem} visible={detailModalVisible2} onClose={() => {
        setDetailModalVisible2(false)
    }}></BreakdownDetailModal2>
  </>
}


export default BreakDownTablePage