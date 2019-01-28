<template>
    <div class="studentList">
        <div class="studentList_warp" v-for="(item,index) in studentList.answerForStudent" :key="index">
            <div class="left">
                <!--<div class="avatar">
                    <div class="checkbox" @click="select(index,item.id)" v-if="allShow">
                        <div class="point" v-if="arr[index]"></div>
                    </div>
                    <div class="avatar_warps">
                        <img :src="item.avatar" alt="头像">
                    </div>
                </div>-->
                <div class="studentName">{{item.studentName}}</div>
            </div>
            <div class="right" v-if="studentList.quesetionType ==='objective'">
                <div class="studentSelect">{{item.answerForObjective}}</div>
                <div class="state correct" v-if="item.result === 'CORRECT'">正确</div>
                <div class="state look" v-if="item.result === 'WRONG'">错误</div>
                <div class="state unsubmitted" v-if="item.result === 'NONE'">未提交</div>
            </div>
            <div class="right" v-if="studentList.quesetionType ==='subjective'">
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
        <!--<div class="footer" v-if="allShow">
            <div class="selectAll" @click="allSelect">
                <div class="checkbox">
                    <div class="point" v-if="allState"></div>
                </div>
                全选
            </div>
            <div class="share">
                分享
            </div>
        </div>-->
    </div>
</template>

<!--学生列表-->

<script>
    import store from '@/store'

    export default {
        name: "studentList",
        props: {
            studentList: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            allShow: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                arr: [],
                selected: [],
                allState: false
            }
        },
        watch: {
            studentList: {
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
            }
        },
        methods: {
            select(index, id) {
                if (this.arr[index] === true) {
                    this.arr.splice(index, 1, false);
                    for (let i = 0; i < this.selected.length; i++) {
                        if (this.selected[i] === id) {
                            Array.prototype.remove = function (val) {
                                var index = this.indexOf(val);
                                if (index > -1) {
                                    this.splice(index, 1);
                                }
                            };
                            this.selected.remove(id);
                        }
                    }
                } else {
                    this.arr.splice(index, 1, true);
                    this.selected.push(id);
                }
                let state;
                for (let i = 0; i < this.arr.length; i++) {
                    if (this.arr[i] === false) {
                        state = false;
                    }
                }
                if (state === false) {
                    this.allState = false;
                } else {
                    this.allState = true;
                }
            },
            //全选
            allSelect() {
                let deposit = [];
                let state;
                for (let i = 0; i < this.arr.length; i++) {
                    if (this.arr[i] === false) {
                        state = false;
                    }
                }
                if (state === false) {
                    for (let j = 0; j < this.arr.length; j++) {
                        deposit.push(true);
                    }
                    this.arr = deposit;
                    this.allState = true;
                } else {
                    for (let j = 0; j < this.arr.length; j++) {
                        deposit.push(false);
                    }
                    this.arr = deposit;
                    this.allState = false;
                }
                console.log(this.arr);
            },
            //去批改页面
            correct(studentId) {
                store.commit('SET_STUDENTID', studentId);
                this.$router.push({
                    path: '@/pages/teacher/classroom/show-subjective',
                    name: 'subjectiveShow'
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
