// src/store/useStore.js
import { create } from 'zustand'
// 创建全局store
const useStore = create((set) => ({
  provinceTreeData: [],
  setProvinceTreeData: (data) => set({ provinceTreeData: data })
  // 实现方法: 从指定地址获取JSON直接给到 provinceTreeData。 因为全局唯一，所以不需要组件调用获取。 组件加载就获取了
}))

export default useStore
