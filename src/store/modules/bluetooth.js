const bluetooth = {
    state: {
        bluetoothValue: localStorage.getItem("bluetooth") || '',
    },
    mutations: {
        SET_BLUETOOTHVALUE: (state, states) => {
            localStorage.setItem("bluetooth", states);
            state.bluetoothValue = states
        }
    }
};

export default bluetooth
