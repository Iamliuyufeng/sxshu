// src/components/GlobalPopoverQuality.jsx
import React, { useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import globalStore from '../store/globals'
import { Button } from 'antd';

// 独立的全局浮层组件
const GlobalPopoverQuality = ({
  visible,
  position,
  clickedRecord,
  clickedObject,
  getCssAlignedGradientColor,
  onClose // 外部传递的关闭浮层方法
}) => {
  const elRef = useRef(null);
  // 浮层偏移量（原逻辑中的10px）

  const userProvinces = globalStore(state => state.userProvinces)

  const offset = 10;
  // 浮层的预估高度（如果浮层内容不固定，可后续用getBoundingClientRect获取实际高度）
  const popoverEstimatedHeight = 110; // 可根据实际样式调整这个值

  // 动态计算浮层的位置（使用useMemo缓存，仅当position/visible变化时重新计算）
  const popoverStyle = useMemo(() => {
    if (!visible || !position) {
      return {};
    }

    // 获取视口高度
    const viewportHeight = window.innerHeight;
    // 计算浮层显示在下方时的底部位置
    const bottomPositionWhenBelow = position.y + offset + popoverEstimatedHeight;
    // 计算浮层的最终位置
    let top, left;

    if (bottomPositionWhenBelow > viewportHeight) {
      // 超出视口底部，显示在点击位置上方
      top = position.y - popoverEstimatedHeight - offset;
    } else {
      // 未超出，显示在点击位置下方
      top = position.y + offset;
    }
    left = position.x;

    return {
      position: 'absolute',
      top: `${top}px`, // 改为px单位，避免位置偏移
      left: `${left}px`,
      // 可选：限制浮层的最大宽度，避免超出右侧视口（若需要）
      // maxWidth: '300px',
    };
  }, [visible, position]);

  // 【可选】更精准的方式：获取浮层实际高度（适合内容不固定的场景）
  // 注意：需要在浮层渲染后获取，所以用useEffect
  // useEffect(() => {
  //   if (visible && elRef.current) {
  //     const actualHeight = elRef.current.getBoundingClientRect().height;
  //     // 这里可以重新计算位置，需要添加状态来存储actualHeight
  //     console.log('浮层实际高度：', actualHeight);
  //   }
  // }, [visible]);

  // 全局点击事件处理函数
  const handleClickOutside = (e) => {
    if (elRef.current && visible && !elRef.current.contains(e.target)) {
      onClose(); // 调用外部的关闭方法
    }
  };

  // 绑定/解绑全局事件
  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // 组件卸载时清理事件
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  if (!visible) return null;

  // 挂载到body
  return createPortal(
    <div
      className='global-popover-quality'
      ref={elRef}
      style={popoverStyle} // 使用动态计算的样式
    >
      <div className='name'>{clickedRecord.name || ''}</div>
      <div className='values'>
        <div className='box' style={{
          backgroundColor: getCssAlignedGradientColor(clickedObject[1] || 0)
        }}></div>
        <div>{clickedObject[0] || ''}</div>
        <div className='value'>{clickedObject[1] || 0}%</div>
      </div>
      <div className='actions'>
        <Button disabled={userProvinces.indexOf(clickedRecord.name) === -1 } onClick={() => {
           onClose(true);
        }}>申诉</Button>
      </div>
    </div>,
    document.body
  );
};

export default GlobalPopoverQuality;