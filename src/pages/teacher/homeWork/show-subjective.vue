<template>
    <div class="subjectiveWork">
        <classroom-header :header="header" :jump="jump"/>
        <div class="subjectiveContent" v-if="pageShow">
            <swiper ref="mySwiper">
                <swiper-slide v-for="(item,index) in subjective" :key="index">
                    <div class="subjective_warp">
                        <subjective :subjectiveTopic="item" :id="item.id"/>
                        <div class="button_warp">
                            <div class="subjective_submit"
                                 @click="modifyAnswer(item.id)">批改答案
                            </div>
                        </div>
                        <board :id="item.id" :subjectiveAnswer="subjectiveAnswer"/>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <loading v-if="loading"/>
    </div>
</template>

<script>
    import classroomHeader from "../../../components/public/PublicHeader"
    import subjective from "../../../components/topicList/subjective"
    import board from "../../../components/board/Board"
    import Loading from '../../../components/public/Loading'
    import {mapGetters} from 'vuex'
    import store from '@/store'

    export default {
        components: {
            classroomHeader,
            subjective,
            board,
            Loading
        },
        data() {
            return {
                loading: true,                      //加载状态
                pageShow: false,                    //页面显示状态
                header: {                           //头部标题显示
                    title: '一课一练-主观题',
                    url: '/TStudentList'
                },
                jump: {name: '转至客观题', url: '/TObjective'},//添加一个按钮跳转客观题
                subjectiveId: '',                   //主观题id
                subjective: [
                    {                     //api获取去内容
                        questionId: 1,
                        title: '主观题-1',
                        questionContent: '有两根铁丝，第一根用去 米，第二根用去 ，剩下的一样长，两根铁丝和原来相比如何。'
                    }, {                     //api获取去内容
                        questionId: 2,
                        title: '主观题-2',
                        questionContent: '有两根铁丝，第一根用去 米，第二根用去 ，剩下的一样长，两根铁丝和原来相比如何。'
                    }, {                     //api获取去内容
                        questionId: 3,
                        title: '主观题-3',
                        questionContent: '有两根铁丝，第一根用去 米，第二根用去 ，剩下的一样长，两根铁丝和原来相比如何。'
                    }],
                subjectiveAnswer: []
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'isBoard',
                'boardImg'
            ])
        },
        watch: {
            subjective: {
                handler() {
                    for (let i = 0; i < this.subjective.length; i++) {
                        this.subjectiveAnswer.push({id: this.subjective[i].id, answer: ''})
                    }
                },
                immediate: true,
                deep: true
            },
            boardImg(val) {
                for (let i = 0; i < this.subjectiveAnswer.length; i++) {
                    if (this.subjectiveAnswer[i].id === this.subjectiveId) {
                        this.subjectiveAnswer[i].answer = val;
                    }
                }
            }
        },
        mounted() {
            this.getSubjectiveWork();
        },
        methods: {
            getSubjectiveWork() {
                this.pageShow = true;
                this.loading = false;
            },
            modifyAnswer(id) {
                this.subjectiveId = id;
                if (this.isBoard) {
                    this.$store.commit('SET_POPUP_BLUETOOTH', true);
                } else {
                    store.commit('SET_BLUETOOTH', true);
                    window.HandwrittenBoard.exploration();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .subjectiveWork {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        overflow: auto;
        .jump {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 2.5rem;
            color: rgba(255, 255, 255, 1);
            font-size: 18px;
            &:before {
                content: " ";
                display: inline-block;
                height: 12px;
                width: 12px;
                border-width: 2px 2px 0 0;
                border-color: #ffffff;
                border-style: solid;
                -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
                position: absolute;
                top: 50%;
                right: -.8rem;
                margin-top: -2px;
            }
        }
        .subjectiveContent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            .swiper-container {
                width: 100%;
                height: 100%;
                overflow-y: scroll;
                .subjective_warp {
                    width: 100%;
                    height: 100%;
                    padding: 4.19rem 1.14rem 1.14rem;
                    box-sizing: border-box;
                    .button_warp {
                        padding-bottom: 20px;
                        position: relative;
                        height: 2.7rem;
                        .subjective_submit {
                            position: absolute;
                            right: 3.71rem;
                            padding: 0 20px;
                            height: 2.29rem;
                            border: 2px solid #9A84FF;
                            line-height: 2.29rem;
                            text-align: center;
                            border-radius: 1.145rem;
                            color: #9A84FF;
                            font-size: 18px;
                        }
                    }
                }
            }
        }
    }
</style>
