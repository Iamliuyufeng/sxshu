import React from 'react';
import BarChart from './BarChart';

const BarChartDemo = ({
    height,
    xData,
    yAxisUnit,
    seriesData
}) => {
  // 自定义渐变色（也可以使用默认值）
  const customGradient = {
    start: '#7BD2C6', // 起始色： DodgerBlue
    end: '#00DCFF'    // 结束色： LightSkyBlue
  };

  return (
    <div style={{ margin: '0 auto', padding: '20px'}}>
      {/* 使用柱状图组件，配置渐变色、柱宽等 */}
      <BarChart
        xData={xData}
        yAxisUnit={yAxisUnit}
        seriesData={seriesData}
        barWidth="24px" // 柱宽设为30%（也可以传数字，如25）
        gradientColor={customGradient} // 自定义渐变色
        height={height} // 自定义高度
      />
    </div>
  );
};

export default BarChartDemo;