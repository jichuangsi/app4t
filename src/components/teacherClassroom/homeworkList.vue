<template>
    <div class="homeworkList">
        <div class="task_content">
            <div class="task_warp">
                <div class="task" :class="{violet:teacherHomework.homeworkStatus==='NOTSTART',
                green:teacherHomework.homeworkStatus==='PROGRESS',
                yellow:teacherHomework.homeworkStatus=='FINISH',
                gray:teacherHomework.homeworkStatus=='COMPLETED',
                Deleting:isDeleting}">
                    <div class="homeworkInfo" @click.stop.passive="goHomework(teacherHomework.homeworkId)"  @touchstart="gtouchstart(teacherHomework)" @touchend="gtouchend(teacherHomework)">
                        <div class="homeworkInfo1">
                            <div class="task_name">{{teacherHomework.homeworkName}}<span class="task_status">({{transferStatus(teacherHomework.homeworkStatus)}})</span></div>
                        </div>
                        <div class="homeworkInfo2">
                            <div class="class">班级:{{teacherHomework.className}}</div>
                            <div class="submitter">提交人数:{{teacherHomework.submitted}}/{{teacherHomework.total}}</div>
                        </div>
                        <div class="homeworkInfo3">
                            <div class="item">发布时间:{{time(teacherHomework.homeworkPublishTime)}}</div>
                            <div class="item">结束时间:{{time(teacherHomework.homeworkEndTime)}}</div>
                        </div>
                    </div>

                    <div class="state" v-if="teacherHomework.homeworkStatus==='NOTSTART'" @click.stop.passive="updateStatus(teacherHomework.homeworkId, 'PROGRESS')"></div>
                    <div class="state" v-if="teacherHomework.homeworkStatus==='PROGRESS'"  @click.stop.passive="updateStatus(teacherHomework.homeworkId, 'FINISH')"></div>
                    <div class="state" v-if="teacherHomework.homeworkStatus==='FINISH'"  @click.stop.passive="updateStatus(teacherHomework.homeworkId, 'PROGRESS')"></div>
                    <div class="state" v-if="teacherHomework.homeworkStatus==='COMPLETED'"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import {updateHomeworkStatus} from "@/api/teacher/homework"
    import {MessageBox} from 'mint-ui'
    export default {
        name: "homeworkList",
        props: {
            teacherHomework: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data() {
            return {
                Loop:'',
                isDeleting:false
            }
        },
        computed: {
            //vuex 调用
            /*...mapGetters([
                'courseId'
            ])*/
        },
        methods: {
            transferStatus(status){
                if(status==='NOTSTART'){
                    return "未发布";
                }else if(status==='PROGRESS'){
                    return "已发布";
                }else if(status=='FINISH'){
                    return "停止提交";
                }else if(status=='COMPLETED'){
                    return "已结束";
                }else{
                    return "-";
                }
            },
            time(time) {
                if(time===0) return "暂无";
                let times = parseInt(time);
                let date = new Date(times);
                let month = (date.getMonth() + 1 > 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1);
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return month + '月' + day + '日\t' + hours + ':' + minutes;
            },
            //进入课堂
            goHomework(homeworkId) {
                store.commit('SET_HOMEWORKID', homeworkId);
                console.log(homeworkId);
                this.$router.push({
                    path: '@/pages/teacher/homeWork/student-list',
                    name: 'TStudentList'
                })
            },
            updateStatus(homeworkId, homeworkStatus){
                let _this = this;
                updateHomeworkStatus(homeworkId, homeworkStatus).then(res => {
                    console.log(res);
                    _this.$emit("reloadDatas");
                }) .catch(err => {
                    //console.log(err);
                });
            },
            gtouchstart(item) {
                let self = this
                //console.log(item)
                clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
                this.Loop=setTimeout(function(){
                    self.isDeleting = true;
                    if(item.homeworkStatus == 'FINISH'){
                        MessageBox.confirm('', {message: '是否结束'+item.homeworkName}).then(res=>{
                            //console.log(item.homeworkId,item.homeworkStatus)
                            self.updateStatus(item.homeworkId,'COMPLETED')
                        self.$emit('upRefresh')
                        }).catch (e =>{
                                console.log(e);
                        })
                    }
                },500);
            },
            gtouchend() {
                clearInterval(this.Loop);
                this.isDeleting = false;
                    console.log(789)
            }
        }
    }
</script>

<!--教师端课目信息-->

<style lang="scss">
    .homeworkList {
        .task_content {
            padding-bottom: 2.29rem;
            .title {
                font-size: 24px;
                padding-bottom: .57rem;
                color: rgba(128, 213, 156, 1);
            }
            .pendingTitle {
                color: rgba(238, 199, 32, 1);
            }
            .task_warp {
                position: relative;
                padding: 0.5rem 1.14rem;
                background-color: white;
                border-radius: 18px;
                .task {
                    position: relative;
                    box-sizing: border-box;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: .64rem 1.14rem .64rem 1.14rem;
                    margin-bottom: 1.14rem;
                    height: 7rem;
                    line-height: 1.86rem;
                    font-size: 16px;
                    border-radius: 16px;
                    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.18);
                    .homeworkInfo{
                        width: 100%;
                        .homeworkInfo1{
                            width: 100%;
                            padding-bottom: 0.5rem;
                            .task_name {
                                /*overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;*/
                                font-size: 20px;
                                color: rgba(53, 53, 53, 1);
                                .task_status {
                                    font-size: 16px;
                                    color: rgba(136, 136, 136, 1);
                                }
                            }
                        }
                        .homeworkInfo2{
                            float: left;
                            width: 50%;
                            .class {
                                /*max-width: 30%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;*/
                                color: rgba(136, 136, 136, 1);
                            }
                            .submitter {
                                /*!*max-width: 30%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;*/
                                color: rgba(136, 136, 136, 1);
                            }
                        }
                        .homeworkInfo3{
                            float: right;
                            width: 50%;
                            .item {
                                color: rgba(162, 162, 162, 1);
                            }
                        }
                    }
                    .state {
                        /*max-width: 20%;
                        width: 20%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        position: relative;
                        text-align: center;*/
                        // width: 8.57rem;
                        // height: 3rem;
                        // line-height: 3rem;
                        text-align: center;
                        font-size: 16px;
                        color: white;
                        border-radius: 100px;
                        margin-top: 3%
                    }
                }
                .violet {
                    background-color: rgba(241, 238, 254, 1);
                    .state {
                        //line-height: 1.86rem;
                        //border-radius: 1.86rem;
                        // background-color: rgba(142, 120, 240, 1);
                        // color: white;
                        width:136px;
                        height:50px;
                        background: url('../../assets/按钮.png') no-repeat;
                        background-position: -135px -1136px;
                    }
                    .state:active {
                        background: url('../../assets/按钮.png') no-repeat;
                        background-position: -578px -1136px;
                    }
                }
                .green {
                    background-color: rgba(222, 255, 225, 1);
                    .state {
                        width:136px;
                        height:50px;
                        background: url('../../assets/按钮.png') no-repeat;
                        background-position: -135px -1211px;
                    }
                    .state:active {
                        background: url('../../assets/按钮.png') no-repeat;
                        background-position: -578px -1211px;
                    }
                }
                .yellow {
                    background-color: rgb(255, 252, 225);
                    .state {
                        width:136px;
                        height:50px;
                        background: url('../../assets/按钮.png') no-repeat;
                        background-position: -135px -1280px;
                    }
                    .state:active {
                        background: url('../../assets/按钮.png') no-repeat;
                        background-position: -578px -1280px;
                    }
                }
                .gray {
                    background-color: rgba(230, 230, 230, 1);
                    .state {
                        width:136px;
                        height:50px;
                        background: url('../../assets/按钮.png') no-repeat;
                        background-position: -578px -1356px;
                    }
                }
                .Deleting {
                    box-shadow:0px 0px 0px #fff;
                }
                .task:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
