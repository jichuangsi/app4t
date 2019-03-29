import axios from 'axios'

//const apiUrl = 'http://api.jichuangsi.com/COURSESERVICE/student/';
//const host = 'http://api.jichuangsi.com/CLASSINTERACTION/';
// const apiUrl = '/COURSESERVICE/student/';

const apiurl = 'http://192.168.31.154:8082/result/teacher/'


//课堂
export function getCourseSubjectResult(classId,subjectname) {
    return axios({
        method: 'get',
        url: `${apiurl}getCourseSubjectResult?classId=`+classId+'&subject='+subjectname,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}
//习题getSubjectQuestionRate
export function getSubjectQuestion(classId) {
    return axios({
        method: 'get',
        url: `${apiurl}getSubjectQuestion?classId=`+classId,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}
//习题详情
export function getSubjectQuestionRate(classId,homeId) {
    return axios({
        method: 'get',
        url: `${apiurl}getSubjectQuestionRate?classId=`+classId+'&homeId='+homeId,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}

//发送文件信息
export function publishFile(courseId,fileName,fileId) {
    return axios({
        method: 'post',
        url: `192.168.31.154:8080/publishFile/`+courseId+'/'+fileName+'/'+fileId,
        headers: {'accessToken': localStorage.getItem('token')}
    });
}