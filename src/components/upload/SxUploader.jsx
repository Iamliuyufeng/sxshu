import React, { useState } from 'react'
import { Upload, Button, Space } from 'antd'
import { DeleteOutlined, UploadOutlined  } from '@ant-design/icons'
import axios from 'axios';
import { getNodeRequestUrl, formatIsoToDate, getFileNameFromPath } from '../../utils/utils'

const SxUploader = ({
    value,
    onChange
}) => {
    const [loading, setLoading] = useState(false);
    const deleteCurrentFile = () => {
        onChange('')
    }
    
    // 自定义上传逻辑（核心）
    const handleUpload = async (file) => {
        setLoading(true);
        try {
            // 1. 创建 FormData（适配后端接收文件的格式）
            const formData = new FormData();
            // 注意：后端 ctx.request.files.file 对应 key 是 "file"，需保持一致
            formData.append('file', file.file);

            // 2. 调用后端上传接口 /sxfile/upload
            const response = await axios.post(getNodeRequestUrl('/sxfile/upload'), formData, {
                headers: {
                    // 必须设置 Content-Type 为 multipart/form-data（FormData 自动处理）
                    'Content-Type': 'multipart/form-data',
                },
                // 可选：设置上传超时（比如30秒）
                timeout: 100000,
            });

            // 3. 解析后端返回结果（匹配你 Koa 接口的返回格式）
            if (response.data.result === 'ok') {
                const { relativePath: uploadFilePath } = response.data;
                onChange(uploadFilePath)
                // setCurrentEditFile(uploadFilePath); // 保存文件路径
            } else {
                message.error(`上传失败：${response.data.message}`);
            }
        } catch (error) {
            // 异常处理（网络错误/接口报错）
            message.error(`上传失败：${error.message || '服务器异常'}`);
            console.error('上传错误：', error);
        } finally {
            setLoading(false);
        }
    };

    if (value) {
        return <Space>
            <Button type='link'>{getFileNameFromPath(value)}</Button>
            <Button type='link' onClick={deleteCurrentFile} icon={<DeleteOutlined/>}></Button> 
        </Space>
    } else {
        return <Upload
            showUploadList={false}
            name="file" // 与后端接收的 key 保持一致（file）
            customRequest={handleUpload} // 自定义上传逻辑（替代默认上传）
        >
            <Button loading={loading} icon={<UploadOutlined />} type="link">上传文件</Button>
        </Upload>
    }
}

export default SxUploader