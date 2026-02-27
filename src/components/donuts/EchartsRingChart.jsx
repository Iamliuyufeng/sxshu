import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

// 封装的环形图组件
const EchartsRingChart = ({
  // 容器样式（如宽高）
  style = { width: '100%', height: '400px' },
  // 环形图数据：格式为 [{ name: '名称', value: 数值 }, ...]
  data = [],
  // 环形图颜色数组：与数据项一一对应
  colors = ['#00AAFF', '#F6BD16'],
  // 环形图内半径（如'40%'）
  innerRadius = '60%',
  // 环形图外半径（如'80%'）
  outerRadius = '80%',
  // 背景图片地址（可选）
  bgImageUrl = '',
  // 背景图片缩放比例（可选，0-1之间，根据需求调整）
  bgImageScale = 0.5,
  // 环形图文本样式配置（可选）
  labelConfig = {
    show: false,
    position: 'center'
  },
    // 是否显示提示框（可选）
  showTooltip = true,
   // 自定义提示框格式（可选）
  tooltipFormatter = null
}) => {
  // 生成ECharts配置项（使用useMemo缓存，避免频繁重渲染）
  const getOption = useMemo(() => {

     // 默认的提示框格式化函数
    const defaultFormatter = (params) => {
       if (!params) return '';
      
      const { color, name, value, percent, data: dataItem } = params;
      return `
        <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0;">
          <div style="width: 12px; height: 12px; background-color: ${color}; border-radius: 2px;"></div>
          <span style="font-weight: bold;">${name}:</span>
          <span>${value}</span>
          <span style="color: #dfdfdfff;">(${percent}%)</span>
        </div>
      `;
    };

    const option = {
      // 配置提示框
      tooltip: {
        show: showTooltip,
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 0,
        padding: [8, 12],
        textStyle: {
          color: '#FFF',
          fontSize: 12,
        },
        // 添加阴影
        // extraCssText: 'box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);',
        // 使用自定义或默认的格式化函数
        formatter: tooltipFormatter || defaultFormatter,
      },
      // 隐藏图例（核心：移除多余元素）
      legend: {
        show: false,
      },
      labelLine: {
        show: false
      },
      series: [
        {
          name: '数据统计',
          type: 'pie',
          // 环形图的核心：radius设置内/外半径
          radius: [innerRadius, outerRadius],
          // 取消饼图的偏移（保证中心对齐）
          center: ['50%', '50%'],
          // 数据
          data: data,
          // 颜色
          color: colors,
          // 文本标签配置
            //   label: labelConfig,
          // 取消高亮时的偏移（可选）
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          // 隐藏说明文字（标签）
          label: {
            show: false, // 无论如何都不显示标签文字
          },
          clockwise: false,
          // 隐藏向外引出的连线
          labelLine: {
            show: false, // 无论如何都不显示引出线
          },
          // 关闭选中效果（可选）
          select: {
            disabled: true,
          },
        },
      ],
      // 图形元素：用于添加背景图片
      graphic: [],
    };

    // 如果传入了背景图片地址，添加graphic元素
    if (bgImageUrl) {
      // 计算图片的宽高（基于容器的宽高比例，这里取环形图外半径的比例）
      // 核心：让图片中心与环形图中心（50%,50%）对齐
      option.graphic.push({
        // 元素类型：图片
        type: 'image',
        // 图片地址
        style: {
          image: bgImageUrl,
          // 图片宽高：基于缩放比例和容器尺寸（这里用百分比更适配）
          width: `${parseFloat(outerRadius) * bgImageScale * 2}%`,
          height: `${parseFloat(outerRadius) * bgImageScale * 2}%`,
        },
        // 定位：中心与环形图中心对齐（关键配置）
        left: '50%',
        top: '50%',
        // 偏移：让图片的中心（而非左上角）与left/top的位置对齐
        origin: ['50%', '50%'],
      });
    }

    return option;
  }, [data, colors, innerRadius, outerRadius, bgImageUrl, bgImageScale, labelConfig]);

  return (
    <ReactECharts
      // 传入ECharts实例（必须，否则可能报错）
      echarts={echarts}
      // 配置项
      option={getOption}
      // 容器样式
      style={style}
      // 可选：开启响应式（窗口大小变化时重绘）
      responsive={true}
    />
  );
};

export default EchartsRingChart;