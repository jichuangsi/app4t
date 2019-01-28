<template>
    <div class="teacherIndex">
        <div class="header">
            <div class="title_warp">
                <div
                        class="title"
                        @click="changeTabs(index)"
                        v-for="(item,index) in tabs"
                        :key="item.index">{{item.text}}
                </div>
                <div class="bar"
                     :style="navStyle"></div>
            </div>
        </div>
        <swiper ref="mySwiper">
            <swiper-slide v-if="pageShow">

                <scroll-content ref="myscrollfull" @load="loadData" @reload="reloadData" :mescrollValue="mescrollValue"
                                :tips="tips">
                    <div slot="empty">无任何数据</div>
                    <input class="search classSearch" type="text" v-model="inputValue" placeholder="搜索课程">
                    <course-list v-for="item in filtersTextChange" :key="item.index"
                                 :teacherClassroom="item"/>
                    <div class="history" v-if="classState">上拉查看历史信息</div>
                </scroll-content>

            </swiper-slide>
            <swiper-slide v-if="pageShow">
                <scroll-content class="homeWork_content" ref="myscrollfulls" @load="loadDatas" @reload="reloadDatas"
                                :tips="tipss">
                    <div slot="empty">无任何数据</div>
                    <input class="search searchHomeWork " type="text" placeholder="搜索作业">
                    <div class="PublicHomeWork">
                        <!--待批改-->
                        <div class="task_content" v-for="item in pendingList"
                             :key="item.index">
                            <h1 class="title pendingTitle">{{item.date}}</h1>
                            <div class="task_warp">
                                <router-link class="task"
                                             tag="div" to="/TStudentList"
                                             v-for="items in item.content"
                                             :key="items.index"
                                             :class="{violet:items.state == 1,green:items.state == 2,yellow:items.state ==3}"
                                >
                                    <span class="task_name">{{items.title}}</span>
                                    <span class="class">班级:{{items.class}}班</span>
                                    <span class="submitter">提交人数:{{items.submitter}}人</span>
                                    <span class="state" v-if="items.state==1">发布</span>
                                    <span class="state" v-if="items.state==2">已批改</span>
                                    <span class="state" v-if="items.state==3">待批改</span>
                                </router-link>
                            </div>
                        </div>
                        <!--今天的作业-->
                        <div class="task_content" v-for="item in nowTeacherWork"
                             :key="item.index">
                            <h1 class="title">{{item.date}}</h1>
                            <div class="task_warp">
                                <router-link class="task"
                                             tag="div" to="/TStudentList"
                                             v-for="items in item.content"
                                             :key="items.index"
                                             :class="{violet:items.state == 1,green:items.state == 2,yellow:items.state ==3}"
                                >
                                    <span class="task_name">{{items.title}}</span>
                                    <span class="class">班级:{{items.class}}班</span>
                                    <span class="submitter">提交人数:{{items.submitter}}人</span>
                                    <span class="state" v-if="items.state==1">发布</span>
                                    <span class="state" v-if="items.state==2">已批改</span>
                                    <span class="state" v-if="items.state==3">待批改</span>
                                </router-link>
                            </div>
                        </div>
                        <div class="history" v-if="!teacherWork.length">上拉查看历史信息</div>
                        <!--历史作业-->
                        <div class="task_content" v-for="item in teacherWork"
                             :key="item.index">
                            <h1 class="title">{{item.date}}</h1>
                            <div class="task_warp">
                                <router-link class="task"
                                             tag="div" to="/TStudentList"
                                             v-for="items in item.content"
                                             :key="items.index"
                                             :class="{violet:items.state == 1,green:items.state == 2,yellow:items.state ==3}"
                                >
                                    <span class="task_name">{{items.title}}</span>
                                    <span class="class">班级:{{items.class}}班</span>
                                    <span class="submitter">提交人数:{{items.submitter}}人</span>
                                    <span class="state" v-if="items.state==1">发布</span>
                                    <span class="state" v-if="items.state==2">已批改</span>
                                    <span class="state" v-if="items.state==3">待批改</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </scroll-content>
            </swiper-slide>
        </swiper>
        <loading v-if="loading"/>
    </div>
