import React, { useState } from 'react'
import { Modal, Form, Input, Space, Table, Select, Upload, Button } from 'antd'

import reviewStore from '../store/review'

const BreakdownDetailModal = ({
    reviewItem = {},
    visible,
    onClose
}) => {
    const breakDownFaultDetailTableData = reviewStore(state => state.breakDownFaultDetailTableData)

    const columns = [
        {
            title: '序号',
            dataIndex: 'serialNumber',
            width: '60px',
            align: 'center',
        },
        {
            title: '云化系统故障代码',
            dataIndex: 'cloudFaultCode',
            align: 'center',
            width: '180px',
        },
        {
            title: '电力生产系统故障代码',
            dataIndex: 'powerFaultCode',
            align: 'center',
            width: '200px',
        },
        {
            title: '异常指标',
            dataIndex: 'abnormalIndex',
            align: 'center',
            width: '150px',
        },
    ];
    const handleCancel = () => {
        onClose && onClose()
    }


    return <Modal
        title='详情'
        width={827}
        height={694}
        closable
        open={visible}
        onCancel={handleCancel}
        footer={null}
    >
        <div className='break-down-item-detail'>
            <Space className='basic'>
                <div>省份：{reviewItem.province} </div>
                <div>电场名称： {reviewItem.stationName} </div>
                <div>总得分：{reviewItem.totalScore}% </div>
                <div>{reviewItem.currentLabel}: {reviewItem.currentValue}</div>
            </Space>
            <div style={{
                height: '560px',
                overflowY: 'auto'
            }}>
                <Table
                    bordered
                    className='sx-table-normal'
                    columns={columns} dataSource={breakDownFaultDetailTableData} ></Table>

            </div>
        </div>
    </Modal>

}

export default BreakdownDetailModal