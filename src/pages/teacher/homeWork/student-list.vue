<template>
  <div class="TStudentList">
    <teacher-header :header="header" :jump="jump"/>
    <scroll-content ref="myscrollfull" @reload="reloadData" :mescrollValue="mescrollValue" v-if="pageShow">
      <input class="search" type="text" v-model="inputValue" placeholder="搜索学生">
      <div class="student_list">
        <div class="mainTitle">
          <span class="icon"></span>
          <span class="title">学生列表</span>
        </div>
        <div class="item" v-for="item in filtersTextChange" :key="item.index">
          <div class="left">
            <!--<div class="avatar"><img :src="item.avatar" alt=""></div>-->
            <div class="name">{{item.studentName}}<span class="account">({{item.studentAccount}})</span></div>
          </div>
          <!--<router-link tag="div" to="/TObjective" class="correction" v-if="item.completedTime==1">批改</router-link>
          <router-link tag="div" to="/TObjective" class="view" v-if="item.completedTime==2">查看</router-link>-->
          <div class="correction" v-if="item.completedTime>0">已提交</div>
          <div class="notSubmitted" v-if="item.completedTime===0">未提交</div>
        </div>
      </div>
    </scroll-content>
    <loading v-if="loading"/>
  </div>
</template>

<!--作业详情-->

<script>
  import teacherHeader from '../../../components/public/PublicHeader'
  import ScrollContent from '../../../components/public/ScrollContent'
  import Loading from '../../../components/public/Loading'
  import {mapGetters} from 'vuex'
  import store from '@/store'
  import {getHomework} from "@/api/teacher/homework"

  export default {
    components: {
      teacherHeader,
      ScrollContent,
      Loading
    },
    data() {
      return {
          inputValue: '',
          loading: true,                                   //页面加载状态
          pageShow: false,                                 //页面内容加载状态
          mescrollValue: {up: false, down: true},         //页面是否需要上拉下拉
          jump: {name: '开始批改', url: '/TQuestions'},//添加主观题按钮
          header: {                                        //头部标题
            url: '/teacherIndex',
            title: ''
          }
        }
      },
      computed: {
          //vuex 调用
          ...mapGetters([
              'homeworkId',
              'homeworkStudents',
              'homeworkQuestions'
          ]),
          //查找数据
          filtersTextChange() {
              let _this = this;
              let arr = [];
              if (_this.inputValue === '') {
                  return _this.homeworkStudents;
              } else {
                  for (let i = 0; i < _this.homeworkStudents.length; i++) {
                      if(_this.homeworkStudents[i].studentName.indexOf(_this.inputValue) > -1 ||
                          _this.homeworkStudents[i].studentAccount.indexOf(_this.inputValue) > -1){
                          arr.push(_this.homeworkStudents[i]);
                      }
                  }
                  return arr;
              }
          },
      },
    created() {
      this.getHomeworkDetail();
    },
    methods: {
        getHomeworkDetail() {
            getHomework(this.homeworkId).then(res=>{
                //console.log(res.data.data);
                store.commit('SET_HOMEWORKSTUDENTS', res.data.data.students);
                store.commit('SET_HOMEWORKQUESTIONS', res.data.data.questions);
                store.commit('SET_HOMEWORKNAME', res.data.data.homeworkName);
                store.commit('SET_HOMEWORKINITSLIDE', 0);
                this.header.title = res.data.data.homeworkName;
                this.pageShow = true;
                this.loading = false;
            }).catch(err=>{
                //console.log(err);
            })
        },
        //课堂下拉刷新
        reloadData() {
            let _this = this;
            setTimeout(() => {
                _this.getHomeworkDetail();
                _this.$refs.myscrollfull.endSuccess();
            }, 1000);
        },
      }
    }
</script>

<style lang="scss">
  .TStudentList {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .mescroll {
      box-sizing: border-box;
      position: absolute;
      top: 3.15rem;
      bottom: 0;
      padding: 3.43rem 4.86rem 0;
      height: auto !important;
      background-color: rgba(255, 255, 255, 1);
      .search {
        width: 100%;
        height: 3.14rem;
        border-radius: 32px;
        text-align: center;
        font-size: 18px;
        padding: 0 1rem;
        box-sizing: border-box;
        margin-bottom: 2.29rem;
        background-color: rgba(247, 247, 247, 1);
      }
      .student_list {
        .mainTitle {
          height: 2rem;
          position: relative;
          //margin: 1.43rem 0 2.29rem;
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
        .item {
          height: 4.25rem;
          line-height: 4.25rem;
          font-size: 20px;
          display: flex;
          justify-content: space-between;
          padding-bottom: 2.61rem;
          .left {
            display: flex;
            .avatar {
              width: 4.25rem;
              height: 4.25rem;
              img {
                width: 100%;
                border-radius: 50%;
              }
            }
            .name {
              //padding-left: 2.29rem;
              color: rgba(53, 53, 53, 1);
              .account{
                font-size: 16px;
              }
            }
          }
          .correction {
            color: rgba(142, 120, 240, 1);
          }
          .view {
            color: rgba(101, 179, 127, 1);
          }
          .notSubmitted {
            color: rgba(162, 162, 162, 1);
          }
        }
      }
    }
  }
</style>
