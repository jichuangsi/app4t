<template>
    <div class="teacherTopic" @click="goTopic(topic.quesetionType,topic.questionId,topic.title)">
        <div class="title">{{topic.title}}</div>
        <div class="topic" v-html="topic.questionContent">{{topic.questionContent}}</div>
        <!--<div class="remind" v-if="topic.questionPic" @click.stop="picimg(topic.questionPic)">
            （点开查看图片）
        </div>
        <div class="bigimg" v-if="dsadsa">
            <div class="btn" @click.stop="picimgshow">x</div>
            <img :src="bigimg" alt="">
        </div>-->
        <PopupPic :questionPic="topic.questionPic"/>
        <div class="correct_rate" v-if="topic.quesetionType === 'objective'&&topic.questionStatus !== 'NOTSTART'">
            正确率{{topicAcc*100}}%
        </div>
        <div class="state" :class="{release_warp:topic.questionStatus=='NOTSTART'}">
            <div class="tips" v-if="topic.questionStatus !== 'NOTSTART'">
                <div>提交人数:&nbsp;&nbsp;<span class="people" v-text="percent(topicCount,studentCount)+'%'"></span></div>
                <div class="progressContainer">
                    <div class="progress" :style="{width:percent(topicCount,studentCount)+'%'}"></div>
                </div>
            </div>
            <router-link tag="div" to="/subjectiveDetails" class="button view" v-if="topic.questionStatus == 'FINISH' ">
                查看
            </router-link>
            <div class="button termination" v-if="topic.questionStatus == 'PROGRESS'"
                 @click.stop="terminationTips(topic.questionId)">终止作答
            </div>
            <div class="button release" v-if="topic.questionStatus == 'NOTSTART'"
                 @click.stop="releaseTips(topic.questionId)">发布
            </div>
        </div>
    </div>
</template>

<!--教师端课堂题目列表-->

<script>
    import {MessageBox, Toast} from 'mint-ui';
    import store from '@/store'
    import {mapGetters} from 'vuex'
    import {
        questionPublish,
        questionTerminate
        //getQuestionPic
    } from '@/api/teacher/classroom'
    import PopupPic from "./PopupPic";

    export default {
        name: "teacherTopic",
        components: {PopupPic},
        props: {
            topicAcc: {
                type: Number,
                default: 0
            },
            courseId: {
                type: String,
                default: null
            },
            topicCount: {
                type: Number,
                default: 0
            },
            topic: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            studentCount: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                /*bigimg:'',
                dsadsa: false*/
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'topicId',
                'title'
            ])
        },
        methods: {
            /*picimgshow(){
                let self = this
                self.dsadsa = false
            },
            picimg(src){
                let self = this
                self.dsadsa = true
                getQuestionPic(src).then(res=>{
                    // console.log(res.data.data.content)
                    self.bigimg = //res.data.data.content;
                        "data:image/png;base64," +
                        res.data.data.content.replace(",", "");
                })
            },*/
            percent: function (submited, total) {
                if (total == 0) return 0;
                else return (submited / total).toFixed(4) * 100;
            },
            //进入题目
            goTopic(type, id, title) {
                console.log(this.dsadsa)
                store.commit('SET_TOPICID', id);
                store.commit('SET_TITLE', title);
                if (type === 'objective') {
                    this.$router.push({
                        path: '@/pages/teacher/classroom/show-objective',
                        name: 'objectiveQuestions'
                    });
                } else if (type === 'subjective') {
                    this.$router.push({
                        path: '@/pages/teacher/classroom/subjective',
                        name: 'subjectiveDetails'
                    });
                }
            },
            //根据课堂id,题目id终止题目回答
            async terminationTips(questionId) {
                let self = this;
                try {
                    await MessageBox.confirm('', {message: '是否终止答题'});
                    await questionTerminate(self.courseId, questionId);
                    self.topic.questionStatus = 'FINISH';
                    Toast({
                        message: '终止答题成功',
                        position: 'bottom'
                    });
                } catch (e) {
                    // Toast({
                    //     message: e,
                    //     position: 'bottom'
                    // });
                }
            },
            //根据课堂id,题目id发布题目
            async releaseTips(questionId) {
                let self = this;
                try {
                    await MessageBox.confirm('', {message: '是否发布题目'});
                    await questionPublish(self.courseId, questionId);
                    self.topic.questionStatus = 'PROGRESS';
                    Toast({
                        message: '发布成功',
                        position: 'bottom'
                    });
                } catch (e) {
                    // Toast({
                    //     message: e,
                    //     position: 'bottom'
                    // });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .teacherTopic {
        font-size: 18px;
        padding: 2.29rem;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 18px;
        margin-bottom: 1.17rem;
        .title {
            color: rgba(105, 180, 130, 1);
        }
        /*.bigimg {
                position: fixed;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: #fff;
                z-index: 101;
                .btn {
                    padding: 1rem 2rem;
                    float: right;
                    font-size: 2.5rem;
                    color: yellowgreen;
                }
                img {
                    height: 100%;
                    width: 100%;
                    //padding: 4.5rem 2rem;
                }
            }
            .remind {
                font-size: 16px;
                color: #666;
                position: absolute;
                right: 40%;
                // bottom: 0%
            }*/
        .topic {
            padding: 1.14rem 0 .5rem;
            line-height: 34px;
            color: rgba(53, 53, 53, 1);
        }
        .correct_rate {
            font-size: 14px;
            line-height: 30px;
            color: #5AA5EF;
        }
        .state {
            height: 4rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .tips {
                width: 65%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-right: 10px;
                color: rgba(142, 120, 240, 1);
                /*overflow: hidden; !*自动隐藏文字*!*/
                text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                white-space: nowrap; /*强制不换行*/
                box-sizing: border-box;
                font-size: 16px;
                .people {
                    font-size: 26px;
                    color: #5AA5EF;
                }
                .progressContainer {
                    height: 8px;
                    width: 96%;
                    border-radius: 8px;
                    background-color: #ddd;
                    .progress {
                        background-color: #5AA5EF;
                        border-radius: 4px;
                        height: 8px;
                        line-height: 8px;
                    }
                }
            }
            .button {
                max-width: 35%;
                height: 36px;
                line-height: 36px;
                border-radius: 36px;
                padding: 0 1.86rem;
                color: white;
                font-size: 18px;
                box-sizing: border-box;
                overflow: hidden; /*自动隐藏文字*/
                text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                white-space: nowrap; /*强制不换行*/
            }
            .view {
                background-color: #5AA5EF;
            }
            .view:active {
                box-shadow: 0 2px 6px 3px #5AA5EF;
            }
            .termination {
                background-color: #FE5454;
            }
            .termination:active {
                background-color: #e74f4f;
                box-shadow: 0 2px 6px 3px #e74f4f;
            }
            .release {
                background-color: #69B482;
            }
            .release:active {
                background-color: #54956a;
                box-shadow: 0 2px 6px 3px #54956a;
            }
        }
        .release_warp {
            justify-content: flex-end;
        }
    }
</style>
