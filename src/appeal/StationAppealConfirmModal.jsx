import React, { useState } from 'react'
import { Modal, Form, Input, Space, Table, Select, Upload, Button, Radio, Pagination } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import appealStore from '../store/appeal.js'
import globalStore from '../store/globals.js'
import { downloadAttachment, getFileNameFromPath } from '../utils/utils.js'
import { update } from '../utils/colclient.js'

import tableStoreFactory from '../store/useStatusBookStore.js'

const { TextArea } = Input

import { RenderTag } from './AppealList.jsx'


const StationAppealConfirmModal = () => {
    const confirmAppealModalVisible = appealStore(state => state.confirmAppealModalVisible)
    const appealStationSelectedData = appealStore(state => state.appealStationSelectedData)
    const goBackCreateAppealModal = appealStore(state => state.goBackCreateAppealModal)
    const cancelAppealRequest = appealStore(state => state.cancelAppealRequest)
    const removeStationSelectedData = appealStore(state => state.removeStationSelectedData)
    const confirmSitesAppealCreate = appealStore(state => state.confirmSitesAppealCreate)

    const appealObjectViewObject = appealStore(state => state.appealObjectViewObject)
    const appealObjectModalVisible = appealStore(state => state.appealObjectModalVisible)
    const setAppealObjectModalVisible = appealStore(state => state.setAppealObjectModalVisible)
    const updateAppealViewObject = appealStore(state => state.updateAppealViewObject)
    const setAppealObjectViewObject = appealStore(state => state.setAppealObjectViewObject)


    const caseTableStore = tableStoreFactory.getTableStore('appeals')
    const refreshTable = caseTableStore(state => state.refreshTable)


    const setGlobalLoading = globalStore(state => state.setGlobalLoading)
    const isAdmin = globalStore(state => state.isAdmin)

    const handleOk = async () => {
        setGlobalLoading(true)
        await update(appealObjectViewObject._id, appealObjectViewObject, 'appeals')
        await refreshTable()
        setAppealObjectModalVisible(false)
        setGlobalLoading(false)
    }
    const handleCancel = () => {
        setAppealObjectModalVisible(false)
        
    }
    const removeAppealData = () => {
    }

    return <Modal
        title='申诉详情'
        style={{ top: 28 }}
        width={982}
        height={810}
        closable
        open={appealObjectModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => {
            return <Space style={{ padding :  '0 16px 16px'}}>
                <button onClick={handleOk}>申诉</button>
                <button className='reset' onClick={() => {
                    handleCancel()
                }}>取消</button>
            </Space>
        }}
    >
        <div className='appeal-edit'>
            <div className='single-appeal'>
                <div className='line'>
                    <div className='form-item'>
                        <div className='label'>流程编号：</div>
                        <div className='value'>{appealObjectViewObject.incIndex}</div>
                    </div>
                    <div className='form-item'>
                        <div className='label'>场站：</div>
                        <div className='value'>{appealObjectViewObject.site}</div>
                    </div>
                    <div className='form-item'>
                        <div className='label'>分数：</div>
                        <div className='value'>{appealObjectViewObject.score}%</div>
                    </div>
                </div>
                <div className='line'>
                    <div className='form-item'>
                        <div className='label'>申诉类型：</div>
                        <div className='value'>{appealObjectViewObject.category}</div>
                    </div>
                    <div className='form-item'>
                        <div className='label'>指标1：</div>
                        <div className='value'>{appealObjectViewObject.indicator}</div>
                    </div>
                    <div className='form-item'>
                        <div className='label'>指标2：</div>
                        <div className='value'>{appealObjectViewObject.indicatorType}</div>
                    </div>
                </div>
                <div className='line'>
                    <div className='form-item'>
                        <div className='label' style={{ alignSelf: 'start'}}>申诉说明</div>
                        <div className='display-area'>
                            {appealObjectViewObject.desc}
                        </div>
                    </div>
                </div>
                <div className='line'>
                    <div className='form-item'>
                        <div className='label'>附件</div>
                        <div><Button type='link' size='small' onClick={() => {
                            downloadAttachment(appealObjectViewObject.attachment)
                        }}>{getFileNameFromPath(appealObjectViewObject.attachment)}</Button></div>
                    </div>
                </div>
                <div className='line'>
                    <div className='form-item'>
                        <div className='label' style={{ alignSelf: 'start'}}>审核状态</div>
                        {isAdmin && 
                        <Select disabled={isAdmin? false: true} style={{width: '160px'}} value={appealObjectViewObject.status} options={[{
                            label: '确认',
                            value: 'confirmed'
                        }, {
                            label: '驳回',
                            value: 'rejected'
                        }
                        ]} onChange={val => {
                            updateAppealViewObject({
                                status: val
                            })
                        }}></Select>}
                        {!isAdmin && RenderTag(appealObjectViewObject.status)}
                    </div>
                </div>
                <div className='line'>
                    <div className='form-item'>
                        <div className='label' style={{ alignSelf: 'start'}}>审核意见</div>
                        {isAdmin && <TextArea style={{flex: 1}} placeholder='填写申诉说明' value={appealObjectViewObject.comment} onChange={e => {
                            updateAppealViewObject({
                                comment: e.target.value
                            })
                        }}></TextArea>}
                        {!isAdmin && <div className='display-area'>
                            {appealObjectViewObject.comment}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    </Modal>

}

export default StationAppealConfirmModal