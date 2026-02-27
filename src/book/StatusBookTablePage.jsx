import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Modal } from 'antd'
import CommonTablePage from '../components/common-table/ComonTablePage'
import LocalTable from '../components/common-table/LocalTable'
import LabelValue from '../components/label-value/LabelValue'
import { getNodeRequestUrl } from '../utils/utils'
const StatusBookTable = () => {
  const [detailViewModalVisible, setDetailViewModalVisible] = useState(false)
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 76, align: 'center' },
    // { title: '省份', dataIndex: 'province', key: 'province', width: 120, align: 'center' },
    { title: '场站', dataIndex: 'name',width: 260, key: 'name' },
    { title: '设备类型', dataIndex: 'equipment_type', key: 'equipment_type', width: 160, align: 'left' },
    { title: '设备型号', dataIndex: 'equipment_model', key: 'equipment_model', width: 220, align: 'left' },
    { title: '额定功率(kW)', dataIndex: 'rated_active_power', key: 'rated_active_power', width: 140, align: 'left' },
    { title: '电力产系统逻辑编码', dataIndex: 'logical_id', key: 'logical_id', align: 'left' },
    { title: '电力产系统物理名称', dataIndex: 'physical_name', key: 'physical_name', align: 'left' },
    {
      title: '操作',
      width: 160,
      key: 'action',
      align: 'center',
      render: (value, record) => (
        <span>
          <a
            style={{ marginRight: 8 }} onClick={() => {
              setDetailViewModalVisible(true)
            }}
          >状态字典
          </a>
          <a>删除</a>
        </span>
      )
    }
  ]

  const DetailModal = () => {
    const dcolumns = [
      {
        title: '状态值',
        dataIndex: 'statusValue',
        key: 'statusValue',
        width: 80,
        align: 'center'
      },
      {
        title: '状态描述',
        dataIndex: 'statusDesc',
        key: 'statusDesc',
        align: 'center'
      }
    ]
    return (
      <Modal
        title='状态字典详情'
        open={detailViewModalVisible}
        onCancel={() => {
          setDetailViewModalVisible(false)
        }}
        footer={false}
      >
        <div style={{
          height: '646px',
          display: 'flex',
          flexDirection: 'column'
        }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}>
            <LabelValue label='创建方式:' value='新增字典' />
            <LabelValue label='字典名称' value='新增字典' />
          </div>
          <LocalTable
            columns={dcolumns} requestUrl='./public/status-dict.json' storeName='status-dict'
          />
        </div>
      </Modal>
    )
  }

  return (
    <>
      <CommonTablePage storeName='status-book' requestUrl={getNodeRequestUrl(`/coll/status-book/list`)} columns={columns} query={{}}/>
      <DetailModal />
    </>
  )
}

export default StatusBookTable
