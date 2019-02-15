import axios from '../../utils/axios'

let apiUrl = 'http://school.jichuangsi.com:81/HOMEWORKSERVICE/teacher/';

//习题列表
export function getHomeworkList() {
  return axios({
      method: 'GET',
      url: `${apiUrl}getList`,
      headers: {'accessToken': localStorage.getItem('token')}
  });
}

//历史习题列表
export function getHomeworkHistory(pageIndex, pageSize) {
  return axios({
      method: 'POST',
      url: `${apiUrl}getHistory`,
      data: {
          pageIndex,
          pageSize
      },
      headers: {'accessToken': localStorage.getItem('token')}
  });
}

//习题状态更新
export function updateHomeworkStatus(homeworkId, homeworkStatus) {
    return axios({
        method: 'POST',
        url: `${apiUrl}updateHomeworkStatus`,
        data: {
            homeworkId,
            homeworkStatus
        },
        headers: {'accessToken': localStorage.getItem('token')}
    });
}


//学生作业情况列表
export function getHomework(homeworkId) {
  return axios({
    method: 'get',
    url: `${apiUrl}getHomework/${homeworkId}`,
      headers: {'accessToken': localStorage.getItem('token')}
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





