<template>
  <div class="TStudentList">
    <teacher-header :header="header"/>
    <scroll-content ref="myscrollfull" @load="loadData" :mescrollValue="mescrollValue" v-if="pageShow">
      <input class="search" type="text" placeholder="搜索学生">
      <div class="student_list">
        <div class="item" v-for="item in list" :key="item.index">
          <div class="left">
            <div class="avatar"><img :src="item.avatar" alt=""></div>
            <div class="name">{{item.name}}</div>
          </div>
          <router-link tag="div" to="/TObjective" class="correction" v-if="item.state==1">批改</router-link>
          <router-link tag="div" to="/TObjective" class="view" v-if="item.state==2">查看</router-link>
          <div class="notSubmitted" v-if="item.state==3">未提交</div>
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


  export default {
    components: {
      teacherHeader,
      ScrollContent,
      Loading
    },
    data() {
      return {
        loading: true,                                   //页面加载状态
        pageShow: false,                                 //页面内容加载状态
        mescrollValue: {up: false, down: false},         //页面是否需要上拉下拉
        header: {                                        //头部标题
          url: '/teacherIndex',
          title: '一课一练'
        },
        list: [{                                         //学生列表
          id: 1,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 1,
        }, {
          id: 2,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 2,
        }, {
          id: 3,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 3,
        }, {
          id: 4,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 2,
        }, {
          id: 5,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 1,
        }, {
          id: 6,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 3,
        }, {
          id: 7,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 1,
        }, {
          id: 8,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 1,
        }, {
          id: 9,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 1,
        }, {
          id: 10,
          avatar: 'http://pd0qnho0l.bkt.clouddn.com/Bitmap.png',
          name: '韩梅梅',
          state: 1,
        },]
      }
    },
    mounted() {
      this.getStudentList();
    },
    methods: {
      getStudentList() {
        this.pageShow = true;
        this.loading = false;
      },
      loadData(pageIndex) {
        setTimeout(() => {
          this.$refs.myscrollfull.endByPage(1, 1);
          //第一个参数：当前页获取的数据总数；第二个参数：列表总页数
        }, 2000)
      }
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
              padding-left: 2.29rem;
              color: rgba(53, 53, 53, 1);
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
