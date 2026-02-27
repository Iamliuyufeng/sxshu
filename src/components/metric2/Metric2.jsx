import React from 'react'
import './style.less'

export default ({
    value,
    tagValue,
    tagUnit
}) => {
    return <div className='sx-metric-2'>
        <div className='sx-label'>{value}</div>
        <div className='sx-tag'>
            <div className='sx-tag-value'>{tagValue}</div>
            <div className='sx-tag-unit'>{tagUnit}</div>
        </div>
    </div>
}