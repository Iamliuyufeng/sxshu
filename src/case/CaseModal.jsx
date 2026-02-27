import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Space, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const CreateModal = ({
    title = '创建',
    fields = [{
        type: 'input',
        name: 'caseName',
        label: '案例名称', // 补充label字段，用于表单标签
        required: true,
        placeholder: '请输入案例名称' // 可选占位符
    }, {
        type: 'select',
        name: 'province',
        label: '省份',
        options: [{ label: '北京', value: '北京' }],
        required: true,
        placeholder: '请选择省份'
    }, {
        type: 'file',
        name: 'attachment',
        label: '附件',
        required: false,
        tip: '支持上传任意格式文件' // 可选提示
    }],
    onConfirm, // 提交成功后的回调，返回表单数据
    visible,
    onClose // 关闭对话框的回调
}) => {
    // 初始化Antd Form实例（用于校验和取值）
    const [form] = Form.useForm();
    // 控制文件上传加载状态
    const [uploadLoading, setUploadLoading] = useState(false);

    // 对话框关闭时重置表单
    useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible, form]);

    // 自定义文件上传逻辑
    const handleFileUpload = async (file) => {
        setUploadLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file); // 匹配后端接收的key：file

            const response = await axios.post(
                `${NODE_API_PREFIX}/sxfile/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 30000
                }
            );
            if (response.data.result === 'ok') {
                // 上传成功后，把文件路径回写到表单字段中
                const { filePath } = response.data;
                form.setFieldsValue({
                    [fields.find(item => item.type === 'file')?.name]: filePath
                });
                message.success('文件上传成功！');
                return { status: 'done', url: filePath }; // 告诉Upload组件上传完成
            } else {
                message.error(`上传失败：${response.data.message}`);
                return { status: 'error' };
            }
        } catch (error) {
            message.error(`上传失败：${error.message || '服务器异常'}`);
            console.error('文件上传错误：', error);
            return { status: 'error' };
        } finally {
            setUploadLoading(false);
        }
    };

    // 表单提交处理
    const handleOk = async () => {
        try {
            // 执行表单校验
            const formData = await form.validateFields();
            // 通过onConfirm返回表单数据给父组件
            console.log(formData);
            if (typeof onConfirm === 'function') {
                onConfirm(formData);
            }
            // 校验通过后可选择关闭对话框（也可由父组件控制）
            onClose?.();
        } catch (errorInfo) {
            // 校验失败时提示
            message.error('表单填写不完整，请检查必填项！');
            console.error('表单校验失败：', errorInfo);
        }
    };

    // 关闭对话框
    const handleCancel = () => {
        form.resetFields();
        onClose?.();
    };

    // 渲染不同类型的表单控件
    const renderFormItem = (item) => {
        const { type, name, label, required, placeholder, options, tip } = item;
        switch (type) {
            case 'input':
                return (
                    <Form.Item
                        key={name}
                        name={name}
                        label={label}
                        rules={[{ required, message: `请输入${label}` }]}
                        tooltip={tip}
                    >
                        <Input placeholder={placeholder} />
                    </Form.Item>
                );
            case 'select':
                return (
                    <Form.Item
                        key={name}
                        name={name}
                        label={label}
                        rules={[{ required, message: `请选择${label}` }]}
                        tooltip={tip}
                    >
                        <Select
                            placeholder={placeholder}
                            options={options || []}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                );
            case 'file':
                return (
                    <Form.Item
                        key={name}
                        name={name}
                        label={label}
                        rules={required ? [{ required, message: `请上传${label}` }] : []}
                        tooltip={tip}
                    >
                        <Upload
                            name={name}
                            customRequest={({ file }) => handleFileUpload(file)}
                            showUploadList={{ showPreviewIcon: false }}
                            beforeUpload={() => false} // 阻止自动上传
                            fileList={form.getFieldValue(name) ? [{
                                uid: '1',
                                name: '已上传文件',
                                status: 'done',
                                url: form.getFieldValue(name)
                            }] : []}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                loading={uploadLoading}
                                type="primary"
                            >
                                点击上传文件
                            </Button>
                        </Upload>
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            title={title}
            width={980}
            open={visible}
            onCancel={handleCancel}
            footer={null} // 隐藏默认footer，自定义
            destroyOnClose // 关闭时销毁组件，避免缓存
        >
            <Form
                form={form}
                layout='horizontal' // 垂直布局，更适合多字段
                colon={false} // 去掉label后的冒号（可选）
            >
                <div className='create-modal' style={{ height: '560px', overflowY: 'auto' }}>
                    {fields.map((item) => renderFormItem(item))}
                </div>

                {/* 自定义底部按钮 */}
                <Space style={{ marginTop: 20, textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleCancel} type="reset">
                        取消
                    </button>
                    <button onClick={handleOk}>
                        保存
                    </button>
                </Space>
            </Form>
        </Modal>
    );
};

export default CreateModal;