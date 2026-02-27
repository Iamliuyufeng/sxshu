import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Space, Table, Select, Upload, Button, Radio, Pagination } from 'antd'
import { processAppealData } from '../utils/utils.js'
import { appealCandinateData as mockAppealData } from '../store/mock.js'

import successImg from '../assets/image/success.png'

import appealStore from '../store/appeal.js'
import globalStore from '../store/globals.js'
import *  as client from '../utils/colclient.js'
import { useFetcher } from 'react-router-dom'


const RenderStation = () => {
    const appealCandinateData = appealStore(state => state.appealCandinateData)
    const candinateDataCurrent = appealStore(state => state.candinateDataCurrent)
    const candinateDataTotal = appealStore(state => state.candinateDataTotal())
    const candinateGotoPage = appealStore(state => state.candinateGotoPage)
    const setCandinateSelectedKeys = appealStore(state => state.setCandinateSelectedKeys)
    const candinateSelectedKeys = appealStore(state => state.candinateSelectedKeys)
    const confirmStationCreate = appealStore(state => state.confirmStationCreate)
    const setAppealCandinateData = appealStore(state => state.setAppealCandinateData)


    const appealProvince = appealStore(state => state.appealProvince)
    const appealSite = appealStore(state => state.appealSite)
    const appealType = appealStore(state => state.appealType)
    const setAppealProvince = appealStore(state => state.setAppealProvince)
    const setAppealSite = appealStore(state => state.setAppealSite)
    const setAppealType = appealStore(state => state.setAppealType)


    
    const dateTypes = globalStore(state => state.dateTypes)
    const provinces = globalStore(state => state.userProvinces).map( t => ({
        label: t,
        value: t
    }))

    const [siteOptions, setSiteOptions] = useState([])

    const columns = [
        {
            width: '36px',
            dataIndex: 'number',
            className: 'center',
        },
        {
            title: '类别',
            dataIndex: 'category',
            onCell: (record, index) => {
                return {
                    rowSpan: record.categorySpan ?? 1
                }
            }
        },
        {
            title: '指标1',
            dataIndex: 'indicator',
            onCell: (record, index) => {
                return {
                    rowSpan: record.indicatorSpan ?? 1
                }
            }
        },
        {
            title: '指标2',
            dataIndex: 'indicatorType',
        },
        {
            title: '分数',
            dataIndex: 'score',
        },
        {
            title: '操作',
            className: 'column-score',
            width: 120,
            render: (value, record) => {
                return <Button type='link' onClick={() => {
                    setCandinateSelectedKeys([record.key])
                    confirmStationCreate()
                }}>申诉</Button>
            }
        }
    ];

    const rowSelection = {
        selectedRowKeys: candinateSelectedKeys,
        onChange: (keys) => {
            setCandinateSelectedKeys(keys)
        },
    };

    const handleTableChange = (index) => {
        candinateGotoPage(index)
    }

    const onProvinceChanged = async province => {
        setAppealProvince(province)
    }

    const onSiteChanged = async val => {
        setAppealSite(val)
        setCandinateSelectedKeys([])
        // setAppealCandinateData(mockAppealData)
    }
    
    const fetchSiteList = async () => {
        setAppealSite('')
        setAppealCandinateData([])
        setCandinateSelectedKeys([])
        const sites = await client.list('sites', {
            province: appealProvince
        })
        setSiteOptions(sites.list.map(r => {
            return {
                label: r.name,
                psr_id: r.psr_id,
                value: r.name
            }
        }))
    }

    const fetchSiteData = async () => {
        setAppealCandinateData(mockAppealData)
    }

    useEffect(() => {
        fetchSiteList()
    }, [appealProvince])

    return <div className="station">
        <Space className='action-bar'>
            <div>省份</div>
            <Select onChange={onProvinceChanged} value={appealProvince} options={provinces} style={{ width: '120px' }}></Select>
            <div>场站</div>
            <Select value={appealSite} options={siteOptions} style={{ width: '260px' }} onChange={onSiteChanged}></Select>
            <div>类别</div>
            <Select options={dateTypes} allowClear value={appealType} onChange={val => {
                setAppealType(val)
            }} style={{ width: '120px' }}></Select>
            <button onClick={() => {
                fetchSiteData()
            }}>查询</button>
            <button className='reset' onClick={() => {
                setAppealType('')
                setAppealSite('')
                setAppealCandinateData([])
            }}>重置</button>
        </Space>
        <Table scroll={{
            y: 480
        }}
            pagination={false}
            rowSelection={rowSelection}
            bordered className='sx-table-normal' columns={columns} dataSource={processAppealData(appealCandinateData)}>
        </Table>
        <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Pagination
                current={candinateDataCurrent}
                pageSize={20}
                total={candinateDataTotal} // 总数据条数
                onChange={handleTableChange}
                showSizeChanger // 显示每页条数选择器
                showQuickJumper // 显示快速跳页
                pageSizeOptions={['10', '20', '50']} // 可选每页条数
            />
        </div>
    </div>
}

const AppealCreateModal = () => {
    const candinateModalVisible = appealStore(state => state.candinateModalVisible)
    const confirmAppealCreate = appealStore(state => state.confirmAppealCreate)
    const cancelAppealRequest = appealStore(state => state.cancelAppealRequest)
    const candinateTypeSwitch = appealStore(state => state.candinateTypeSwitch)
    const candinateRange = appealStore(state => state.candinateRange)
    const setAppealCandinateData = appealStore(state => state.setAppealCandinateData)

    const setCandinateModalVisible = appealStore(state => state.setCandinateModalVisible)
    const setConfirmAppealModalVisible = appealStore(state => state.setConfirmAppealModalVisible)
    const successAppealModalVisible = appealStore(state => state.successAppealModalVisible)
    const updateCandinateRange = appealStore(state => state.updateCandinateRange)
    const closeSuccessModal = appealStore(state => state.closeSuccessModal)

    const handleOk = () => {
        confirmAppealCreate()
    }
    const handleCancel = () => {
        cancelAppealRequest()
    }

    return <>
        <Modal
            title='新增申诉'
            style={{ top: 28 }}
            width={982}
            height={810}
            closable
            open={candinateModalVisible}
            onCancel={handleCancel}
            footer={() => {
                return <Space style={{ padding: '0 16px 16px' }}>
                    <button onClick={handleOk}>申诉</button>
                    <button className='reset' onClick={() => {
                        handleCancel()
                    }}>取消</button>
                </Space>
            }}
        >
            <div className='create-appeal'>
               <RenderStation></RenderStation>
            </div>
        </Modal>
        <Modal
            title='申诉填写'
            width={356}
            height={230}
            closable
            open={successAppealModalVisible}
            onCancel={() => {
                closeSuccessModal()
            }}
            footer={null}
        >
            <div className='appeal-success'>
                <img className="img" src={successImg}></img>
                <div className="text">申诉成功</div>
                <div className="desc">请到 <Button onClick={() => {
                    closeSuccessModal()
                    location.href = './#/appeal'
                }} size='small' type='link'> 数据申诉</Button> 页面查看审批状态</div>
            </div>
        </Modal>
    </>
    

}

export default AppealCreateModal