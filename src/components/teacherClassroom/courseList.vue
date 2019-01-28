<template>
    <div class="courseList"
         @click="goCLassroom(teacherClassroom.courseId,teacherClassroom.courseName,teacherClassroom.teacherName,teacherClassroom.teacherId)">
        <div class="courseLeft">
            <div class="course">{{teacherClassroom.courseName}}</div>
            <div class="item grade">班级：{{teacherClassroom.className}}</div>
            <div class="item time">上课时间：{{time(teacherClassroom.courseStartTime)}}</div>
        </div>
        <div class="state class" v-if="'PROGRESS' === teacherClassroom.courseStatus">上课中</div>
        <div class="state view" v-if="'FINISH' === teacherClassroom.courseStatus">查看</div>
        <div class="state started" v-if="'NOTSTART' === teacherClassroom.courseStatus">未开始</div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import store from '@/store'

    export default {
        name: "courseList",
        props: {
            teacherClassroom: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'courseId'
            ])
        },
        methods: {
            time(courseEndTime) {
                let times = parseInt(courseEndTime);
                let date = new Date(times);
                let month = (date.getMonth() + 1 > 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1);
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return month + '月' + day + '日\t' + hours + ':' + minutes;
            },
            //进入课堂
            goCLassroom(Id, courseName, teacherName, teacherId) {
                store.commit('SET_COURSEID', Id);
                store.commit('SET_COURSENAME', courseName);
                store.commit('SET_TEACHERNAME', teacherName);
                store.commit('SET_TEACHERID', teacherId);
                console.log(this.courseId);
                this.$router.push({
                    path: '@/pages/teacher/classroom/show',
                    name: 'TClassroom'
                })
            }
        }
    }
</script>

<!--教师端课目信息-->

<style lang="scss">
    .courseList {
        width: 100%;
        border-radius: 18px;
        background-color: #fff;
        padding: 2.29rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2.29rem;
        .courseLeft {
            .course {
                color: rgba(53, 53, 53, 1);
                font-size: 28px;
            }
            .item {
                font-size: 20px;
                color: rgba(162, 162, 162, 1);
            }
            .grade {
                padding: 1.3rem 0 .5rem;
            }
        }
        .state {
            width: 8.57rem;
            height: 3rem;
            line-height: 3rem;
            text-align: center;
            font-size: 20px;
            color: white;
            border-radius: 100px;
        }
        .class {
            background-color: #8E78F0;
        }
        .view {
            background-color: #888888;
        }
        .started {
            background-color: #69B482;
        }
    }
</style>
