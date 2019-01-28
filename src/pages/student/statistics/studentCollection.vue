<template>
  <div class="studentCollection">
    <div class="top">
      <div class="nav">
        <i
          class="iconfont icon-icon-arrow-left2"
          @click="back"
        ></i>
        <div class="text">我的收藏</div>
      </div>
    </div>

    <div class="class_topic_warp" v-for="(item,index) in topicList" :key="index" v-if="pageShow">
      <div class="Collection" @click="Collection(item.questionId)">
        <img :src="Collectionsrc" alt="">
      </div>
      <!--客观题-->
      <div class="objective_warp" v-if="item.quesetionType==='objective'">
        <div class="topic" v-html="item.questionContent">
          {{item.questionContent}}
        </div>
        <div class="select clearfix" v-for="(item1,index) in item.options" :key="index" v-if="item.answer.length==1">
          <div class="round">
            <span class="point" v-if="item.answerForStudent.answerForObjective === conversion(index)"></span>
          </div>
          <div class="option">{{conversion(index)}}.</div>
          <div class="text" v-html="item1">{{item1}}</div>
        </div>
        <div class="select clearfix" v-for="(item2,index) in item.options" :key="index" v-if="item.answer.length>1">
          <div class="round" >
            <span class="point" v-for="(item3,index1) in item.answerForStudent.answerForObjective.split('|')" :key="index1" v-if="item3 === conversion(index)"></span>
          </div>
          <div class="option">{{conversion(index)}}.</div>
          <div class="text" v-html="item2">{{item2}}</div>
        </div>
        <PopupPic :questionPic="item.questionPic"/>
        <div class="anwers" v-if="item.questionStatus == 'FINISH'">
          此题答案为:<span v-html="item.answer.split('|').join(',')"></span>
        </div>
        <div class="remind" v-html="item.parse" v-if="item.questionStatus == 'FINISH'">
        </div>
      </div>
      <!--主观题-->
      <div class="subjective_warp" v-if="item.quesetionType ==='subjective'">

        <div class="topic_warp">
          <div class="title">{{item.title}}</div>
          <div class="topic" v-html="item.questionContent">
            {{item.questionContent}}
          </div>
        </div>
        <PopupPic :questionPic="item.questionPic"/>
        <div class="anwers" v-if="item.questionStatus == 'FINISH'">
          此题答案为:<span v-html="item.answer"></span>
        </div>
        <div class="remind" v-html="item.parse" v-if="item.questionStatus == 'FINISH'">
        </div>

        <board :subjectiveAnswer="objectiveAnswer" :id="item.questionId" />

      </div>
    </div>
    <loading v-if="loading"/>
  </div>
</template>

<script>
    import {listFavorQuestions, getSubjectPic, removeFavorQuestion} from "@/api/student/classroom";
    import PopupPic from "../../../components/topicList/PopupPic";
    import Board from "../../../components/board/Board";
    import Loading from '../../../components/public/Loading';
    import { Toast } from "mint-ui";
    export default {
        name: "studentCollection",
        components: {
            Board,
            PopupPic,
            Loading
        },
        data() {
          return {
              //题目列表
              topicList: [],
              objectiveAnswer: [],
              Collectionsrc:require('../../../assets/已收藏.png'),
              Collectiontype:true,
              loading: true,                               //页面加载状态
              pageShow: false                            //页面内容显示
          };
        },
        mounted() {
            this.getFavorList();
        },
        methods: {
            async getFavorList() {
                let self = this;
                let res = await listFavorQuestions();
                console.log(res);
                self.topicList = res.data.data;
                self.pageShow = true;
                self.loading = false;
                for (let index = 0; index < self.topicList.length; index++) {
                    let t = self.topicList[index];
                    if (t.questionStatus === "FINISH") {
                        if (t.quesetionType === "subjective") {
                            if (t.answerForStudent || t.answerForTeacher) {
                                let img = await getSubjectPic(
                                    t.answerForTeacher
                                        ? t.answerForTeacher.stubForSubjective
                                        : t.answerForStudent.stubForSubjective
                                );
                                if (img.data.data) {
                                  self.objectiveAnswer.push({ id: t.questionId, answer: img.data.data.content });
                                }
                            }
                        }
                    }
                }
            },
            back() {
              this.$router.push({
        path: '/studentIndex'
    })
            },
            conversion(index) {
                let num = 65 + index;
                return String.fromCharCode(num);
            },
              //点击收藏
              Collection(questionId){
                if(this.Collectiontype){
                    let self = this;
                    removeFavorQuestion(questionId).then(res => {
                        if (res.data.code === '0010') {
                            self.getFavorList();
                        }else{
                            Toast({
                                message: res.data.msg,
                                position: "middle",
                                duration: 1000
                            });
                        }
                    });
                }
            }
        }
    };
