import axios from 'axios';
import { message } from 'antd';

axios.defaults.timeout = 120000;

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('operation_token');

let LOCAL_HOST = location.origin // 'https://localhost:4999'
try {
  if (top.localAddress) {
    const url = new URL(top.localAddress)
    LOCAL_HOST = url.origin
  }
} catch (e) {
  console.log(e);
}

axios.interceptors.response.use((response) => {
  const result = response?.data;
  if (result.code === '100403') {
    message.warning('请求被拒绝：请联系管理员进行操作');
    return null;
  } else {
    return response?.data;
  }
}, error => {
  console.log('error', error)
  //请求超时时、未知异常时
  // message.warning('服务器异常，请联系管理员');

  if (!error.config?.isHiddenMessage) {
    //请求超时时、未知异常时
    message.warning('服务器异常，请联系管理员');
  }
});

export async function GET_FRE_STATUS() {
  try {
    const freStatus = await axios.get('/api/fre/info');
    return freStatus.data;
  } catch (e) {
    return null;
  }
}

export function GET_APPLIST() {
  return axios.get('/api/fre/app/list').then((response) => {
    console.log('list', response?.data?.apps);
    return response?.data?.apps || [];
  })
}

export function GET_PARAMSLIST(app_name) {
  return axios.post(`/api/fre/configuration/param/read?app=${app_name}`).then((response) => {
    return response.data ?? [];
  })
}

export async function GET_STARTAPP(app_name) {
  await axios.get(`/api/fre/app/init/${app_name}?operation_token=${token}`)
  return axios.get(`/api/fre/app/start/${app_name}?operation_token=${token}`)
}

export function GET_STOPAPP(app_name) {
  return axios.get(`/api/fre/app/stop/${app_name}?operation_token=${token}`).then((response) => {
    return response
  })
}

export function GET_FRE_INFO() {
  return axios.get(LOCAL_HOST + '/api/fre/info').then((response) => {
    return response?.data;
  })
}

export function UPDATE_FRE_INFO(params) {
  const formData = new FormData();
  for (const key in params) {
    formData.append(key, params[key]);
  }
  return axios.post(LOCAL_HOST + `/api/fre/update?operation_token=${token}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((response) => {
    return response?.code == "0";
  })
}

export function IMPORT_APP(file, isHiddenMessage) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`/api/fre/app/import?operation_token=${token}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 15 * 60 * 1000,
    isHiddenMessage: isHiddenMessage
  }).then((response) => {
    if (response.code === '100400') {
      message.warning(response.msg);
      return
    }
    if (response.code != '0') {
      message.warning('导入包不符合规范，请检查');
      return;
    }
    return response;
  })
}

export function DELETE_APP(name) {
  return axios.post('/api/fre/app/trash' + `?operation_token=${token}`, { name }).then((response) => {
    return response?.code == "0";
  })
}

export async function UPDATE_PARAMS({ name, params }) {
  return await axios.post('/api/fre/configuration/param/update?app=' + name + `&operation_token=${token}`, params)
  // return axios.post('/api/configuration/param/update?app=' + name, params).then((response) => {
  //   if (response.code != '0') {
  //     message.warning(response.msg);
  //     return;
  //   }
  //   return response;
  // })
}

export function ENCRYPT(msg, key) {
  return axios.post('/api/authority/util/encrypt', { msg, key }).then((response) => {
    return response?.data;
  })
}

export function GET_APP_SERVICE(name) {
  const config = {
    method: 'get',
    url: '/api/fre/app/bservice/list',
    params: {
      app: name
    }
  };
  return axios.request(config).then((response) => {
    return response?.data;
  })
}

export function GET_APP_LOGIN_INFO(app_name) {
  return axios.get(`/api/fre/app/login/info?app=${app_name}&branch=`).then((response) => {
    return response.data ?? {};
  })
}

export function GET_APP_MENU_TREE(app_name) {
  return axios.get(`/api/fre/app/${app_name}/menu/tree?withoutAppParam=true`).then((response) => {
    return response.data ?? {};
  })
}

export function GET_PAGE_LIST(appID) {
    // TODO 换成FRE接口
    return axios.post(`/api/fre/configuration/listPage?app=${appID}`, { withSubApp: true }).then((response) => {
        return response.data ?? [];
    })
}

export async function UPDAGE_DEFULT_APP(appName) {
  if (window.electronAPI) {
    electronAPI.updateLocalDefaultApp(appName)
  } else {
    await UPDATE_FRE_INFO({
      appDefault: appName
    })
  }
  return 'ok'
}

export function GET_APP_INFO(appID) {
    return axios.get(`/api/fre/app/byname/${appID}`).then((response) => {
        return response.data ?? {};
    })
}