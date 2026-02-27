import React, { useState } from 'react'
import { Modal, Form, Input, Space, Table, Select, Upload, Button, Radio, Pagination } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import globalStore from '../store/globals'

const ProvinceAppealForm = ({
    province,
    score,
    onOk
}) => {
    const provinces = globalStore(state => state.provinces)
    return <div className='province'>
        <div className='select-prov'>
            <img src={buildingImg}></img>
            <div className="choose">省份选择</div>
            <Select options={provinces} style={{width: 160}} ></Select>
            <div className="code">流程编号</div>
            <div className="code-number">123009892</div>
            <div className='score'>分数 88.21%</div>
        </div>
        <div className='form-item'>
            <div className="label">申述类型</div>
            <Select style={{ flex: 1 }}></Select>
        </div>
        <div className='form-item'>
            <div className="label">申诉说明</div>
            <TextArea placeholder='填写申诉说明' style={{ flex: 1, height: '108px' }}></TextArea>
        </div>
        <div className='form-item'>
            <div className="label">附件上传</div>
            <Upload>
                <Button icon={<UploadOutlined />} variant="outlined">上传文件</Button>
                <div style={{ marginTop: '6px' }}>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
            </Upload>
        </div>
    </div>
}

export default ProvinceAppealForm