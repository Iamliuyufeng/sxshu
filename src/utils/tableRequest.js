/**
 * 通用表格数据请求方法（适配直接到data层的格式：{ items, count, pageSize, current }）
 * @param {string} url - 请求地址（本地JSON路径或API接口）
 * @param {Object} params - 请求参数（分页、筛选等）
 * @param {number} params.pageSize - 每页条数
 * @param {number} params.current - 当前页码
 * @returns {Object} 表格数据：{ list, total, pageSize, current }（前端统一映射为list/total）
 */
export const fetchTableDataApi = async (url, params = { pageSize: 10, current: 1 }) => {
  try {
    // 处理请求参数：本地JSON用GET拼接参数，API可根据需求改为POST
    const queryString = new URLSearchParams(params).toString();
    const requestUrl = queryString ? `${url}?${queryString}` : url;

    const response = await fetch(requestUrl);
    // 检查响应是否成功（status 200-299）
    if (!response.ok) {
      throw new Error(`请求失败：${response.status} ${response.statusText}`);
    }

    // 直接解析返回的data层数据（无code/message）
    const data = await response.json();

    // 核心：将API的items→list、count→total，前端统一使用list/total
    const { items: list, count: total, pageSize, current } = data;
    // 返回表格所需的核心数据（前端通用格式）
    return { list, total, pageSize: pageSize || params.pageSize, current: current || params.current };
  } catch (error) {
    console.error('表格数据请求异常：', error);
    throw error; // 抛出错误让上层处理
  }
};

/**
 * 通用表格状态初始化（供Store使用）
 * @param {Object} options - 初始配置
 * @param {number} options.pageSize - 初始每页条数
 * @returns {Object} 表格初始状态
 */
export const initTableState = (options = { pageSize: 10 }) => ({
  list: [], // 前端统一用list
  total: 0, // 前端统一用total
  pageSize: options.pageSize,
  current: 1,
  loading: false,
  error: null
});

/**
 * 通用表格状态更新方法（供Store的set函数使用）
 * @param {Function} set - Zustand的set方法
 * @param {string} tableKey - 表格唯一标识（如statusBook）
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 */
export const handleTableDataFetch = async (set, tableKey, url, params) => {
  // 1. 设置加载状态
  set((state) => ({
    tableStates: {
      ...state.tableStates,
      [tableKey]: {
        ...state.tableStates[tableKey],
        loading: true,
        error: null
      }
    }
  }));

  try {
    // 2. 发起请求（已映射为list/total）
    const tableData = await fetchTableDataApi(url, params);

    // 3. 更新成功状态
    set((state) => ({
      tableStates: {
        ...state.tableStates,
        [tableKey]: {
          ...state.tableStates[tableKey],
          ...tableData, // 覆盖list、total、pageSize、current
          loading: false
        }
      }
    }));
  } catch (error) {
    // 4. 更新失败状态
    set((state) => ({
      tableStates: {
        ...state.tableStates,
        [tableKey]: {
          ...state.tableStates[tableKey],
          loading: false,
          error: error.message
        }
      }
    }));
  }
};

/**
 * 通用表格状态重置方法（供Store使用）
 * @param {Function} set - Zustand的set方法
 * @param {string} tableKey - 表格唯一标识
 * @param {Object} initState - 初始状态
 */
export const resetTableState = (set, tableKey, initState) => {
  set((state) => ({
    tableStates: {
      ...state.tableStates,
      [tableKey]: initState
    }
  }));
};