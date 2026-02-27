import React from 'react';
import './ProgressBar.css';

/**
 * 渐变色进度条组件
 * @param {number} value - 进度值（1-100，超出范围会被限制在1-100）
 * @param {string} gradientStart - 渐变起始颜色（默认：#11AB84）
 * @param {string} gradientMid - 渐变中间颜色（默认：#F6BD16）
 * @param {string} gradientEnd - 渐变结束颜色（默认：#FF6400）
 * @param {number} height - 进度条高度（默认：20px）
 * @returns {JSX.Element} 进度条组件
 */
const ProgressBar = ({
  value,
  gradientStart = '#0082FD',
  gradientEnd = '#00FADE',
  height = 8,
}) => {
  // 限制进度值在1-100之间
  const progress = Math.max(1, Math.min(100, Number(value) || 0));
  // 计算进度条宽度占比（%）
  const progressWidth = `${progress}%`;
  // 计算箭头的水平位置（需减去箭头自身的一半宽度，使其居中在进度位置）
  const arrowLeft = `calc(${progressWidth} - 6px)`; // 6px是箭头宽度的一半（箭头宽12px）

  return (
    <div className="progress-bar-container" style={{ '--bar-height': `${height}px` }}>
      {/* 进度条背景容器 */}
      <div className="progress-bar-bg">
        {/* 动态进度条（渐变色） */}
        <div
          className="progress-bar-fill"
          style={{
            width: progressWidth,
            background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          }}
        />
      </div>
      {/* 进度箭头（绝对定位） */}
      <div
        className="progress-arrow"
        style={{
          left: arrowLeft,
          // 箭头的垂直位置：进度条下方，与进度条间距4px
          top: `calc(var(--bar-height) + 4px)`,
        }}
      />
      {/* 可选：进度数值显示（可根据需求隐藏） */}
      {/* <div
        className="progress-value"
        style={{
          left: arrowLeft,
          top: `calc(var(--bar-height) + 16px)`, // 箭头下方显示数值
        }}
      >
        {progress}%
      </div> */}
    </div>
  );
};

export default ProgressBar;