import axios from '../utils/axios'

let apiUrl = '/uaaForstudent/';

//作业列表
export function getInfo() {
  return axios({
    method: 'get',
    url: `${apiUrl}getInfo`,
  });
}
