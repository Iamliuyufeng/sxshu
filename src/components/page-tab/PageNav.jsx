import React from 'react'
import { Tabs } from 'antd';

import './style.less'

const PageTab = ({
    activeKey,
    items = [{ label: '首页', children: 'Content of Tab 1', key: '1' },
        { label: '运行监视', children: 'Content of Tab 2', key: '2' }]
}) => {
    const onChange = () => {

    }
    return (
        <Tabs
          className="sx-page-tab"
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          items={items}
        />
      );
}


export default PageTab
