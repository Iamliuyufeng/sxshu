
// 1. 全国34个省级行政区列表（按常用顺序排列）
const provinces = ['天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'];
const newProvinces = [
  { code: "TJ", name: "天津" },
  { code: "HEB", name: "河北" },
  { code: "SX", name: "山西" },
  { code: "NMG", name: "内蒙古" },
  { code: "LN", name: "辽宁" },
  { code: "JL", name: "吉林" }
]

// 电场列表
const farmList = [
  {
    "id": "CN_12_N0001_S0001",
    "name": "天津三峡海上风电场升压站1"
  },
  {
    "id": "CN_12_N0001_S0002",
    "name": "天津三峡海上风电场升压站2"
  },
  {
    "id": "CN_12_N0001_S0003",
    "name": "天津三峡海上风电场升压站3"
  },
  {
    "id": "CN_12_N0001_S0004",
    "name": "天津三峡海上风电场升压4"
  }
]

// 2. 生成10到100之间的随机整数（包含边界值）
const getRandomNum = () => {
  return Math.floor(Math.random() * 91) + 10; // Math.random()生成0-1的数，*91得到0-90.999，+10得到10-100.999，取整后是10-100
};

const randomScores = names => {
  return names.map((item, index) => {
    // 北京的各项值固定为100
    if (index === 0) {
      return {
        name: item.name,
        total: {
          "dq_ratio": 100,
          "dq_score": 100
        },
        status: {
          "dq_ratio": 100,
          "dq_score": 100
        },
        fault: {
          "dq_ratio": 100,
          "dq_score": 100
        },
        pwd: {
          "dq_ratio": 100,
          "dq_score": 100
        },
        energy: {
          "dq_ratio": 100,
          "dq_score": 100
        }
      };
    }
    // 其他省市随机生成10-100的数值
    return {
      name: item.name,
      total: {
          "dq_ratio": getRandomNum(),
          "dq_score": getRandomNum()
        },
      status: {
          "dq_ratio": getRandomNum(),
          "dq_score": getRandomNum()
        },
      fault: {
          "dq_ratio": getRandomNum(),
          "dq_score": getRandomNum()
        },
      pwd: {
          "dq_ratio": getRandomNum(),
          "dq_score": getRandomNum()
        },
      energy: {
          "dq_ratio": getRandomNum(),
          "dq_score": getRandomNum()
        },
    };
  })
}

// 3. 生成最终的分数数据数组
const scores = randomScores(newProvinces)

// 全国数据质量评分
const countryScores = [
  {
    "province_code": "AH",
    "province_name": "安徽",
    "ranking": 1,
    "energy": {
      "dq_ratio": 0.98765,
      "dq_score": 98.77
    },
    "status": {
      "dq_ratio": 0.98765,
      "dq_score": 98.77
    },
    "fault": {
      "dq_ratio": 0.98765,
      "dq_score": 98.77
    },
    "pwd": {
      "dq_ratio": 0.98765,
      "dq_score": 98.77
    },
    "total": {
      "dq_ratio": 0.98765,
      "dq_score": 98.77
    }
  },{
    "province_code": "JS",
    "province_name": "江苏",
    "ranking": 1,
    "energy": {
      "dq_ratio": 0.98765,
      "dq_score": 18.77
    },
    "status": {
      "dq_ratio": 0.98765,
      "dq_score": 8.77
    },
    "fault": {
      "dq_ratio": 0.98765,
      "dq_score": 58.77
    },
    "pwd": {
      "dq_ratio": 0.98765,
      "dq_score": 38.77
    },
    "total": {
      "dq_ratio": 0.98765,
      "dq_score": 28.77
    }
  }
]

const getFarmListRind = () => {
  // 生成包含50条风电场数据的数组
  const windFarmData = [];

  // 循环生成50条记录
  for (let i = 0; i < 50; i++) {
    // 序号：从1到50
    const serialNumber = i + 1;
    // 风电场名称：风电场1、风电场2...
    const windFarmName = `风电场${serialNumber}`;
    // 得分：从100依次向下，即100、99、98...51
    const score = 100 - i;
    // 同比得分：在当前得分基础上±5以内的随机数（保留1位小数，模拟真实数据）
    const yearOnYearScore = (score + (Math.random() * 10 - 5)).toFixed(1);
    // 同比排名：1到50的随机整数
    const yearOnYearRank = Math.floor(Math.random() * 50) + 1;
    // 场站排名：1到50的随机整数
    const stationRank = Math.floor(Math.random() * 50) + 1;

    // 将每条数据添加到数组中
    windFarmData.push({
      serialNumber, // 序号
      windFarmName, // 风电场名称
      score, // 得分
      yearOnYearScore: Number(yearOnYearScore), // 同比得分（转换为数字类型）
      yearOnYearRank, // 同比排名
      stationRank, // 场站排名
    });

  }
  return windFarmData;
}

