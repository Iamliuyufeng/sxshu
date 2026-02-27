import React, { useState, useEffect } from 'react'
import './style.less'
import Metric1 from '../components/metric1/Metric1'
import AssetDistribution from '../components/asset/AssetDistribution'
import DeviceSituation from './DeviceSituation'

import leftImg from '../assets/image/left.svg'
import SectionBox from '../components/section/SectionBox'
import RegionalDataQuality from './RegionalDataQuality'
import TotalScoreRanking from './TotalScoreRanking'

import homeStore from '../store/home'
import globalStore from '../store/globals'

import MoMComparison from './MoMComparison'

const MainPage = () => {
  const leftShow = homeStore(state => state.leftShow)
  const setLeftshow = homeStore(state => state.setLeftshow)
  const dataQualityStatistics = homeStore(state => state.dataQualityStatistics);
  const fetchDataQualityStatistics = homeStore(state => state.fetchDataQualityStatistics);
  console.log(dataQualityStatistics);

  const onToggleLeftShow = () => {
    setLeftshow(!leftShow)
  }

  /**
 * 判断参数是否为数值，若是则乘以100并保留2位小数，否则返回 '--'
 * @param {*} value - 传入的参数（可能是任意类型）
 * @returns {string|number} - 处理后的结果（数值或 '--'）
 */
  function processNumber(value) {
    // 1. 检查是否为数值类型（包括数字和字符串形式的数字）
    if (typeof value === 'number' && !isNaN(value)) {
      // 2. 处理数值：乘以100并保留2位小数
      const result = (value * 100).toFixed(2);
      // 3. 转换为数字（若需要）或返回字符串（根据需求）
      return parseFloat(result); // 返回数字（如 123.45）
      // 或 return result; // 返回字符串（如 "123.45"）
    }
    
    // 4. 处理字符串形式的数字（如 "123"）
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        const result = (num * 100).toFixed(2);
        return parseFloat(result); // 或 return result;
      }
    }
    
    // 5. 其他情况（null、undefined、NaN、非数字字符串等）返回 '--'
    return '--';
  }

  useEffect(() => {
      // 获取数据质量 五个维度数据质量统计（完整性、一致性、唯一性、有效性、准确性）
      fetchDataQualityStatistics()
  }, [])
  return (
    <div className='sx-main-page sx-page'>
      <div className='sx-main-page-content'>
        <div className='content'>
          <div className='left'>
            <SectionBox title='资产分布' content={<AssetDistribution />} style={{ flex: 1 }} />
            <SectionBox title='设备情况' content={<DeviceSituation />} style={{ flex: 1 }} />
          </div>
          <div className='center'>
            <SectionBox title='总体指标概览' content={<div className='metric-list'>
              <Metric1
                label='完整性' value={`${processNumber(dataQualityStatistics.completeness)}%`} onClick={() => {
                  location.href = '/#/case'
                }}
              />
              <Metric1 label='一致性' value={`${processNumber(dataQualityStatistics.consistency)}%`} />
              <Metric1 label='唯一性' value={`${processNumber(dataQualityStatistics.uniqueness)}%`} />
              <Metric1 label='有效性' value={`${processNumber(dataQualityStatistics.validity)}%`} />
              <Metric1 label='准确性' value={`${processNumber(dataQualityStatistics.accuracy)}%`} />
            </div>}>
            </SectionBox>

            <SectionBox style={{ overflow: 'hidden', flex: 1 }} title='全国数据质量评分总览' content={<RegionalDataQuality />} />
          </div>
        </div>
        <div className='toggle-button' onClick={onToggleLeftShow}>
          <div className='image-wrapper'>
            <img style={{ cursor: 'pointer' }} src={leftImg} />
          </div>
        </div>
        {leftShow && <div className='side'>
          <TotalScoreRanking> </TotalScoreRanking>
          <MoMComparison />
        </div>}
      </div>
      {/* <Metric1 label="完整性" value='65.20%'></Metric1> */}
    </div>
  )
}

export default MainPage
