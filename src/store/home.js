// src/store/useStore.js
import { create } from 'zustand'
import { scores, rankFarmList, provincesList, dataQualityStatistics, rankingTotalScore, rankingTotalScoreCompare, countryScores } from './mock'

const API_PREFIX = window.API_PREFIX

// 创建全局store
const useStore = create((set) => ({
  // 初始化状态
  leftShow: true,

  // 设备情况
  statistics: {
    wind_turbine: '--',
    inverter: '--',
    substation: '--'
  },


  // 场站总得分排名
  dataRankingTotalScore: rankingTotalScore,

  // rankingTotalScore: [],

  // 五个维度数据质量统计（完整性、一致性、唯一性、有效性、准确性）
  dataQualityStatistics: dataQualityStatistics, // mock数据 后期删掉

  // 场站总得分排名-同环比
  rankingTotalScoreCompare: rankingTotalScoreCompare,
  // rankingTotalScoreCompare: [],

  setLeftshow: () => set(state => {
    return {
      leftShow: !state.leftShow
    }
  }),
  countryScores,
  scores, // 区域数据质量
  rankFarmList,
  provincesList,

  count: 0,
  theme: 'light',
  user: null,

  setScores: scores => set(state => {
    return {
      scores
    }
  }),

  // 定义更新状态的方法（支持同步/异步）
  increment: () => set((state) => ({ count: state.count + 1 })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setUser: (user) => set({ user }),
  // 异步方法（如请求接口获取用户信息）
  fetchUser: async (userId) => {
    const res = await fetch(`/api/user/${userId}`)
    const user = await res.json()
    set({ user })
  },

  fetchStatistics: async () => {
    console.log('/equipment/statistics请求完整地址：', `${API_PREFIX}/equipment/statistics`);
    const res = await fetch(`${API_PREFIX}/equipment/statistics`)

    const statistics = await res.json()

    set({ statistics })
  },
  // 数据质量 五个维度数据质量统计（完整性、一致性、唯一性、有效性、准确性）
  fetchDataQualityStatistics: async () => {
    const res = await fetch(`${API_PREFIX}/data-quality/statistics`)

    const dataQualityStatistics = await res.json()
    console.log('/data-quality/statistics--------', dataQualityStatistics)
    set({ dataQualityStatistics })
  },

  // 获取场站总得分排名
  fetchRankingTotalScore: async (order="desc") => {
    const res = await fetch(`${API_PREFIX}/data-quality/ranking/total-score?order=${order}`);
    const dataRankingTotalScore = await res.json();
    set({ dataRankingTotalScore });
  },

  // 获取全国各省数据质量评分
  fetchDataQualityProvinces: async (params = {}) => {
    // 默认参数
    const {
        startTime,
        endTime,
    } = params;
    const queryParams = new URLSearchParams();
    if (startTime) queryParams.append('start_date', startTime);
    if (endTime) queryParams.append('end_date', endTime);

    const res = await fetch(`${API_PREFIX}/data-quality/provinces?${queryParams.toString()}`);

    // 全国数据质量
    const countryScores = await res.json();
    set({countryScores})
  },

  // 按业务域查询数据质量（电量/状态/故障 每日得分）
  fetchDataQualityByDomain: async (params = {}) => {
    // 默认参数
    const {
        startTime,
        endTime,
        farmId = null,
        province = null,
        pageSize = 20,
        order = 'desc',
        page = 1,
    } = params;
    const queryParams = new URLSearchParams();
    queryParams.append('order', order);

    if (startTime) queryParams.append('start_date', startTime);
    if (endTime) queryParams.append('end_date', endTime);
    if (farmId) queryParams.append('farm_id', farmId);
    if (province) queryParams.append('province', province);
    if (pageSize) queryParams.append('page_size', pageSize);
    if (page) queryParams.append('page', page);

    const res = await fetch(`${API_PREFIX}/data-quality/by-domain?${queryParams.toString()}`);

    // 区域数据质量
    const scores = await res.json();
    console.log('scores-------------', scores);
    const result = scores?.items || []
    set({scores: result})
  },

  // 场站总得分排名-同环比
  fetchRankingTotalScoreCompare: async (params = {}) => {
    // 默认参数
    const {
        year,       // 必传
        month,      // 必传
        compare = null,
        province = null,
    } = params;
    console.log('场站总得分排名-同环比接口请求参数', params)
    // 验证必传参数
    if (!year || !month) {
        throw new Error("year 和 month 是必传参数");
    }
    // 拼接 URL 参数
    const queryParams = new URLSearchParams();
    queryParams.append('year', year);
    queryParams.append('month', month);
    if (province) queryParams.append('province', province);
    if (compare) queryParams.append('compare', compare);

    const res = await fetch(`${API_PREFIX}/data-quality/ranking/total-score-compare?${queryParams.toString()}`);
    
    if (!res.ok) {
        throw new Error(`请求失败: ${res.status}`);
    }
    
    const rankingTotalScoreCompare = await res.json();
    console.log('rankingTotalScoreCompare---------', rankingTotalScoreCompare)
    set({ rankingTotalScoreCompare });
  }
}))

export default useStore
