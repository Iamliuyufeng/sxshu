import React from 'react';

const RingLegend = ({
  color,
  label,
  value
}) => {
  return <div className='ring-legend'>
    <div className='indicator'>
      <div className='box' style={{backgroundColor: color}}></div>
      <div className='label'>{label}</div>
    </div>
    <div className='value'>{value}</div>
  </div>
};

export default RingLegend;