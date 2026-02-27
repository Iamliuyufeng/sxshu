import React, { useState } from 'react'
import { Modal, Form, Input, Space, Table, Select, Upload, Button, Radio, Pagination } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { processAppealData } from '../utils/utils.js'
import { appealCandinateData as mockAppealData } from '../store/mock.js'

import buildingImg from '../assets/image/building.png'
import successImg from '../assets/image/success.png'

import appealStore from '../store/appeal.js'
import globalStore from '../store/globals.js'
import SxUploader from '../components/upload/SxUploader.jsx'
import *  as client from '../utils/colclient.js'

const { TextArea } = Input

const RenderProvince = () => {
    const provinces = globalStore(state => state.userProvinces).map(t => ({
        label: t,
        value: t
    }))
    const provinceSwitch = appealStore(state => state.provinceSwitch)
    const provinceAppealObject = appealStore(state => state.provinceAppealObject)
    const updateProvinceAppeal = appealStore(state => state.updateProvinceAppeal)
    
    return <div className='province'>
        <div className='select-prov'>
            <img src={buildingImg}></img>
            <div className="choose">省份选择</div>
            { provinceSwitch && <Select onChange={val => {
                updateProvinceAppeal({
                    province: val
                })
            }} options={provinces} style={{width: 160}} ></Select>}
            { !provinceSwitch && provinceAppealObject && <div className="choose">{provinceAppealObject.province}</div>}
            {/* <div className="code">流程编号</div>
            <div className="code-number">123009892</div> */}
            <div className='score'>分数 {provinceAppealObject && provinceAppealObject.score}%</div>
        </div>
        <div className='form-item'>
            <div className="label">申述类型</div>
            <Select options={[{
                label: '电量',
                value: 'energy'
            }, {
                label: '状态',
                value: 'status'
            }, {
                label: '故障',
                value: 'error'
            }, {
                label: '一次接线图',
                value: 'line'
            }]} value={provinceAppealObject && provinceAppealObject.appealType} style={{ flex: 1 }} onChange={val => {
                updateProvinceAppeal({
                    appealType: val
                })
            }}></Select>
        </div>
        <div className='form-item'>
            <div className="label">申诉说明</div>
            <TextArea placeholder='填写申诉说明' value={provinceAppealObject && provinceAppealObject.desc} onChange={e => {
                updateProvinceAppeal({
                    desc: e.target.value
                })
            }}  style={{ flex: 1, height: '108px' }}></TextArea>
        </div>
        <div className='form-item'>
            <div className="label">附件上传</div>
            <SxUploader value={provinceAppealObject && provinceAppealObject.attachment} onChange={val => {
                  updateProvinceAppeal({
                    attachment: val
                })              
            }}></SxUploader>
        </div>
    </div>
}

const RenderStation = () => {
    const appealCandinateData = appealStore(state => state.appealCandinateData)
    const candinateDataCurrent = appealStore(state => state.candinateDataCurrent)
    const candinateDataTotal = appealStore(state => state.candinateDataTotal())
    const candinateGotoPage = appealStore(state => state.candinateGotoPage)
    const setCandinateSelectedKeys = appealStore(state => state.setCandinateSelectedKeys)
    const candinateSelectedKeys = appealStore(state => state.candinateSelectedKeys)
    const confirmStationCreate = appealStore(state => state.confirmStationCreate)
    const updateStationAppealObject = appealStore(state => state.updateStationAppealObject)
    const setAppealCandinateData = appealStore(state => state.setAppealCandinateData)

    const provinces = globalStore(state => state.userProvinces).map( t => ({
        label: t,
        value: t
    }))

    const [siteOptions, setSiteOptions] = useState([])
    const [province, setProvince] = useState('')
    const [site, setSite] = useState('')

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
        setProvince(province)
        setAppealCandinateData([])
        setSite('')
        setCandinateSelectedKeys([])
        updateStationAppealObject({
            province,
            site: ''
        })
        const sites = await client.list('sites', {
            province: province
        })
        setSiteOptions(sites.list.map(r => {
            return {
                label: r.name,
                psr_id: r.psr_id,
                value: r.name
            }
        }))
    }

    const onSiteChanged = async val => {
        setSite(val)
        setCandinateSelectedKeys([])
        updateStationAppealObject({
            province,
            site: val
        })
        setAppealCandinateData(mockAppealData)
    }

    return <div className="station">
        <Space className='action-bar'>
            <div>省份</div>
            <Select onChange={onProvinceChanged} value={province} options={provinces} style={{ width: '120px' }}></Select>
            <div>场站</div>
            <Select value={site} options={siteOptions} style={{ width: '260px' }} onChange={onSiteChanged}></Select>
            <div>类别</div>
            <Select style={{ width: '120px' }}></Select>
            <button onClick={() => {

            }}>查询</button>
            <button className='reset'>重置</button>
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

const AppealCreateModal = ({
    province, // 带入的申诉省份
}) => {
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
                { false && <Space className='range'>
                    <div>申诉范围</div>
                    <Radio.Group options={[
                        { label: '省份', value: 'province' },
                        { label: '场站', value: 'station' },
                    ]} onChange={ev => {
                        updateCandinateRange(ev.target.value)
                    }} value={candinateRange} />
                </Space> }
                {candinateRange === '----' && <RenderProvince></RenderProvince>}
                {candinateRange === 'station' && <RenderStation></RenderStation>}
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