import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Space, Select, Upload, Button, DatePicker, message } from 'antd';
import SxUploader from '../upload/SxUploader';

const FormModal = ({
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
    onFieldChange, // 接收字段值变化的回调，用于通知父组件更新fields
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
    
    // 统一处理表单字段变化（核心：替代subscribe，无需单个onChange）
    const handleFormValuesChange = (changedValues, allValues) => {
        // 1. 更新缓存的表单值
        // setFormValues(allValues); // 暂时注释掉，未使用的变量
        // 2. 遍历变化的字段，触发联动回调
        Object.keys(changedValues).forEach(fieldName => {
            // 找到当前变化字段的配置
            const fieldConfig = fields.find(item => item.name === fieldName);
            if (fieldConfig?.onChangeKey) {
                // 触发父组件回调：参数(联动标识, 字段名, 新值, 所有值)
                onFieldChange?.(
                    fieldConfig.onChangeKey,
                    fieldName,
                    changedValues[fieldName],
                    allValues
                );
            }
        });
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
                        initialValue={item.initialValue}
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
                        <SxUploader ></SxUploader>
                    </Form.Item>
                );
            // 新增date类型的表单项
            case 'date':
                return (
                    <Form.Item
                        key={name}
                        name={name}
                        label={label}
                        rules={[{
                            required,
                            message: `请选择${label}`,
                            // 可选：日期格式校验
                            type: 'object',
                            message: `请选择有效的${label}`
                        }]}
                        tooltip={tip}
                    >
                        <DatePicker
                            placeholder={placeholder}
                            style={{ width: '100%' }}
                            // 可选：限制日期选择范围
                            // disabledDate={(current) => current && current > dayjs().endOf('day')}
                            format="YYYY-MM-DD" // 显示格式
                        />
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
                // 表单级别的值变化监听，替代subscribe
                onValuesChange={handleFormValuesChange}
                layout='horizontal' // 垂直布局，更适合多字段
                colon={false} // 去掉label后的冒号（可选）
            >
                <div className='create-modal' style={{ height: '560px', overflowY: 'auto' }}>
                    {fields.map((item) => renderFormItem(item))}
                </div>

                {/* 自定义底部按钮 */}
                <Space style={{ marginTop: 20, textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleCancel} className='reset'>
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

export default FormModal;