<template>
  <div class="questions">
    <classroom-header :header="header"/>
    <div class="questionsContent">
      <swiper ref="mySwiper" :options="swiperOption">
        <swiper-slide v-for="(item,index) in homeworkQuestions" :key="index">
          <scroll-content
            ref="myscrollfull"
            @reload="reloadData"
            :mescrollValue="mescrollValue"
            v-if="pageShow"
          >
            <div class="centertext">左右滑动切换题目</div>
            <div class="questions_warp">
              <div class="topic_title">{{item.questionTypeInCN}}</div>
              <div class="topic" v-html="item.questionContent">{{item.questionContent}}</div>
              <div
                class="select"
                v-for="(item1,index1) in item.options"
                :key="index1"
                v-if="item.questionType ==='objective'"
              >
                <div class="option">{{tab(index1)}}.</div>
                <div class="text" v-html="item1">{{item1}}</div>
              </div>
              <div class="anwers">
                此题答案为:
                <span v-html="item.answer.split('|').join(',')"></span>
              </div>
              <div class="remind" v-html="item.parse"></div>
              <PopupPic :questionPic="item.questionPic" v-if="item.questionPic"/>
            </div>
            <question-chart :question="item" :studentCount="studentCount"/>
            <div class="studentList">
              <span class="icon"></span>
              <span class="title">学生列表</span>
            </div>
            <student-list :question="item" :index="index"/>
          </scroll-content>
        </swiper-slide>
      </swiper>
    </div>
    <loading v-if="loading"/>
  </div>
</template>

<script>
import classroomHeader from "../../../components/public/PublicHeader";
import ScrollContent from "../../../components/public/ScrollContent";
import subjective from "../../../components/topicList/subjective";
import board from "../../../components/board/Board";
import Loading from "../../../components/public/Loading";
import PopupPic from "../../../components/teacherClassroom/PopupPicInHomework";
import { mapGetters } from "vuex";
import store from "@/store";
import { getHomework } from "@/api/teacher/homework";
import StudentList from "../../../components/teacherClassroom/studentListInHomework";
import questionChart from "../../../components/teacherClassroom/chartInHomework";

