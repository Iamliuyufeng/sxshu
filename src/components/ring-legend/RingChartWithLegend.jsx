import React, { useEffect, useRef, memo } from 'react';
import * as echarts from 'echarts';

// 环形图组件（修复背景图显示问题）
const RingChartWithLegend = memo((props) => {
  const {
    data = [],
    centerImgUrl = '',
    height = 400
  } = props;

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // 初始化ECharts实例
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 处理数据
    const seriesData = data.map(item => ({
      name: item.name,
      value: item.value
    }));
    const colors = data.map(item => item.color);

    // ECharts配置项（核心修复：将graphic移到全局配置，而非series内部）
    const option = {
      backgroundColor: '#101827',
      // 全局graphic配置：环形图中心背景图（关键修复点）
      graphic: {
        elements: [
          {
            type: 'image',
            z: 100, // 提高层级，避免被环形图覆盖（加大z值）
            // 定位：与环形图中心（25%，50%）完全重合
            left: '25%',
            top: '50%',
            // 偏移：让图片中心与定位点重合（关键！原position方式易偏移）
            origin: ['50%', '50%'],
            style: {
              image: centerImgUrl,
              width: 80, // 正方形图片宽度
              height: 80, // 正方形图片高度
              // 可选：添加背景色，测试是否定位成功（调试用，可删除）
              // backgroundColor: 'rgba(255,0,0,0.5)'
            }
          }
        ]
      },
      // 图例配置（无变化）
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 0,
        top: 'center',
        formatter: function (name) {
          const item = data.find(i => i.name === name);
          const value = item ? item.value : 0;
          return `{square| }{name|${name}}{value|${value}}`;
        },
        textStyle: {
          rich: {
            square: {
              width: 12,
              height: 12,
              backgroundColor: function (params) {
                const item = data.find(i => i.name === params.name);
                return item ? item.color : '#fff';
              },
              margin: [0, 8, 0, 0]
            },
            name: {
              color: '#fff',
              fontSize: 14,
              margin: [0, 16, 0, 0]
            },
            value: {
              color: '#65BBE8',
              fontSize: 14
            }
          }
        },
        pageIconSize: 12,
        pageTextStyle: { color: '#65BBE8' },
        itemWidth: 120,
        itemHeight: 24,
        pageButtonItemGap: 5,
        pageButtonGap: 10,
        maxHeight: height,
        data: data.map(item => item.name),
        padding: 0
      },
      // 环形图系列配置（移除内部的graphic）
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['25%', '50%'], // 与背景图定位一致
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: { label: { show: false } },
          labelLine: { show: false },
          data: seriesData,
          itemStyle: {
            color: function (params) {
              return colors[params.dataIndex];
            },
            borderWidth: 2,
            borderColor: '#101827'
          }
        }
      ]
    };

    // 渲染图表
    if (chartInstance.current) {
      chartInstance.current.setOption(option, true);
    }

    // 窗口自适应
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      chartInstance.current?.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, centerImgUrl, height]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: `${height}px`,
        padding: 0,
        margin: 0,
        overflow: 'hidden'
      }}
    />
  );
});

export default RingChartWithLegend;