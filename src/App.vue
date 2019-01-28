<template>
    <div id="app">
        <keep-alive>
            <!--<transition :name="transitionName">-->
            <router-view v-if="$route.meta.keepAlive"/>
            <!--</transition>-->
        </keep-alive>

        <!--<transition :name="transitionName">-->
        <router-view v-if="!$route.meta.keepAlive"/>
        <!--</transition>-->
        <bluetooth/>
        <popup-board/>
        <Preview/>
    </div>
</template>

<script>
    import Bluetooth from './components/Bluetooth'
    import PopupBoard from './components/PopupBoard'
    import {Toast} from 'mint-ui';
    import Preview from '../src/components/board/Preview'
    import initialize from '@/utils/board'
    import {mapGetters} from 'vuex'
    import {checkUpgrade} from '@/utils/upgrade'

    export default {
        name: 'App',
        data() {
            return {
                transitionName: 'fold-left',
                pageUrl: ''
            }
        },
        components: {
            Bluetooth,
            PopupBoard,
            Preview
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'blueToothList'
            ])
        },
        // vue监听路由对象$route的方法
        watch: {
            // watch $route 决定使用哪种过渡
            '$route'(to, from) {
                //to、from是最基本的路由对象，分别表示从(from)某个页面跳转到(to)另一个页面,to.path（表示要跳转到的路由地址），from.path同理。
                const routerDeep = ['/studentIndex', '/teacher', '/teacherMy', '/classroom', '/myShow',
                    '/objectiveWork', '/subjectiveWork', '/TClassroom', '/objectiveQuestions',
                    '/subjectiveDetails', '/subjectiveShow', '/TStudentList', '/TObjective', '/TSubjective', 'teacherMy',
                    '/teacherInformation', '/teacherenquiry', 'studentenquiry','teacherhomework', 'principal','studentCollection','mistakescollection','Wrong','raising','assistant'];
                //找到to.path和from.path在routerDeep数组中的下标
                this.pageUrl = this.$route.path;
                console.log("当前路由:" + this.$route.path);
                if(this.$route.path=='/studentenquiry' /*需要调整为老师页面*/
                    ||this.$route.path=='/studentIndex'
                    ||this.$route.path=='/mistakescollection'
                    ||this.$route.path=='/myShow'){
                if(!(localStorage.getItem('token'))){
                    let route = this.$route.path
                        this.$router.push({ path: "/", name: "login" })
                    this.$store.state.userroute = route
                    }
                    else {
                        this.$store.state.userroute = ''
                    }
                }
                const toDepth = routerDeep.indexOf(to.path);
                const fromDepth = routerDeep.indexOf(from.path);
                // console.log('在' + fromDepth);
                // console.log('去' + toDepth);
                this.transitionName = toDepth > fromDepth ? 'fold-left' : 'fold-right';
            },
            blueToothList(val) {
                // console.log("我是蓝牙设备");
                // console.log(val);
            }
        },
        created() {
            console.log("created-userroute:"+this.$store.state.userroute);
            console.log("created-path:"+this.$route.path);
                setTimeout(function () {
                    try{
                        //initialize();//教师端去掉启动蓝牙检测
                        navigator.splashscreen.hide();
                    }catch (e) {
                        console.log(e);
                    }
                }, 500);
        },
        mounted() {
            let exitAppTicker = 0;
            let _this = this;
            document.addEventListener("deviceready", function () {

                cordova.getAppVersion.getPackageName().then(function(packageName) {
                    checkUpgrade('android', packageName);
                });

                document.addEventListener("backbutton", function () {
                    console.log(_this.pageUrl);
                    if (_this.pageUrl == '/') {
                        if (exitAppTicker == 0) {
                            exitAppTicker++;
                            Toast({
                                message: '再按一次退出',
                                position: 'bottom',
                                duration: 2000
                            });
                            setTimeout(function () {
                                exitAppTicker = 0;
                            }, 2000);
                        } else if (exitAppTicker == 1) {
                            navigator.app.exitApp(); //退出app
                        }
                    } else if (_this.pageUrl == '/studentIndex') {
                        if (exitAppTicker == 0) {
                            exitAppTicker++;
                            Toast({
                                message: '再按一次退出',
                                position: 'bottom',
                                duration: 2000
                            });
                            setTimeout(function () {
                                exitAppTicker = 0;
                            }, 2000);
                        } else if (exitAppTicker == 1) {
                            navigator.app.exitApp(); //退出app
                        }
                    } else if (_this.pageUrl == '/teacher') {
                        if (exitAppTicker == 0) {
                            exitAppTicker++;
                            Toast({
                                message: '再按一次退出',
                                position: 'bottom',
                                duration: 2000
                            });
                            setTimeout(function () {
                                exitAppTicker = 0;
                            }, 2000);
                        } else if (exitAppTicker == 1) {
                            navigator.app.exitApp(); //退出app
                        }
                    } else {
                        history.back();
                    }
                }, false);
            }, false);
        }
    }
</script>


<style lang="scss">
    #app {
        width: 100%;
        height: 100%;
    }

    .fold-left-enter-active {
        animation-name: fold-left-in;
        animation-duration: .3s;
    }

    .fold-left-leave-active {
        animation-name: fold-left-out;
        animation-duration: .3s;
    }

    @keyframes fold-left-in {
        0% {
            -webkit-transform: translate3d(100%, 0, 0);
            transform: translate3d(100%, 0, 0);
            /* visibility: visible; */
        }
        /*50% {
          transform: translate3d(50%, 0, 0);
        }*/
        100% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes fold-left-out {
        0% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
        /*50% {
          transform: translate3d(-50%, 0 , 0);
        }*/
        100% {
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
            /* visibility: hidden; */
        }
    }

    .fold-right-enter-active {
        animation-name: fold-right-in;
        animation-duration: .3s;
    }

    .fold-right-leave-active {
        animation-name: fold-right-out;
        animation-duration: .3s;
    }

    @keyframes fold-right-in {
        0% {
            width: 100%;
            -webkit-transform: translate3d(-100%, 0, 0);
            transform: translate3d(-100%, 0, 0);
            /* visibility: visible; */
        }
        /*50% {
          transform: translate3d(50%, 0, 0);
        }*/
        100% {
            width: 100%;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes fold-right-out {
        0% {
            width: 100%;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
        /*50% {
          transform: translate3d(-50%, 0 , 0);
        }*/
        100% {
            width: 100%;
            -webkit-transform: translate3d(100%, 0, 0);
            transform: translate3d(100%, 0, 0);
            /* visibility: hidden; */
        }
    }

    .clearfix:after {
        display: block;
        visibility: hidden;
        clear: both;
        height: 0;
        content: '';
    }

    .mint-indicator-wrapper {
        z-index: 3000 !important;
    }
</style>
