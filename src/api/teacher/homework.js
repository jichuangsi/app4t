import axios from '../../utils/axios'

let apiUrl = '/homeworkForteacher/';

//作业列表
export function getWorkList() {
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

//学生作业情况列表
export function getStudentList(homeworkId) {
  return axios({
    method: 'get',
    url: `${apiUrl}getStudentList`,
    data: {
      homeworkId
    }
  });
}

//学生作业详情
export function getStudentDetail(homeworkId) {
  return axios({
    method: 'get',
    url: `${apiUrl}getStudentDetail`,
    data: {
      homeworkId
    }
  });
}

//作业主观题批改图片存根
export function postSubjectPic() {
  return axios({
    method: 'post',
    url: `${apiUrl}postSubjectPic`,
  });
}

//作业主观题批改图片提交
export function postSubjectPicSubmission() {
  return axios({
    method: 'post',
    url: `${apiUrl}postSubjectPicSubmission`,
  });
}

//作业主观题批改图片提交
export function query() {
  return axios({
    method: 'get',
    url: `${apiUrl}query`,
  });
}

//学生查询接口
export function queryStudents(homeworkId, studentName) {
  return axios({
    method: 'get',
    url: `${apiUrl}queryStudents`,
    data: {
      homeworkId,
      studentName
    }
  });
}





