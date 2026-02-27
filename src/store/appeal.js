// src/store/useStore.js
import { create } from 'zustand';
import *  as client from '../utils/colclient.js'
import { validate } from '../utils/utils.js';

// 创建全局store
const useStore = create((set, get) => ({
  appealTableTotal: 480,
  appealTableCurrent: 1,
  appealTableData: [],

  successAppealModalVisible: false, // 申请成功对话框
  /**
   * 新增申诉表格
   */
  candinateModalVisible: false, // 申诉对话框可见性

  appealProvince: '', // 申诉省份
  appealSite: '', // 申诉场站
  appealType: '', // 申诉类型

  provinceAppealObject: {}, // 省份申诉数据
  stationAppealObject: {}, // 场站申诉 首页专用
  candinate: '',  // 申诉类型
  candinateSelectedKeys: [],
  appealCandinateData: [], // 可选待申诉数据， 按场站筛选的结果
  candinateDataCurrent: 1,
  candinateDataTotal: () => get().appealCandinateData.length,
  candinateGotoPage: page => set(state => {
    return {
      candinateDataCurrent: page
    }
  }),

  setAppealProvince: province => set(state => {
    return {
      appealProvince: province
    }
  }),

  setAppealSite: site => set(state => {
    return {
      appealSite: site
    }
  }),
  setAppealType: type => set(state => {
    return {
      appealType: type
    }
  }),

  setAppealCandinateData: data => set(state => {
    return {
      appealCandinateData: data
    }
  }),

  setCandinateModalVisible: visible => set(state => {
    return {
      candinateModalVisible: visible
    }
  }),

  setCandinateSelectedKeys: keys => set(state => {
    return {
      candinateSelectedKeys: keys
    }
  }),

  updateCandinateRange: range => set(state => {
    return {
      appealCandinateData: [],
      candinateRange: range
    }
  }),

  // 从列表打开申诉对话框
  openAppealCreateModal: () => set(state => {
    return {
      candinateModalVisible: true,
      candinateTypeSwitch: true,
      provinceSwitch: true,
      stationSwitch: true,
      candinateRange: 'province'
    }
  }),

  // 确认下一步填写分项详情
  confirmAppealCreate: () => set(async state => {
      set({
        candinateModalVisible: false,
        confirmAppealModalVisible: true,
        appealStationSelectedData: state.candinateSelectedKeys.map(key => {
          return state.appealCandinateData.find(t => t.key === key)
        }).map(t => {
          return {
            ...t, 
            province: state.appealProvince,
            site: state.appealSite,
          }
        })
      })
  }),

  // 批量创建申诉
  confirmSitesAppealCreate: () => set(async state => {
    const appealStationSelectedData = state.appealStationSelectedData
    
    for (const item of appealStationSelectedData) {
      if (!validate(item, [
        { key: 'desc', msg: '申诉描述不能为空，请填写详细的申诉原因' },
        { key: 'attachment', msg: '申诉附件不能为空，请上传相关证明材料', checkType: 'array' }
      ])) {
        return
      }
    }
    for (const item of appealStationSelectedData) {
      await client.create({
        ...item,
        inc: 'APS',
        type: item.appealType,
        status: 'requested'
      }, 'appeals')
    }
    state.reset()
    set({
      successAppealModalVisible: true
    })
  }),

  reset: () => set(state => ({
    confirmAppealModalVisible: false,
    candinateModalVisible: false,
    provinceAppealObject: {},
    stationAppealObject: {},
    candinateSelectedKeys: [],
    appealCandinateData: [],
    successAppealModalVisible: false
  })),


  //  创建并打开申诉对话框
  createAppeal: ({
    province,
    site,
    type
  }) => set(state => {
    return {
      candinateModalVisible: true,
      appealProvince: province,
      appealSite: site,
      appealType: type,
      appealCandinateData: []
    }
  }),

  updateProvinceAppeal: (update) => set(state => {
    return {
      provinceAppealObject: {
        ...state.provinceAppealObject,
        ...update
      }
    }
  }),

  closeSuccessModal: () => set(state => {
    return {
      successAppealModalVisible: false
    }
  }),



  /**
   * 申诉确认对话框相关状态
   */
  confirmAppealModalVisible: false,
  appealStationSelectedData: [], // 申诉已选

  goBackCreateAppealModal: () => set(state => { // 回退到选择表格
    return {
      candinateModalVisible: true,
      confirmAppealModalVisible: false,
      candinateSelectedKeys: state.appealStationSelectedData.map(data => data.key)
    }
  }),

  removeStationSelectedData: index => set(state => { // 删除一条申请项
    return {
      appealStationSelectedData: state.appealStationSelectedData.filter((_, i) => i !== index)
    }
  }),

  updateStationDataItem: (index, updateObject) => set(state => {
    return {
      appealStationSelectedData: state.appealStationSelectedData.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            ...updateObject
          }
        } else {
          return item
        }
      })
    }
  }),

  setConfirmAppealModalVisible: visible => set(state => {
    return {
      confirmAppealModalVisible: visible
    }
  }),

  cancelAppealRequest: () => set(state => { // 回退到选择表格
    return {
      candinateModalVisible: false,
      confirmAppealModalVisible: false,
      candinateSelectedKeys: [],
      appealCandinateData: [],
      appealStationSelectedData: []
    }
  }),


  appealObjectViewObject : {},
  appealObjectModalVisible: false,

  setAppealObjectModalVisible: visible => set(state => {
    return {
      appealObjectModalVisible: visible
    }
  }),

  updateAppealViewObject: object => set(state => {
    return {
      appealObjectViewObject: {
        ...state.appealObjectViewObject,
        ...object
      }
    }
  }),

  setAppealObjectViewObject: object => set(state => {
    return {
      appealObjectViewObject: object
    }
  })

}));

export default useStore;