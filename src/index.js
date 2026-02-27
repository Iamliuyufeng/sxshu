import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './app'
import './base.less'
import './assets/fonts.css'
import './assets/antd.less'
import locale from 'antd/locale/zh_CN'
import customizeRenderEmpty from './custom_render'
import { ConfigProvider } from 'antd'

import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

ReactDOM.render(
  // 开启严格模式，开启后，可以检测到app组件里的规范，例如使用字符串的 ref=""
  <React.StrictMode>
    <HashRouter>
      <ConfigProvider
        theme={{
          token: {
            colorText: '#B6B6B6',
            colorBorder: '#17CEFF',
            colorBgContainer: '#001732'
          },
          components: {
            Tag: {
              defaultBg: 'transparent'
            /* 这里是你的组件 token */
            },
            Button: {

            },
            Message: {
              contentBg: '#2AB4EB'
            },
            Select: {
              activeBorderColor: '#2AB4EB',
              selectorBg: 'rgba(23,206,255,0.1)',
              activeOutlineColor: 'none'
            },
            DatePicker: {
              cellActiveWithRangeBg: 'rgba(21, 154, 255, 0.2)',
              activeBg: 'rgba(23,206,255,0.1)',
              activeShadow: 'none',
              colorBgContainer: 'rgba(23,206,255,0.1)'
            /* 这里是你的组件 token */
            },
            Segmented: {
              itemColor: '#B6B6B6',
              itemHoverColor: '#fff',
              trackBg: 'rgba(26,93,148,0.2)',
              itemActiveBg: 'linear-gradient(#0C609E 0%, #2AB4EB 100%)'
            },
            Tabs: {
              itemActiveColor: '#00F0FF',
              itemSelectedColor: '#00F0FF',
              inkBarColor: '#00F0FF'
            // cardBg: 'rgba(26,93,148,0.2)',
            // cardBg: 'linear-gradient(#0C609E 0%, #2AB4EB 100%)'
            /* 这里是你的组件 token */
            },
            Tree: {
              indentSize: 0
            }
          }
        }}
        renderEmpty={customizeRenderEmpty}
        locale={locale}
      >
        <App />
      </ConfigProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('app')
)
