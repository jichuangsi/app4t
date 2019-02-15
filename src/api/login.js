/* eslint-disable no-unreachable */
import axios from '../utils/axios'

// const apiUrl = 'http://school.jichuangsi.com:81/api/auth/login';
const apiUrl = 'http://192.168.31.108:8888/api/auth/login'

export async function login(userAccount, userPwd ) {
    let res = await axios({
        method: 'POST',
        url: `${apiUrl}`,
        data: {
            userAccount,
            userPwd
        }
    });
    if (res.data.code === '0010') {
        // console.log(res.data.data.accessToken)
        localStorage.setItem("token", res.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        return res.data.data ? res.data.data.user : false;
    } else {
        throw res.data.msg;
    }

}
