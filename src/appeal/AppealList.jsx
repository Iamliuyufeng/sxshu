import React, { useEffect, useState } from 'react'
import { DatePicker, Input, Tag, Space, Select, Button } from 'antd'

import CommonTablePage from '../components/common-table/ComonTablePage'
import appealStore from '../store/appeal'
import globalStore from '../store/globals'
import AppealCreateModal from './AppealCreateModal.jsx'
import { downloadAttachment, getNodeRequestUrl } from '../utils/utils'
import './style.less'
import StationAppealEditModal from './StationAppealEditModal'
import StationAppealConfirmModal from './StationAppealConfirmModal.jsx'
import * as client from '../utils/colclient'

const { RangePicker } = DatePicker;


const RenderTag = value => {
    if (value === 'requested') {
        return <Tag className='success' >
            已申请
        </Tag>
    }
    if (value === 'confirmed') {
        return <Tag className='primary'>已确认</Tag>
    }
    if (value === 'rejected') {
        return <Tag className='error' >已驳回</Tag>
    }
}

const AppealListPage = () => {
    const createAppeal = appealStore(state => state.createAppeal)
    const setAppealStatus = appealStore(state => state.setAppealStatus)
    const provinces = globalStore(state => state.provinces)
    const isAdmin = globalStore(state => state.isAdmin)
    // const createAppeal = globalStore(state => state.createAppeal)

    const setAppealObjectModalVisible = appealStore(state => state.setAppealObjectModalVisible)
    const updateAppealViewObject = appealStore(state => state.updateAppealViewObject)
    const setAppealObjectViewObject = appealStore(state => state.setAppealObjectViewObject)

    const columns = [
        {
            width: '64px',
            title: '序号',
            dataIndex: 'number',
            className: 'column-name',
        },
        {
            title: '省份',
            dataIndex: 'province',
            width: 100
        },
        {
            title: '场站名称',
            width: 240,
            dataIndex: 'site',
        },
        {
            title: '流程编号',
            dataIndex: 'incIndex',
            width: 140
        },
        {
            title: '申诉类型',
            dataIndex: 'category',
            width: 140
        },
        {
            title: '提交人',
            dataIndex: 'committer',
            width: 80
        },
        {
            title: '详细描述',
            dataIndex: 'desc',
        },
        {
            title: '审批状态',
            dataIndex: 'status',
            width: 120,
            render: RenderTag
        },
        {
            title: '操作',
            align: 'left',
            width: 120,
            render: (value, record) => {
                return <Space>
                    <Button size='small' type='link' onClick={() => {
                        setAppealObjectModalVisible(true)
                        setAppealObjectViewObject(record)
                    }}>数据详情</Button>
                </Space>
            }
        }
    ];

    const [query, setQuery] = useState({})
    const [siteListOptions, setSiteListOptions] = useState([])
    const [tableQuery, setTableQuery] = useState({})

    const fetchSiteListData = async province => {
        const sites = await client.list('sites', {
            province
        })
        setSiteListOptions(sites.list.map(r => {
            return {
                label: r.name,
                psr_id: r.psr_id,
                value: r.name
            }
        }))
    }

    return <>
        <CommonTablePage actionBar={<>
            <div>省份</div>
            <Select allowClear value={query.province} style={{ width: '120px' }} options={provinces} onChange={async val => {
                setQuery({
                    ...query,
                    province: val
                })
                fetchSiteListData(val)
            }}></Select>
            <div>场站名称</div>
            <Select allowClear options={siteListOptions} style={{ width: '200px' }} value={query.site} onChange={val => {
                setQuery({
                    ...query,
                    site: val
                })
            }}></Select>
            <div>流程编号</div>
            <Input style={{ width: '120px' }} value={query.incIndex} onChange={e => {
                setQuery({
                    ...query,
                    incIndex: e.target.value
                })
            }}></Input>
            <div>审批状态</div>
            <Select allowClear style={{ width: '180px' }} options={[{
                label: '已申请',
                value: 'requested'
            }, {
                label: '已确认',
                value: 'confirmed'
            }, {
                label: '已驳回',
                value: 'rejected'
            }]} value={query.status} onChange={val => {
                setQuery({
                    ...query,
                    status: val
                })
            }}></Select>
            <div>查询时间</div>
            <RangePicker style={{ width: '300px' }} />
            <button className="main" onClick={() => {
                setTableQuery(query)
            }}>查询</button>
            <button className="reset" onClick={() => {
                setQuery({})
                setTableQuery({})
            }}>重置</button>
            <button style={{
                marginLeft: 'auto'
            }} onClick={() => {
                createAppeal({
                    province: '',
                    site: '',
                    type: ''
                })
            }}>新增申诉</button>
        </>} columns={columns} storeName='appeals' query={tableQuery} requestUrl={getNodeRequestUrl('/coll/appeals/list')}></CommonTablePage>
        <AppealCreateModal></AppealCreateModal>
        <StationAppealEditModal></StationAppealEditModal>
        <StationAppealConfirmModal />
    </>
}

export { RenderTag }

export default AppealListPage