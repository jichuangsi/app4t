<template>
    <div class="Testindex">
        <div class="header">
            <div class="title_warp">
                <div class="title">
                    考试
                </div>
                <div class="bar"
                     :style="navStyle"></div>
            </div>
        </div>
        <Upgrade/>

                <scroll-content class="test_content" ref="myscrollfulls" @load="loadDatas" @reload="reloadDatas" :mescrollValue="mescrollValue"  @init="mescrollsInit"
                                :tips="tipss" :updownRefresh="updownRefresh">
                    <div slot="empty">无任何数据</div>
                    <input class="search searchtest " type="text"  v-model="inputValues" placeholder="搜索考试">
                    <test-list v-for="item in filtersHWTextChange" :key="item.index"
                                  :teachertest="item" @reloadDatas="reloadDatas" @upRefresh="upRefresh"/>
                    <div class="history" v-if="testState">上拉查看历史信息</div>
                </scroll-content>
        <loading v-if="loading"/>
    </div>
</template>
<!--课堂作业-->
<script>
    import ScrollContent from '../public/ScrollContent'
    import testList from '../teacherClassroom/testlist'
    import Loading from '../public/Loading'
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import {gettestHistory} from "../../api/teacher/test"
    import Upgrade from '../public/Upgrade'
    import {Toast} from 'mint-ui';

    export default {
        name: 'Testindex',
        components: {
            ScrollContent,
            testList,
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
                //习题总页码
                testPageNum: 100,
                //判断课堂是否还有
                testState: true,
                //导航样式
                navStyle: '',
                loading: true,    //加载状态
                pageShow: false,  //内容加载状态
                tipss: '没有更多习题',      //作业加载到最后的提示
                //作业列表
                teachertest: [],
                mescroll: null,
                mescrolls: null,
                slideFired: false
            }
        },
        computed: {
            ...mapGetters([
                'testList',
                'isNew'
            ]),
            //查找数据
            filtersHWTextChange() {
                let _this = this;
                let arr = [];
                if (_this.inputValues === '') {
                    _this.teachertest = _this.testList;
                    return _this.teachertest;
                } else {
                    for (let i = 0; i < _this.teachertest.length; i++) {
                        /*console.log(_this.teacherClassroom[i].courseName + ", " + _this.inputValue);*/
                        /*if (_this.teacherClassroom[i].courseName === _this.inputValue) {
                            arr.push(_this.teacherClassroom[i]);
                        }*/
                        if(_this.teachertest[i].testName.indexOf(_this.inputValues) > -1){
                            arr.push(_this.teachertest[i]);
                        }
                    }
                    return arr;
                }
            }
        },
        mounted() {
            let _self = this;
            let networkState = navigator.connection.type;
            //console.log(networkState);
            if (networkState === "unknown") {
                document.addEventListener("online", function(){
                    //console.log(_self.slideFired);
                    if(!_self.slideFired){
                        _self.getTeacherIndex();
                        _self.slideFired = true;
                    }
                });
            }else{
                this.getTeacherIndex();
            }
        },
        activated(){
            this.slideFired = false;
            if(this.isNew){
                store.commit('SET_testHISTORY', []);
                this.getTeacherIndex();
                this.mescroll.resetUpScroll();
                this.mescrolls.resetUpScroll();
                store.commit('IS_NEW', false);
            }
        },
        methods: {
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            },
            mescrollsInit (mescrolls) {
                this.mescrolls = mescrolls;
            },
            //获取第一次的内容
            getTeacherIndex() {
                let _this = this;
                /*this.$store.dispatch('getTeacherClass').then(() => {
                    _this.pageShow = true;
                    _this.loading = false;
                    _this.teacherClassroom = _this.classList;
                }).catch((err) => {
                    console.log('err', err);
                    /!*let msg = this.getMsg(err);
                    if(msg){
                        Toast({
                            message: msg,
                            position: 'middle',
                            duration: 2000
                        });
                    }*!/
                    _this.pageShow = true;
                    _this.loading = false;
                });*/
                this.$store.dispatch('getTeachertest').then(() => {
                    _this.pageShow = true;
                    _this.loading = false;
                    //console.log(_this.teachertest)
                    _this.teachertest = _this.testList;
                }).catch((err) => {
                    console.log("err", err);
                    _this.pageShow = true;
                    _this.loading = false;
                });
            },
            //作业上拉加载的api
            loadDatas(pageIndex) {
                //console.log(this.mescrollValue.up)
                    //console.log(this.testPageNum, pageIndex);
                setTimeout(() => {
                    //console.log(this.mescrollValue.up)
                    //console.log(this.testPageNum, pageIndex);
                    gettestHistory(pageIndex)
                        .then(res => {
                            // console.log(res)
                            // let temp
                            store.commit('SET_testHISTORY', res.data.data.content);
                            // temp = this.removeRepeat(this.testList,'testId')
                            // console.log(temp)
                            // this.teachertest = this.testList;
                            this.teachertest = this.removeRepeat(this.testList,'testId')
                            this.testPageNum = res.data.data.pageCount;
                            //console.log(this.teachertest)
                            if (this.testPageNum === pageIndex) {
                                this.testState = false;
                                //console.log('执行了');
                            }
                            this.$refs.myscrollfulls.endByPage(res.data.data.pageSize, res.data.data.pageCount);
                            //console.log(this.mescrollValue.up)
                        })
                        .catch(err => {
                            console.log('err', err);
                            this.mescrolls.endErr();
                            /*let msg = this.getMsg(err);
                            if(msg){
                                Toast({
                                    message: msg,
                                    position: 'middle',
                                    duration: 2000
                                });
                            }*/
                            //this.$refs.myscrollfull.endSuccess();
                        });
                }, 2000)
            },
            //作业下拉
            reloadDatas() {
                let _this = this;
                setTimeout(function () {
                    let arr1 = [];
                    arr1 = _this.teachertest;
                    //console.log(arr1);
                    _this.$store.dispatch('getTeachertest').then(() => {
                        _this.teachertest = _this.testList;
                        let arr2 = _this.teachertest;
                        //console.log(arr2);
                        if(arr1&&arr1.length>0){
                            let arr3 = [];
                            arr1.forEach((item, index)=>{
                                let i = arr2.findIndex(x=>{
                                    return x.testId === item.testId;
                                });
                                if(i === -1){
                                    arr3.push(arr1[index]);
                                }
                                //console.log(arr3);
                            });
                            let j = arr2.findIndex(x=>{
                                return x.testStatus === 'COMPLETED';
                            });
                            arr3.forEach((item, index)=>{
                                //item.testStatus = 'FINISH';
                                if(j === -1){
                                    _this.teachertest.push(item);
                                }else{
                                    _this.teachertest.splice(j++, 0, item);
                                }
                            })
                            //console.log(_this.workList);
                            _this.removeRepeat(_this.teachertest, 'testId');
                        }
                        //_this.teachertest = _this.removeRepeat(_this.testList, 'testId');
                        //_this.$refs.myscrollfulls.endSuccess();
                    }).catch((err) => {
                        console.log('err', err);
                        _this.mescrolls.endErr();
                        /*let msg = this.getMsg(err);
                        if(msg){
                            Toast({
                                message: msg,
                                position: 'middle',
                                duration: 2000
                            });
                        }
                        _this.$refs.myscrollfull.endSuccess();*/
                    });
                    _this.$refs.myscrollfulls.endSuccess();
                }, 1000);
            },
            upRefresh(testId, testStatus) {
                let i = this.teachertest.findIndex(x=>{
                    return x.testId == testId;
                });
                if(i != -1){
                    this.teachertest[i].testStatus = testStatus;
                    if(testStatus === 'COMPLETED'){
                        let temp = this.teachertest.splice(i, 1);
                        let j = this.teachertest.findIndex(x=>{
                            return x.testStatus === 'COMPLETED';
                        });
                        if(temp&&temp.length===1){
                            if(j === -1){
                                this.teachertest.push(temp[0]);
                            }else{
                                this.teachertest.splice(j, 0, temp[0]);
                            }
                        }
                        this.removeRepeat(this.teachertest, 'testId');
                    }
                }
                //this.updownRefresh ++
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
                return arr;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .Testindex {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('../../assets/allbj.png') no-repeat;
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
            .mescroll {
                position: absolute;
                top: 3.15rem;
                bottom: 6rem;
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
                    background-color: #f8f8f8;
                }

                .searchtest {
                    background-color: #f8f8f8;
                }
            }
            .test_content {
        background: url('../../assets/allbj.png') no-repeat;
            }
        }
        .history {
            font-size: 18px;
            text-align: center;
        }
</style>
