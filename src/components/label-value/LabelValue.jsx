import React from 'react'

export default ({
  label,
  labelWidth = 70,
  value
}) => {
  return (
    <div style={{
      display: 'flex'
    }}
    >
      <div style={{
        width: labelWidth,
        color: 'rgba(255,255,255,0.6)',
        fontSize: '14'
      }}
      >{label}
      </div>
      <div style={{
        color: ' #FFFFFF',
        fontSize: '14'
      }}
      >{value}
      </div>
    </div>
  )
}
