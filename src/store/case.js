// src/store/useStore.js
import { create } from 'zustand';
import { scores, rankFarmList, provincesList } from './mock';
// 创建全局store
const useStore = create((set) => ({
    columnXData: ['人', '机', '料', '法', '环'],

    // 示例数据（匹配参考图）
    mainProviderData: [
        { name: '主机厂家1', value: 200.50, color: '#4983CF' },
        { name: '主机厂家2', value: 400.50, color: '#2AB4EB' },
        { name: '主机厂家3', value: 1400.50, color: '#FFD700' },
        { name: '主机厂家4', value: 800.50, color: '#FF8C00' },
        { name: '主机厂家5', value: 2100.50, color: '#9932CC' }
    ],

    setMainProviderData: object => set(state => {
        return {
            mainProviderData: object
        }
    }),

    inverterManufacturer: [
        { name: '逆变器厂家1', value: 220.50, color: '#4983CF' },
        { name: '逆变器厂家2', value: 600.50, color: '#2AB4EB' },
        { name: '逆变器厂家3', value: 400.50, color: '#FFD700' },
        { name: '逆变器厂家4', value: 1800.50, color: '#FF8C00' },
        { name: '逆变器厂家5', value: 2100.50, color: '#9932CC' }
    ],

    setInverterManufacturer: object => set(state => {
        return {
            inverterManufacturer: object
        }
    }),


    caseTableData: [
        { "number": 1, "name": "逆变器厂家能效优化解决方案", "published": "2025-01-10 08:30:25", "status": "已发布", "publisher": "张三" },
        { "number": 2, "name": "风电场智能运维管理系统落地", "published": "2025-01-10 09:15:42", "status": "已发布", "publisher": "李四" },
        { "number": 3, "name": "光伏电站发电量提升技术应用", "published": "2025-01-11 10:20:18", "status": "审核中", "publisher": "王五" },
        { "number": 4, "name": "储能电池寿命延长方案实践", "published": "2025-01-11 11:05:33", "status": "已驳回", "publisher": "赵六" },
        { "number": 5, "name": "新能源电站数据可视化平台搭建", "published": "2025-01-12 14:22:09", "status": "已发布", "publisher": "孙七" },
        { "number": 6, "name": "逆变器故障诊断算法优化", "published": "2025-01-12 15:10:55", "status": "审核中", "publisher": "周八" },
        { "number": 7, "name": "风电叶片维护成本控制案例", "published": "2025-01-13 09:08:12", "status": "已发布", "publisher": "吴九" },
        { "number": 8, "name": "光伏组件清洁机器人应用效果", "published": "2025-01-13 10:30:47", "status": "已驳回", "publisher": "郑十" },
        { "number": 9, "name": "新能源微电网调度策略实践", "published": "2025-01-14 13:15:21", "status": "已发布", "publisher": "张三" },
        { "number": 10, "name": "逆变器散热结构改进设计", "published": "2025-01-14 14:40:36", "status": "审核中", "publisher": "李四" },
        { "number": 11, "name": "风电场功率预测精度提升方案", "published": "2025-01-15 08:50:10", "status": "已发布", "publisher": "王五" },
        { "number": 12, "name": "光伏电站并网谐波治理案例", "published": "2025-01-15 09:25:45", "status": "已驳回", "publisher": "赵六" },
        { "number": 13, "name": "储能系统充放电效率优化", "published": "2025-01-16 11:30:22", "status": "已发布", "publisher": "孙七" },
        { "number": 14, "name": "逆变器电磁兼容整改措施", "published": "2025-01-16 12:15:58", "status": "审核中", "publisher": "周八" },
        { "number": 15, "name": "风电变流器故障处理实例", "published": "2025-01-17 14:00:15", "status": "已发布", "publisher": "吴九" },
        { "number": 16, "name": "光伏跟踪系统精度校准方案", "published": "2025-01-17 15:30:40", "status": "已驳回", "publisher": "郑十" },
        { "number": 17, "name": "新能源电站运维数字化转型", "published": "2025-01-18 09:10:05", "status": "已发布", "publisher": "张三" },
        { "number": 18, "name": "逆变器软件固件升级实践", "published": "2025-01-18 10:45:30", "status": "审核中", "publisher": "李四" },
        { "number": 19, "name": "风电场塔筒防腐技术应用", "published": "2025-01-19 13:20:17", "status": "已发布", "publisher": "王五" },
        { "number": 20, "name": "光伏电站组件衰减率测试分析", "published": "2025-01-19 14:55:52", "status": "已驳回", "publisher": "赵六" },
        { "number": 21, "name": "储能电池管理系统优化设计", "published": "2025-01-20 08:20:28", "status": "已发布", "publisher": "孙七" },
        { "number": 22, "name": "逆变器并联运行稳定性提升", "published": "2025-01-20 09:50:53", "status": "审核中", "publisher": "周八" },
        { "number": 23, "name": "风电偏航系统故障诊断案例", "published": "2025-01-21 11:15:19", "status": "已发布", "publisher": "吴九" },
        { "number": 24, "name": "光伏电站智能巡检机器人应用", "published": "2025-01-21 12:40:44", "status": "已驳回", "publisher": "郑十" },
        { "number": 25, "name": "新能源电站功率调节策略实践", "published": "2025-01-22 14:05:10", "status": "已发布", "publisher": "张三" },
        { "number": 26, "name": "逆变器保护功能测试方案", "published": "2025-01-22 15:30:35", "status": "审核中", "publisher": "李四" },
        { "number": 27, "name": "风电场集电线路损耗治理", "published": "2025-01-23 08:45:01", "status": "已发布", "publisher": "王五" },
        { "number": 28, "name": "光伏电站逆变器选型指南", "published": "2025-01-23 09:20:26", "status": "已驳回", "publisher": "赵六" },
        { "number": 29, "name": "储能系统并网标准合规性验证", "published": "2025-01-24 11:35:52", "status": "已发布", "publisher": "孙七" },
        { "number": 30, "name": "逆变器温升测试及改进措施", "published": "2025-01-24 12:10:17", "status": "审核中", "publisher": "周八" },
        { "number": 31, "name": "风电齿轮箱润滑管理案例", "published": "2025-01-25 14:25:43", "status": "已发布", "publisher": "吴九" },
        { "number": 32, "name": "光伏电站发电量损失分析报告", "published": "2025-01-25 15:50:08", "status": "已驳回", "publisher": "郑十" },
        { "number": 33, "name": "新能源电站能量管理系统应用", "published": "2025-01-26 08:30:34", "status": "已发布", "publisher": "张三" },
        { "number": 34, "name": "逆变器通讯协议兼容性测试", "published": "2025-01-26 09:05:59", "status": "审核中", "publisher": "李四" },
        { "number": 35, "name": "风电场雷电防护技术升级", "published": "2025-01-27 11:20:25", "status": "已发布", "publisher": "王五" },
        { "number": 36, "name": "光伏组件回收利用方案探讨", "published": "2025-01-27 12:55:50", "status": "已驳回", "publisher": "赵六" },
        { "number": 37, "name": "储能电池快充技术实践", "published": "2025-01-28 14:10:16", "status": "已发布", "publisher": "孙七" },
        { "number": 38, "name": "逆变器故障模拟及排查流程", "published": "2025-01-28 15:35:41", "status": "审核中", "publisher": "周八" },
        { "number": 39, "name": "风电发电量提升改造项目", "published": "2025-01-29 08:50:07", "status": "已发布", "publisher": "吴九" },
        { "number": 40, "name": "光伏电站并网调试案例分析", "published": "2025-01-29 09:25:32", "status": "已驳回", "publisher": "郑十" },
        { "number": 41, "name": "新能源微电网储能配置优化", "published": "2025-01-30 11:40:58", "status": "已发布", "publisher": "张三" },
        { "number": 42, "name": "逆变器效率测试方法改进", "published": "2025-01-30 12:15:23", "status": "审核中", "publisher": "李四" },
        { "number": 43, "name": "风电场运维人员培训体系建设", "published": "2025-01-31 14:30:49", "status": "已发布", "publisher": "王五" },
        { "number": 44, "name": "光伏电站监控系统升级改造", "published": "2025-01-31 15:05:14", "status": "已驳回", "publisher": "赵六" },
        { "number": 45, "name": "储能系统消防安全设计案例", "published": "2025-02-01 08:20:40", "status": "已发布", "publisher": "孙七" },
        { "number": 46, "name": "逆变器浪涌保护措施验证", "published": "2025-02-01 09:55:05", "status": "审核中", "publisher": "周八" },
        { "number": 47, "name": "风电叶片冰情监测及除冰方案", "published": "2025-02-02 11:10:31", "status": "已发布", "publisher": "吴九" },
        { "number": 48, "name": "光伏电站土地利用率提升方案", "published": "2025-02-02 12:45:56", "status": "已驳回", "publisher": "郑十" },
        { "number": 49, "name": "新能源电站碳足迹核算实践", "published": "2025-02-03 14:00:22", "status": "已发布", "publisher": "张三" },
        { "number": 50, "name": "逆变器全生命周期管理方案", "published": "2025-02-03 15:25:47", "status": "审核中", "publisher": "李四" }
    ],

    caseDetailData: [
        {
            "number": "1",
            "commited": "2025-11-09",
            "dataType": "电量",
            "anaType": "完整性",
            "committer": "刘多多",
            "desc": "数据完整性偏差2%",
            "advice": "请检查数据"
        },
        {
            "number": "2",
            "commited": "2025-11-09",
            "dataType": "功率",
            "anaType": "准确性",
            "committer": "张明宇",
            "desc": "功率数据准确性偏差5%",
            "advice": "校准采集设备"
        },
        {
            "number": "3",
            "commited": "2025-11-10",
            "dataType": "电压",
            "anaType": "完整性",
            "committer": "李思思",
            "desc": "电压数据缺失10条记录",
            "advice": "补全缺失数据"
        },
        {
            "number": "4",
            "commited": "2025-11-10",
            "dataType": "电流",
            "anaType": "一致性",
            "committer": "王浩轩",
            "desc": "电流数据与标准值不一致",
            "advice": "核对数据来源"
        },
        {
            "number": "5",
            "commited": "2025-11-11",
            "dataType": "电量",
            "anaType": "及时性",
            "committer": "刘多多",
            "desc": "电量数据上报延迟30分钟",
            "advice": "优化传输链路"
        },
        {
            "number": "6",
            "commited": "2025-11-11",
            "dataType": "温度",
            "anaType": "准确性",
            "committer": "赵晓琪",
            "desc": "温度数据测量偏差1.5℃",
            "advice": "更换温度传感器"
        },
        {
            "number": "7",
            "commited": "2025-11-12",
            "dataType": "风速",
            "anaType": "完整性",
            "committer": "陈俊辉",
            "desc": "风速数据缺失2小时记录",
            "advice": "检查采集终端"
        },
        {
            "number": "8",
            "commited": "2025-11-12",
            "dataType": "功率",
            "anaType": "一致性",
            "committer": "张明宇",
            "desc": "功率数据跨设备不一致",
            "advice": "统一设备校准标准"
        }
    ],
    columnSeries: [600, 400, 430, 120, 800],

    addCaseDetail: object => set(state => {
        return {
            caseDetailData: [...state.caseDetailData, object]
        }
    }),

}));

export default useStore;