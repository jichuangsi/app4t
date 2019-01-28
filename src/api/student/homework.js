import axios from '../../utils/axios'

let apiUrl = '/homeworkForstudent/';

//作业列表
export function getList() {
  return axios({
    method: 'get',
    url: `${apiUrl}getList`,

  });

}

//历史作业列表
export function getHistory() {
  return axios({
    method: 'get',
    url: `${apiUrl}getHistory`,
  });
}

//作业详情
export function getDetail(homeworkId) {
  return axios({
    method: 'get',
    url: `${apiUrl}getDetail`,
    data: {
      homeworkId
    }
  });
}

//作业主观题图片存根
export function getSubjectPic() {
  return axios({
    method: 'post',
    url: `${apiUrl}getSubjectPic`
  });
}

//作业提交
export function postSubmission() {
  return axios({
    method: 'post',
    url: `${apiUrl}postSubmission`
  });
}

