// src/api/jsonStorageApi.js
import { getNodeRequestUrl } from './utils';
/**
 * JSON 存储服务接口工具类
 * 封装所有对接后端 JSONStorageService 的请求方法
 */

// 基础请求配置
const BASE_URL = ''; // 根据实际后端接口前缀调整

/**
 * 通用请求方法
 * @param {string} url - 请求地址
 * @param {string} method - 请求方法 GET/POST/DELETE
 * @param {object} data - 请求参数
 * @returns {Promise} 请求结果
 */
const request = async (url, method = 'GET', data = {}) => {
  try {
    let options = {
      method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };

    // 处理不同请求方法的参数传递
    if (method === 'GET' || method === 'DELETE') {
      // GET/DELETE 参数拼接到 URL
      const params = new URLSearchParams(data);
      url = `${url}?${params.toString()}`;
    } else {
      // POST/PUT 参数放在 body
      options.body = JSON.stringify(data);
    }

    const response = await fetch(getNodeRequestUrl(url), options);
    const result = await response.json();

    // 统一处理接口响应
    if (result.code !== 200) {
      throw new Error(result.message || '请求失败');
    }
    return result.data
  } catch (error) {
    console.error(`请求 ${url} 失败：`, error);
    throw error; // 抛出错误让页面处理
  }
};

/**
 * 写入 JSON 数据到后端
 * @param {string} key - JSON 文件名（不含后缀）
 * @param {object} data - 要存储的 JSON 数据
 * @returns {Promise}
 */
export const setJSON = (key, data) => {
  return request('/json/set', 'POST', { key, data });
};

/**
 * 从后端读取 JSON 数据
 * @param {string} key - JSON 文件名（不含后缀）
 * @returns {Promise}
 */
export const getJSON = async (key) => {
  return request('/json/get', 'GET', { key });
};

/**
 * 删除后端的 JSON 文件
 * @param {string} key - JSON 文件名（不含后缀）
 * @returns {Promise}
 */
export const deleteJSON = (key) => {
  return request('/json/delete', 'DELETE', { key });
};

/**
 * 下载 JSON 文件到本地
 * @param {string} key - JSON 文件名（不含后缀）
 * @param {object} data - JSON 数据（可选，不传则先从后端读取）
 */
export const downloadJSON = async (key, data) => {
  try {
    // 如果没传 data，先从后端读取
    const jsonData = data || (await getJSON(key)).data;
    // 转换为 JSON 字符串并格式化
    const jsonStr = JSON.stringify(jsonData, null, 2);
    // 创建 Blob 对象
    const blob = new Blob([jsonStr], { type: 'application/json' });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${key}.json`;
    document.body.appendChild(a);
    a.click();
    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true, message: '下载成功' };
  } catch (error) {
    console.error('下载 JSON 文件失败：', error);
    throw new Error('下载失败：' + error.message);
  }
};

// 默认导出所有方法，方便批量导入
export default {
  setJSON,
  getJSON,
  deleteJSON,
  downloadJSON,
};