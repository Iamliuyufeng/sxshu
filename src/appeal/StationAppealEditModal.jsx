import React, { useState } from 'react'
import { Modal, Form, Input, Space, Table, Select, Upload, Button, Radio, Pagination } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import appealStore from '../store/appeal.js'
import globalStore from '../store/globals.js'
import SectionBox from '../components/section/SectionBox.jsx'
import SxUploader from '../components/upload/SxUploader.jsx'

const { TextArea } = Input

const RenderSingleAppeal = ({ appeal, index }) => {
    const updateStationDataItem = appealStore(state => state.updateStationDataItem)
    const appealObjectModalVisible = appealStore(state => state.appealObjectModalVisible)
    const setAppealObjectModalVisible = appealStore(state => state.setAppealObjectModalVisible)
    const updateAppealViewObject = appealStore(state => state.updateAppealViewObject)
    const setAppealObjectViewObject = appealStore(state => state.setAppealObjectViewObject)

    return <div className='single-appeal'>
        <div className='line'>
            <div className='form-item'>
                <div className='label'>场站：</div>
                <div className='value'>{appeal.site}</div>
            </div>
            <div className='form-item'>
                <div className='label'>分数：</div>
                <div className='value'>{appeal.score}%</div>
            </div>
        </div>
        <div className='line'>
            <div className='form-item'>
                <div className='label'>申诉类型：</div>
                <div className='value'>{appeal.category}</div>
            </div>
            <div className='form-item'>
                <div className='label'>指标1：</div>
                <div className='value'>{appeal.indicator}</div>
            </div>
            <div className='form-item'>
                <div className='label'>指标2：</div>
                <div className='value'>{appeal.indicatorType}</div>
            </div>
        </div>
        <div className='line'>
            <div className='form-item'>
                <div className='label' style={{ alignSelf: 'start'}}>申诉说明</div>
                <TextArea style={{flex: 1}} placeholder='填写申诉说明' value={appeal.desc} onChange={e => {
                    updateStationDataItem(index, {
                        desc: e.target.value
                    })
                }}></TextArea>
            </div>
        </div>
        <div className='line'>
            <div className='form-item'>
                <div className='label'>附件上传</div>
                <SxUploader value={appeal.attachment} onChange={val => {
                    updateStationDataItem(index, {
                        attachment: val
                    })
                }}></SxUploader>
            </div>
        </div>
    </div>
}


const StationAppealEditModal = () => {
    const confirmAppealModalVisible = appealStore(state => state.confirmAppealModalVisible)
    const appealStationSelectedData = appealStore(state => state.appealStationSelectedData)
    const goBackCreateAppealModal = appealStore(state => state.goBackCreateAppealModal)
    const cancelAppealRequest = appealStore(state => state.cancelAppealRequest)
    const removeStationSelectedData = appealStore(state => state.removeStationSelectedData)
    const confirmSitesAppealCreate = appealStore(state => state.confirmSitesAppealCreate)

    const setGlobalLoading = globalStore(state => state.setGlobalLoading)
    const handleOk = async () => {
        setGlobalLoading(true)
        await confirmSitesAppealCreate()
        setGlobalLoading(false)
    }
    const handleCancel = () => {
        cancelAppealRequest()
        
    }
    const removeAppealData = () => {
    }

    return <Modal
        title='申诉详情'
        style={{ top: 28 }}
        width={982}
        height={810}
        closable
        open={confirmAppealModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => {
            return <Space style={{ padding :  '0 16px 16px'}}>
                <button onClick={handleOk}>审核</button>
                <button className='reset' onClick={() => {
                    handleCancel()
                }}>关闭</button>
            </Space>
        }}
    >
        <div className='appeal-edit'>
            <div style={{
                marginBottom: '16px',
                marginRight: '8px'
            }}><button onClick={() => {
                goBackCreateAppealModal();
            }}>返回上一级</button> </div>
            {appealStationSelectedData && appealStationSelectedData.map((appealEdit, index) => {
                return <SectionBox title={'申诉' + (index + 1)} 
                    extra={<Button type='link' onClick={() => {
                        removeStationSelectedData(index)
                    }}>删除</Button>}
                    content={<RenderSingleAppeal appeal={appealEdit} index={index}></RenderSingleAppeal>}>
                    
                </SectionBox>
            })}
        </div>
    </Modal>

}

export default StationAppealEditModal