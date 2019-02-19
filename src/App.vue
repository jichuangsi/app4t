<template>
    <div id="app">
        
        <div class="black" v-show="cancelshow">
            <div class="black_box">
                <div class="cancel" v-show="!mandatory" @click="cancelbtn">x</div>
                <img class="img" src="../src/assets/升级.png" alt="">
                <div class="black_text">检查到新版本</div>
                <div class="black_text1" v-for="(item,index) in remark.split(';')" :key="index"><span><img src="../src/assets/升级菱形.png" alt=""></span>{{item}}</div>
                <div class="black_text2" @click="upgradeclick">立即升级</div>
            </div>
        </div>
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
    import {checkUpgrade,upgradeForAndroid} from '@/utils/upgrade'

    export default {
        name: 'App',
        data() {
            return {
                transitionName: 'fold-left',
                pageUrl: '',
                cancelshow:false,
                releasePath:'',
                packageName:'',
                remark:'',
                mandatory:false
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
                'blueToothList',
                'isPopupUpgrade',
                'upgradeInfo'
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
                if(this.$route.path=='/assistant' /*需要调整为老师页面*/
                    ||this.$route.path=='/teacherIndex'
                    ||this.$route.path=='/teacherenquiry'
                    ||this.$route.path=='/teacherInformation'){
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
                //console.log("我是蓝牙设备");
                //console.log(val);
            },
            isPopupUpgrade(state){
                this.cancelshow = state;
            },
            upgradeInfo(obj){
                this.releasePath = obj.releasePath;
                this.packageName = obj.packageName;
                this.remark = obj.remark;
                this.mandatory = obj.mandatory;
            }
        },
        created() {
            /*console.log("created-userroute:"+this.$store.state.userroute);
            console.log("created-path:"+this.$route.path);
                setTimeout(function () {
                    try{
                        initialize();//教师端去掉启动蓝牙检测
                        navigator.splashscreen.hide();
                    }catch (e) {
                        console.log(e);
                    }
                }, 500);*/
        },
        mounted() {
            let exitAppTicker = 0;
            let _this = this;
            document.addEventListener("deviceready", function () {
                setTimeout(function () {
                    try{
                        //initialize();//教师端去掉启动蓝牙检测
                        navigator.splashscreen.hide();
                    }catch (e) {
                        console.log(e);
                    }
                }, 500);

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
        },
        methods:{
            //取消升级页面
           cancelbtn () {
               this.cancelshow = false
           },
           //升级
           upgradeclick() {
               upgradeForAndroid(this.releasePath,this.packageName);
               this.cancelshow = false
           }
        }
    }
</script>


<style lang="scss">
    #app {
        width: 100%;
        height: 100%;
    }
    .black {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        background-color:rgba(0,0,0,0.2)
    }
    .black_box {
        width: 42rem;
        // height: 56rem;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -21rem;
        margin-top: -23rem;
        border-radius: 2rem;
        .img {
            width: 100%;
            margin-top: -5rem;
        }
    }
    .cancel {
        width: 2rem;
        height: 2rem;
        line-height: 1.6rem;
        text-align: center;
        font-size: 2rem;
        border: 2px solid #fff;
        border-radius: 50%;
        color: #fff;
        position: absolute;
        right: 1.4rem;
        top: 0.4rem;
    }
    .black_text {
        margin-top: 1rem;
        text-align: center;
        font-size: 2rem;
        margin-bottom: 3.2rem;
    }
    .black_text1 {
        margin-top: 1.2rem;
        font-size: 1.4rem;
        text-indent: 10px;
        margin-left: 12rem;
        span {
            display: inline-block;
                vertical-align: middle;
            img {
                margin-right: 10px;
            }
        }
    }
    .black_text2 {
        width: 19.9rem;
        height: 4.29rem;
        line-height: 4.29rem;
        margin: 5rem auto;
        font-size: 24px;
        color: white;
        box-sizing: border-box;
        background: linear-gradient(to right, #08EBD0, #28A1EC);
        border-radius: 4.29rem;
        text-align: center;
        padding-bottom: 10px;
    }
    .black_text2:active{
        background-image: linear-gradient(-166deg, invalid gradient);
        box-shadow: 0 2px 6px 3px #62D8EF, 0 2px 23px 8px rgba(103,217,255,0.89);
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
