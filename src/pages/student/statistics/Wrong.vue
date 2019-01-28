  <template>
    <div class="Wrong">
      <div class="top">
        <div class="nav">
          <i
            class="iconfont icon-icon-arrow-left2"
            @click="back"
          ></i>
          <div class="text">{{msg}}</div>
        </div>
      </div>
      <div class="center">
          <div class="one">时间分类</div>
          <div class="two" @click="timeshow=!timeshow">{{time}}
            <span></span>
            <ul :class="{'ulheight':timeshow}">
              <li v-for="(item,index) in timenav" @click.stop="timeclick(item, index)" :key="index">{{item}}</li>
            </ul>
          </div>
          <div class="one">错题详情</div>
          <div class="class_topic_warp" v-for="(item,index) in topicList" :key="index">
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
              <!--<div class="anwers">
                答案错误:<span v-html="item.answer.split('|').join(',')"></span>
              </div>-->
              <div class="anwers">
                正确答案:<span v-html="item.answer.split('|').join(',')"></span>
              </div>
              <div class="remindbtn clearfix"><span @click="remindclick(index)">答案解析</span></div>
              <div class="remind" v-html="item.parse" v-if="item.parse&&remindshow&&remindid==index">
              </div>
              <div class="remind" v-if="!item.parse&&remindshow&&remindid==index">
                此题没有解析
              </div>
              <div class="raising" @click="raising(item.questionId)">智能推题</div>
            </div>
          </div>
      </div>
    </div>
  </template>

  <script>
      import {getSubjectPic} from "@/api/student/classroom";
      import PopupPic from "../../../components/topicList/PopupPic";
      import {mapGetters} from 'vuex'
  export default {
    name: "Wrong",
    components: {
      PopupPic
    },
    data() {
      return {
          msg:'',
          remindshow:false,
          remindid:'',
          time:'全部',
          timeshow:false,
          timenav:['全部','一周前错题','一月前错题'],
          topicList: [],
          objectiveAnswer: []
      };
    },
      computed: {
          //vuex 调用
          ...mapGetters([
              'incKnowledgeId',
              'incKnowledge',
              'incQuestions'
          ])
      },
    mounted() {
        this.msg = this.$route.query.msgtext;
        this.listQuestions();
    },
    methods: {
              async listQuestions() {
                  console.log(this.incKnowledgeId);
                  console.log(this.incKnowledge);
                  console.log(this.incQuestions);
                  let self = this;
                  self.topicList = this.incQuestions;
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
        this.$router.go(-1); //返回上一层
      },
              conversion(index) {
                  let num = 65 + index;
                  return String.fromCharCode(num);
              },
              remindclick(index){
                if(this.remindid == index){
                  this.remindshow = !this.remindshow
                }else {
                  this.remindid = index
                  this.remindshow = true
                }
              },
              raising(questionId){
                this.$router.push({
                    path: '@/pages/student/statistics/raising',
                    name: 'raising',
                    query:{
                        msg:this.msg,
                        questionId:questionId
                    }
                });
              },
              timeclick(name, index){
                this.timeshow = false;
                if(this.time !== name){
                    this.time = name;
                    this.topicList = [];
                    let now = new Date().getTime();
                    if(index===1){
                        let prevWeek = now - 7*86400000;
                        this.incQuestions.forEach((obj, index)=>{
                            if(obj.answerForStudent.createTime >= prevWeek){
                                this.topicList.push(obj);
                            }
                        });
                    }else if(index===2){
                        let prevMonth = now - 30*86400000;
                        this.incQuestions.forEach((obj, index)=>{
                            if(obj.answerForStudent.createTime >= prevMonth){
                                this.topicList.push(obj);
                            }
                        });
                    }else{
                        this.topicList = this.incQuestions;
                    }
                }
              }
    }
  };
  </script>

  <style scoped lang="scss">
  .Wrong {
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
    .center {
        padding: 1rem;
        margin-bottom: 5rem;
        .one {
            border-left: 4px solid   #80d59c;
            height: 1.4rem;
            text-indent: 1rem;
            font-size: 1.4rem;
            font-weight: 700;
        }
        .two {
            width: 16rem;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            font-size: 1.4rem;
            font-weight: 700;
            margin: 1rem auto;
            background-color: #fce99b;
            border-radius: 1.5rem;
            position: relative;
            span {
              display: inline-block;
              border: 0.5rem solid #000;
              border-color: #000 transparent transparent transparent;
              border-top-width: 0.8rem;
              position: absolute;
              // margin-left: 1rem;
              right:2rem;
              top:0.5rem;
            }
            ul {
              width: 14rem;
              height: 0rem;
              position: absolute;
              left:1rem;
              overflow: hidden;
              transition: height 0.5s;
              z-index: 1000;
              li {
                background-color: #fce99b;
              }
            }
            .ulheight {
              height: 300%;
            }
        }
        
      .class_topic_warp {
        position: relative;
        width: 100%;
        height: auto;
        margin: 1rem 0;
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
            border: 1px solid #80d59c;
            // margin-top: 28px;
          }
          .remindbtn {
            // position: absolute;
            span {
              right:15px;
              font-size: 18px;
              padding: 5px 10px;
              background-color: #80d59c;
              color: #fff;
              float: right;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
            }
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
    }
              .raising {
                display: block;
                width: 14rem;
                height: 3rem;
                line-height: 3rem;
                text-align: center;
                margin: 1rem auto;
                color:#fff;
                border-radius: 3rem;
                font-size: 2rem;
                background: linear-gradient(to right, #08EBD0, #28A1EC);
              }
  }
  </style>
