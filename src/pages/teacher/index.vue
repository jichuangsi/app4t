<template>
    <div class="teacherPage">
        <teacher-index v-show="linkState === 0"/>
        <teacher-my v-show="linkState === 1"/>
        <div class="footers">
            <div
                    class="link"
                    :class="{link_hover:index===linkState}"
                    v-for="(item,index) in footerArr"
                    :key="item.index"
                    @click="State(index)"
            >
                <span class="iconfont icon" v-html="item.icon"></span>
                <div class="text">{{item.text}}</div>
            </div>
        </div>
        <bluetooth v-if="isBlueTooth"/>
    </div>
</template>

<script>
    import teacherIndex from '../../components/teacherIndex/TeacherIndex'
    import teacherMy from '../../components/teacherIndex/teacherMy'
    import Bluetooth from '../../components/Bluetooth'

    import {mapGetters} from 'vuex'
    import {Indicator} from 'mint-ui';

    export default {
        components: {
            teacherIndex,
            teacherMy,
            Bluetooth
        },
        data() {
            return {
                linkState: 0,
                footerArr: [{
                    icon: '&#xe617;',
                    text: '课堂'
                }, {
                    icon: '&#xe616;',
                    text: '我的'
                },]
            }
        },
        computed: {
            ...mapGetters([
                'isBlueTooth'
            ])
        },
        methods: {
            State(index) {
                this.linkState = index;
            }
        },
        mounted() {
            // Indicator.open({
            //     text: '正在搜索附近蓝牙设备...',
            //     spinnerType: 'snake'
            // });
            // setTimeout(function () {
            //     Indicator.close();
            //
            // }, 100000);
            // initialize();
            // window.HandwrittenBoard.exploration();
            // window.HandwrittenBoard.connect("F3:EA:6B:C8:78:DB");
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == 'TClassroom' || from.name == 'TStudentList' || from.name == 'teacherInformation') {
                to.meta.isBack = true;
                next();
            } else {
                next();
            }
        },
        activated() {
            if (!this.$route.meta.isBack) {
                console.log('我运行了');
            }
            // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
            this.$route.meta.isBack = false
        }
    }
</script>

<style lang="scss" scoped>
    .teacherPage {
        .footers {
            width: 100%;
            height: 6rem;
            display: flex;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 999;
            background: #FFFFFF;
            box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.12);
            .link {
                position: relative;
                padding: .79rem 0 .36rem;
                flex: 1;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                color: rgba(203, 203, 203, 1);
                .icon {
                    line-height: 35px;
                    font-size: 35px;
                    position: relative;
                    .message {
                        position: absolute;
                        top: -5%;
                        left: 52%;
                        width: 1rem;
                        height: 1rem;
                        background-color: rgba(255, 82, 82, 1);
                        border-radius: 50%;
                    }
                }
                .text {
                    line-height: 28px;
                    font-size: 20px;
                }
                .msg {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    top: 10%;
                    left: 54%;
                    background-color: red;
                    z-index: 2;
                }
            }
            .link_hover {
                color: #4caf50;
            }
        }
    }
</style>
