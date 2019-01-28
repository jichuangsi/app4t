<template>
  <div class="mistakescollection">
    <div class="top">
      <div class="nav">
        <i
          class="iconfont icon-icon-arrow-left2"
          @click="back"
        ></i>
        <div class="text">错题集</div>
      </div>
      <div class="messagetext">请左右滑动切换科目</div>
      <div class="center">

        <swiper
          :options="swiperOption"
          ref="mySwiper"
        >
          <!-- slides -->
          <swiper-slide>
            <div class="box">
                <img src="../../../assets/语文_03.png" alt="">
                <div class="text">
                    <span>语文</span>
                    <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="box">
                <img src="../../../assets/数学_03.png" alt="">
                <div class="text">
                    <span>数学</span>
                    <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="box">
                <img src="../../../assets/英语_03.png" alt="">
                <div class="text">
                    <span>英语</span>
                    <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                </div>
            </div>
          </swiper-slide>
            <swiper-slide>
                <div class="box">
                    <img src="../../../assets/历史_03.png" alt="">
                    <div class="text">
                        <span>历史</span>
                        <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                    </div>
                </div>
            </swiper-slide>
            <swiper-slide>
                <div class="box">
                    <img src="../../../assets/地理_03.png" alt="">
                    <div class="text">
                        <span>地理</span>
                        <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                    </div>
                </div>
            </swiper-slide>
          <swiper-slide>
            <div class="box">
                <img src="../../../assets/政治_03.png" alt="">
                <div class="text">
                    <span>政治</span>
                    <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                </div>
            </div>
          </swiper-slide>
            <swiper-slide>
                <div class="box">
                    <img src="../../../assets/生物_03.png" alt="">
                    <div class="text">
                        <span>生物</span>
                        <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                    </div>
                </div>
            </swiper-slide>
          <swiper-slide>
            <div class="box">
                <img src="../../../assets/物理_03.png" alt="">
                <div class="text">
                    <span>物理</span>
                    <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                </div>
            </div>
          </swiper-slide>
            <swiper-slide>
                <div class="box">
                    <img src="../../../assets/化学_03.png" alt="">
                    <div class="text">
                        <span>化学</span>
                        <span>共错题{{total}}道，涉及{{involve}}个知识点</span>
                    </div>
                </div>
            </swiper-slide>
          <!-- Optional controls -->
          <div
            class="swiper-pagination "
            slot="pagination"
          ></div>
          <!-- <div
            class="swiper-button-prev swiper-button-black"
            slot="button-prev"
          ></div>
          <div
            class="swiper-button-next swiper-button-black"
            slot="button-next"
          ></div> -->
          <!-- <div class="swiper-scrollbar"   slot="scrollbar"></div> -->
        </swiper>

      </div>
      <div class="boxnav">
          <div class="clearfix" @click="mistakescollection(item.name,item.id)" v-for="(item,index) in involvenav" :key="index">
              <div class="fl">{{item.name}}</div>
              <div class="fr">
                  <i class="iconfont icon-icon-arrow-right2"></i>
              </div>
              <div class="fr">一共{{item.number}}道错题</div>
          </div>
      </div>
    </div>

  </div>
</template>

<script>
    import {listIncorrectQuestions} from '@/api/student/classroom'
    import {Toast} from 'mint-ui'
    import store from '@/store'

    let vm = null;
export default {
  name: "mistakescollection",
  components: {},
  data() {
    return {
        total:'0',//错题数量
        involve:'0',//涉及知识点个数
        involvenav:[],//涉及知识点列表
        involveStored:[],//页面缓存
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
            slideChange: function(){
                //console.log(this.activeIndex);
                //console.log(this.realIndex);
            },
            slideChangeTransitionStart: function() {
            //console.log(this.activeIndex); //切换结束时，告诉我现在是第几个slide

              let subjectId = this.realIndex + 1;
              vm.getIncorrectQuestions(subjectId);
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
      // swiperSlides: [1, 2, 3, 4]
    };
  },
    created() {
        vm = this;
    },
    mounted(){
      this.getIncorrectQuestions(1);
    },
  methods: {
      getIncorrectQuestions(subjectId, knowledgeId){
          let _this = this;
          listIncorrectQuestions(subjectId, knowledgeId).then(res => {
              console.log(res);
              if(res.data.code === "0010"){
                  let questions = res.data.data;
                  let count = 0;
                  _this.involvenav = [];
                  _this.involveStored = [];
                  questions.forEach((obj, index)=>{
                      count += obj.count;
                      _this.involvenav.push({name:obj.knowledge,number:obj.count,id:obj.knowledgeId});
                      _this.involveStored.push({id:obj.knowledgeId,questions:obj.questions});
                  });
                  _this.total = count;
                  _this.involve = questions.length;
              }else{
                  Toast(res.data.msg);
              }
          });
      },
    back() {
      //this.$router.go(-1); //返回上一层
        this.$router.push({
            path: '/studentIndex',
            name: 'studentIndex'
        });
    },
    mistakescollection(msgtext,id){
        this.involveStored.forEach((obj,index)=>{
            if(obj.id === id){
                store.commit('SET_KNOWLEDGEID', obj.id);
                store.commit('SET_KNOWLEDGE', msgtext);
                store.commit('SET_QUESTIONS', obj.questions);
            }
        });
        this.$router.push({
                    path: '@/pages/student/statistics/Wrong',
                    name: 'Wrong',
                    query:{
                        msgtext:msgtext
                    }
                });
    }
  }
};
</script>

<style scoped lang="scss">
.mistakescollection {
  .top {
    .nav {
      width: 100%;
      height: 4.7rem;
      line-height: 4.7rem;
      background-color: #80d59c;
      color: #ffffff;
      font-size: 2rem;
        position: relative;
      .iconfont {
        font-size: 2rem;
        display: inline-block;
        padding-right: 1rem;
        position: absolute;
        left: 2rem;
      }
      .text {
        text-align: center;
      }
    }
  }
  .messagetext {
      font-size: 1.2rem;
      text-align: center;
      margin-top: 1rem;
  }
  .center {
    width: 100%;
    // overflow: hidden;
    padding: 0 2rem;
    .swiper-container {
        width: 100% !important;
    }
    .swiper-slide {
        width: 100% !important;
        height: 11rem !important;
        margin: 2.5rem auto;
    }
    .box {
      width: 90%;
      height: 11rem;
      margin: 0 auto;
      border-radius: 1rem;
      box-shadow: 0.3rem 0.3rem 0.3rem #b2b2b2;
      padding: 1rem;
      background-color: #ffffff;
      img {
          display: inline-block;
          width: 9rem;
          height: 9rem;
          vertical-align: top;
      }
      .text {
          display: inline-block;
          margin-left: 2rem;
          margin-top: 1rem;
          >span:first-child{
              display: block;
              font-size: 2rem;
              font-weight: 700;
              margin-bottom: 2rem;
          }
          >span:nth-child(2){
              display: block;
              font-size: 1.6rem;
              font-weight: normal;
          }
      }
    }
  }
  .boxnav {
      padding: 0 4rem;
      .clearfix {
          width: 100%;
          height: 5rem;
          line-height: 5rem;
          font-size: 1.6rem;
        border-radius: 1rem;
        box-shadow: 0.2rem 0.2rem 0.2rem #b2b2b2;
        margin-bottom: 1rem;
      background-color: #ffffff;
        .fl {
            margin-left: 1rem;
        }
        .fr {
            margin-right: 1rem;
        }
      }
  }
}
</style>
