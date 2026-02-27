// src/pages/JSONStoragePage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Input, message, Card, Space, Typography, Divider } from 'antd';
import jsonStorageApi from '../utils/jsonclient';

const { TextArea } = Input
const { Title, Text } = Typography;

const JSONStoragePage = () => {
  // 状态管理
  const [key, setKey] = useState(''); // JSON 文件名（key）
  const [jsonData, setJsonData] = useState(''); // 输入的 JSON 字符串
  const [loading, setLoading] = useState(false); // 加载状态

  // 校验输入的 JSON 格式是否合法
  const validateJSON = (str) => {
    if (!str) return { valid: false, message: 'JSON 数据不能为空' };
    try {
      JSON.parse(str);
      return { valid: true };
    } catch (error) {
      return { valid: false, message: 'JSON 格式错误：' + error.message };
    }
  };

  // 写入 JSON 到后端
  const handleSetJSON = async () => {
    if (!key) {
      message.warning('请输入 JSON 文件名（key）');
      return;
    }
    const validateResult = validateJSON(jsonData);
    if (!validateResult.valid) {
      message.error(validateResult.message);
      return;
    }

    try {
      setLoading(true);
      const data = JSON.parse(jsonData);
      await jsonStorageApi.setJSON(key, data);
      message.success('JSON 数据写入成功');
    } catch (error) {
      message.error('写入失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 从后端读取 JSON
  const handleGetJSON = async () => {
    if (!key) {
      message.warning('请输入 JSON 文件名（key）');
      return;
    }

    try {
      setLoading(true);
      const result = await jsonStorageApi.getJSON(key);
      // 格式化 JSON 显示
      setJsonData(JSON.stringify(result.data, null, 2));
      message.success('JSON 数据读取成功');
    } catch (error) {
      message.error('读取失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 删除后端的 JSON 文件
  const handleDeleteJSON = async () => {
    if (!key) {
      message.warning('请输入 JSON 文件名（key）');
      return;
    }

    try {
      setLoading(true);
      await jsonStorageApi.deleteJSON(key);
      message.success('JSON 文件删除成功');
      // 清空输入框
      setJsonData('');
    } catch (error) {
      message.error('删除失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 下载 JSON 文件到本地
  const handleDownloadJSON = async () => {
    if (!key) {
      message.warning('请输入 JSON 文件名（key）');
      return;
    }

    try {
      setLoading(true);
      await jsonStorageApi.downloadJSON(key);
      message.success('JSON 文件下载成功');
    } catch (error) {
      message.error('下载失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2}>JSON 数据存储管理</Title>
      <Card bordered={true} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Text strong>JSON 文件名（Key）：</Text>
          <Input
            placeholder="请输入 JSON 文件名（不含 .json 后缀）"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={{ width: '300px', marginTop: '8px' }}
          />
        </div>

        <Divider orientation="left">JSON 数据内容</Divider>
        <TextArea
          placeholder="请输入合法的 JSON 数据"
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          rows={15}
          style={{ width: '100%', marginBottom: '16px' }}
          autoSize={{ minRows: 15, maxRows: 20 }}
        />

        <Space size="middle">
          <Button
            type="primary"
            onClick={handleSetJSON}
            loading={loading}
            disabled={!key}
          >
            写入 JSON 到后端
          </Button>
          <Button
            type="default"
            onClick={handleGetJSON}
            loading={loading}
            disabled={!key}
          >
            从后端读取 JSON
          </Button>
          <Button
            type="default"
            onClick={handleDownloadJSON}
            loading={loading}
            disabled={!key}
          >
            下载 JSON 到本地
          </Button>
          <Button
            type="danger"
            onClick={handleDeleteJSON}
            loading={loading}
            disabled={!key}
          >
            删除后端 JSON 文件
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default JSONStoragePage;