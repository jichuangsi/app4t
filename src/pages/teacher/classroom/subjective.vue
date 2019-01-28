<template>
    <div class="subjectiveDetails">
        <teacher-header :header="header"/>
        <scroll-content ref="myscrollfull" @reload="reloadData" v-if="pageShow" :mescrollValue="mescrollValue">
            <div class="subjective_warp">
                <div class="topic" v-html="studentList.questionContent">
                    {{studentList.questionContent}}
                </div>
                <!--<div class="remind" v-if="studentList.questionPic" @click.stop="picimg(studentList.questionPic)">
                    （点开查看图片）
                </div>
                <div class="bigimg" v-if="dsadsa">
                    <div class="btn" @click.stop="picimgshow">x</div>
                    <img :src="bigimg" alt="">
                </div>-->
                <PopupPic :questionPic="studentList.questionPic"/>
            </div>
            <div class="tips">
                提交人数：{{initial.count}}人
            </div>
            <div id="subjectiveChart">

            </div>
            <div class="subjectiveTitle">
                <span class="icon"></span>
                <span class="title">学生列表</span>
            </div>
            <student-list :studentList="studentList"/>
        </scroll-content>
        <loading v-if="loading"/>
    </div>
</template>

<!--主观题详情-->

<script>
    import TeacherHeader from '../../../components/public/PublicHeader'
    import ScrollContent from '../../../components/public/ScrollContent'
    import StudentList from '../../../components/teacherClassroom/studentList'
    import {
        getCourseStatistics,
        getQuestion,
        getQuestionStatisticsList
        //getQuestionPic
    } from '@/api/teacher/classroom'
    import Loading from '../../../components/public/Loading'
    import {mapGetters} from 'vuex'
    import PopupPic from '../../../components/teacherClassroom/PopupPic'

    export default {
        components: {
            TeacherHeader,
            ScrollContent,
            StudentList,
            Loading,
            PopupPic
        },
        data() {
            return {
                //饼图数据
                mescrollValue: {up: false, down: true},          //是否需要上拉加载状态
                loading: true,                                    //页面加载状态
                pageShow: false,                                  //内容加载状态
                header: {                                         //头部标题加载
                    title: '',
                    url: '/TClassroom'
                },
                studentCount: '',
                studentList: {},
                initial: {
                    count: ''
                }/*,
                bigimg:'',
                dsadsa: false*/
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'topicId',
                'courseId',
                'title'
            ])
        },
        mounted() {
            this.getStudent();
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
            //获取页面数据
            async getStudent() {
                //获取题目基本信息
                let self = this;
                let r1 = await getQuestion(self.topicId);
                self.studentList = r1.data.data;
                self.supplementStudentList(self.studentList.answerForStudent);
                let r2 = await getCourseStatistics(self.courseId);
                self.studentCount = r2.data.data.studentCount;
                //获取当前人数的初始值 平均分 正确率
                let res = await getQuestionStatisticsList(self.courseId);
                this.pageShow = true;
                this.loading = false;
                let data = res.data.data.list;
                data.forEach((question) => {
                    if (question.questionId === self.topicId) {
                        self.initial.count = question.count;
                    }
                });
                this.drawLine();
                this.header.title = this.title;
            },
            //饼图加载
            drawLine() {
                this.$nextTick(function () {
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = this.$echarts.init(document.getElementById('subjectiveChart'));
                    // 绘制图表
                    myChart.setOption({
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            top: 0,
                            left: 0,
                            itemGap: 35,
                            bottom: 'bottom',
                            data: [{name: "提交", icon: 'circle'}, {name: "未提交", icon: 'circle'}],
                            formatter: function (a) {
                                return a;
                            }
                        },
                        series: [
                            {
                                name: '主观题',
                                type: 'pie',
                                radius: '70%',
                                center: ['70%', '55%'],
                                data: [
                                    {value: this.initial.count, name: "提交"},
                                    {value: this.studentCount - this.initial.count, name: "未提交"}
                                ],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color: ['rgba(103,233,117,1)', 'rgba(48,154,60,1)']
                    });
                })
            },
            reloadData() {
                setTimeout(() => {
                    this.getStudent();
                    this.$refs.myscrollfull.endSuccess();
                }, 2000)
            },
            supplementStudentList(answerForStudent) {
                let allStudent = JSON.parse(sessionStorage.getItem("curClassStudentsList"));
                let restStudent = [];
                for(let i = 0; i < allStudent.length; i++){
                    let included = false;
                    for(let j = 0; j < answerForStudent.length; j++){
                        if(allStudent[i].studentId === answerForStudent[j].studentId){
                            included = true;
                            break;
                        }
                    }
                    if(!included){
                        restStudent.push(allStudent[i]);
                    }
                }
                console.log(restStudent);
                restStudent.forEach((s) => {
                    s.result = "NONE";
                    answerForStudent.push(s);
                })
            }
        }
    }
