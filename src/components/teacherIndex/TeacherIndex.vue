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
        <Upgrade/>
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
                <scroll-content class="homeWork_content" ref="myscrollfulls" @load="loadDatas" @reload="reloadDatas" :mescrollValue="mescrollValue"
                                :tips="tipss" :updownRefresh="updownRefresh">
                    <div slot="empty">无任何数据</div>
                    <input class="search searchHomeWork " type="text"  v-model="inputValues" placeholder="搜索习题">
                    <homework-list v-for="item in filtersHWTextChange" :key="item.index"
                                  :teacherHomework="item" @reloadDatas="reloadDatas" @upRefresh="upRefresh"/>
                    <div class="history" v-if="homeworkState">上拉查看历史信息</div>
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
    import homeworkList from '../teacherClassroom/homeworkList'
    import Loading from '../public/Loading'
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import {getHistory} from "../../api/teacher/classroom"
    import {getHomeworkHistory} from "../../api/teacher/homework"
    import Upgrade from '../public/Upgrade'

    export default {
        name: 'TeacherIndex',
        components: {
            ScrollContent,
            courseList,
            homeworkList,
            Loading,
            Upgrade
        },
        data() {
            return {
                //input输入的值
                inputValue: '',
                inputValues: '',
                updownRefresh: 0,
                mescrollValue: {up: true, down: true},
                //课堂总页码
                classPageNum: 100,
                //判断课堂是否还有
                classState: true,
                //习题总页码
                homeworkPageNum: 100,
                //判断课堂是否还有
                homeworkState: true,
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
                        text: '习题'
                    }
                ],
                loading: true,    //加载状态
                pageShow: false,  //内容加载状态
                tips: '没有更多课堂列表',    //课堂加载到最后的提示
                tipss: '没有更多习题',      //作业加载到最后的提示
                //课堂今天要上的课
                teacherClassroom: [],
                //作业列表
                teacherHomework: []
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
            },
            filtersHWTextChange() {
                let _this = this;
                let arr = [];
                if (_this.inputValues === '') {
                    _this.teacherHomework = _this.homeworkList;
                    return _this.teacherHomework;
                } else {
                    for (let i = 0; i < _this.teacherHomework.length; i++) {
                        /*console.log(_this.teacherClassroom[i].courseName + ", " + _this.inputValue);*/
                        /*if (_this.teacherClassroom[i].courseName === _this.inputValue) {
                            arr.push(_this.teacherClassroom[i]);
                        }*/
                        if(_this.teacherHomework[i].homeworkName.indexOf(_this.inputValues) > -1){
                            arr.push(_this.teacherHomework[i]);
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
                        //this.navStyle = 'transition: left .2s;left:94.08px;';
                        this.navStyle = 'transition: left .2s;left:109px;';
                    } else {
                        //this.navStyle = 'transition: left .2s;left:23.06px;';
                        this.navStyle = 'transition: left .2s;left:24px;';
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
                                //_this.navStyle = 'transition: left .2s;left:94.08px;';
                                _this.navStyle = 'transition: left .2s;left:109px;';
                            } else {
                                //_this.navStyle = 'transition: left .2s;left:23.06px;';
                                _this.navStyle = 'transition: left .2s;left:24px;';
                            }
                        }
                    })
                }).catch((err) => {
                    console.log("err", err);
                });
                this.$store.dispatch('getTeacherHomework').then(() => {
                    _this.teacherHomework = _this.homeworkList;
                    this.swiper.on('slideChangeTransitionEnd', function () {
                        for (let i = 0; i < _this.tabs.length; i++) {
                            if (i === this.activeIndex) {
                                //_this.navStyle = 'transition: left .2s;left:108.08px;';
                                _this.navStyle = 'transition: left .2s;left:120px;';
                            } else {
                                //_this.navStyle = 'transition: left .2s;left:30.06px;';
                                _this.navStyle = 'transition: left .2s;left:35px;';
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
                            //this.teacherClassroom = this.classList;
                            this.teacherClassroom = this.removeRepeat(this.classList, 'courseId');
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
                console.log(this.mescrollValue.up)
                    console.log(this.homeworkPageNum, pageIndex);
                setTimeout(() => {
                    console.log(this.mescrollValue.up)
                    console.log(this.homeworkPageNum, pageIndex);
                    getHomeworkHistory(pageIndex)
                        .then(res => {
                            console.log(res)
                            // let temp
                            store.commit('SET_HOMEWORKHISTORY', res.data.data.content);
                            // temp = this.removeRepeat(this.homeworkList,'homeworkId')
                            // console.log(temp)
                            // this.teacherHomework = this.homeworkList;
                            this.teacherHomework = this.removeRepeat(this.homeworkList,'homeworkId')
                            this.homeworkPageNum = res.data.data.pageCount;
                            console.log(this.teacherHomework)
                            if (this.homeworkPageNum === pageIndex) {
                                this.homeworkState = false;
                                console.log('执行了');
                            }
                            this.$refs.myscrollfulls.endByPage(res.data.data.pageSize, res.data.data.pageCount);
                            console.log(this.mescrollValue.up)
                        })
                        .catch(err => {
                            console.log(err);
                        });
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
                    _this.$store.dispatch('getTeacherHomework').then(() => {
                        _this.teacherHomework = _this.homeworkList;
                        _this.$refs.myscrollfulls.endSuccess();
                    }).catch((err) => {
                        console.log("err", err);
                    });
                }, 1000);
            },
            upRefresh() {
                    this.updownRefresh ++
            },
            removeRepeat(arr, key){
                for(let i = 0; i < arr.length; i++) {
                    for(let j = i+1; j < arr.length; j++) {
                        if(arr[i][key] === arr[j][key]){
                            arr.splice(j, 1);
                            j = j-1;  // 关键，因为splice()删除元素之后，会使得数组长度减小，此时如果没有j=j-1的话，会导致相同id项在重复两次以上之后无法进行去重，且会错误删除id没有重复的项。
                        }
                    }
                }
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
            // background-color: rgba(145, 220, 169, 1);
            background: url('../../assets/上方导航栏.png') no-repeat;
            background-size: 100% 110%;
            .title_warp {
                width: 100%;
                display: flex;
                font-size: 24px;
                color: white;
                box-sizing: border-box;
                .title {
                    height: 100%;
                    font-size: 2rem;
                    color: white;
                    position: relative;
                    box-sizing: border-box;
                    margin-left: 30.02px;
                }
                .bar {
                    position: absolute;
                    width: 66px;
                    left: 24px;
                    bottom: -.5px;
                    height: 4px;
                    border-radius: 3px;
                    background-color: #FFFFFF;
                    background: url('../../assets/作业--课堂下标识.png') no-repeat;
                    background-size: 100%;
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
