<template>
    <div class="black" v-show="cancelshow">
        <div class="black_box">
            <div class="cancel" v-show="!mandatory" @click="cancelbtn">x</div>
            <img class="img" src="../../assets/升级.png" alt="">
            <div class="black_text">检查到新版本</div>
            <div class="black_text1" v-for="(item,index) in remark.split(';')" :key="index"><span><img src="../../assets/升级菱形.png" alt=""></span>{{item}}</div>
            <div class="black_text2" @click="upgradeclick">立即升级</div>
        </div>
    </div>
</template>

<script>
    import {checkUpgrade,upgradeForAndroid} from '@/utils/upgrade'
    import {mapGetters} from 'vuex'

    export default {
        name: "Upgrade",
        data() {
            return {
                cancelshow:false,
                releasePath:'',
                packageName:'',
                remark:'',
                mandatory:false
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'isPopupUpgrade',
                'upgradeInfo'
            ])
        },
        watch: {
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

        },
        mounted() {
            document.addEventListener("deviceready", function () {
                cordova.getAppVersion.getPackageName().then(function(packageName) {
                    console.log("packageName:"+packageName);
                       checkUpgrade('android', packageName);
                   });
            });
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

<style lang="scss" scoped>
    .black {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 10;
        background-color:rgba(0,0,0,0.2);
        .black_box {
            width: 42rem;
            //height: 56rem;
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
            .black_text2:active {
                background-image: linear-gradient(-166deg, invalid gradient);
                box-shadow: 0 2px 6px 3px #62D8EF, 0 2px 23px 8px rgba(103,217,255,0.89);
            }
        }
    }

</style>