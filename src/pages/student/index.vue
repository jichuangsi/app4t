<template>
    <div class="student">
        <classroom v-show="linkState === 0" v-on:message="zxc($event)" v-on:messageout="qwe($event)"/>
        <homework v-show="linkState === 1"/>
        <my v-show="linkState === 2"/>
        <div class="footers">
            <div
                    class="link"
                    :class="{link_hover:index===linkState}"
                    v-for="(item,index) in footerArr"
                    :key="item.index"
                    @click="State(index)"
            >
                <div class="msg" v-if="index==0&&Message"></div>
                <span class="iconfont icon" v-html="item.icon"></span>
                <div class="text">{{item.text}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import classroom from '../../components/studentIndex/classroom'
    import homework from '../../components/studentIndex/homework'
    import my from '../../components/studentIndex/my'
    import {mapGetters} from 'vuex'

    export default {
        name: "student",
        components: {
            classroom,
            homework,
            my
        },
        data() {
            return {
                Message : '',
                linkState: 0,
                footerArr: [{
                    icon: '&#xe617;',
                    text: '课堂'
                }, {
                    icon: '&#xe618;',
                    text: '作业'
                }, {
                    icon: '&#xe616;',
                    text: '我的'
                }]
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'setState',
                'isBlueTooth'
            ])
        },
        methods: {
            qwe(val){
                this.Message = val
            },
            zxc(val){
                this.Message = val
            },
            State(index) {
                this.linkState = index;
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.name == 'classroom' || from.name == 'objectiveWork' || from.name == 'subjectiveWork' || from.name == 'myShow') {
                to.meta.isBack = true;
                next();
            } else {
                next();
            }
        },
        activated() {
            if (!this.$route.meta.isBack) {
                setTimeout(function () {
                    // initialize();
                }, 1000)
            }
            // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
            this.$route.meta.isBack = false
        }
    }

</script>

<style lang="scss">
    .student {
        width: 100%;
        height: 100%;
        position: relative;
        .footers {
            width: 100%;
            height: 6rem;
            display: flex;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 1000;
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
