import axios from '../../utils/axios'

//const apiUrl = 'http://192.168.31.108:8888/COURSESERVICE/teacher/'
//const host = 'http://192.168.31.108:8888/COURSESTATISTICS/'
const apiUrl = '/COURSESERVICE/teacher/'
const host = '/COURSESTATISTICS/'

export function getList() {
    return axios({
        method: 'GET',
        url: `${apiUrl}getList`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//历史课程列表
export function getHistory(pageNum) {
    return axios({
        method: 'POST',
        url: `${apiUrl}getHistory`,
        data: {
            pageNum
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//开始上课
export function courseStart(courseId) {
    return axios({
        method: 'POST',
        url: `${apiUrl}courseStart/${courseId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//开始上课
export function courseEnd(courseId) {
    return axios({
        method: 'POST',
        url: `${apiUrl}courseEnd/${courseId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//获取课堂详情
export function getCourse(courseId) {
    return axios({
        method: 'get',
        url: `${apiUrl}getCourse/${courseId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//获取课堂人数
export function getCourseStatistics(courseId) {
    return axios({
        method: 'get',
        url: `${host}getCourseStatistics/${courseId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂详情获取题目默认值
export function getQuestionStatisticsList(courseId) {
    return axios({
        method: 'get',
        url: `${host}getQuestionStatisticsList/${courseId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//主观题获取当前课堂提交人数 无论主观题还是客观题
export function getQuestion(questionId) {
    return axios({
        method: 'get',
        url: `${apiUrl}getQuestion/${questionId}`,
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂详情发布题目
export function questionPublish(courseId, questionId) {
    return axios({
        method: 'post',
        url: `${apiUrl}questionPublish/${courseId}/${questionId}`,
        data: {
            questionId
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂详情发布题目
export function questionTerminate(courseId, questionId) {
    return axios({
        method: 'post',
        url: `${apiUrl}questionTerminate/${courseId}/${questionId}`,
        data: {
            questionId
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂主观手寫板图片
export function getSubjectPic(stubForSubjective) {
    return axios({
        method: 'POST',
        url: `${apiUrl}getSubjectPic`,
        data: {
            stubForSubjective
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂主观手寫板图片
export function getAttachment(sub) {
    return axios({
        method: 'POST',
        url: `${apiUrl}getAttachment`,
        //url: `http://127.0.0.1:8888/COURSESERVICE/teacher/getAttachment`,
        data: {
            sub
        },
        responseType:'blob',
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂题目图片
export function getQuestionPic(stubForSubjective) {
    return axios({
        method: 'POST',
        url: `${apiUrl}getQuestionPic`,
        data: {
            stubForSubjective
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂状态更新
export function changeCourseStatus(courseId, courseStatus) {
    return axios({
        method: 'POST',
        url: `${apiUrl}changeCourseStatus`,
        data: {
            courseId,
            courseStatus
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂题目状态更新
export function changeQuestionStatus() {
    return axios({
        method: 'POST',
        url: `${apiUrl}changeCourseStatus`,
        data: {},
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂查询接口
export function getQuery(courseName) {
    return axios({
        method: 'get',
        url: `${apiUrl}query`,
        data: {
            courseName
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂详情的题目列表
export function getQuestionsForstudent(courseId) {
    return axios({
        method: 'get',
        url: `${apiUrl}getQuestionsForstudent`,
        data: {
            courseId
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//学生答题情况列表
export function getAnsFromstudent(courseId, questionId) {
    return axios({
        method: 'get',
        url: `${apiUrl}getAnsFromstudent`,
        data: {
            courseId,
            questionId
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂主观题批改图片存根
export function sendSubjectPicByString(content) {
    let contentType = 'image/jpeg';
    let name = 'pic.jpg';
    return axios({
        method: 'post',
        url: `${apiUrl}sendSubjectPicByString`,
        data: {
            content,
            contentType,
            name
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}

//课堂主观题批改提交
export function sendAnswer(questionId, studentAnswerId, answerId, score, stubForSubjective, teacherId, teacherName) {
    let picForSubjective = null;
    return axios({
        method: 'post',
        url: `${apiUrl}sendAnswer/${questionId}/${studentAnswerId}`,
        data: {
            answerId,
            picForSubjective,
            score,
            stubForSubjective,
            teacherId,
            teacherName
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}
//课堂主观题共享
export function shareAnswer(questionId, studentAnswerId, answerId, score, stubForSubjective, teacherId, teacherName) {
    let picForSubjective = null;
    return axios({
        method: 'post',
        url: `${apiUrl}shareAnswer/${questionId}/${studentAnswerId}`,
        data: {
            answerId,
            picForSubjective,
            score,
            stubForSubjective,
            teacherId,
            teacherName
        },
        //headers: {'accessToken': localStorage.getItem('token')}
    });
}
