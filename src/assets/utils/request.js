import axios from 'axios'

const service = axios.create();
axios.defaults.headers.common['accessToken'] = 'accessToken';
// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response['data']['code'] === 200) {
    return response;
  } else {
    console.log(response.message);
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
