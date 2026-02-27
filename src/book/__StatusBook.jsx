import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Table, Spin, Alert, Pagination, Button, Input, Select, Empty } from 'antd'
// import useStatusBookStore from '../store/useStatusBookStore'
import tableStoreFactory from '../store/useStatusBookStore'

/**
 * 自定义Hook：计算表格的scrollY高度（支持实时更新）
 * @param {React.RefObject} ref - 表格容器的Ref（必须是React.createRef()/useRef()创建的Ref对象）
 * @param {number} offset - 高度偏移值（容器高度减去该值，得到表格的scrollY）
 * @returns {[number, () => void]} - [表格scrollY高度, 手动更新高度的方法]
 */
const useTableScrollHeightRef = (ref, offset = 0) => {
  const [tableScrollY, setTableScrollY] = useState(0)

  // 核心：计算高度的纯函数（抽离便于复用）
  const calculateTableHeight = useCallback(() => {
    if (!ref.current) return // 避免Ref未挂载时的报错
    const containerHeight = ref.current.clientHeight
    const targetHeight = Math.max(0, containerHeight - offset) // 确保高度≥0
    setTableScrollY(targetHeight)
  }, [ref, offset]) // 依赖ref和offset，变化时重新生成函数

  // 1. 监听容器尺寸变化（ResizeObserver：比window.resize更精准，监听元素自身尺寸变化）
  // 2. 监听ref变化、offset变化
  // 3. 组件挂载/卸载时清理监听
  useEffect(() => {
    // 初始计算一次高度
    calculateTableHeight()

    // 监听窗口resize（兜底：应对窗口尺寸变化）
    window.addEventListener('resize', calculateTableHeight)

    // 监听容器自身尺寸变化（核心：实现「随时更新」）
    const resizeObserver = new ResizeObserver(() => {
      calculateTableHeight()
    })
    if (ref.current) {
      resizeObserver.observe(ref.current)
    }

    // 组件卸载/依赖变化时，清理所有监听
    return () => {
      window.removeEventListener('resize', calculateTableHeight)
      resizeObserver.disconnect() // 停止监听容器尺寸
    }
  }, [ref, offset, calculateTableHeight]) // 依赖变化时重新初始化监听

  // 暴露手动更新方法：支持外部主动触发高度计算（比如容器内容变化后）
  const updateTableHeight = useCallback(() => {
    calculateTableHeight()
  }, [calculateTableHeight])

  // 返回高度值 + 手动更新方法
  return [tableScrollY, updateTableHeight]
}

const useStatusBookStore = tableStoreFactory.getTableStore('status-book')

const StatusBookTable = ({
}) => {
  const tableContainerRef = useRef(null)
  const [tableScrollY] = useTableScrollHeightRef(tableContainerRef, 104)

  // 选择器写法（和你项目统一）
  const tableState = useStatusBookStore((state) => state.tableState)
  const initTable = useStatusBookStore((state) => state.initTable)
  const fetchTableData = useStatusBookStore((state) => state.fetchTableData)
  const changeTablePage = useStatusBookStore((state) => state.changeTablePage)
  const changeTablePageSize = useStatusBookStore((state) => state.changeTablePageSize)
  const refreshTable = useStatusBookStore((state) => state.refreshTable)

  const { list, total, pageSize, current, loading, error } = tableState
  const requestUrl = './public/status-book.json'

  // 示例：自定义查询条件（如省份筛选）
  const [province, setProvince] = React.useState('')

  // 组件挂载：仅初始化表格状态（不加载数据）
  useEffect(() => {
    initTable(20)
    handleSearch()
    // 卸载时中断请求
    return () => {
      const abortController = useStatusBookStore.getState().tableState.abortController
      if (abortController) abortController.abort()
    }
  }, [initTable])

  // ========== 核心：所有数据加载都是「手动触发」 ==========
  // 1. 首次加载/查询按钮触发
  const handleSearch = () => {
    fetchTableData(requestUrl, { province }) // 传入查询条件
  }

  // 2. 分页切换触发（先改页码，再加载数据）
  const handlePageChange = (newCurrent, newPageSize) => {
    if (newCurrent !== current) {
      changeTablePage(newCurrent) // 先更新页码
      fetchTableData(requestUrl, { province }) // 再加载数据
    }
    if (newPageSize !== pageSize) {
      changeTablePageSize(newPageSize) // 先更新页大小
      fetchTableData(requestUrl, { province }) // 再加载数据
    }
  }

  // 3. 刷新重试触发
  const handleRefresh = () => {
    refreshTable() // 清空错误
    fetchTableData(requestUrl, { province }) // 重新加载
  }

  useEffect(() => {
    refreshTable()
  }, [])
  // 表头
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', align: 'center' },
    { title: '省份', dataIndex: 'province', key: 'province', align: 'center' },
    { title: '场站名称', dataIndex: 'stationName', key: 'stationName', align: 'center' },
    { title: '厂家', dataIndex: 'manufacturer', key: 'manufacturer', align: 'center' },
    { title: '设备类型', dataIndex: 'deviceType', key: 'deviceType', align: 'center' },
    { title: '机型', dataIndex: 'model', key: 'model', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: () => (
        <span>
          <a style={{ marginRight: 8 }}>状态字典</a>
          <a>删除</a>
        </span>
      )
    }
  ]

  /*
  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description={error}
        type="error"
        showIcon
        style={{ margin: '50px' }}
        action={
          <button
            onClick={handleRefresh}
            style={{ border: 'none', background: '#1890ff', color: 'white', padding: '4px 8px', borderRadius: '4px' }}
          >
            刷新重试
          </button>
        }
      />
    );
  }
  */
  // console.log('tableScrollY', tableScrollY, list, total, pageSize, current, loading)

  return (
    <div className='table-page'>
      <div className='content-container'>
        <div className='action-bar'>
          <div>省份</div>
          <Select style={{ width: '120px' }} />
          <div>场站名称</div>
          <Select style={{ width: '280px' }} />
          <div>报告状态</div>
          <div>查询时间</div>
          <button className='main'>查询</button>
          <button className='reset'>重置</button>
          <button style={{
            marginLeft: 'auto'
          }}
          >报告上传
          </button>
        </div>
        <div className='table-container status-book' ref={tableContainerRef}>
          <Table
            className='sx-table-normal'
            scroll={{
              y: tableScrollY
            }}
            loading={{
              spinning: loading,
              tip: '正在加载台账数据...', // 自定义提示文字
              delay: 300 // 延迟显示加载（避免闪屏，单位ms）
            }}
            locale={{
              emptyText: null
              // Empty
              //   style={{
              //     height: (tableScrollY - 40) + 'px'
              //   }} className='table-empty-placeholder' description={error ? '加载异常' : '暂无数据'}
              //            />
            }}
            pagination={{
              showQuickJumper: true,
              pageSize,
              // 显示总条数（关键：实现共xx条信息，自定义显示文案）
              showTotal: (total, range) => {
                // total：总条数；range：当前页的条数范围，如[1,10]
                return `共 ${total} 条记录，当前显示 ${range[0]}-${range[1]} 条`
                // 极简版：直接返回`共 ${total} 条`即可
                // return `共 ${total} 条`;
              },
              total,
              current,
              showSizeChanger: true
            }}
            columns={columns} dataSource={list}
          />
        </div>
      </div>
    </div>
  )
}

export default StatusBookTable
