import axios from 'axios'
//axios请求封装
const service = axios.create();
service.interceptors.response.use(function (response) {

  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default service
