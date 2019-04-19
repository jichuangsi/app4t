import axios from '../../utils/axios'

//const apiUrl = 'http://api.jichuangsi.com/COURSESERVICE/student/';
//const host = 'http://api.jichuangsi.com/CLASSINTERACTION/';
// const apiUrl = '/COURSESERVICE/student/';coursestatistics

const apiurl = '/COURSESTATISTICS/result/teacher/'

//课堂
export function getCourseSubjectResult(classId,subjectname) {
    return axios({
        method: 'get',
        url: `${apiurl}getCourseSubjectResult?classId=`+classId+'&subject='+subjectname,
        // headers: {'accessToken': localStorage.getItem('token')}
    });
}
//习题getSubjectQuestionRate
export function getSubjectQuestion(classId) {
    return axios({
        method: 'get',
        url: `${apiurl}getSubjectQuestion?classId=`+classId,
        // headers: {'accessToken': localStorage.getItem('token')}
    });
}
//习题详情
export function getSubjectQuestionRate(classId,homeId) {
    return axios({
        method: 'get',
        url: `${apiurl}getSubjectQuestionRate?classId=`+classId+'&homeId='+homeId,
        // headers: {'accessToken': localStorage.getItem('token')}
    });
}

//发送文件信息
export function publishFile(courseId,fileName,fileId) {
    return axios({
        method: 'post',
        url: `/COURSESERVICE/console/publishFile/`+courseId+'/'+fileName+'/'+fileId,
        // headers: {'accessToken': localStorage.getItem('token')}
    });
}

export function getCourseSign(courseId,classId) {
    return axios({
        method: 'GET',
        url: `/COURSESTATISTICS/class/getCourseSign/${courseId}/${classId}`,
        // headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂点赞
export function commendCourse(courseId, studentId, studentName) {
    return axios({
        method: 'POST',
        url: `/COURSESERVICE/teacher/commendCourse`,
        data: {
            courseId,
            studentId,
            studentName
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//取消课堂点赞
export function discommendCourse(courseId, studentId) {
    return axios({
        method: 'PUT',
        url: `/COURSESERVICE/teacher/discommendCourse/${courseId}/${studentId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}