import React from 'react'
import './style.css'

export default ({
    label,
    value,
    style
}) => {
    return <div className='sx-metric-1'>
        <div className='sx-label'>{label}</div>
        <div className='sx-value'>{value}</div>
    </div>
}