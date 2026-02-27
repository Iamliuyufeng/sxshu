import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Space, Table, Select, Upload, Button } from 'antd'

import reviewStore from '../store/review'
import globalStore from '../store/globals'

const BreakdownDetailModal = ({
    reviewItem = {},
    visible,
    onClose
}) => {
    const breakDownDetailTableData = reviewStore(state => state.breakDownDetailTableData)
    const fetchDataQualityIssue = reviewStore(state => state.fetchDataQualityIssue)

    // 分页状态
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // 初始化时调用接口获取详情数据
    useEffect(() => {
        if (visible && reviewItem.queryParams) {
            fetchDataQualityIssue({
                ...reviewItem.queryParams,
                page: current,
                pageSize: pageSize
            })
        }
    }, [visible, current, pageSize])

    // 分页变化处理
    const handlePageChange = (newPage, newPageSize) => {
        setCurrent(newPage)
        setPageSize(newPageSize)
    }

    const columns = [
        {
            title: '序号',
            key: 'index',
            width: '60px',
            align: 'center',
            render: (_, __, index) => (current - 1) * pageSize + index + 1,
        },
        {
            title: '日期',
            dataIndex: 'stat_time',
            width: '220px',
            align: 'center',
        },
        {
            title: '异常指标',
            dataIndex: 'dimension_display',
            width: '100px',
            align: 'center',
        },
        {
            title: '异常描述',
            dataIndex: 'descriptions',
            align: 'left',
            render: (descriptions) => {
                if (!Array.isArray(descriptions) || descriptions.length === 0) {
                    return '-';
                }
                return (
                    <div>
                        {descriptions.map((desc, index) => (
                            <div key={index}>{index + 1}. {desc}</div>
                        ))}
                    </div>
                );
            }
        },
        {
            title: '附加信息',
            dataIndex: 'extra',
            align: 'left',
            width: '200px',
            render: (extra) => {
                if (!Array.isArray(extra) || extra.length === 0) {
                    return '-';
                }
                return (
                    <div>
                        {extra.map((item, index) => (
                            <div key={index}>{item.field}：{item.value}</div>
                        ))}
                    </div>
                );
            }
        },
    ];
    const handleCancel = () => {
        onClose && onClose()
    }

    console.log('breakDownDetailTableData---------', breakDownDetailTableData)
    return <Modal
        title='详情'
        width={1175}
        height={694}
        closable
        open={visible}
        onCancel={handleCancel}
        footer={null}
    >
        <div className='break-down-item-detail'>
            <Space className='basic'> 
                <div>省份：{reviewItem.province} </div>
                <div>电场名称： {reviewItem.farm_name} </div>
                <div>总得分：{typeof reviewItem?.total?.dq_ratio === 'number' ? (reviewItem?.total?.dq_ratio * 100).toFixed(2) : '--'}% </div>
                <div>{reviewItem.currentLabel}: {reviewItem.currentValue}</div>
            </Space>
            <div style={{
                height: '560px',
                overflowY: 'auto'
            }}>
                <Table
                    bordered
                    className='sx-table-normal'
                    columns={columns}
                    dataSource={breakDownDetailTableData}
                    pagination={{
                        showQuickJumper: true,
                        pageSize,
                        current,
                        showTotal: (total) => `共 ${total} 条记录`,
                        showSizeChanger: true,
                        onChange: handlePageChange,
                        onShowSizeChange: handlePageChange
                    }}
                />

            </div>
        </div>
    </Modal>

}

export default BreakdownDetailModal