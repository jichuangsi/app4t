<template>
    <div class="TObjective">
        <classroom-header :header="header" :jump="jump"/>
        <div class="objective_content" v-show="pageShow">
            <div class="objectiveTitle">
                <span class="icon"></span>
                <span class="title">作业信息</span>
            </div>
            <div class="student_msg">
                <div class="msg">
                    <div class="name"><span>姓名</span>&nbsp;韩梅梅</div>
                    <div class="class"><span>班级</span>&nbsp;初一（1）班</div>
                </div>
                <div class="score"><span>总分</span>&nbsp;80</div>
                <div class="objectiveScore"><span>客观题得分</span><span>&nbsp;40</span><span>共8题，答对7题</span></div>
                <div class="subjectiveScore"><span>客观题得分</span><span>&nbsp;未批改</span></div>
            </div>
            <div class="objectiveTitle" style="margin-bottom: 2.24rem">
                <span class="icon"></span>
                <span class="title">作业详情</span>
            </div>
            <div class="objective_topic">
                <div class="class_topic_warp">
                    <div class="objective_warp" v-for="(item,index) in objectiveList" :key="index">
                        <class-objective :objective="item" @selectAnswer="selectAnswer"/>
                        <div class="tips">错误。正确答案：B</div>
                    </div>
                </div>
            </div>
        </div>
        <loading v-if="loading"/>
    </div>

</template>

<!--作业客观题批改-->

<script>
    import classroomHeader from "../../../components/public/PublicHeader"
    import classObjective from "../../../components/topicList/classObjective"
    import Loading from '../../../components/public/Loading'

    export default {
        components: {
            classroomHeader,
            classObjective,
            Loading
        },
        data() {
            return {
                loading: true,                                //页面加载状态
                pageShow: false,                              //内容加载状态
                header: {                                     //头部标题内容
                    title: '一课一练-客观题',
                    url: '/TStudentList'
                },
                jump: {name: '转至主观题', url: '/TSubjective'},//添加主观题按钮
                workState: true,                              //是否需要线
                objectiveList: [{                             //api获取的客观题数据列表
                    questionId: 1,
                    title: '客观题-1',
                    questionContent: '有两根铁丝，第一根用去米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
                    answer: 'B',
                    options: ['第一根长', '第二根长', '一样长', '无法确定']
                },{                             //api获取的客观题数据列表
                    questionId: 2,
                    title: '客观题-2',
                    questionContent: '有两根铁丝，第一根用去米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
                    answer: 'B',
                    options: ['第一根长', '第二根长', '一样长', '无法确定']
                },{                             //api获取的客观题数据列表
                    questionId: 3,
                    title: '客观题-3',
                    questionContent: '有两根铁丝，第一根用去米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
                    answer: 'B',
                    options: ['第一根长', '第二根长', '一样长', '无法确定']
                }]
            }
        },
        mounted() {
            this.getTObjective();
        },
        methods: {
            selectAnswer() {

            },
            //获取页面数据
            getTObjective() {
                this.pageShow = true;
                this.loading = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .TObjective {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
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
        .objective_content {
            box-sizing: border-box;
            position: absolute;
            top: 4.29rem;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 0 1.14rem;
            height: auto !important;
            .objectiveTitle {
                height: 2rem;
                position: relative;
                margin: 2rem 0 1.4rem;
                .icon {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: .57rem;
                    height: 1.43rem;
                    background-color: rgba(128, 213, 156, 1);
                }
                .title {
                    position: absolute;
                    top: 50%;
                    margin-left: 1.14rem;
                    transform: translateY(-50%);
                    font-size: 24px;
                    color: rgba(53, 53, 53, 1);
                }
            }
            .student_msg {
                padding: 0 3.72rem;
                .msg {
                    display: flex;
                    font-size: 18px;
                    justify-content: space-between;
                    line-height: 1.42rem;
                    color: #999999;
                    span {
                        font-size: 20px;
                        color: rgba(53, 53, 53, 1);
                    }
                }
            }
            .score {
                position: relative;
                padding: 1.14rem 0;
                color: #69B482;
                font-size: 18px;
                span {
                    font-size: 20px;
                    color: #353535;
                }
                &:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom: 1px solid rgba(230, 230, 230, 1);
                    -webkit-transform: scaleY(.5);
                    -webkit-transform-origin: 0 0;
                }
            }
            .objectiveScore {
                padding: 1.14rem 0;
                span:nth-child(1) {
                    font-size: 20px;
                    color: #353535;
                }
                span:nth-child(2) {
                    font-size: 18px;
                    color: #999999;
                }
                span:nth-child(3) {
                    padding-left: 4.59rem;
                    font-size: 18px;
                    color: rgba(105, 180, 130, 1);
                }
            }
            .subjectiveScore {
                padding-bottom: 2.29rem;
                span:nth-child(1) {
                    font-size: 20px;
                    color: #353535;
                }
                span:nth-child(2) {
                    font-size: 18px;
                    color: #9c8afc;
                }
            }
            .objective_topic {
                padding: 0 1.14rem;
                .class_topic_warp {
                    padding: 1.14rem;
                    border-radius: 18px;
                    background-color: white;
                    .objective_warp {
                        /*background-color: #0e96ff;*/
                        position: relative;
                        width: 100%;
                        margin-bottom: 2.29rem;
                        &:before {
                            content: "";
                            position: absolute;
                            left: 2.57rem;
                            right: 2.57rem;
                            bottom: 0;
                            border-bottom: 2px solid #CFD1D9;
                            -webkit-transform: scaleY(.5);
                            -webkit-transform-origin: 0 0;
                        }
                        .tips {
                            padding: 0 3.71rem 2.73rem;
                            font-size: 20px;
                            color: #EA412D;
                        }
                    }
                    .objective_warp:last-of-type {
                        &:before {
                            display: none;
                        }
                    }
                }
            }
        }
    }
</style>