const rankFarmList = getFarmListRind();

const provincesList = newProvinces.map(pr => {
  return {
    label: pr.name,
    value: pr.code
  }
})


const appealCandinateData = [
  // 第一组：电量分类（重复出现）
  { category: '电量', indicator: '上网电量', indicatorType: '完整性', score: 98.1 },
  { category: '电量', indicator: '发电量', indicatorType: '一致性', score: 81.1 },
  { category: '电量', indicator: '上网电量', indicatorType: '准确性', score: 92.3 },
  { category: '电量', indicator: '发电量', indicatorType: '完整性', score: 85.7 },
  { category: '电量', indicator: '厂用电率', indicatorType: '唯一性', score: 78.9 },
  { category: '电量', indicator: '上网电量', indicatorType: '有效性', score: 95.2 },
  { category: '电量', indicator: '发电量', indicatorType: '准确性', score: 88.4 },
  { category: '电量', indicator: '厂用电率', indicatorType: '一致性', score: 76.5 },
  { category: '电量', indicator: '上网电量', indicatorType: '唯一性', score: 90.6 },
  { category: '电量', indicator: '发电量', indicatorType: '有效性', score: 83.8 },
  // 第二组：电压分类（重复出现）
  { category: '电压', indicator: '母线电压', indicatorType: '完整性', score: 91.2 },
  { category: '电压', indicator: '线路电压', indicatorType: '一致性', score: 86.3 },
  { category: '电压', indicator: '母线电压', indicatorType: '准确性', score: 93.5 },
  { category: '电压', indicator: '线路电压', indicatorType: '完整性', score: 89.7 },
  { category: '电压', indicator: '变压器电压', indicatorType: '唯一性', score: 79.1 },
  { category: '电压', indicator: '母线电压', indicatorType: '有效性', score: 94.8 },
  { category: '电压', indicator: '线路电压', indicatorType: '准确性', score: 87.2 },
  { category: '电压', indicator: '变压器电压', indicatorType: '一致性', score: 77.4 },
  { category: '电压', indicator: '母线电压', indicatorType: '唯一性', score: 91.9 },
  { category: '电压', indicator: '线路电压', indicatorType: '有效性', score: 84.6 },
  // 第三组：电流分类（重复出现）
  { category: '电流', indicator: '负载电流', indicatorType: '完整性', score: 90.3 },
  { category: '电流', indicator: '零序电流', indicatorType: '一致性', score: 82.5 },
  { category: '电流', indicator: '负载电流', indicatorType: '准确性', score: 92.7 },
  { category: '电流', indicator: '零序电流', indicatorType: '完整性', score: 86.9 },
  { category: '电流', indicator: '短路电流', indicatorType: '唯一性', score: 80.2 },
  { category: '电流', indicator: '负载电流', indicatorType: '有效性', score: 93.1 },
  { category: '电流', indicator: '零序电流', indicatorType: '准确性', score: 85.4 },
  { category: '电流', indicator: '短路电流', indicatorType: '一致性', score: 78.3 },
  { category: '电流', indicator: '负载电流', indicatorType: '唯一性', score: 89.5 },
  { category: '电流', indicator: '零序电流', indicatorType: '有效性', score: 81.7 },
  // 第四组：功率分类（重复出现）
  { category: '功率', indicator: '有功功率', indicatorType: '完整性', score: 96.4 },
  { category: '功率', indicator: '无功功率', indicatorType: '一致性', score: 88.6 },
  { category: '功率', indicator: '有功功率', indicatorType: '准确性', score: 94.2 },
  { category: '功率', indicator: '无功功率', indicatorType: '完整性', score: 87.8 },
  { category: '功率', indicator: '视在功率', indicatorType: '唯一性', score: 81.4 },
  { category: '功率', indicator: '有功功率', indicatorType: '有效性', score: 97.3 },
  { category: '功率', indicator: '无功功率', indicatorType: '准确性', score: 89.1 },
  { category: '功率', indicator: '视在功率', indicatorType: '一致性', score: 79.6 },
  { category: '功率', indicator: '有功功率', indicatorType: '唯一性', score: 95.5 },
  { category: '功率', indicator: '无功功率', indicatorType: '有效性', score: 84.9 },
  // 第五组：回到电量分类（继续重复）
  { category: '电量', indicator: '上网电量', indicatorType: '完整性', score: 92.8 },
  { category: '电量', indicator: '发电量', indicatorType: '一致性', score: 83.2 },
  { category: '电量', indicator: '厂用电率', indicatorType: '准确性', score: 77.9 },
  { category: '电量', indicator: '上网电量', indicatorType: '唯一性', score: 91.4 },
  { category: '电量', indicator: '发电量', indicatorType: '有效性', score: 86.5 },
  { category: '电压', indicator: '母线电压', indicatorType: '完整性', score: 93.7 },
  { category: '电压', indicator: '线路电压', indicatorType: '一致性', score: 85.1 },
  { category: '电流', indicator: '负载电流', indicatorType: '准确性', score: 90.8 },
  { category: '功率', indicator: '有功功率', indicatorType: '完整性', score: 96.7 },
  { category: '电量', indicator: '上网电量', indicatorType: '有效性', score: 94.3 }
].map((item, index) => ({
  ...item,
  key: `item_${index + 1}` // 生成格式：item_1、item_2...（也可以直接用index + 1作为key）
}))

