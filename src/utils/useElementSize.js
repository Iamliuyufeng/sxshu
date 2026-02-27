import { useState, useEffect, useCallback } from 'react';

/**
 * 进阶版Hook：获取元素宽高（监听元素自身尺寸变化+窗口resize）
 * @param {React.RefObject<HTMLElement> | HTMLElement | null} target - 目标元素（Ref对象/直接传入DOM元素）
 * @returns {Object} 包含width和height的对象，初始为0
 */
export const useElementSize = (target) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  // 定义计算尺寸的函数，使用useCallback缓存
  const calculateSize = useCallback((element) => {
    if (element) {
      const { offsetWidth, offsetHeight } = element;
      setSize({
        width: offsetWidth,
        height: offsetHeight,
      });
    } else {
      // 元素不存在时重置为0
      setSize({ width: 0, height: 0 });
    }
  }, []);

  useEffect(() => {
    let element = null;
    // 处理传入的是Ref对象或直接是DOM元素的情况
    if (target && 'current' in target) {
      element = target.current;
    } else if (target instanceof HTMLElement) {
      element = target;
    }

    // 初始计算一次尺寸
    calculateSize(element);

    // 创建ResizeObserver实例，监听元素尺寸变化
    const resizeObserver = new ResizeObserver((entries) => {
      // entries是被监听元素的数组，取第一个即可
      if (entries[0]) {
        calculateSize(entries[0].target);
      }
    });

    // 若元素存在，开始监听
    if (element) {
      resizeObserver.observe(element);
    }

    // 清理函数：停止监听并销毁实例
    return () => {
      resizeObserver.disconnect();
    };
  }, [target, calculateSize]); // 依赖目标元素和计算函数

  return size;
};

/**
 * 改进版Hook：传入CSS选择器，获取元素宽高（处理元素动态存在/消失、尺寸变化）
 * @param {string} query - CSS选择器（如'.quality-table'、'#box'）
 * @param {number} [debounceDelay=0] - 防抖延迟（ms），默认0（不防抖）
 * @returns {Object} 包含width和height的对象，初始为0
 */
export const useElementSize2 = (query, debounceDelay = 0) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  // 防抖处理：缓存计算函数，减少频繁更新
  const calculateSize = useCallback(
    (element) => {
      if (element) {
        // 可选：根据需求替换为clientWidth/clientHeight、scrollWidth/scrollHeight
        const { offsetWidth, offsetHeight } = element;
        setSize({ width: offsetWidth, height: offsetHeight });
      } else {
        // 元素不存在时重置为0
        setSize({ width: 0, height: 0 });
      }
    },
    [debounceDelay]
  );

  // 封装防抖函数（内部实现，避免依赖外部库）
  const debouncedCalculateSize = useCallback(
    (element) => {
      let timer = null;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          calculateSize(element);
        }, debounceDelay);
      };
    },
    [calculateSize, debounceDelay]
  );

  useEffect(() => {
    // 存储当前的目标元素
    let targetElement = null;
    // 声明观察者实例（用于后续销毁）
    let resizeObserver = null;
    let mutationObserver = null;

    // 1. 查找元素的函数
    const findElement = () => {
      // querySelector返回第一个匹配的元素，若要多个可改用querySelectorAll（需调整逻辑）
      return document.querySelector(query);
    };

    // 2. 初始化/更新元素监听
    const initElementListener = () => {
      // 先销毁旧的ResizeObserver（避免重复监听）
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      // 查找最新的元素
      targetElement = findElement();
      // 计算初始尺寸
      calculateSize(targetElement);

      // 若元素存在，监听其尺寸变化
      if (targetElement) {
        resizeObserver = new ResizeObserver((entries) => {
          if (entries[0]) {
            calculateSize(entries[0].target);
          }
        });
        resizeObserver.observe(targetElement);
      }
    };

    // 3. 监听DOM变化：检测元素是否出现/消失（处理动态渲染）
    const initMutationObserver = () => {
      // 监听整个文档的DOM变化（可根据需求缩小监听范围，如document.body）
      mutationObserver = new MutationObserver((mutations) => {
        // 遍历DOM变化记录，判断是否影响目标元素
        const hasRelevantChange = mutations.some((mutation) => {
          // 检查新增/移除的节点，或节点属性变化（如class、style）
          return (
            mutation.addedNodes.length > 0 ||
            mutation.removedNodes.length > 0 ||
            mutation.type === 'attributes'
          );
        });

        if (hasRelevantChange) {
          // 重新检查元素并更新监听
          initElementListener();
        }
      });

      // 配置监听选项：监听子节点变化、属性变化
      mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'id'], // 只监听关键属性，提升性能
      });
    };

    // 初始化：先执行一次元素查找和监听
    initElementListener();
    // 启动DOM变化监听（处理元素动态渲染）
    initMutationObserver();

    // 兜底：监听窗口resize（防止极端情况尺寸未更新）
    const handleResize = debouncedCalculateSize(targetElement);
    window.addEventListener('resize', handleResize);

    // 清理函数：组件卸载时销毁所有观察者和事件监听
    return () => {
      // 销毁ResizeObserver
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      // 销毁MutationObserver
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      // 移除窗口resize监听
      window.removeEventListener('resize', handleResize);
      // 清除防抖定时器
      clearTimeout(handleResize.timer);
    };
  }, [query, calculateSize, debounceDelay, debouncedCalculateSize]);

  return size;
};