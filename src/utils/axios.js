import axios from 'axios'
//axios请求封装
const service = axios.create();
const apiHost = 'http://api.jichuangsi.com';
service.interceptors.request.use(function (config) {

    if(config.url.indexOf(apiHost) == -1){
      config.url = apiHost.concat(config.url);
    }
    if(!config.headers.accessToken&&localStorage.getItem('token')){
        config.headers.accessToken = localStorage.getItem('token');
    }
    //console.log(config);
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

service.interceptors.response.use(function (response) {

  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default service