</template>
<!--课堂作业-->
<script>
    import ScrollContent from '../public/ScrollContent'
    import courseList from '../teacherClassroom/courseList'
    import Loading from '../public/Loading'
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import {getHistory} from "../../api/teacher/classroom"

    export default {
        name: 'TeacherIndex',
        components: {
            ScrollContent,
            courseList,
            Loading
        },
        data() {
            return {
                //input输入的值
                inputValue: '',
                mescrollValue: {up: true, down: true},
                //课堂总页码
                classPageNum: 100,
                //判断课堂是否还有
                classState: true,
                //导航样式
                navStyle: '',
                //导航
                tabs: [
                    {
                        id: 1,
                        text: '课程'
                    },
                    {
                        id: 2,
                        text: '作业'
                    }
                ],
                loading: true,    //加载状态
                pageShow: false,  //内容加载状态
                tips: '没有更多课堂列表',    //课堂加载到最后的提示
                tipss: '没有更多作业',      //作业加载到最后的提示
                //课堂今天要上的课
                teacherClassroom: [],
                nowTeacherWork: [
                    {
                        date: '8月15日',
                        content: [{
                            title: '一课一练',
                            class: '初一(1)',
                            submitter: '10',
                            state: 1
                        }, {
                            title: '一课一练',
                            class: '初一(1)',
                            submitter: '10',
                            state: 2
                        }, {
                            title: '一课一练',
                            class: '初一(1)',
                            submitter: '10',
                            state: 3
                        }, {
                            title: '一课一练',
                            class: '初一(1)',
                            submitter: '10',
                            state: 2
                        }]
                    }
                ],       //今天的作业
                teacherWork: [],          //历史作业
                pendingList: [            //待批改作业
                    {
                        date: '待批改',
                        content: [{
                            title: '一课一练',
                            class: '初一(1)',
                            submitter: '10',
                            state: 3
                        }, {
                            title: '一课一练',
                            class: '初一(1)',
                            submitter: '10',
                            state: 3
                        }, {
                            title: '一课一练',
                            class: '初一(1)',
                            submitter: '10',
                            state: 3
                        }, {
                            title: '一课一练',
                            class: '初一(1)',
                            submitter: '10',
                            state: 3
                        }]
                    }
                ]
            }
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            },
            ...mapGetters([
                'classList',
                'homeworkList'
            ]),
            //查找数据
            filtersTextChange() {
                let _this = this;
                let arr = [];
                if (_this.inputValue === '') {
                    _this.teacherClassroom = _this.classList;
                    return _this.teacherClassroom;
                } else {
                    for (let i = 0; i < _this.teacherClassroom.length; i++) {
                        /*console.log(_this.teacherClassroom[i].courseName + ", " + _this.inputValue);*/
                        /*if (_this.teacherClassroom[i].courseName === _this.inputValue) {
                            arr.push(_this.teacherClassroom[i]);
                        }*/
                        if(_this.teacherClassroom[i].courseName.indexOf(_this.inputValue) > -1){
                            arr.push(_this.teacherClassroom[i]);
                        }
                    }
                    return arr;
                }
            }
        },
        mounted() {
            this.getTeacherIndex();
        },
        methods: {
            //检测导航改变
            changeTabs(index) {
                for (let i = 0; i < this.tabs.length; i++) {
                    if (i === index) {
                        this.navStyle = 'transition: left .2s;left:113.08px;';
                    } else {
                        this.navStyle = 'transition: left .2s;left:30.06px;';
                    }
                }
                this.swiper.slideTo(index, 500, false);
            },
            //获取第一次的内容
            getTeacherIndex() {
                let _this = this;
                this.$store.dispatch('getTeacherClass').then(() => {
                    _this.pageShow = true;
                    _this.loading = false;
                    _this.teacherClassroom = _this.classList;
                    this.swiper.on('slideChangeTransitionEnd', function () {
                        for (let i = 0; i < _this.tabs.length; i++) {
                            if (i === this.activeIndex) {
                                _this.navStyle = 'transition: left .2s;left:113.08px;';
                            } else {
                                _this.navStyle = 'transition: left .2s;left:30.06px;';
                            }
                        }
                    })
                }).catch((err) => {
                    console.log("err", err);
                });
            },
            //课堂上拉加载的的api
            loadData(pageIndex) {
                setTimeout(() => {
                    console.log(this.classPageNum, pageIndex);
                    getHistory(pageIndex)
                        .then(res => {
                            store.commit('SET_CLASSHISTORY', res.data.data.content);
                            this.teacherClassroom = this.classList;
                            this.classPageNum = res.data.data.pageCount;
                            if (this.classPageNum === pageIndex) {
                                this.classState = false;
                                console.log('执行了');
                            }
                            this.$refs.myscrollfull.endByPage(res.data.data.pageSize, res.data.data.pageCount);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }, 2000)
            },
            //作业上拉加载的api
            loadDatas(pageIndex) {
                setTimeout(() => {
                    let _this = this;
                    this.api.getTeacherWork()
                        .then(function (res) {
                            _this.teacherWork = res.data.teacherWork;
                            _this.$refs.myscrollfulls.endByPage(1, 2);
                        })
                        .catch(function (err) {
                            console.log('err' + err);
                        });
                    //第一个参数：当前页获取的数据总数；第二个参数：列表总页数
                }, 2000)
            },
            //课堂下拉刷新
            reloadData() {
                let _this = this;
                setTimeout(() => {
                    this.$store.dispatch('getTeacherClass').then(() => {
                        _this.teacherClassroom = _this.classList;
                        _this.$refs.myscrollfull.endSuccess();
                    }).catch((err) => {
                        console.log("err", err);
                    });
                }, 1000);
            },
            //作业下拉
            reloadDatas() {
                let _this = this;
                setTimeout(function () {
                    console.log("作业数据刷新成功");
                    _this.$refs.myscrollfulls.endSuccess();
                }, 1000);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .teacherIndex {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .header {
            width: 100%;
            height: 3.15rem;
            line-height: 3.15rem;
            position: fixed;
            z-index: 10;
            background-color: rgba(145, 220, 169, 1);
            .title_warp {
                width: 100%;
                display: flex;
                font-size: 24px;
                color: white;
                box-sizing: border-box;
                .title {
                    height: 100%;
                    color: white;
                    position: relative;
                    box-sizing: border-box;
                    margin-left: 30.02px;
                }
                .bar {
                    position: absolute;
                    width: 53px;
                    left: 30.06px;
                    bottom: -.5px;
                    height: 3px;
                    border-radius: 3px;
                    background-color: #FFFFFF;
                }
                .bar_left {
                    /*animation: toLeft .3s forwards;*/
                }

                .bar_right {
                    /*animation: toRight .3s forwards;*/
                }

                @keyframes toRight {
                    from {
                        left: 30.06px;
                    }
                    to {
                        left: 113.08px;
                    }
                }
                @keyframes toLeft {
                    from {
                        left: 113.08px;
                    }
                    to {
                        left: 30.06px;
                    }
                }
            }
        }
        .swiper-container {
            position: absolute;
            left: 0;
            top: 3.15rem;
            right: 0;
            bottom: 6rem;
            box-sizing: border-box;
            .mescroll {
                position: absolute;
                top: 0;
                box-sizing: border-box;
                padding: 2.36rem 2rem 0;
                .empty {
                    text-align: center;
                    font-size: 18px;
                    padding-top: 1.79rem
                }
                .search {
                    width: 100%;
                    height: 3.14rem;
                    border-radius: 32px;
                    text-align: center;
                    font-size: 18px;
                    padding: 0 1rem;
                    box-sizing: border-box;
                    margin-bottom: 3.43rem;
                }
                .classSearch {
                    background-color: #ffffff;
                }

                .searchHomeWork {
                    background-color: #f8f8f8;
                }
                .PublicHomeWork {
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
                            padding: 2.29rem 1.14rem;
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
                                height: 3.14rem;
                                line-height: 1.86rem;
                                font-size: 16px;
                                border-radius: 16px;
                                .task_name {
                                    max-width: 30%;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    color: rgba(53, 53, 53, 1);
                                }
                                .class {
                                    max-width: 30%;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    color: rgba(136, 136, 136, 1);
                                }
                                .submitter {
                                    max-width: 30%;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .state {
                                    max-width: 20%;
                                    width: 20%;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    position: relative;
                                    text-align: center;
                                }
                            }
                            .violet {
                                background-color: rgba(241, 238, 254, 1);
                                .state {
                                    line-height: 1.86rem;
                                    border-radius: 1.86rem;
                                    background-color: rgba(142, 120, 240, 1);
                                    color: white;
                                }
                            }
                            .green {
                                background-color: rgba(222, 255, 225, 1);
                                .state {
                                    color: rgba(101, 179, 127, 1);
                                }
                            }
                            .yellow {
                                background-color: rgba(255, 248, 220, 1);
                                .state {
                                    color: rgba(162, 162, 162, 1);
                                    &:before {
                                        content: "";
                                        display: inline-block;
                                        height: .57rem;
                                        width: .57rem;
                                        background-color: rgba(255, 82, 82, 1);
                                        border-radius: 50%;
                                        position: absolute;
                                        top: .4rem;
                                        right: -.64rem;
                                        font-size: 0;
                                    }
                                }
                            }
                            .task:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                }
            }
            .homeWork_content {
                background-color: white;
            }
        }
        .history {
            font-size: 18px;
            text-align: center;
        }
    }
</style>