</script>

<style lang="scss">
    .subjectiveDetails {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .mescroll {
            box-sizing: border-box;
            position: absolute;
            top: 3.15rem;
            bottom: 6rem;
            padding: 3.5rem 4.86rem 3.14rem;
            height: auto !important;
            background-color: rgba(255, 255, 255, 1);
            .subjective_warp {
                padding: 2.86rem 2.29rem;
                font-size: 18px;
                border-radius: 18px;
                line-height: 34px;
                background-color: rgba(246, 255, 247, 1);
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
                }
                .remind {
                    font-size: 16px;
                    color: #666;
                    position: absolute;
                    right: 40%;
                    // bottom: 0%
                }*/
            }
            .tips {
                padding: 3.43rem 0 .79rem;
                font-size: 18px;
                color: rgba(105, 180, 130, 1);
                position: relative;
            }
            .subjectiveTitle {
                height: 2rem;
                position: relative;
                margin: 1.43rem 0 2.29rem;
                .icon {
                    display: inline-block;
                    width: .57rem;
                    height: 1.43rem;
                    margin-top: .285rem;
                    background-color: rgba(128, 213, 156, 1);
                }
                .title {
                    position: absolute;
                    top: 50%;
                    margin-left: .57rem;
                    transform: translateY(-50%);
                    font-size: 20px;
                    color: rgba(53, 53, 53, 1);
                }
            }
            #subjectiveChart {
                width: 100%;
                height: 11.7rem;
                position: relative;
                padding-bottom: 1.93rem;
                &:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom: 2px solid rgba(230, 230, 230, .5);
                    -webkit-transform: scaleY(.5);
                    -webkit-transform-origin: 0 0;
                }
            }
        }
    }
    .MathJye table{
        border-collapse: collapse;
        margin: 0;
        padding: 0;
        text-align: center;
        vertical-align: middle;
        line-height: normal;
        font-size: inherit;
        _font-size: 100%;
        font-style: normal;
        font-weight: normal;
        border: 0;
        float: none;
        display: inline-block;
        zoom: 0;
    }
    .mathjye-underpoint2 {
        border-bottom: 2px dotted #000;
        padding-bottom: 3px;
    }
    #q_answer{display:none;}
    table.edittable{border-collapse:collapse;text-align:center;margin:2px}table.edittable td,table.edittable th{line-height:30px;padding:5px;white-space:normal;word-break:break-all;border:1px solid #000;vertical-align:middle}table.composition{border-collapse:collapse;text-align:left;margin:2px;width:98%}table.composition td,table.composition th{line-height:30px;white-space:normal;word-break:break-all;border-width:0;vertical-align:middle}table.composition2{border-collapse:collapse;width:auto}table.composition2 td,table.composition2 th{text-align:left;line-height:30px;white-space:normal;word-break:break-all;border:none;border-width:0;vertical-align:middle}
    sup {
        vertical-align: super;
    }
</style>
