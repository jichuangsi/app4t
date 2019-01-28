import {getList} from '../../../api/teacher/classroom'

const teacher = {
    state: {
        classList: [],
        classListHistory: [],
        homeworkList: [],
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
