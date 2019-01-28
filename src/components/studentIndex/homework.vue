<template>
    <div class="homeWork">
        <public-header :header="header"/>
        <scroll-content ref="myscrollfull" @load="loadData" @reload="reloadData" :list="list" v-if="pageShow"
                        :tips="tips">
            <div slot="empty">无任何数据</div>
            <div class="PublicHomeWork">
                <div class="task_content" v-for="item in pendingList" :key="item.index">
                    <h1 class="title pendingTitle">{{item.date}}</h1>
                    <div class="task_warp">
                        <router-link class="task"
                                     tag="div" to="/objectiveWork"
                                     v-for="items in item.content"
                                     :key="items.index"
                                     :class="{violet:items.state == 1,green:items.state == 2,yellow:items.state ==3}"
                        >
                            <span class="task_name">{{items.title}}</span>
                            <span class="teacher">任课老师：{{items.teacher}}</span>
                            <span class="state" v-if="items.state==1">未完成</span>
                            <span class="state" v-if="items.state==2">已完成</span>
                            <span class="state" v-if="items.state==3">已批改</span>
                        </router-link>
                    </div>
                </div>
                <div class="task_content" v-for="item in nowList" :key="item.index">
                    <h1 class="title">{{item.date}}</h1>
                    <div class="task_warp">
                        <router-link class="task"
                                     tag="div" to="/objectiveWork"
                                     v-for="items in item.content"
                                     :key="items.index"
                                     :class="{violet:items.state == 1,green:items.state == 2,yellow:items.state ==3}"
                        >
                            <span class="task_name">{{items.title}}</span>
                            <span class="teacher">任课老师：{{items.teacher}}</span>
                            <span class="state" v-if="items.state==1">未完成</span>
                            <span class="state" v-if="items.state==2">已完成</span>
                            <span class="state" v-if="items.state==3">已批改</span>
                        </router-link>
                    </div>
                </div>
                <div class="history" v-if="!list.length">上拉查看历史信息</div>
                <div class="task_content" v-for="item in list" :key="item.index">
                    <h1 class="title">{{item.date}}</h1>
                    <div class="task_warp">
                        <router-link class="task"
                                     tag="div" to="/objectiveWork"
                                     v-for="items in item.content"
                                     :key="items.index"
                                     :class="{violet:items.state == 1,green:items.state == 2,yellow:items.state ==3}"
                        >
                            <span class="task_name">{{items.title}}</span>
                            <span class="teacher">任课老师：{{items.teacher}}</span>
                            <span class="state" v-if="items.state==1">未完成</span>
                            <span class="state" v-if="items.state==2">已完成</span>
                            <span class="state" v-if="items.state==3">已批改</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </scroll-content>
        <loading v-if="loading"/>
    </div>
</template>

<!--作业簿-->

<script>
    import PublicHeader from '../public/PublicHeader'
    import ScrollContent from '../public/ScrollContent'
    import Loading from '../public/Loading'

    export default {
        data() {
            return {
                header: {                         //头部标题
                    title: '作业',
                },
                title: '作业簿',                   //标题
                nowList: [{
                    "date": '今天',
                    "content": [{
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '1'
                    }, {
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '2'
                    }, {
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '2'
                    }]
                }, {
                    "date": '今天',
                    "content": [{
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '1'
                    }, {
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '2'
                    }, {
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '2'
                    }]
                }, {
                    "date": '今天',
                    "content": [{
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '1'
                    }, {
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '2'
                    }, {
                        "title": '一课一练',
                        "teacher": '韩梅梅',
                        "state": '2'
                    }]
                }
                ],                      //第一次加载的作业
                list: [],                         //上拉加载历史作业
                pendingList: [                    //待完成作业
                    {
                        "date": '待完成',
                        "content": [{
                            "title": '一课一练',
                            "teacher": '韩梅梅',
                            "state": '1'
                        }, {
                            "title": '一课一练',
                            "teacher": '韩梅梅',
                            "state": '1'
                        }, {
                            "title": '一课一练',
                            "teacher": '韩梅梅',
                            "state": '1'
                        }, {
                            "title": '一课一练',
                            "teacher": '韩梅梅',
                            "state": '1'
                        }]
                    }
                ],
                loading: true,                    //加载状态
                pageShow: false,                  //内容状态
                tips: "没有更多作业"                //加载完提示
            }
        },
        components: {
            PublicHeader,
            ScrollContent,
            Loading
        },
        mounted() {
            this.getHomeWork();
        },
        methods: {
            //获取数据加载
            getHomeWork() {
                this.pageShow = true;
                this.loading = false;
                // let _this = this;
                // this.api.test()
                //   .then(function (res) {
                //     _this.nowList = res.data.homeWork;
                //     _this.pageShow = true;
                //     _this.loading = false;
                //   })
                //   .catch(function (err) {
                //     console.log('err', err);
                //   });
            },
            //上拉加载
            loadData(pageIndex) {
                setTimeout(() => {
                    if (pageIndex === 1) {
                        this.list = []
                    }
                    let _this = this;
                    this.api.getHomeWork()
                        .then(function (res) {
                            _this.list = res.data.homeWork;
                            _this.pageShow = true;
                            _this.loading = false;
                            _this.$refs.myscrollfull.endByPage(1, 1);
                            //第一个参数：当前页获取的数据总数；第二个参数：列表总页数
                        })
                        .catch(function (err) {
                            console.log('err', err);
                        });
                }, 2000)
            },
            //下拉刷新数据
            reloadData() {
                let _this = this;
                setTimeout(function () {
                    console.log("数据更新完成");
                    _this.$refs.myscrollfull.endSuccess();
                }, 1000)
            }
        }
    }
</script>

<style lang="scss">
    .homeWork {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        .mescroll {
            box-sizing: border-box;
            position: absolute;
            top: 3.15rem;
            bottom: 6rem;
            padding: 3.21rem 2.29rem 0;
            font-size: 18px;
            height: auto !important;
            .empty {
                text-align: center;
                padding-top: 1.79rem
            }
            .task_content {
                padding-bottom: 2.29rem;
                .title {
                    font-size: 24px;
                    padding-bottom: .57rem;
                    color: rgba(128, 213, 156, 1);
                }
                .pendingTitle {
                    color: rgba(159, 141, 242, 1);
                }
                .task_warp {
                    position: relative;
                    padding: 2.29rem 1.14rem;
                    /*background-color: white;*/
                    /*border-radius: 18px;*/
                    .task {
                        position: relative;
                        box-sizing: border-box;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        padding: 0 4.71rem 0 1.14rem;
                        margin-bottom: 1.14rem;
                        height: 3.14rem;
                        line-height: 3.14rem;
                        font-size: 20px;
                        border-radius: 16px;
                        .task_name {
                            max-width: 40%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: rgba(53, 53, 53, 1);
                        }
                        .teacher {
                            color: rgba(136, 136, 136, 1);
                        }
                        .state {
                            position: relative;
                        }
                    }
                    .violet {
                        background-color: rgba(241, 238, 254, 1);
                        .state {
                            color: rgba(142, 120, 240, 1);
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
            .history {
                text-align: center;
            }
        }
    }
</style>
