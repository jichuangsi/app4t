import store from '@/store'
import {Indicator} from 'mint-ui';
import {Toast} from 'mint-ui';

function onInitialize(res) {
    //window.HandwrittenBoard.initialize(handler) 回調函數
    //初始化成功后一般會開啟藍牙掃描，也可通過用戶事件觸發
    if (localStorage.getItem("bluetooth")) {
        window.HandwrittenBoard.exploration();
        setTimeout(function () {
            window.HandwrittenBoard.connect(localStorage.getItem("bluetooth"));
        }, 1000);
    } else {
        store.commit('SET_BLUETOOTH', true);
        window.HandwrittenBoard.exploration();
    }
}

function onExploration(res) {
    //window.HandwrittenBoard.exploration() 回調函數
    //res 裡面保存了所有藍牙設備
    if (res) {
        let arr = [];
        for (var key in res) {
            if (res.hasOwnProperty(key)) {
                arr.push({
                    key: key,
                    val: res[key]
                })
            }
        }
        store.commit('SET_BLUETOOTH_LIST', arr);
    }
}

function onConnect(res) {
    Indicator.close();
    store.commit('SET_BLUETOOTH', false);
    store.commit('SET_BOARD', true);
    Toast('连接设备成功!');
    //window.HandwrittenBoard.connect() 回調函數
    //連接成功代表手寫板準備好，畫板已經在內存了，可以操作 take() cleanup() 等
}

function onIsConnect(res) {
    console.log('onIsConnect', res);
    //window.HandwrittenBoard.isConnect() 回調函數
    //检测蓝牙有无连接手写板
}

function onDrawing(res) {
    //window.HandwrittenBoard.destroy() 回調函數
    //返回手写板内容
    console.log("onDrawing" + res);
    store.commit('SET_BOARD_POINT', res);
}

function onDestroy(res) {
    //window.HandwrittenBoard.destroy() 回調函數
    //銷毀成功
}

function onDisconnect(res) {
    Toast('断开设备成功!');
}

function getBase64img(res) {
    if (res !== undefined) {
        store.commit('SET_BOARD_IMG', res);
    }
    //window.HandwrittenBoard.destroy() 回調函數
    //銷毀成功
}

function reDrawBase64img(res) {
    //window.HandwrittenBoard.destroy() 回調函數
    //銷毀成功
}

function onError(method, message) {
    Indicator.close();
    //所有出錯回調函數
    console.log(method, message);
}

export default function () {
    window.HandwrittenBoard.initialize(function (result) {
        console.log('result ' + result.method, result); //返回數據 裡面含有4個鍵：method code message data
        if (parseInt(result.code) !== 0) {
            onError(result.method, result.message);
        } else {
            switch (result.method) {
                case "initialize":
                    console.log('initialize');
                    onInitialize(result.data);
                    break;
                case "exploration":
                    onExploration(result.data);
                    break;
                case "connect":
                    onConnect(result.data);
                    break;
                case "isConnect":
                    onIsConnect(result.data);
                    break;
                case "drawing":
                    onDrawing(result.data);
                    break;
                case "destroy":
                    onDestroy(result.data);
                    break;
                case "disconnect":
                    onDisconnect(result.data);
                    break;
                case "getBase64img":
                    getBase64img(result.data);
                    break;
                case "reDrawBase64img":
                    reDrawBase64img(result.data);
                    break;
            }
        }
    });
}
