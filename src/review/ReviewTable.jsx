import React, { useEffect, useState, useMemo } from 'react'
import { DatePicker, Table, Tag, Space, Select } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

import CommonTablePage from '../components/common-table/ComonTablePage'
import reviewStore from '../store/review'
import useTableScrollHeight from '../utils/useTableScrollHeight'
import useStore from '../store/globals'

import './style.less'

const { RangePicker } = DatePicker;

// const ReviewTable = () => {
//   const tableScrollY = useTableScrollHeight('review-table', 96);
//   const reviewTableData = reviewStore(state => state.reviewTableData);
//    // 获取导航方法
//   const navigate = useNavigate();

//   const onHeaderClick = column => ({
//     onClick: () => {
//       navigate({
//         pathname: '/breakdown',
//         search: new URLSearchParams({
//           dataIndex: column.dataIndex
//         }).toString()
//       });

//       // console.log('表头被点击了', '列名：', column.title, '字段：', column.dataIndex);
//       // 这里可以添加你的业务逻辑，比如自定义排序、筛选等
//     }
//   })

//   const columns = [
//     {
//       width: '64px',
//       title: '排名',
//       dataIndex: 'ranking', // 补充排名的英文字段名
//     },
//     {
//       title: '省份',
//       dataIndex: 'province',
//     },
//     {
//       title: '场站名称',
//       dataIndex: 'station',
//     },
//     {
//       title: '主接线图',
//       dataIndex: 'mainWiringDiagram', // 现为得分字段
//        // 给当前列的表头绑定点击事件
//        onHeaderCell: onHeaderClick
//     },
//     {
//       title: '电量数据',
//       dataIndex: 'powerData',
//       onHeaderCell: onHeaderClick
//     },
//     {
//       title: '状态数据',
//       dataIndex: 'statusData',
//       onHeaderCell: onHeaderClick
//     },
//     {
//       title: '故障数据',
//       dataIndex: 'faultData',
//       onHeaderCell: onHeaderClick
//     },
//     {
//       title: '总得分',
//       dataIndex: 'totalScore',
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
//       <div className="table-container review-table">
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
//           columns={columns} dataSource={reviewTableData} ></Table>
//       </div>
//     </div>
//   </div>
// }

const ReviewTablePage = () => {

    // 获取导航方法
    const navigate = useNavigate();
    // 获取省份数据
    const provinces = useStore(state => state.provinces);
    // 获取场站数据
    const farms = useStore(state => state.farms);
    // 获取获取场站列表方法
    const fetchFarmList = useStore(state => state.fetchFarmList);
    // 是否使用 mock 数据（设为 false 时使用真实接口）
    const USE_MOCK = false;
    // API 前缀
    const API_PREFIX = window.API_PREFIX;
    // 请求 URL（根据开关选择 mock 或真实接口）
    const requestUrl = USE_MOCK ? '/public/review-list.json' : `${API_PREFIX}/data-quality/by-domain`;

    // 查询参数状态
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [timeRange, setTimeRange] = useState([]);
    const [queryKey, setQueryKey] = useState(0); // 用于触发表格刷新

    // 初始化：设置默认时间范围（当月1号到现在）
    useEffect(() => {
      if (timeRange.length === 0) {
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
    }, []);

    // 构建查询参数（使用 useMemo 缓存，避免重复请求）
    // 注意：selectedStation、selectedProvince 变化不触发表格请求，只有点击查询按钮时才触发
    const query = useMemo(() => {
      const result = { queryKey }; // 添加 queryKey 用于触发刷新
      if (selectedProvince) result.province = selectedProvince;
      if (selectedStation) result.farm_id = selectedStation;
      // 移除 selectedStation、selectedProvince 依赖，避免切换场站、省份时触发表格请求
      if (timeRange && timeRange.length === 2) {
        result.start_date = timeRange[0];
        result.end_date = timeRange[1];
      }
      result.order = 'desc'; // 默认降序
      result.page_size = 20;
      return result;
    }, [queryKey, timeRange]);

    // 省份改变时重置场站并调用接口
    const handleProvinceChange = (value) => {
      console.log('handleProvinceChange 被调用，province:', value);
      setSelectedProvince(value);
      setSelectedStation(null);
      fetchFarmList(value);
    };

    // 查询按钮点击
    const handleQuery = () => {
      setQueryKey(prev => prev + 1); // 触发表格刷新
    };

    // 重置按钮点击
    const handleReset = () => {
      // if (provinces && provinces.length > 0) {
      //   setSelectedProvince(provinces[0].value);
      // }
      setSelectedProvince(null);
      setSelectedStation(null);

      // 重置时间范围
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

    const onHeaderClick = column => ({
      onClick: () => {
        const {province, farm_id, start_date, end_date} = query
        navigate({
          pathname: '/breakdown',
          search: new URLSearchParams({
            dataIndex: column.dataIndex,
            province,
            farm_id,
            start_date,
            end_date
          }).toString()
        });
  
        // console.log('表头被点击了', '列名：', column.title, '字段：', column.dataIndex);
        // 这里可以添加你的业务逻辑，比如自定义排序、筛选等
      }
    })
  
    const columns = [
      {
        width: '64px',
        title: '排名',
        dataIndex: 'ranking',
      },
      {
        title: '省份',
        dataIndex: 'province',
      },
      {
        title: '场站名称',
        dataIndex: 'farm_name',
      },
      {
        title: '主接线图',
        dataIndex: 'pwd',
        render: (value) => value?.dq_score,
        onHeaderCell: onHeaderClick
      },
      {
        title: '电量数据',
        dataIndex: 'energy',
        render: (value) => value?.dq_score,
        onHeaderCell: onHeaderClick
      },
      {
        title: '状态数据',
        dataIndex: 'status',
        render: (value) => value?.dq_score,
        onHeaderCell: onHeaderClick
      },
      {
        title: '故障数据',
        dataIndex: 'fault',
        render: (value) => value?.dq_score,
        onHeaderCell: onHeaderClick
      },
      {
        title: '总得分',
        dataIndex: 'total',
        render: (value) => value?.dq_score,
      },
    ];
    console.log(farms);
  return <CommonTablePage actionBar={<>
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
  </>} storeName='review' requestUrl={requestUrl} query={query} columns={columns} ></CommonTablePage>
}


export default ReviewTablePage