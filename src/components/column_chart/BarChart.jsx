import React, { useEffect, useRef, memo } from 'react';
import * as echarts from 'echarts';

/**
 * 基于ECharts的React柱状图组件（无圆角+Y轴单位+自定义最大值+X轴标签间距）
 * @param {Object} props - 组件属性
 * @param {Array} props.xData - X轴数据（如['风电场1', '风电场2', ...]）
 * @param {Array} props.seriesData - 系列数据（如[100, 99, 98, ...]）
 * @param {number} [props.barWidth] - 柱宽（像素或百分比，如20、'30%'）
 * @param {Object} [props.gradientColor] - 渐变色配置（start: 起始颜色, end: 结束颜色）
 * @param {string} [props.seriesName] - 系列名称（可扩展）
 * @param {number} [props.height=400] - 图表高度（像素）
 * @param {string} [props.yAxisUnit='个'] - Y轴单位（如“个”、“分”、“MW”）
 * @param {number} [props.yAxisMax] - Y轴最大值（不传则自动计算）
 * @returns {React.Element} 柱状图组件
 */
const BarChart = memo(({
  xData = [],
  seriesData = [],
  barWidth = 20, // 默认柱宽20像素
  gradientColor = {
    start: '#0C609E',
    end: '#2AB4EB'
  },
  seriesName = '数据',
  height = 400,
  yAxisUnit = '个', // Y轴单位默认值
  yAxisMax // Y轴最大值（可选）
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // 初始化ECharts实例
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      // 设置实例背景为透明
      chartInstance.current.setOption({
        backgroundColor: 'transparent'
      });
    }

    // 生成柱状图渐变色（从上到下）
    const colorGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: gradientColor.start },
      { offset: 1, color: gradientColor.end }
    ]);

    // 统一的轴标签颜色（复用变量，便于维护）
    const axisLabelColor = '#65BBE8';
    // 网格线颜色
    const splitLineColor = '#4983CF';
    // X轴标签与坐标轴的距离（5px）
    const xAxisLabelMargin = 5;

    // ECharts配置项
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 0,
        padding: [8, 12],
        textStyle: {
          color: '#FFF',
          fontSize: 12,
        },
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: false // 隐藏图例
      },
      // 无间距配置：让图表顶满容器
      grid: {
        left: 0,    // 左间距设为0
        right: 0,   // 右间距设为0
        top: 40,     // 上间距设为0
        bottom: 0,  // 下间距设为0
        containLabel: true // 保证标签不被裁剪
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisTick: {
          alignWithLabel: true,
          // X轴刻度线颜色统一
          lineStyle: {
            color: axisLabelColor
          }
        },
        // X轴标签配置：颜色+5px间距
        axisLabel: {
          color: axisLabelColor,
          margin: xAxisLabelMargin // 标签与坐标轴的距离设为5px（核心）
        },
        // X轴轴线颜色
        axisLine: {
          lineStyle: {
            color: axisLabelColor
          }
        }
      },
      yAxis: {
        type: 'value',
        // Y轴最大值配置：传了则用指定值，否则自动计算
        max: yAxisMax,
        // Y轴单位配置：通过name添加单位，显示在轴上方
        name: yAxisUnit,
        nameTextStyle: {
          color: axisLabelColor, // 单位文字颜色与轴标签一致
          padding: [0, 0, 0, 5] // 单位与Y轴的间距（可选，微调位置）
        },
        nameLocation: 'end', // 单位显示位置：end（轴上方）/start（轴下方）
        // Y轴标签颜色
        axisLabel: {
          color: axisLabelColor,
          margin: 0 // 标签与轴线的距离设为0
        },
        // Y轴轴线颜色
        axisLine: {
          lineStyle: {
            color: splitLineColor
          }
        },
        // 横向刻度线（Y轴网格线）：虚线+颜色#4983CF
        splitLine: {
          show: true,
          lineStyle: {
            color: splitLineColor,
            type: 'dashed' // 虚线
          }
        }
      },
      series: [
        {
          name: seriesName,
          type: 'bar',
          barWidth: barWidth,
          data: seriesData,
          // 柱状图样式：仅保留渐变色，移除圆角配置（核心修改）
          itemStyle: {
            color: colorGradient
            // 删掉了原有的borderRadius: 4，实现无圆角效果
          }
        }
      ]
    };

    // 设置配置项渲染图表
    if (chartInstance.current) {
      chartInstance.current.setOption(option, true);
    }

    // 窗口resize自适应
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [xData, seriesData, barWidth, gradientColor, seriesName, height, yAxisUnit, yAxisMax]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0
      }}
    />
  );
});

export default BarChart;