import axios from '../utils/axios'

// const apiUrl = 'http://api.jichuangsi.com/USERSERVICE/';
const apiUrl = '/USERSERVICE/'

//从服务器获取应用的版本信息，和本地应用版本对比
export function getAppInfo(appName,appType) {
    return axios({
        method: 'POST',
        url: `${apiUrl}getAppInfo`,
        data: {
            appName,
            appType
        }
    });
}
