import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Spin } from 'antd';

import MainPage from './mainpage/MainPage.jsx'
import CaseAnalysis from './case/CaseAnalysis.jsx'
import Report from './report/Report.jsx'
import AppealList from './appeal/AppealList.jsx'
import Review from './review/ReviewTable.jsx'
import BreakdownTable from './review/BreakdownTable.jsx'
import Rule from './review/Rule.jsx'
import StatusBookTablePage from './book/StatusBookTablePage.jsx'
import SiteManagePage from './book/SiteManagePage.jsx'
import AdminManagePage from './manage/Manage.jsx'
import JSONManagePage from './manage/JSONManage.jsx'

// 1. 导入图片，webpack会处理并返回构建后的路径
import globalStore from './store/globals.js'

const App = () => {
  const globalSpin = globalStore(state => state.globalSpin)
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    >
      <Spin spinning={globalSpin} tip='请求服务处理中...' fullscreen />
      <Routes style={{ flex: 1 }}>
        <Route path='/' element={<MainPage />} />
        {/* 案例分析 */}
        <Route path='/case' element={<CaseAnalysis />} />

        {/* 申诉页面 */}
        <Route path='/appeal' element={<AppealList />} />

        {/* 盘点 数据 */}
        <Route path='/review' element={<Review />} />
        {/* 盘点 报告 */}
        <Route path='/report' element={<Report />} />
        {/* 盘点 分项结果 */}
        <Route path='/breakdown' element={<BreakdownTable />} />

        {/* 盘点 规则 */}
        <Route path='/rule' element={<Rule />} />

        {/* 台账 状态字典、故障字典、一次接线图 公用 */}
        <Route path='/book' element={<StatusBookTablePage />} />

        <Route path='/site' element={<SiteManagePage />} />

        <Route path='/manage/SG225HX' element={<AdminManagePage />} />
        <Route path='/manage/SG225HX1' element={<JSONManagePage />} />
      </Routes>
    </div>
  )
}
export default App