// 获取数据质量 五个维度数据质量统计（完整性、一致性、唯一性、有效性、准确性）
const dataQualityStatistics = {
  "completeness": 0,
  "consistency": 0,
  "uniqueness": 0,
  "validity": 0,
  "accuracy": 0
}

// 场站总得分排名
const rankingTotalScore = [
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场1",
    "dq_ratio": 0.98765,
    "dq_score": 98.77
  },
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场2",
    "dq_ratio": 0.98765,
    "dq_score": 98.77
  },
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场3",
    "dq_ratio": 0.98765,
    "dq_score": 98.77
  },
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场4",
    "dq_ratio": 0.98765,
    "dq_score": 98.77
  },
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场5",
    "dq_ratio": 0.98765,
    "dq_score": 98.77
  },
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场6",
    "dq_ratio": 0.98765,
    "dq_score": 98.77
  }
]

// 场站总得分排名-同环比
const rankingTotalScoreCompare = [
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场",
    "province": "安徽",
    "current_dq_ratio": 0.98765,
    "current_dq_ranking": 0,
    "baseline_dq_ratio": 0.98765,
    "baseline_dq_ranking": 0,
    "current_dq_score": 98.77,
    "baseline_dq_score": 98.77
  },
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场",
    "province": "安徽",
    "current_dq_ratio": 0.98765,
    "current_dq_ranking": 0,
    "baseline_dq_ratio": 0.98765,
    "baseline_dq_ranking": 0,
    "current_dq_score": 98.77,
    "baseline_dq_score": 98.77
  },
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场",
    "province": "安徽",
    "current_dq_ratio": 0.98765,
    "current_dq_ranking": 0,
    "baseline_dq_ratio": 0.98765,
    "baseline_dq_ranking": 0,
    "current_dq_score": 98.77,
    "baseline_dq_score": 98.77
  },
  {
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场",
    "province": "安徽",
    "current_dq_ratio": 0.98765,
    "current_dq_ranking": 0,
    "baseline_dq_ratio": 0.98765,
    "baseline_dq_ranking": 0,
    "current_dq_score": 98.77,
    "baseline_dq_score": 98.77
  },{
    "farm_id": "CN_12_N0001_W0001",
    "farm_name": "天津三峡海上风电场",
    "province": "安徽",
    "current_dq_ratio": 0.98765,
    "current_dq_ranking": 0,
    "baseline_dq_ratio": 0.98765,
    "baseline_dq_ranking": 0,
    "current_dq_score": 98.77,
    "baseline_dq_score": 98.77
  }
]

export {
  appealCandinateData,
  randomScores,
  countryScores,
  rankFarmList,
  provincesList,
  scores,
  dataQualityStatistics,
  rankingTotalScore,
  rankingTotalScoreCompare,
  farmList
}