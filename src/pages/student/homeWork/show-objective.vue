<template>
    <div class="objectiveWork">
        <classroom-header :header="header" :jump="jump"/>
        <div class="objective_content">
            <div class="class_topic_warp">
                <div class="objective_warp" v-for="(item,index) in list" :key="index">
                    <class-objective :objective="item" @selectAnswer="selectAnswer"/>
                </div>
            </div>
        </div>
        <mt-popup v-model="popupVisible">
            <div class="popup_warp">
                <div class="img_warp">
                    <img src="http://pd0qnho0l.bkt.clouddn.com/Group%204.png">
                </div>
                <div class="text">是否提交作业</div>
                <div class="operation">
                    <div @click="determine">是</div>
                    <div @click="signOut">否</div>
                </div>
            </div>
        </mt-popup>
        <loading v-if="loading"/>
    </div>
</template>

<!--客观题作业-->

<script>
    import classroomHeader from "../../../components/public/PublicHeader"
    import Loading from '../../../components/public/Loading'
    import classObjective from "../../../components/topicList/classObjective"
    import {MessageBox} from 'mint-ui';
    import {Indicator} from 'mint-ui';
    import {Toast} from 'mint-ui';

    export default {
        components: {
            classroomHeader,
            classObjective,
            Loading
        },
        data() {
            return {
                header: {                       //头部标题
                    title: '一课一练-客观题',
                    url: '/studentIndex'
                },
                popupVisible: false,           //提交作业弹出层状态
                loading: true,                 //加载状态
                pageShow: false,               //页面状态
                jump: {name: '转至主观题', url: '/subjectiveWork'},              //头部多加一个按钮
                objectiveAnswer: [],
                list: [
                    {                       //api数据列表
                        questionId: 1,
                        title: "客观题-1",
                        questionContent: '有两根铁丝，第一根用去米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
                        options: ['第一根长', '第二根长', '一样长', '无法确定']
                    }, {                       //api数据列表
                        questionId: 2,
                        title: "客观题-2",
                        questionContent: '有两根铁丝，第一根用去米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
                        options: ['第一根长', '第二根长', '一样长', '无法确定']

                    }, {                       //api数据列表
                        questionId: 3,
                        title: "客观题-3",
                        questionContent: '有两根铁丝，第一根用去米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
                        options: ['第一根长', '第二根长', '一样长', '无法确定']
                    }]
            }
        },
        mounted() {
            this.objectiveWork();
            for (let i = 0; i < this.list.length; i++) {
                this.objectiveAnswer.push({id: this.list[i].questionId, answer: ''})
            }
        },
        methods: {
            objectiveWork() {
                this.pageShow = true;
                this.loading = false;
            },
            //提交作业弹出层点击是操作
            determine() {
                this.popupVisible = false;
            },
            //提交作业弹出层点击否操作
            signOut() {
                this.popupVisible = false;
            },
            //点击提交按钮显示
            show() {
                this.popupVisible = true;
                this.$refs.objective.show();
            },
            selectAnswer(id, title) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.objectiveAnswer[i].id === id) {
                        this.objectiveAnswer[i].answer = title;
                    }
                }
                console.log(this.objectiveAnswer);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .objectiveWork {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        background-color: #F7F7F7;
        /*background-color: #1b1b1b;*/

        .objective_content {
            padding: 0 1.14rem;
            margin-top: 4.5rem;
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
                }
                .objective_warp:last-of-type {
                    &:before {
                        display: none;
                    }
                }
            }
        }
        .mint-popup {
            background-color: #f7f7f7;
            border-radius: 5px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, .5);
            .popup_warp {
                text-align: center;
                padding: 1.72rem 6.5rem 2.86rem;
            }
            .img_warp {
                padding-bottom: 2.29rem;
            }
            .text {
                padding-bottom: 3.93rem;
                font-size: 18px;
                color: #a2a2a2;
            }
            .operation {
                display: flex;
                justify-content: space-between;
                div {
                    background-color: #f7f7f7;
                    font-size: 20px;
                    color: #777777;
                }
                div:nth-child(1) {
                    color: #80d59c;
                }
            }
        }
    }
</style>
