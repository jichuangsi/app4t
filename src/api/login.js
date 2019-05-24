/* eslint-disable no-unreachable */
import axios from '../utils/axios'
import store from '@/store'

//const apiUrl = 'http://api.jichuangsi.com/api/auth/login';
const apiUrl = '/api/auth/login';

export async function login(userAccount, userPwd ) {
    let res = await axios({
        method: 'POST',
        url: `${apiUrl}`,
        data: {
            userAccount,
            userPwd
        }
    });
    let flage=localStorage.getItem('flag');
    localStorage.removeItem('flag')
    flage=true;
    localStorage.setItem('flage',flage);
    if (res.data.code === '0010') {
        // console.log(res.data.data.accessToken)
        let oldUser = JSON.parse(localStorage.getItem('user'));
        let newUser = res.data.data.user;
        if(oldUser&&newUser&&oldUser.userId&&newUser.userId&&oldUser.userId!=newUser.userId){
            store.commit('IS_NEW', true);
        }
        localStorage.setItem("token", res.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        return res.data.data ? res.data.data.user : false;
    } else {
        throw res.data.msg;
    }

}
