const topic = {
    state: {
        //题目id
        topicId: '',
        //题目辩题
        title: '',
        //学生id
        studentId: ''
    },
    mutations: {
        SET_TOPICID: (state, topicId) => {
            state.topicId = topicId;
        },
        SET_TITLE: (state, title) => {
            state.title = title;
        },
        SET_STUDENTID: (state, studentId) => {
            state.studentId = studentId;
        }
    }
};


// 暴露出去
export default topic
