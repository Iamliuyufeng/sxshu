import { message } from "antd"

/**
 * 处理数据：排序 + 添加categorySpan和indicatorSpan属性
 * @param {Array} data 原始的appealCandinateData
 * @returns {Array} 处理后的数据集
 */
const processAppealData = (data) => {
  // 步骤1：先按category升序排序，再按indicator升序子排序
  const sortedData = [...data].sort((a, b) => {
    // 先比较category
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category, 'zh-CN') // 中文排序
    }
    // category相同，比较indicator
    return a.indicator.localeCompare(b.indicator, 'zh-CN')
  })

  // 步骤2：计算categorySpan
  const dataWithCategorySpan = []
  let currentCategory = null
  let categoryCount = 0
  // 第一步遍历：统计每个category的总数量
  for (let i = 0; i < sortedData.length; i++) {
    const item = sortedData[i]
    if (item.category !== currentCategory) {
      // 新的category，重置计数
      currentCategory = item.category
      categoryCount = 1
      // 统计当前category的总数量
      for (let j = i + 1; j < sortedData.length; j++) {
        if (sortedData[j].category === currentCategory) {
          categoryCount++
        } else {
          break
        }
      }
      // 标记第一个item的categorySpan为总数
      dataWithCategorySpan.push({ ...item, categorySpan: categoryCount })
      // 后续相同category的item，categorySpan设为0
      for (let j = i + 1; j < i + categoryCount; j++) {
        dataWithCategorySpan.push({ ...sortedData[j], categorySpan: 0 })
      }
      // 跳过已处理的项
      i += categoryCount - 1
    }
  }

  // 步骤3：计算indicatorSpan（在相同category分组内处理）
  const finalData = []
  let currentGroupCategory = null
  let groupStartIndex = 0
  // 先按category分组
  for (let i = 0; i < dataWithCategorySpan.length; i++) {
    const item = dataWithCategorySpan[i]
    // 新的category分组
    if (item.category !== currentGroupCategory) {
      // 处理上一个分组的indicatorSpan
      if (currentGroupCategory !== null) {
        const group = dataWithCategorySpan.slice(groupStartIndex, i)
        finalData.push(...calculateIndicatorSpan(group))
      }
      // 重置分组信息
      currentGroupCategory = item.category
      groupStartIndex = i
    }
    // 处理最后一个分组
    if (i === dataWithCategorySpan.length - 1) {
      const group = dataWithCategorySpan.slice(groupStartIndex)
      finalData.push(...calculateIndicatorSpan(group))
    }
  }

  return finalData
}

/**
 * 辅助函数：计算分组内的indicatorSpan
 * @param {Array} group 同一category的数据集
 * @returns {Array} 处理后的分组数据
 */
const calculateIndicatorSpan = (group) => {
  const result = []
  let currentIndicator = null
  let indicatorCount = 0
  let index = 0
  while (index < group.length) {
    const item = group[index]
    if (item.indicator !== currentIndicator) {
      // 新的indicator，统计数量
      currentIndicator = item.indicator
      indicatorCount = 1
      // 统计当前indicator的总数量
      for (let j = index + 1; j < group.length; j++) {
        if (group[j].indicator === currentIndicator) {
          indicatorCount++
        } else {
          break
        }
      }
      // 第一个item设为总数，后续设为0
      result.push({ ...item, indicatorSpan: indicatorCount })
      for (let j = index + 1; j < index + indicatorCount; j++) {
        result.push({ ...group[j], indicatorSpan: 0 })
      }
      // 跳过已处理的项
      index += indicatorCount
    } else {
      index++
    }
  }
  return result
}

/**
 * 根据0-100的数值，获取与CSS linear-gradient一致的渐变色
 * CSS对应：background: linear-gradient(270deg, #11AB84 0%, #F6BD16 48%, #FF6400 100%);
 * @param {number} n - 0-100的数值（超出范围会被限制在0-100之间），对应渐变轴上的0%~100%位置
 * @returns {string} 对应的十六进制渐变色（如#xxyyzz）
 */
