// src/manage/Manage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Table, Button, Input, Space, Modal, Form, Upload,
  message, Popconfirm, Card, Layout, Row, Col,
  Select
} from 'antd';

import { list, batchImport, batchRemove, remove } from '../utils/colclient'

// 核心表格组件
const SimpleDataTable = ({ tableName = 'user' }) => {
  // 状态管理
  const [data, setData] = useState([]);        // 表格数据
  const [loading, setLoading] = useState(false); // 加载状态
  const [total, setTotal] = useState(0);      // 总条数
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(20);    // 每页条数
  const [searchText, setSearchText] = useState(''); // 搜索关键词
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中的行ID
  const [columns, setColumns] = useState([]);  // 自动生成的列配置

  // 1. 获取数据列表
  const fetchData = async () => {
    try {
      // 构建查询参数
      const queryParams = {
        current: currentPage,
        pageSize,
        ...(searchText && { keyword: searchText })
      };

      // 调用真实接口（替换为你的接口逻辑）
      const result = await list(tableName, queryParams);

      // 更新数据
      setData(result.list || []);
      setTotal(result.total || 0);

      // 2. 根据第一条数据自动生成列（无排序、仅展示）
      if (result.list && result.list.length > 0) {
        const firstItem = result.list[0];
        const autoColumns = [];

        // 遍历第一条数据的所有key，生成列配置
        Object.keys(firstItem).forEach(key => {
          autoColumns.push({
            title: key,          // 列标题用key名
            align: 'left',
            dataIndex: key,      // 数据字段名
            key: key,            // 列唯一标识
          });
        });
        setColumns(autoColumns);
      } else {
        setColumns([]); // 无数据时清空列
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      setData([]);
      setTotal(0);
      setColumns([]);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1)
    fetchData()
  }, [tableName])

  // 3. 搜索功能
  const handleSearch = () => {
    setCurrentPage(1); // 搜索后重置到第一页
    fetchData();
  };

  // 重置搜索
  const handleResetSearch = () => {
    setSearchText('');
    setCurrentPage(1);
    fetchData();
  };

  // 4. 批量删除功能
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      return;
    }

    try {
      setLoading(true);
      // 调用批量删除接口

      for (const key of selectedRowKeys) {
        await remove(key, tableName)
      }
      if (result.success || result.code === 0) {
        setSelectedRowKeys([]); // 清空选中状态
        // message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
      } else {
        // message.error(result.message || '批量删除失败');
      }
    } catch (error) {
      console.error('批量删除失败:', error);
      // message.error('批量删除失败，请重试');
    } finally {
      setLoading(false);
      fetchData(); // 刷新数据
    }
  };

  // 5. JSON批量导入功能
  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      // 调用批量导入接口
      const result = await batchImport(tableName, file);

      if (result) {
        Modal.success({
          content: `成功导入 ${result.data.total}条数据`
        });
        fetchData(); // 刷新数据
      } else {
        Modal.error(result.message || '批量导入失败');
      }
    } catch (error) {
      Modal.error(`导入失败：${error.message || '文件格式错误'}`);
    } finally {
      setLoading(false);
    }

    return false; // 阻止AntD Upload的默认上传行为
  };

  // 表格行选择配置（复选框）
  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    // 自动获取行ID（优先用_id，没有则用id，最后用key）
    getCheckboxProps: (record) => ({
      value: record._id || record.id || record.key
    })
  }), [selectedRowKeys]);

  const handlePageChange = (newCurrent, newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(newCurrent)
    fetchData()
  }

  return (
    <div>
      {/* 操作栏 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* 搜索区域 */}
        <Space size="middle">
          <Input
            placeholder="输入关键词搜索"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 280 }}
          />
          <Button type="primary" onClick={handleSearch}>搜索</Button>
          <Button onClick={handleResetSearch}>重置</Button>
          <Button onClick={fetchData}>刷新</Button>
        </Space>

        {/* 操作按钮区域 */}
        <Space size="middle">
          {/* 批量导入 */}
          <Upload
            beforeUpload={handleFileUpload}
            showUploadList={false}
            accept=".json"
          >
            <Button type="primary">批量导入JSON</Button>
          </Upload>

          {/* 批量删除 */}
          <Popconfirm
            title="确定删除选中的记录吗？"
            onConfirm={handleBatchDelete}
            okText="确认"
            cancelText="取消"
          >
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
            >
              批量删除
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {/* 数据表格 */}
      <Table
        className='sx-table'
        rowKey={(record) => record._id || record.id || Math.random()} // 行唯一标识
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: handlePageChange,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        rowSelection={rowSelection} // 开启复选框
        scroll={{ x: 'max-content', y: 600 }} // 横向滚动（适配多列）
        bordered // 显示表格边框（可选）
      />
    </div>
  );
};

// 使用示例
const App = () => {
  // 可以根据实际需求动态设置表名
  const tableNames = [{
    label: '设备台账',
    value: 'status-book'
  }, {
    label: '场站台账',
    value: 'sites'
  }, {
    label: '全国得分',
    value: 'p-scores'
  }, {
    label: '场站得分',
    value: 'st-scores'
  }]
  const [currentTable, setCurrentTable] = useState('status-book')

  return <div className='sx-page'>
    <Select style={{ width: '360px'}} value={currentTable} options={tableNames} onChange={val => {
      setCurrentTable(val)
    }} />
    <SimpleDataTable tableName={currentTable} />;
  </div>
};

export default App;