import {getList, getHistory} from '@/api/student/classroom';

const homeWork = {
  state: {
    todayData: [],
    historyData: []
  },
  mutations: {
    SET_TODAY: (state, todayData) => {
      // state.todayData = state.todayData.concat(todayData)
      state.todayData = todayData;
    },
    SET_HISTORY: (state, historyData) => {
      state.historyData = state.historyData.concat(historyData)
    }
  },
  actions: {
    getWrokList({commit}) {
      return new Promise((resolve, reject) => {
        getList()
          .then(function (res) {
            commit('SET_TODAY', res.data.data.classroomList)
            resolve()
          })
          .catch(function (error) {
            reject(error);
          })
      })
    },
    getWrokHistory({commit}) {
      getHistory()
        .then(function (res) {
          console.log(res);
          commit.SET_TODAY('SET_HISTORY', res.data)
        })
    }
  }
};

// 暴露出去
export default homeWork
