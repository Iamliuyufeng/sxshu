import React from 'react'
import bgImage from '../../assets/image/chart-bg.png' // 本地图片示例

import EchartsRingChart from './EchartsRingChart'

// 示例页面
const RingChartDemo = () => {
  // 测试数据
  const chartData = [
    { name: '风电场', value: 200 },
    { name: '光伏站', value: 600 }
  ]

  // 测试颜色
  const chartColors = ['#F6BD16', '#00AAFF']

  // 背景图片地址（可以是本地图片或网络图片）
  // 本地图片：使用import导入（webpack处理），或放在public目录用绝对路径
  // const bgImage = '/assets/center-bg.png'; // public目录图片示例
  // const bgImage = 'https://xxx.com/center-bg.png'; // 网络图片示例

  return (
    <div style={{ marginLeft: '-1px', paddingTop: '4%' }}>
      <EchartsRingChart
        style={{ width: '200px', height: '200px' }}
        data={chartData}
        colors={chartColors}
        innerRadius='67%'
        outerRadius='82%'
        bgImageUrl={bgImage}
        bgImageScale={1} // 调整图片缩放比例
        labelConfig={{
          show: true,
          position: 'outside',
          formatter: '{b}: {c} ({d}%)'
        }}
      />
    </div>
  )
}

export default RingChartDemo
