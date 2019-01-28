import {getList} from '@/api/student/classroom';

const classList = {
    state: {
        classroomList: [],
        historyData: []
    },
    mutations: {
        SET_TODAY: (state, todayData) => {
            console.log(state.historyData);
            state.classroomList = todayData;
            state.classroomList = state.classroomList.concat(state.historyData)
        },
        SET_HISTORY: (state, historyData) => {
            state.historyData = historyData;
            state.classroomList = state.classroomList.concat(historyData)
        }
    },
    actions: {
        getClassList({commit}) {
            return new Promise((resolve, reject) => {
                getList()
                    .then(function (res) {
                        commit('SET_TODAY', res.data.data);
                        resolve()
                    })
                    .catch(function (error) {
                        reject(error);
                    })
            })
        }
    }
};

// 暴露出去
export default classList
