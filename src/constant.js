export const OperateType = {
  SINGLE: 'single',
  BOTH: 'both'
};

export const Operate = {
  START: 'start',
  STOP: 'stop',
  DELETE: 'delete',
  DEFAULT: 'default',
  RUNTIME: 'runtime'
}

const urlParams = new URLSearchParams(window.location.search);  
const token = urlParams.get('operation_token');  

const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || token


const localMenu = isLocal ? [{
  key: Operate.START,
  value: '启动',
  PermissionKey: OperateType.SINGLE
},
{
  key: Operate.STOP,
  value: '停止',
  PermissionKey: OperateType.SINGLE
},
{
  key: Operate.DELETE,
  value: '删除',
  PermissionKey: OperateType.SINGLE
}] : [];

export const editMenuEnum = [
  ...localMenu,
  {
    key: Operate.DEFAULT,
    value: '设为默认',

    PermissionKey: OperateType.BOTH
  },
  {
    key: Operate.RUNTIME,
    value: '运行参数',

    PermissionKey: OperateType.BOTH
  }
];

export const DataType = {
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean',
  PICTURE: 'picture',
  FILE: 'file',
  OBJECT: 'object',
  ARRAY: 'array',
  JSON: 'json',
  ENUM:'enum'
}

export const EnumMap = {
  logoutType: [{
    value: '返回登录页',
    label: '返回登录页'
}, {
    value: '关闭页签',
    label: '关闭页签'
}, {
    value: '跳转到链接',
    label: '跳转到链接'
}],
  loginType:[{
      value: '仅系统用户登录',
      label: '仅系统用户登录'
    }, {
      value: '仅LDAP用户登录',
      label: '仅LDAP用户登录'
    }, {
      value: '通用登录',
      label: '通用登录'
    }]
,usingTenantType: [
  {
      value: 'single',
      label: '单租户'
  },
  {
      value: 'multiple',
      label: '多租户'
  },
  {
      value: 'mixed',
      label: '单租户与多租户切换'
  },
]}

export const DEFAULT_HEARTBEAT_INTERVAL = 60;