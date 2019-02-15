import {getList} from '../../../api/teacher/classroom'
import {getHomeworkList} from '../../../api/teacher/homework'

const teacher = {
    state: {
        classList: [],
        classListHistory: [],
        homeworkList: [],
        homeworkListHistory: [],
        homeworkId: '',
        homeworkName: '',
        homeworkStudents: [],
        homeworkQuestions: [],
        homeworkInitSlide: 0,
        courseId: '',
        courseName: '',
        teacherName: '',
        teacherId: '',
        pageNum: 2
    },
    mutations: {
        SET_CLASS: (state, classListToday) => {
            state.classList = classListToday;
            state.classList = state.classList.concat(state.classListHistory);
        },
        SET_CLASSHISTORY: (state, classListHistory) => {
            state.classListHistory = classListHistory;
            state.classList = state.classList.concat(classListHistory);
        },
        SET_HOME: (state, homeworkList) => {
            state.homeworkList = homeworkList;
            state.homeworkList = state.homeworkList.concat(state.homeworkListHistory);
        },
        SET_HOMEWORKHISTORY: (state, homeworkListHistory) => {
            state.homeworkListHistory = homeworkListHistory;
            state.homeworkList = state.homeworkList.concat(homeworkListHistory);
        },
        SET_HOMEWORKID: (state, homeworkId) => {
            state.homeworkId = homeworkId;
        },
        SET_HOMEWORKNAME: (state, homeworkName) => {
            state.homeworkName = homeworkName;
        },
        SET_HOMEWORKSTUDENTS: (state, homeworkStudents) => {
            state.homeworkStudents = homeworkStudents;
        },
        SET_HOMEWORKQUESTIONS: (state, homeworkQuestions) => {
            state.homeworkQuestions = homeworkQuestions;
        },
        SET_HOMEWORKINITSLIDE: (state, homeworkInitSlide) => {
            state.homeworkInitSlide = homeworkInitSlide;
        },
        SET_COURSEID: (state, courseId) => {
            state.courseId = courseId;
        },
        SET_COURSENAME: (state, courseName) => {
            state.courseName = courseName;
        },
        SET_TEACHERNAME: (state, teacherName) => {
            state.teacherName = teacherName;
        },
        SET_TEACHERID: (state, teacherId) => {
            state.teacherId = teacherId;
        }
    },
    actions: {
        getTeacherClass({commit}) {
            return new Promise((resolve, reject) => {
                getList()
                    .then(function (res) {
                        commit('SET_CLASS', res.data.data);
                        resolve()
                    })
                    .catch(function (error) {
                        reject(error);
                    })
            })
        },
        getTeacherHomework({commit}) {
            return new Promise((resolve, reject) => {
                getHomeworkList()
                    .then(function (res) {
                        commit('SET_HOME', res.data.data);
                        resolve()
                    })
                    .catch(function (error) {
                        reject(error);
                    })
            })
        }
        // getTeacherClassHistory({commit}) {
        //     return new Promise((resolve, reject) => {
        //         getHistory(pageNum)
        //             .then(function (res) {
        //                 console.log(res.data.data);
        //                 commit('SET_CLASSHISTORY', res.data.data.content);
        //                 resolve()
        //             })
        //             .catch(function (error) {
        //                 reject(error);
        //             })
        //     })
        // }
    }
};


// 暴露出去
export default teacher
