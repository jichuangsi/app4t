import {getList} from '../../../api/teacher/classroom'
import {getHomeworkList} from '../../../api/teacher/homework'
import {gettestList} from '../../../api/teacher/test'

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
        homeworkObjectiveQs: [],
        homeworkSubjectiveQs: [],
        homeworkCompleted: false,
        homeworkStudentId: '',
        homeworkStudentName: '',
        //
        testList: [],
        testListHistory: [],
        testId: '',
        testName: '',
        testStudents: [],
        testQuestions: [],
        testInitSlide: 0,
        testObjectiveQs: [],
        testSubjectiveQs: [],
        testCompleted: false,
        testStudentId: '',
        testStudentName: '',
        //
        courseId: '',
        courseName: '',
        teacherName: '',
        teacherId: '',
        pageNum: 2
    },
    mutations: {
        SET_CLASS: (state, classListToday) => {
            state.classList = classListToday;
            if(state.classList) state.classList = state.classList.concat(state.classListHistory);
        },
        SET_CLASSHISTORY: (state, classListHistory) => {
            state.classListHistory = classListHistory;
            if(state.classList) state.classList = state.classList.concat(classListHistory);
        },
        SET_HOME: (state, homeworkList) => {
            state.homeworkList = homeworkList;
            if(state.homeworkList) state.homeworkList = state.homeworkList.concat(state.homeworkListHistory);
        },
        SET_HOMEWORKHISTORY: (state, homeworkListHistory) => {
            state.homeworkListHistory = homeworkListHistory;
            if(state.homeworkList) state.homeworkList = state.homeworkList.concat(homeworkListHistory);
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
        SET_HOMEWORKOBJECTIVEQS: (state, homeworkObjectiveQs) => {
            state.homeworkObjectiveQs = homeworkObjectiveQs;
        },
        SET_HOMEWORKSUBJECTIVEQS: (state, homeworkSubjectiveQs) => {
            state.homeworkSubjectiveQs = homeworkSubjectiveQs;
        },
        SET_HOMEWORKCOMPLETED: (state, homeworkCompleted) => {
            state.homeworkCompleted = homeworkCompleted;
        },
        SET_HOMEWORKSTUDENTID: (state, homeworkStudentId) => {
            state.homeworkStudentId = homeworkStudentId;
        },
        SET_HOMEWORKSTUDENTNAME: (state, homeworkStudentName) => {
            state.homeworkStudentName = homeworkStudentName;
        },
        //
        SET_TEST: (state, testList) => {
            state.testList = testList;
            if(state.testList) state.testList = state.testList.concat(state.testListHistory);
        },
        SET_TESTHISTORY: (state, testListHistory) => {
            state.testListHistory = testListHistory;
            if(state.testList) state.testList = state.testList.concat(testListHistory);
        },
        SET_TESTID: (state, testId) => {
            state.testId = testId;
        },
        SET_TESTNAME: (state, testName) => {
            state.testName = testName;
        },
        SET_TESTSTUDENTS: (state, testStudents) => {
            state.testStudents = testStudents;
        },
        SET_TESTQUESTIONS: (state, testQuestions) => {
            state.testQuestions = testQuestions;
        },
        SET_TESTINITSLIDE: (state, testInitSlide) => {
            state.testInitSlide = testInitSlide;
        },
        SET_TESTOBJECTIVEQS: (state, testObjectiveQs) => {
            state.testObjectiveQs = testObjectiveQs;
        },
        SET_TESTSUBJECTIVEQS: (state, testSubjectiveQs) => {
            state.testSubjectiveQs = testSubjectiveQs;
        },
        SET_TESTCOMPLETED: (state, testCompleted) => {
            state.testCompleted = testCompleted;
        },
        SET_TESTSTUDENTID: (state, testStudentId) => {
            state.testStudentId = testStudentId;
        },
        SET_TESTSTUDENTNAME: (state, testStudentName) => {
            state.testStudentName = testStudentName;
        },
        //
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
        },
        getTeachertest({commit}) {
            return new Promise((resolve, reject) => {
                gettestList()
                    .then(function (res) {
                        commit('SET_TEST', res.data.data);
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
