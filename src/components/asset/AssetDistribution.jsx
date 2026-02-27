import React from 'react'
import './style.less'
import bgImage from '../../assets/image/chart-bg.png' // 本地图片示例
import Dunuts from '../donuts/Dunuts.jsx'
import Metric3 from '../metric3/Metric3'
import Metric2 from '../metric2/Metric2'

const AssetDistribution = () => {
  return (
    <div className='asset-distribution'>
      <div className='date-updated'>
        <div className='dot' />
        <div className='text'>更新时间：2025-10-11 08:50:56</div>
      </div>
      <div
        className='chart-metrics' style={{
          backgroundImage: `url(${bgImage})`
        }}
      >
        <Dunuts />
        <div>
          <div className='legend'>
            <div className='box blue' />
            <div className='title'>总装机容量  万kW</div>
          </div>
          <Metric2 value='1440.20' tagValue='819' tagUnit='座' />

          <div className='divider' />

          <div className='legend'>
            <div className='box blue' />
            <div className='title'>风电场</div>
          </div>
          <Metric2 value='144.20' tagValue='123' tagUnit='座' />

          <div className='legend'>
            <div className='box yellow' />
            <div className='title'>光伏场</div>
          </div>
          <Metric2 value='1262.80' tagValue='76' tagUnit='座' />
        </div>
      </div>
    </div>
  )
}

export default AssetDistribution
