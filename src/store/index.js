import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import classList from './modules/student/classList'
import incorrectQuestions from './modules/student/incorrectQuestions'
import login from './modules/login'
import teacher from './modules/teacher/teacher'
import topic from './modules/teacher/topic'
import bluetooth from './modules/bluetooth'
import getters from './getters'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        login,
        classList,
        teacher,
        topic,
        bluetooth,
        incorrectQuestions
    },
    getters
});

export default store
