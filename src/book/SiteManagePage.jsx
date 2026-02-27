import React, { useEffect, useState } from 'react'
import { Tree } from 'antd'
import CommonTablePage from '../components/common-table/ComonTablePage'
import bookStore from '../store/book'
import { provincesList } from '../store/mock'
import { fetchData, getNodeRequestUrl } from '../utils/utils'


import tableStoreFactory from '../store/useStatusBookStore'

const SiteManagePage = () => {
  const columns = [
    {
      title: '序号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: 60,
      align: 'center'
    },
    {
      title: '场站ID',
      dataIndex: 'pms_ne_station__id',
      key: 'pms_ne_station__id',
      width: 120,
      align: 'left'
    },
    {
      title: '所属省份',
      width: 120,
      dataIndex: 'province',
      key: 'province',
      align: 'center'
    },
    {
      title: '电厂名称',
      dataIndex: 'name',
      key: 'name',
      align: 'left'
    },
    {
      title: '资产管理系统中电站编码',
      dataIndex: 'psr_id',
      key: 'psr_id',
      align: 'left'
    },
    {
      title: '资产管理系统中电站名称',
      dataIndex: 'name_pms',
      key: 'name_pms',
      align: 'left'
    },
    {
      title: '设计容量(MW)',
      width: 160,
      dataIndex: 'capacity',
      key: 'capacity',
      align: 'center'
    },
    {
      title: '总装机容量(MW)',
      width: 160,
      dataIndex: 'rated_capacity',
      key: 'rated_capacity',
      align: 'center'
    }
  ]

  const [query, setQuery] = useState({})

  const provinceTreeData =  [
      {
        "title": "三峡集团",
        "key": "group",
        "children": provincesList.map(r => {
          return {
            "isLeaf": true,
            title: r.label,
            key: r.label
          }
        })
      }
  ]
  return (
    <div
      className='sx-page' style={{
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'stretch'
      }}
    >
      <div
        className='left-tree' style={{
          width: '320px'
        }}
      >
        <Tree
          treeData={provinceTreeData} defaultExpandAll expandedKeys={['group']} showLine
          onSelect={val => {
            const [province] = val
            if (province === 'group') {
              setQuery({})
            } else {
              setQuery({
                province: province
              })
            }
          }}
          renderLabel={(label, nodeData) => {
            return <div key={nodeData.key}>{nodeData} -1</div>
          }}
        />
      </div>
      <div
        className='right-table' style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          height: '100%'
        }}
      >
        <CommonTablePage storeName='sites' requestUrl={getNodeRequestUrl('/coll/sites/list')} columns={columns} query={query}/>
      </div>
    </div>
  )
}

export default SiteManagePage
