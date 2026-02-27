import React, { useState, useEffect } from 'react'
import { DatePicker, Table, Tag, Space, Modal } from 'antd'
import './style.less'
import SectionBox from '../components/section/SectionBox';
import CommonTablePage from '../components/common-table/ComonTablePage';
import tableStoreFactory from '../store/useStatusBookStore'
import jsonclient from '../utils/jsonclient';


import BarChart from '../components/column_chart/ColumnChart.jsx'
import CenterRing from './CenterRing.jsx'
const { RangePicker } = DatePicker;
import globalStore from '../store/globals'
import caseStore from '../store/case'
import AnalysisModal from './AnalysisModal';
import FormModal from '../components/form-modal/FormModal.jsx';
import { create, remove, batchRemove } from '../utils/colclient';
import { getNodeRequestUrl } from '../utils/utils';

import imageM1 from '../assets/image/m1.png'
import imageM2 from '../assets/image/m2.png'

const CaseAnalysis = () => {
    const columnXData = caseStore(state => state.columnXData)
    const columnSeries = caseStore(state => state.columnSeries)
    const mainProviderData = caseStore(state => state.mainProviderData)
    const inverterManufacturer = caseStore(state => state.inverterManufacturer)
    const setInverterManufacturer = caseStore(state => state.setInverterManufacturer)
    const setMainProviderData = caseStore(state => state.setMainProviderData)
    const caseTableData = caseStore(state => state.caseTableData)
    const provinces = globalStore(state => state.provinces)

    const [open, setOpen] = useState(false)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [caseObject, setCaseObject] = useState(null)
    const [sites, setSites] = useState([])

    const caseTableStore = tableStoreFactory.getTableStore('cases')
    const refreshTable = caseTableStore(state => state.refreshTable)

    useEffect(async () => {
        const manufacturer = await jsonclient.getJSON('manufacturer')
        setMainProviderData(manufacturer)

        const inverter = await jsonclient.getJSON('inverter')
        setInverterManufacturer(inverter)
    }, [])
    const columns = [
        {
            width: '72px',
            title: '序号'
        },
        {
            title: '省份',
            dataIndex: 'province',
        },
        {
            title: '剖析案例',
            dataIndex: 'name',
        },
        {
            title: '发布时间',
            dataIndex: 'published',
        },
        {
            title: '发布状态',
            dataIndex: 'status',
            render: value => {
                if (value === '已发布') {
                    return <Tag color='green' >
                        {value}
                    </Tag>
                } else {
                    return <Tag className='grayed' >
                        预发布
                    </Tag>
                }
            }
        },
        {
            title: '发布人',
            dataIndex: 'publisher'
        },
        {
            title: '操作',
            className: 'column-score',
            width: 140,
            render: (value, record) => {
                return <Space size="middle">
                    <a onClick={() => {
                        onCaseClick(record)
                    }}>分析详情</a>
                    <a onClick={() => {
                        handleRemoveCase(record)
                    }}>删除</a>
                </Space>
            }
        }
    ];

    const handleRemoveCase = async record => {
        Modal.confirm({
            title: '确认',
            content: '是否确认删除？',
            async onOk() {
                await batchRemove('casedetails', {
                    case: record._id
                })
                await remove(record._id, 'cases')
                refreshTable();
            },
            onCancel() {
            },
        });
    }

    // 处理字段值变化，更新联动字段的options
    const handleFieldChange = (changeKey, fieldName, value) => {
        // 监听省份变化，更新城市选项
        if (changeKey === 'provinceChange' && fieldName === 'province') {
            const newFields = [...fields];
            // 找到城市字段并更新options
            const cityFieldIndex = newFields.findIndex(item => item.name === 'city');
            if (cityFieldIndex > -1) {
                newFields[cityFieldIndex].options = cityData[value] || [];
                newFields[cityFieldIndex].placeholder = value ? '请选择城市' : '请先选择省份';
            }
            setFields(newFields);
        }
    };

    const onCaseClick = record => {
        setCaseObject(record)
        setOpen(true)
    }
    return <div className='case-analysis sx-page'>
        <div className='case-analysis-content'>
            <div className="action-bar">
                <div>查询时间</div>
                <RangePicker style={{ width: '260px' }} />
                <button className="main">查询</button>
                <button className="reset">重置</button>
                <button style={{
                    marginLeft: 'auto'
                }} onClick={() => {
                    setCreateModalOpen(true)
                }}>新增案例</button>
            </div>
            <div className="chart-list">
                <SectionBox title='柱状分析图' content={<BarChart xData={columnXData} height={265} seriesData={columnSeries}></BarChart>}></SectionBox>
                <SectionBox style={{overflow: 'visible'}} contentStyle={{overflow: 'visible'}} title='主机厂家分析图' content={<CenterRing images={[<img src={imageM1} style={{
                    width: '54px',
                    height: '54px',
                    left: '103px',
                    top:  '103px'
                }}></img>]} ringData={mainProviderData}></CenterRing>}></SectionBox>
                <SectionBox style={{overflow: 'visible'}} contentStyle={{overflow: 'visible'}} title='逆变器厂家分析图' content={<CenterRing images={[<img src={imageM2} style={{
                    width: '54px',
                    height: '54px',
                    left: '103px',
                    top:  '103px'
                }}></img>]} ringData={inverterManufacturer}></CenterRing>}></SectionBox>
            </div>
            <CommonTablePage columns={columns} storeName='cases' requestUrl={getNodeRequestUrl('/coll/cases/list')}></CommonTablePage>
        </div>

        <AnalysisModal visible={open} caseObject={caseObject} onClose={() => {
            setOpen(false)
        }}></AnalysisModal>

        <FormModal visible={createModalOpen} fields={[{
                type: 'input',
                name: 'name',
                label: '案例名称', // 补充label字段，用于表单标签
                required: true,
                placeholder: '请输入案例名称' // 可选占位符
            }, {
                type: 'select',
                name: 'province',
                label: '省份', // 补充label字段，用于表单标签
                required: true,
                onChangeKey: 'provinceChange',
                options: provinces
            }, {
                type: 'select',
                name: 'site',
                label: '场站', // 补充label字段，用于表单标签
                required: true,
                options: sites
            }]}
            handleFieldChange={handleFieldChange}
            onClose={() => {
                setCreateModalOpen(false)
            }}
            onConfirm={async object => {
                const result = await create(object, 'cases');
                refreshTable();
            }}
        ></FormModal>
    </div>
}


export default CaseAnalysis