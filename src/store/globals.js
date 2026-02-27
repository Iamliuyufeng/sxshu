// src/store/useStore.js
import { create } from 'zustand';
import { provincesList, farmList } from './mock';
import { fetchData, getNodeRequestUrl } from '../utils/utils';
console.log(farmList);
const API_PREFIX = window.API_PREFIX;
// 创建全局store
const useStore = create((set) => ({
  globalSpin: false,
  provinces: provincesList,
  farms: farmList || [],  // 如果 farmList 未定义，使用空数组兜底

  userProvinces: ['山西', '河北'], // 用户有权限的省
  userId: 'zhang_wei83',  // 用户账号
  userSites: [], // 用户有权限的场站
  isAdmin: true, // 用户是否是管理员

  // 初始化状态
  dateTypes: [{
    label: '电量',
    value: 'energy'
  }, {
    label: '状态',
    value: 'status',
  }, {
    label: '故障',
    value: 'error',
  }, {
    label: '一次接线图',
    value: 'line'
  }],

  anaType: [{
    label: '完整性',
    value: 'integrity'
  }, {
    label: '有效性',
    value: 'validity '
  }, {
    label: '准确性',
    value: 'correctness'
  }, {
    label: '一致性',
    value: 'same'
  }],

  setGlobalLoading : (loading, tip) => set(state => ({
    globalSpin: loading
  })),
    // 3. 定义异步初始化方法，用于从接口加载数据并更新状态
  initResources: async () => {
    const resData = await fetchData(getNodeRequestUrl('/permision/resources'));
    if (resData) {
      console.log('用户有权限的省', resData.result)
        set({
          // 假设接口返回的数据结构如下，根据实际接口返回字段调整
          userProvinces: resData.result.map(sh => sh.name),
          userId: resData.userId,
          isAdmin: resData.isAdmin
        });
      } else {
        console.log('获取用户权限失败')
      }
    },

    // 获取全量省份列表 无权限 （to后期可能要新增权限场站列表）
  fetchGetProvincesList: async () => {
    const res = await fetch(`${API_PREFIX}/region/province`);

    const provinces = await res.json();
    // const provinces = [{ code: "TJ", name: "天津" },
    //                 { code: "HEB", name: "河北" },
    //                 { code: "SX", name: "山西" }]
    const provincesList = provinces.map(pr => {
      return {
        label: pr.name,
        value: pr.code
      }
    })
    set({ provinces:  provincesList});
  },

    // 获取场站列表
  fetchFarmList: async (province = '') => {
    console.log("获取场站列表", province, provincesList)

    let farms = farmList;

    // 如果 API_PREFIX 已定义，调用真实接口
    if (typeof API_PREFIX !== 'undefined') {
      let url = `${API_PREFIX}/farm`;

      if (province) {
        url += `?province=${province}`;
      }

      try {
        const res = await fetch(url);
        if (res.ok) {
          farms = await res.json();
        }
      } catch (error) {
        console.error('获取场站列表请求异常:', error);
      }
    }
    // 转换数据格式供 Select 组件使用
    const resultList = farms.map(farm => {
      return {
        label: farm.name,
        value: farm.id
      }
    })
    set({ farms: resultList });
  }
}));


useStore.getState().fetchGetProvincesList();
useStore.getState().fetchFarmList();

if (typeof window !== 'undefined') {
  useStore.getState().initResources();
}
export default useStore;

// /permision/resources