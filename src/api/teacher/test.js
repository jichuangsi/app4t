import axios from '../../utils/axios'

//let apiUrl = 'http://api.jichuangsi.com/HOMEWORKSERVICE/teacher/';
let apiUrl = '/TESTSERVICE/teacher/';
let fileUrl = '/TESTSERVICE/file/';

//习题列表
export function gettestList() {
  return axios({
      method: 'GET',
      url: `${apiUrl}getList`,
      //headers: {'accessToken': localStorage.getItem('token')}
  });
}

//历史习题列表
export function gettestHistory(pageIndex, pageSize) {
  return axios({
      method: 'POST',
      url: `${apiUrl}getHistory`,
      data: {
          pageIndex,
          pageSize
      },
      //headers: {'accessToken': localStorage.getItem('token')}
  });
}

//习题状态更新
export function updatetestStatus(testId, testStatus) {
    return axios({
        method: 'POST',
        url: `${apiUrl}updateTestStatus`,
        data: {
            testId,
            testStatus
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}


//学生作业情况列表
export function gettest(testId) {
    return axios({
      method: 'get',
      url: `${apiUrl}getTest/${testId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
  }

//课堂主观题图片
export function getPicByString(sub) {
    return axios({
        method: 'POST',
        url: `${fileUrl}getByString`,
        data: {
            sub
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂主观题批改图片存根
export function sendPicByString(content) {
    let contentType = 'image/jpeg';
    let name = 'pic.jpg';
    return axios({
        method: 'post',
        url: `${fileUrl}sendByString`,
        data: {
            content,
            contentType,
            name
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂主观题批改提交
export function sendAnswer(questionId, studentAnswerId, score, stubForSubjective) {
    let picForSubjective = null;
    return axios({
        method: 'post',
        url: `${apiUrl}sendAnswer/${questionId}/${studentAnswerId}`,
        data: {
            score,
            stubForSubjective
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//学生作业详情
export function getStudentTest(testId,studentId) {
    return axios({
        method: 'get',
        url: `${apiUrl}getStudentTest/${testId}/${studentId}`
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

//作业统计分数
export function settleTest(testId) {
    return axios({
      method: 'put',
      url: `${apiUrl}/settleTest/${testId}`,
    });
  }

//学生查询接口
export function queryStudents(testId, studentName) {
  return axios({
    method: 'get',
    url: `${apiUrl}queryStudents`,
    data: {
      testId,
      studentName
    }
  });
}
