import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Space, Table, Select, Upload, Button } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import SxUploader from '../components/upload/SxUploader';
import caseStore from '../store/case'
import globalStore from '../store/globals'
import { getNodeRequestUrl, formatIsoToDate, getFileNameFromPath, openAttachment } from '../utils/utils'

import tableStoreFactory from '../store/useStatusBookStore'
import { create, remove, update } from '../utils/colclient';

const AnalysisModal = ({
    caseObject,
    visible,
    onClose
}) => {
    // const caseDetailData = caseStore(state => state.caseDetailData)
    const dateTypes = globalStore(state => state.dateTypes)
    const anaType = globalStore(state => state.anaType)

    const [newCase, setNewCase] = useState(null)
    const [editCase, setEditCase] = useState(null)
    const [currentEditFile, setCurrentEditFile] = useState('')

    const caseAnalysisTableStore = tableStoreFactory.getTableStore('caseAnalysis')
    const fetchTableData = caseAnalysisTableStore(state => state.fetchTableData)
    const tableState = caseAnalysisTableStore(state => state.tableState)
    const caseDetailData = tableState.list

    const refreshDetails = async () => {
        if (caseObject && caseObject._id) {
            fetchTableData(getNodeRequestUrl('/coll/casedetails/list'), {
                case: caseObject._id
            })
        }
    }
    useEffect(() => {
        refreshDetails()
    }, [caseObject])
    // 存储上传成功后的文件路径
    // const [filePath, setFilePath] = useState('');
    // 控制上传按钮加载状态
    const [loading, setLoading] = useState(false);

    const updateEditValue = (key, value) => {
        if (newCase) {
            setNewCase({
                ...newCase,
                [key]: value
            })
        } else if (editCase) {
            setEditCase({
                ...editCase,
                [key]: value
            })
        }
    }

    const isRecordEdit = record => {
        return record.isEditing || (record && editCase && record._id === editCase._id)
    }

    const getEditValue = (record, key) => {
        if (newCase) {
            return newCase[key]
        } else if (editCase) {
            return editCase[key]
        }
    }

    // const openAttachment = attachment => {
    //     window.open(getNodeRequestUrl(`/sxfile/download?relativePath=${attachment}`), '_blank')
    // }

    const columns = [
        {
            width: '72px',
            title: '序号',
            render: (_, record, index) => {
                return index + 1
            },
            className: 'center',
        },
        {
            title: '提交时间',
            dataIndex: 'updatedAt',
            width: '120px',
            render : (value, record) => {
                return formatIsoToDate(value)
            }
        },
        {
            title: '数据类型',
            dataIndex: 'dataType',
            render: (value, record, index) => {
                if (isRecordEdit(record)) {
                    return <Select style={{
                        width: '160px'
                    }} options={dateTypes} value={getEditValue(record, 'dataType')} onChange={val => {
                        updateEditValue('dataType', val)
                    }}></Select>
                } else {
                    return dateTypes.find(dt => dt.value === value)?.label
                }
            },
            width: 140
        },
        {
            title: '剖析类型',
            dataIndex: 'anaType',
            render: (value, record, index) => {
                if (isRecordEdit(record)) {
                    return <Select style={{
                        width: '160px'
                    }} options={anaType} value={getEditValue(record, 'anaType')} onChange={val => {
                        updateEditValue('anaType', val)
                    }}></Select>
                } else {
                    return anaType.find(dt => dt.value === value)?.label
                }
            },
            width: 140
        },
        {
            title: '提交人',
            dataIndex: 'committer',
            width: 120
        },
        {
            title: '详情描述',
            width: 320,
            dataIndex: 'desc',
            render: (value, record, index) => {
                if (isRecordEdit(record)) {
                    return <Input placeholder='请输入' value={getEditValue(record, 'desc')} onChange={ev => {
                        updateEditValue('desc', ev.target.value)
                    }}></Input>
                } else {
                    return value
                }
            }
        },
        {
            title: '数据收资',
            dataIndex: 'fileUrl',
            render: (value, record) => {
                if (isRecordEdit(record)) {
                    return <SxUploader value={currentEditFile} onChange={val => {
                        setCurrentEditFile(val)
                    }}></SxUploader>
                } else {
                    if (record.attachment) {
                        return <Button onClick={() => {
                            openAttachment(record.attachment)
                        }} type='link'>{getFileNameFromPath(record.attachment)}</Button>
                    } else {
                        return ''
                    }
                }
            }
        },
        {
            title: '处理建议',
            width: 320,
            dataIndex: 'advice',
            render: (value, record, index) => {
                if (isRecordEdit(record)) {
                    return <Input placeholder='请输入' value={getEditValue(record, 'advice')} onChange={ev => {
                        updateEditValue('advice', ev.target.value)
                    }}></Input>
                } else {
                    return value
                }
            },
        },
        {
            title: '操作',
            className: 'column-score',
            width: 120,
            render: (value, record) => {
                if (isRecordEdit(record)) {
                    return <Space size="middle">
                        <a onClick={() => {
                            handleSave()
                            // setNewCase(null)
                        }}>保存</a>
                        <a onClick={() => {
                            setNewCase(null)
                            setEditCase(null)
                        }}>取消</a>
                    </Space >
                } else {
                    return <Space size="middle">
                        <a onClick={() => {
                            setNewCase(null)
                            if (record.attachment) {
                                setCurrentEditFile(record.attachment)
                            } else {
                                setCurrentEditFile('')
                            }
                            setEditCase({
                                ...record,
                                isEditing: true
                            })
                        }}>编辑</a>
                        <a onClick={async () => {
                            await remove(record._id, 'casedetails')
                            refreshDetails()
                        }}>删除</a>
                    </Space >
                }
            }
        }
    ];


    const handleAdd = () => {
        const newData = {
            "isEditing": true,
            "dataType": "电量",
            "anaType": "完整性",
            "desc": "",
            "advice": ""
        };
        setCurrentEditFile('')
        setNewCase(newData)
    };

    // 保存详情
    const handleSave = async () => {
        if (newCase) { // 新增
            const newCaseObject = {
                case: caseObject._id,
                ...newCase
            }
            delete newCaseObject.isEditing
            if (currentEditFile) {
                newCaseObject.attachment = currentEditFile
            }
            await create(newCaseObject, 'casedetails')
            await refreshDetails()
        } 
        if (editCase) { // 更新编辑
            const updateCaseObject = {
                case: caseObject._id,
                ...editCase
            }
            delete updateCaseObject.isEditing
            if (currentEditFile) {
                updateCaseObject.attachment = currentEditFile
            }
            await update(editCase._id, updateCaseObject, 'casedetails')
            await refreshDetails()
        }
        setCurrentEditFile('')
        setEditCase(null)
        setNewCase(null)
    };

    const handleOk = () => {

    }
    const handleCancel = () => {
        setNewCase(null)
        onClose && onClose()
    }

    const deleteCurrentFile = async () => {
        setCurrentEditFile(null)
    }

    const withEditData = [...caseDetailData]

    if (newCase) {
        withEditData.push(newCase)
    }

    return <Modal
        title={caseObject && caseObject.name}
        width={1666}
        height={810}
        closable
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => {
            return <Space>
                <button onClick={() => {
                    handleSave()
                    handleCancel()
                }}>保存</button>
                <button className='reset' onClick={() => {
                    handleCancel()
                }}>取消</button>
            </Space>
        }}
    >
        <div className='case-detail'>
            <button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                新增
            </button>
            <div style={{
                height: '560px',
                overflowY: 'auto'
            }}>
                <Table
                    bordered
                    className='sx-table-normal'
                    pagination={false}
                    columns={columns} dataSource={withEditData} ></Table>

            </div>
        </div>
    </Modal>

}

export default AnalysisModal