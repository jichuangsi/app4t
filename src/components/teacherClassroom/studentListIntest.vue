<template>
    <div class="studentList">
        <div class="studentList_warp" v-for="(item,index) in filtersCommittStudent" :key="index">
            <div class="left">
                <div class="studentName">{{item.studentName}}</div>
            </div>
            <div class="right" v-if="question.questionType ==='objective'">
                <div class="studentSelect">{{item.answerForObjective.split('|').join(',')}}</div>
                <div class="state correct" v-if="item.result === 'CORRECT'">正确</div>
                <div class="state look" v-if="item.result === 'WRONG'">错误</div>
                <div class="state unsubmitted" v-if="item.result === 'NONE'">未提交</div>
            </div>
            <div class="right" v-if="question.questionType ==='subjective'">
                <div class="studentSelect">{{item.subjectiveScore}}</div>
                <div class="state unsubmitted" v-if="item.result === 'NONE'">未提交</div>
                <div
                        @click="correct(item.studentId)"
                        class="state correct"
                        v-if="item.result !== 'NONE'&&item.result !== 'PASS'"
                >
                    批改
                </div>
                <div @click="correct(item.studentId)" class="state look" v-if="item.result === 'PASS'">查看
                </div>

            </div>
        </div>
    </div>
</template>

<!--学生列表-->

<script>
    import store from '@/store'
    import {mapGetters} from 'vuex'

    export default {
        name: "studentList",
        props: {
            question: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            index: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                arr: [],
                selected: [],
                allState: false
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'homeworkStudents',
            ]),
            //查找数据
            filtersCommittStudent() {
                let _this = this;
                let arr = [];
                if(!_this.question.answerModelForStudent||_this.question.answerModelForStudent.length==0){
                    return arr;
                }else{
                    _this.homeworkStudents.forEach((s, index) => {
                        //console.log(s);
                        let i = _this.question.answerModelForStudent.findIndex(x => {
                            //console.log(x);
                            return x.studentId == s.studentId&&s.completedTime!=0;
                        });
                        if(i!=-1) arr.push(_this.question.answerModelForStudent[i]);
                    });
                    //console.log(arr);
                    return arr;
                }

                /*if (_this.inputValue === '') {
                    return _this.homeworkStudents;
                } else {
                    for (let i = 0; i < _this.homeworkStudents.length; i++) {
                        if(_this.homeworkStudents[i].studentName.indexOf(_this.inputValue) > -1 ||
                            _this.homeworkStudents[i].studentAccount.indexOf(_this.inputValue) > -1){
                            arr.push(_this.homeworkStudents[i]);
                        }
                    }
                    return arr;
                }*/
            },
        },
        watch: {
            /*studentList: {
                handler() {
                    this.arr = [];
                    for (let i = 0; i < this.studentList.length; i++) {
                        this.arr.push(false);
                        console.log(1)
                    }
                    console.log(this.arr);
                },
                immediate: true,
                deep: true
            }*/
        },
        methods: {
            //去批改页面
            correct(studentId) {
                store.commit('SET_STUDENTID', studentId);
                store.commit('SET_HOMEWORKINITSLIDE', this.index);
                this.$router.push({
                    path: '@/pages/teacher/homeWork/show-subjective',
                    name: 'TSubjective'
                })
            }
        }
    }
</script>

<style lang="scss">
    .studentList {
        .studentList_warp {
            position: relative;
            display: flex;
            justify-content: space-between;
            height: 4.25rem;
            line-height: 4.25rem;
            font-size: 18px;
            color: rgba(53, 53, 53, 1);
            padding-bottom: 1.14rem;
            .left {
                display: flex;
                justify-content: space-between;
                max-width: 50%;
                width: 40%;
                .avatar {
                    width: 7.57rem;
                    height: 4.25rem;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .checkbox {
                        width: 1.71rem;
                        height: 1.71rem;
                        border-radius: 50%;
                        border: 2px solid #A2A2A2;
                        position: relative;
                        .point {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translateY(-50%) translateX(-50%);
                            width: .57rem;
                            height: .57rem;
                            border-radius: 50%;
                            background-color: #69b482;
                        }
                    }
                    .avatar_warps {
                        width: 4.25rem;
                        height: 4.25rem;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
                .studentName {

                }
            }

            .right {
                display: flex;
                justify-content: space-between;
                max-width: 40%;
                width: 30%;
                .state {

                }
                .correct {
                    color: rgba(105, 180, 130, 1);
                }
                .look {
                    color: rgba(142, 120, 240, 1);
                }
                .unsubmitted {
                    color: rgba(162, 162, 162, 1);
                }
            }
        }
        .footer {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            width: 100%;
            height: 6rem;
            padding: 0 4.68rem;
            font-size: 20px;
            box-sizing: border-box;
            box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.06);
            background-color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .selectAll {
                display: flex;
                align-items: center;
                color: rgba(162, 162, 162, 1);
                .checkbox {
                    width: 1.71rem;
                    height: 1.71rem;
                    border-radius: 50%;
                    border: 2px solid #A2A2A2;
                    position: relative;
                    margin-right: .57rem;
                    .point {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translateY(-50%) translateX(-50%);
                        width: .57rem;
                        height: .57rem;
                        border-radius: 50%;
                        background-color: #69b482;
                    }
                }
            }
            .share {
                padding: .5rem 2.79rem;
                background-color: #69B482;
                border-radius: 93px;
                color: rgba(255, 255, 255, 1);
            }
            .share:active {
                box-shadow: 0 2px 6px 3px #69B482;
            }
        }
    }
</style>
