// src/store/withTableStore.js
import { initTableState, handleTableDataFetch, resetTableState } from '../utils/tableRequest';

/**
 * 高阶函数：为Store添加表格相关的状态和方法
 * @param {Function} createStore - 原始的Zustand create函数逻辑
 * @returns {Function} 增强后的Store
 */
export const withTableStore = (createStore) => {
  return (set) => {
    // 合并原始Store和表格通用逻辑
    return {
      ...createStore(set),
      // 表格状态：key为表格标识，value为表格状态
      tableStates: {},
      // 加载表格数据
      fetchTableData: (tableKey, url, params) => handleTableDataFetch(set, tableKey, url, params),
      // 初始化表格状态
      initTable: (tableKey, options) => {
        set((state) => ({
          tableStates: {
            ...state.tableStates,
            [tableKey]: initTableState(options)
          }
        }));
      },
      // 重置表格状态
      resetTable: (tableKey, options) => {
        resetTableState(set, tableKey, initTableState(options));
      }
    };
  };
};