let vm = null;
export default {
  components: {
    classroomHeader,
    ScrollContent,
    subjective,
    board,
    Loading,
    PopupPic,
    StudentList,
    questionChart
  },
  data() {
    return {
      inputValue: "",
      loading: true, //加载状态
      pageShow: false, //页面显示状态
      //   mescroll: null,
      //   mescrolls: null,
      header: {
        //头部标题显示
        title: "",
        url: "/TStudentList"
      },
      mescrollValue: { up: false, down: true }, //是否需要下拉上拉加载数据
      //jump: {name: '转至客观题', url: '/TObjective'},//添加一个按钮跳转客观题
      swiperOption: {
        notNextTick: true,
        //循环
        loop: false,
        //设定初始化时slide的索引
        initialSlide: 0,
        //自动播放
        // autoplay: true,
        // autoplay: {
        //     delay: 3000,
        //     stopOnLastSlide: false,
        //     disableOnInteraction: true,
        // },
        // 设置轮播
        //   effect : 'flip',
        //滑动速度
        speed: 800,
        //滑动方向
        direction: "horizontal",
        //小手掌抓取滑动
        // grabCursor : true,
        //滑动之后回调函数
        on: {
          slideChange: function() {
            //console.log(this.activeIndex);
            //console.log(this.realIndex);
          },
          slideChangeTransitionStart: function() {
            //console.log(this.activeIndex); //切换结束时，告诉我现在是第几个slide
            //vm.drawChart(this.realIndex);
          }
        },
        //左右点击
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
        //分页器设置
        //   pagination: {
        //       el: '.swiper-pagination',
        //       clickable :true
        //   }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    //vuex 调用
    ...mapGetters([
      "homeworkId",
      "isBoard",
      "boardImg",
      "homeworkStudents",
      "homeworkQuestions",
      "homeworkName",
      "homeworkInitSlide"
    ])
  },
  watch: {},
  created() {
    // vm = this;
    this.getHomeworkDetail();
  },
  mounted() {
    this.swiper.slideTo(this.homeworkInitSlide, 800, false);
    this.pageShow = true;
    this.loading = false;
    this.studentCount = this.homeworkStudents.length;
    this.header.title = this.homeworkName;
  },
  methods: {
    // mescrollInit(mescroll) {
    //   this.mescroll = mescroll;
    // },
    // mescrollsInit(mescrolls) {
    //   this.mescrolls = mescrolls;
    // },
    //给选项添加ABCD
    tab(index) {
      let num = 65 + index;
      return String.fromCharCode(num);
    },
    getHomeworkDetail() {
      getHomework(this.homeworkId)
        .then(res => {
          console.log(res);
          store.commit("SET_HOMEWORKSTUDENTS", res.data.data.students);
          store.commit("SET_HOMEWORKQUESTIONS", res.data.data.questions);
          store.commit("SET_HOMEWORKNAME", res.data.data.homeworkName);
          store.commit("SET_HOMEWORKINITSLIDE", 0);
          this.header.title = res.data.data.homeworkName;
          this.pageShow = true;
          this.loading = false;
        })
        .catch(err => {
          console.log("err", err);
          /*let msg = this.getMsg(err);
                if(msg){
                    Toast({
                        message: msg,
                        position: 'middle',
                        duration: 2000
                    });
                }*/
        });
    },
    //课堂下拉刷新
    reloadData() {
      let _this = this;

      setTimeout(() => {
        _this.getHomeworkDetail();
        for (let i = 0; i < _this.$refs.myscrollfull.length; i++) {
          _this.$refs.myscrollfull[i].endSuccess();
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.questions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  overflow: auto;
  .jump {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 2.5rem;
    color: rgba(255, 255, 255, 1);
    font-size: 18px;
    &:before {
      content: " ";
      display: inline-block;
      height: 12px;
      width: 12px;
      border-width: 2px 2px 0 0;
      border-color: #ffffff;
      border-style: solid;
      -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
      position: absolute;
      top: 50%;
      right: -0.8rem;
      margin-top: -2px;
    }
  }
  .questionsContent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;

    .centertext {
      text-align: center;
      margin-top: 1rem;
      font-size: 20px;
      color: #3d72fe;
      font-weight: 600;
    }
    .swiper-container {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      .mescroll {
        box-sizing: border-box;
        position: absolute;
        top: 3.15rem;
        bottom: 0;
        padding: 3.5rem 4.86rem 3.14rem;
        height: auto !important;
        background-color: rgba(255, 255, 255, 1);
        .questions_warp {
          padding: 2.86rem 2.29rem;
          font-size: 18px;
          border-radius: 18px;
          line-height: 34px;
          background-color: rgba(246, 255, 247, 1);
          .topic {
            padding-bottom: 1rem;
          }
          .topic_title {
            color: rgba(105, 180, 130, 1);
          }
          .select {
            position: relative;
            // height: 1.79rem;
            //padding: 1.14rem 3.71rem 1.36rem;
            font-size: 0;
            .option {
              display: inline-block;
              height: 1.79rem;
              line-height: 2rem;
              padding-left: 0.57rem;
              padding-right: 0.79rem;
              font-size: 20px;
              //color: rgba(105, 180, 130, 1);
              // float: left;
            }

            .text {
              display: inline-block;
              height: 1.79rem;
              line-height: 1.79rem;
              font-size: 18px;
              //color: rgba(53, 53, 53, 1);
              // float: left;
            }
          }
          .anwers {
            font-size: 18px;
            padding: 15px;
            line-height: 24px;
            span {
              color: red;
            }
          }
          .remind {
            font-size: 18px;
            line-height: 24px;
            padding: 15px;
          }
        }
        .studentList {
          height: 2rem;
          position: relative;
          margin: 1.43rem 0 2.29rem;
          .icon {
            display: inline-block;
            width: 0.57rem;
            height: 1.43rem;
            margin-top: 0.285rem;
            background-color: rgba(128, 213, 156, 1);
          }
          .title {
            position: absolute;
            top: 50%;
            margin-left: 0.57rem;
            transform: translateY(-50%);
            font-size: 20px;
            color: rgba(53, 53, 53, 1);
          }
        }
      }
    }
  }
}
</style>