</script>

<style scoped lang="scss">
  .studentCollection{
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
    .class_topic_warp {
      position: relative;
      width: 100%;
      height: auto;
      margin-bottom: 13px;
      margin-top: 13px;
      .Collection {
        width: 2.5rem;
        height: 2.5rem;
        position: absolute;
        right: 2rem;
        z-index: 100;
        margin-top: 13px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .objective_warp {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 18px;
        padding: 1.14rem 1.14rem;
        margin-bottom: 13px;
        background-color: white;
        box-sizing: border-box;
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
        .title {
          padding-bottom: 0.57rem;
          font-size: 18px;
          line-height: 1.79rem;
          color: rgba(105, 180, 130, 1);
        }
        .item {
          padding: 0 3.71rem;
          line-height: 2.43rem;
          font-size: 18px;
        }
        .topic {
          line-height: 2.43rem;
          font-size: 18px;
          padding: 0 3.71rem;
        }
        .select {
          position: relative;
          // height: 1.79rem;
          padding: 1.14rem 3.71rem 1.36rem;
          font-size: 0;
          cursor: pointer;

          .round {
            position: relative;
            display: inline-block;
            width: 1.43rem;
            height: 1.43rem;
            border-radius: 50%;
            border: 2px solid rgba(105, 180, 130, 1);
          // float: left;

            .point {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
              width: 0.57rem;
              height: 0.57rem;
              border-radius: 50%;
              background-color: rgba(154, 132, 255, 1);
            }
          }
          .option {
            display: inline-block;
            height: 1.79rem;
            line-height: 1.79rem;
            padding-left: 0.57rem;
            padding-right: 0.79rem;
            font-size: 20px;
            color: rgba(105, 180, 130, 1);
            // float: left;
          }

          .text {
            display: inline-block;
            height: 3rem;
            line-height: 1.79rem;
            font-size: 18px;
            color: rgba(53, 53, 53, 1);
            // float: left;
          }
        }
      }
  }

    .subjective_warp {
      /*width: 100%;*/
      /*height: 100%;*/
      padding: 1.14rem 1.14rem 3rem;
      border-radius: 18px;
      margin-bottom: 13px;
      background-color: white;
      /*box-sizing: border-box;*/
      .anwers {
        font-size: 18px;
        line-height: 24px;
        padding: 15px;
        span {
          color: red;
        }
      }
      .remind {
        font-size: 18px;
        line-height: 24px;
        padding: 15px;
      }
      .topic_warp {
        position: relative;
        .title {
          font-size: 18px;
          color: #69b482;
        }
        .topic {
          color: #353535;
          font-size: 18px;
          line-height: 34px;
          padding: 0 2.57rem;
        }
      }
    }
    .MathJye table {
      border-collapse: collapse;
      margin: 0;
      padding: 0;
      text-align: center;
      vertical-align: middle;
      line-height: normal;
      font-size: inherit;
      _font-size: 100%;
      font-style: normal;
      font-weight: normal;
      border: 0;
      float: none;
      display: inline-block;
      zoom: 0;
    }
    .mathjye-underpoint2 {
      border-bottom: 2px dotted #000;
      padding-bottom: 3px;
    }
    #q_answer {
      display: none;
    }
    table.edittable {
      border-collapse: collapse;
      text-align: center;
      margin: 2px;
    }
    table.edittable td,
    table.edittable th {
      line-height: 30px;
      padding: 5px;
      white-space: normal;
      word-break: break-all;
      border: 1px solid #000;
      vertical-align: middle;
    }
    table.composition {
      border-collapse: collapse;
      text-align: left;
      margin: 2px;
      width: 98%;
    }
    table.composition td,
    table.composition th {
      line-height: 30px;
      white-space: normal;
      word-break: break-all;
      border-width: 0;
      vertical-align: middle;
    }
    table.composition2 {
      border-collapse: collapse;
      width: auto;
    }
    table.composition2 td,
    table.composition2 th {
      text-align: left;
      line-height: 30px;
      white-space: normal;
      word-break: break-all;
      border: none;
      border-width: 0;
      vertical-align: middle;
    }
    sup {
      vertical-align: super;
    }
    sub{
        vertical-align: sub;
    }
}
</style>
