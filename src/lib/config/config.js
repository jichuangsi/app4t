export default {
    install(Vue,options)
    {
        Vue.prototype.apiHost = function () {
            return 'http://api.jichuangsi.com';
        };
    }
}
