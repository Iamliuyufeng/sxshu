import React, { useEffect, useState } from 'react'
import { DatePicker, Table, Tag, Space, Select, Button, Tabs  } from 'antd'
import reviewStore from '../store/review'
import './style.less'

import ruleJSON from '../store/json/rule.json'
import SectionBox from '../components/section/SectionBox'

const Rule = () => {
  const [currentType, setCurrentType] = useState('电量')
  const [subCurrentType, setSubCurrentType] = useState('发电量')
  const [currentTypeList, setCurrentTypeList] = useState([])
  useEffect(()=> {
    const currentList = ruleJSON.find(rule => rule[0] === currentType && rule[1] ===  subCurrentType)
    setCurrentTypeList(currentList)
  }, [subCurrentType])

  const buttonNames = ruleJSON.filter(rule => rule[0] === currentType).map(rule => rule[1])
//   const ratios = [20,20,2020]
  return <div className='table-page rule-page'>
    <div className='action-bar'>
        <Tabs defaultActiveKey="currentType" items={[{
            key: '电量',
            label: '电量'
        }, {
            key: '故障',
            label: '故障'
        }, {
            key: '状态',
            label: '状态'
        }, {
            key: '主接线图',
            label: '主接线图'
        }]} onChange={val => {
            setCurrentType(val)
            const subType = ruleJSON.filter(rule => rule[0] === val).map(rule => rule[1])[0]

            setSubCurrentType(subType)
        }}/>
        <div className='buttons'>
            {buttonNames && buttonNames.map(btn => {
                return <button onClick={() => {
                    setSubCurrentType(btn)
                }} >{btn}</button>
            })}
            {/* <button className='not-active'>上网电量</button>
            <button className='not-active'>损失电量</button>
            <button className='not-active'>购网电量</button>    
            <button className='not-active'>站用电量</button>    
            <button className='reset' style={{ marginLeft: '30px'}}>编辑</button> */}
        </div>
    </div>

    <div className='rule-container'>
        {['完整性', '一致性', '唯一性', '有效性', '准确性'].map((name, index) => {
            return <SectionBox title={name} extra={<div className="rule-weight">
                <div className='label'>权重占比：</div>
                <div className='value'>{20}%</div>
            </div>}
            content={<div className='rule-content'>
                <div className='content display-area' style={{ height: '450px'}}>{currentTypeList[2 + index * 3]}</div>
                <div className="line"></div>
                <div className="sub-title">数据来源</div>
                <div className='content display-area'>{currentTypeList[3 + index * 3]}</div>
                <div className="line"></div>
                <div className="sub-title">规则说明</div>
                <div className='content display-area'>{currentTypeList[4 + index * 3]}</div>
            </div>}></SectionBox>
        })}
    </div>
  </div>
}


export default Rule