const getCssAlignedGradientColor = (n) => {
  // 1. 对齐CSS的颜色节点：位置为0%、48%、100%（对应CSS中的百分比）
  const colorStops = [
    { position: 100, color: '#11AB84' }, // CSS: 0%
    { position: 48, color: '#F6BD16' }, // CSS: 48%（原50%改为48%）
    { position: 0, color: '#FF6400' } // CSS: 100%
  ]

  // 限制输入数值在0-100之间（对应渐变轴的0%~100%位置）
  const inputValue = Math.max(0, Math.min(100, Number(n) || 0))

  // 辅助函数：将十六进制颜色转换为RGB数组 [r, g, b]（范围0-255）
  function hexToRgb (hex) {
    const pureHex = hex.replace(/^#/, '')
    // 处理简写（如#fff）和全写（如#ffffff），这里统一处理为6位
    const fullHex = pureHex.length === 3
      ? pureHex.split('').map(c => c + c).join('')
      : pureHex
    const r = parseInt(fullHex.substring(0, 2), 16)
    const g = parseInt(fullHex.substring(2, 4), 16)
    const b = parseInt(fullHex.substring(4, 6), 16)
    return [r, g, b]
  }

  // 辅助函数：将RGB数组转换为十六进制颜色（补全两位）
  function rgbToHex (r, g, b) {
    const toHex = (val) => {
      const clamped = Math.max(0, Math.min(255, Math.round(val))) // 限制0-255并取整
      return clamped.toString(16).padStart(2, '0') // 自动补0
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase() // 统一小写，和CSS一致
  }

  // 辅助函数：线性插值（CSS渐变的核心计算方式）
  function lerp (a, b, t) {
    return a + (b - a) * t
  }

  // 2. 查找输入值在渐变轴上对应的颜色节点区间（模拟CSS的节点查找）
  let startStop, endStop
  // 遍历颜色节点，找到包含输入值的相邻节点对
  for (let i = 0; i < colorStops.length - 1; i++) {
    const current = colorStops[i]
    const next = colorStops[i + 1]
    if (inputValue >= current.position && inputValue <= next.position) {
      startStop = current
      endStop = next
      break
    }
  }
  // 兜底（理论上不会触发，因为inputValue被限制在0-100）
  if (!startStop || !endStop) {
    startStop = colorStops[0]
    endStop = colorStops[colorStops.length - 1]
  }

  // 3. 计算输入值在当前区间内的插值比例t（0-1，和CSS的插值比例一致）
  const t = (inputValue - startStop.position) / (endStop.position - startStop.position)

  // 4. 转换颜色为RGB并执行线性插值
  const [startR, startG, startB] = hexToRgb(startStop.color)
  const [endR, endG, endB] = hexToRgb(endStop.color)
  const currentR = lerp(startR, endR, t)
  const currentG = lerp(startG, endG, t)
  const currentB = lerp(startB, endB, t)

  // 5. 转回十六进制颜色并返回
  return rgbToHex(currentR, currentG, currentB)
}

const fetchData = async url => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`请求失败：${response.status}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取数据失败：', error)
    return null
  }
}

const getNodeRequestUrl = url => {
  return NODE_API_PREFIX + url
}

const validate = (object, rules) => {
  if (!object) {
    throw new Error('表单信息不完善，请检查');
  }

  try {
    for (const rule of rules) {
      const value = object[rule.key];
      if (rule.checkType === 'array') {
        if (!value || value.length === 0) throw new Error(rule.msg);
      } else {
        if (!value || value.trim() === '') throw new Error(rule.msg);
      }
    }
    return true
  } catch (e) {
    message.error(e.message);
    return false
  }
}

/**
 * 将ISO时间字符串转换为 yyyy-mm-dd 格式
 * @param {string} isoStr - ISO格式时间字符串（如 2025-12-26T10:08:26.077Z）
 * @returns {string} 格式化后的日期（如 2025-12-26）
 */
const formatIsoToDate = (isoStr) => {
  if (!isoStr) return ''; // 空值处理
  try {
    // 创建Date对象（自动解析ISO格式）
    const date = new Date(isoStr);
    // 获取年/月/日（补零确保两位）
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需+1
    const day = String(date.getDate()).padStart(2, '0');
    // 拼接为 yyyy-mm-dd
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('时间格式转换失败：', error);
    return ''; // 解析失败返回空
  }
}


/**
 * 从文件路径中提取文件名（兼容 Windows(\) 和 Unix(/) 路径分隔符）
 * @param {string} filePath - 完整的文件路径字符串
 * @returns {string} 提取出的文件名（包含扩展名）
 */
const getFileNameFromPath = (filePath) => {
  // 处理空路径的边界情况
  if (!filePath || typeof filePath !== 'string') {
    return '';
  }

  // 将所有反斜杠(\)替换为斜杠(/)，统一路径分隔符
  const normalizedPath = filePath.replace(/\\/g, '/');
  // 按斜杠分割路径，取最后一个元素（即文件名）
  const pathParts = normalizedPath.split('/');
  const fileName = pathParts.pop() || '';

  return fileName;
}

const openAttachment = attachment => {
  window.open(getNodeRequestUrl(`/sxfile/download?relativePath=${attachment}`), '_blank')
}

const downloadAttachment = attachment => {
  window.open(getNodeRequestUrl(`/sxfile/download?relativePath=${attachment}&download=1`), '_blank')
}

const removeAttachment = attachment => {
  window.open(getNodeRequestUrl(`/sxfile/remove?relativePath=${attachment}&download=1`), '_blank')
}


export {
  validate,
  getFileNameFromPath,
  getNodeRequestUrl,
  formatIsoToDate,
  fetchData,
  getCssAlignedGradientColor,
  processAppealData,
  openAttachment,
  removeAttachment,
  downloadAttachment
}
