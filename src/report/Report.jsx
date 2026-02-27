import React, { useEffect, useState } from 'react'
import { DatePicker, Table, Tag, Space, Button, Select, Modal } from 'antd'
import CommonTablePage from '../components/common-table/ComonTablePage'
import reportStore from '../store/report'
import { downloadAttachment, getNodeRequestUrl, getFileNameFromPath } from '../utils/utils'
import FormModal from '../components/form-modal/FormModal'
import tableStoreFactory from '../store/useStatusBookStore'
import { create, remove, update } from '../utils/colclient'
import globals from '../store/globals'

import './style.less'

const { RangePicker } = DatePicker;


const ReportPage = () => {
    const [visible, setVisible] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const isAdmin = globals.getState().isAdmin

    const caseTableStore = tableStoreFactory.getTableStore('reports')
    const refreshTable = caseTableStore(state => state.refreshTable)

    // 支持预览的文件类型
    const PREVIEWABLE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'pdf', 'txt', 'json', 'html', 'xml']

    const handlePreview = (attachment) => {
        const fileName = getFileNameFromPath(attachment)
        const ext = fileName.split('.').pop().toLowerCase()

        if (PREVIEWABLE_TYPES.includes(ext)) {
            // 支持预览，在 Modal 中打开
            const url = getNodeRequestUrl(`/sxfile/download?relativePath=${attachment}`)
            setPreviewUrl(url)
            setPreviewTitle(fileName)
            setPreviewVisible(true)
        } else {
            // 不支持预览，直接下载
            downloadAttachment(attachment)
        }
    }


    const [query, setQuery] = useState({
        status: ''
    })
    const [tableQuery, setTableQuery] = useState({})


    const columns = [
        {
            width: '64px',
            title: '序号',
            dataIndex: 'number',
            className: 'column-name',
        },
        {
            title: '报告名称',
            dataIndex: 'name',
        },
        {
            title: '发布时间',
            width: 240,
            dataIndex: 'published',
        },
        {
            title: '发布状态',
            dataIndex: 'status',
            width: 120,
            render: value => {
                if (value === 'published') {
                    return <Tag className='success' >
                        已发布
                    </Tag>
                }
                if (value === 'prepare') {
                    return <Tag className='grayed' >
                        预发布
                    </Tag>
                }
            }
        },
        {
            title: '发布人',
            dataIndex: 'publisher',
            width: 160
        },
        {
            title: '操作',
            width: 260,
            render: (value, record) => {
                return <div style={{
                    display: 'flex',
                    gap: '5px'
                }}>
                    <Button size='small' onClick={() => {
                        downloadAttachment(record.attachment)
                    }} type='link'>下载</Button>
                    <Button size='small'  type='link' onClick={() => {
                        handlePreview(record.attachment)
                    }}>预览</Button>
                    {isAdmin && <Button size='small'  type='link' onClick={() => {
                        remove(record._id, 'reports')
                        refreshTable()
                    }}>删除</Button>}
                    <Button size='small'  type='link' onClick={() => {
                        if (record.status === 'prepare') {
                            update(record._id, { status: 'published' }, 'reports').then(() => {
                                refreshTable()
                            })
                        }
                    }} disabled={record.status === 'published'}>推送</Button>
                </div>
            }
        }
    ];

    const fields = [{
        type: 'input',
        name: 'name',
        label: '报告名称', // 补充label字段，用于表单标签
        required: true,
        placeholder: '' // 可选占位符
    }, {
        type: 'date',
        name: 'published',
        label: '发布时间', // 补充label字段，用于表单标签
        required: true,
        placeholder: '' // 可选占位符
    }, {
        type: 'select',
        name: 'status',
        label: '发布状态', // 补充label字段，用于表单标签
        required: true,
        initialValue: 'prepare',
        options: [{
            label: '预发布',
            value: 'prepare'
        }, {
            label: '已发布',
            value: 'published'
        }]
    }, {
        type: 'file',
        name: 'attachment',
        label: '报告文件', // 补充label字段，用于表单标签
        required: true
    }];

    return <><CommonTablePage storeName='reports' actionBar={<>
        <div>报告状态</div>
        <Select value={query.status}
            style={{ width: '160px' }}
            onChange={val => {
                setQuery({
                    ...query,
                    status: val
                })        
            }}
         options={[{
            label: '全部',
            value: ''
        }, {
            label: '已发布',
            value: 'published'
        }, {
            label: '预发布',
            value: 'prepare'
        }, ]}></Select>
        <button className="main" onClick={() => {
            setTableQuery(query)
        }}>查询</button>
        <button className="reset" onClick={() => {
            setQuery({
                status: ''
            })
            setTableQuery({
                status: ''
            })
        }}>重置</button>
        <button style={{
            marginLeft: 'auto'
        }} onClick={() => {
            setVisible(true)
        }}>报告上传</button></>} requestUrl={getNodeRequestUrl('/coll/reports/list')} query={tableQuery} columns={columns} />
        <FormModal visible={visible} fields={fields} onConfirm={async object => {
            const userId = globals.getState().userId;
            const result = await create({ ...object, publisher: userId }, 'reports');
            refreshTable();
        }} onClose={() => {
            setVisible(false)
        }}></FormModal>
        <Modal
            title={previewTitle}
            open={previewVisible}
            onCancel={() => setPreviewVisible(false)}
            footer={null}
            width={800}
            style={{ top: 20 }}
        >
            <iframe
                src={previewUrl}
                style={{ width: '100%', height: '70vh', border: 'none' }}
            />
        </Modal></>
}

export default ReportPage