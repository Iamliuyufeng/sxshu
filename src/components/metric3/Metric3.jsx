import React from 'react'
import './style.less'

export default ({
    label,
    unit,
    value,
    icon
}) => {
    return <div className='sx-metric-3'>
        <img src={icon}></img>
        <div className="metric-content">
            <div className="label-unit">
                <div className="label">{label}</div>
                <div className="unit">{unit}</div>
            </div>
            <div className='value'>
            {value}
            </div>
        </div>
    </div>
}