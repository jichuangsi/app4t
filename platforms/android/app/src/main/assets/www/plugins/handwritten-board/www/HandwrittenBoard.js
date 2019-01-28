cordova.define("handwritten-board.HandwrittenBoard", function(require, exports, module) {
var cordova = require('cordova');

var HandwrittenBoard = {
    Handler: Function,
    initialize: function (callback) {
        this.Handler = callback;
        cordova.exec(this.Handler, this.Handler, 'HandwrittenBoard', 'initialize', []);
    },
    exploration: function (timeout) {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.ACCESS_COARSE_LOCATION, function (status) {
            if (status.hasPermission) {
                cordova.exec(this.Handler, this.Handler, 'HandwrittenBoard', 'exploration', [parseInt(timeout)]);
            }
            else {
                permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, function (status) {
                    if (!status.hasPermission) {
                        console.log('無法獲取藍牙權限');
                    } else {
                        cordova.exec(this.Handler, this.Handler, 'HandwrittenBoard', 'exploration', [parseInt(timeout)]);
                    }
                }.bind(this), function () {
                    console.log('無法獲取藍牙權限');
                });
            }
        }.bind(this));
    },
    connect: function (macAddress) {
        cordova.exec(this.Handler, this.Handler, 'HandwrittenBoard', 'connect', [macAddress]);
    },
    isConnect: function (callback, callback) {
        cordova.exec(callback, callback, 'HandwrittenBoard', 'isConnect', []);
    },
    destroy: function (callback) {
        cordova.exec(callback, callback, 'HandwrittenBoard', 'destroy', []);
    },
    disconnect: function () {
        cordova.exec(this.Handler, this.Handler, 'HandwrittenBoard', 'disconnect', []);
    },
    getBase64img: function (base64img) {
        cordova.exec(this.Handler, this.Handler, 'HandwrittenBoard', 'getBase64img', base64img ? [base64img] : []);
    },
};
module.exports = HandwrittenBoard;
});
