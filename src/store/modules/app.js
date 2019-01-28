const app = {
    state: {
        //是否开启蓝牙弹窗
        isBlueTooth: false,
        //是否开启手写板弹窗
        isPopupBoard: false,
        //是否连接手写板成功
        isBoard: false,
        //附件蓝牙设备
        blueToothList: [],
        //手写板图片
        boardImg: '',
        //手写板点
        boardPoint: {}
    },

    mutations: {
        SET_BLUETOOTH: (state, states) => {
            state.isBlueTooth = states
        },
        SET_POPUP_BLUETOOTH: (state, states) => {
            state.isPopupBoard = states
        },
        SET_BOARD: (state, states) => {
            state.isBoard = states
        },
        SET_BLUETOOTH_LIST: (state, arr) => {
            state.blueToothList = arr
        },
        SET_BOARD_IMG: (state, img) => {
            state.boardImg = img
        },
        SET_BOARD_POINT: (state, obj) => {
            state.boardPoint = obj
        }
    },

    actions: {}
};

export default app
