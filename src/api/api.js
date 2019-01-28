import Vue from 'vue'
import axios from '../utils/axios'

/*let apiUrl = 'https://www.easy-mock.com/mock/5b20d27bcf34351f1c8f748a/cryptTotal';*/
let apiUrl = 'https://www.easy-mock.com/mock/5b7bba22d02c1e7f50b4107a/gcharms/';

export function getTest() {
  return axios({
    method: 'get',
    url: `${apiUrl}`
  });
}

export default ({
  //获取作业簿的数据
  getHomeWork: function () {
    return axios.get(`${apiUrl}task`, {
      param: {
        time: new Date().getTime()
      }
    })
  },
  //获取课堂列表的数据
  getClassroomList: function () {
    return axios.get(`${apiUrl}classroomList`, {
      param: {
        time: new Date().getTime()
      }
    })
  },
  //获取课堂的资料
  getClassroom: function () {
    return axios.get(`${apiUrl}classroom`, {
      param: {
        time: new Date().getTime()
      }
    })
  },
  //获取客观题作业的资料
  getObjectiveWork: function () {
    return axios.get(`${apiUrl}objectiveWork`, {
      param: {
        time: new Date().getTime()
      }
    })
  },
  //获取客观题作业的资料
  getMy: function () {
    return axios.get(`${apiUrl}my`, {
      param: {
        time: new Date().getTime()
      }
    })
  },
  //获取客观题作业的资料
  test: function () {
    return axios.get(`${apiUrl}test`, {
      param: {
        time: new Date().getTime()
      }
    })
  },
  //获取课堂首次信息
  getClassroomListNowList: function () {
    return axios.get(`${apiUrl}classroomListNowList`, {
      param: {
        time: new Date().getTime()
      }
    })
  },
  //获取教师端课堂首次信息
  getTClassroom: function () {
    return axios.get(`${apiUrl}teacherClassroom`, {
      param: {
        time: new Date().getTime()
      }
    })
  },
  //获取教师端作业首次信息
  getTeacherWork: function () {
    return axios.get(`${apiUrl}teacherWork`, {
      param: {
        time: new Date().getTime()
      }
    })
  }
})
