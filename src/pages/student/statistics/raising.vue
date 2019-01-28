  <template>
    <div class="raising">
      <div class="top">
        <div class="nav">
          <i
            class="iconfont icon-icon-arrow-left2"
            @click="back"
          ></i>
          <div class="text">{{msg}}</div>
        </div>
      </div>
      <div class="center" v-if="pageShow">
          <div class="one">智能推题</div>
          <div class="class_topic_warp" v-for="(item,index) in addTopicList" :key="index">
            <div class="objective_warp" v-if="item.quesetionType==='objective'">
              <div class="topic" v-html="item.questionContent">
                {{item.questionContent}}
              </div>
              <div class="select clearfix" @click="Selection(index1)" v-for="(item1,index1) in item.options" :key="index1" v-if="item.answer.length==1">
                <div class="round" v-if="index===addTopicList.length-1">
                  <span class="point" v-if="Selectionanswer === conversion(index1) &&Selectionshow"></span>
                </div>
                <div class="option">{{conversion(index1)}}.</div>
                <div class="text" v-html="item1">{{item1}}</div>
              </div>
              <div class="select clearfix" @click="Selections(index2)" v-for="(item2,index2) in item.options" :key="index2" v-if="item.answer.length>1">
                <div class="round" v-if="index===addTopicList.length-1">
                    <span class="point" v-for="(item3,index3) in Selectionanswer.split('|')" :key="index3" v-if="item3 === conversion(index2) &&Selectionshow"></span>
                  </div>
                <div class="option">{{conversion(index2)}}.</div>
                <div class="text" v-html="item2">{{item2}}</div>
              </div>
              <PopupPic :questionPic="item.questionPic"/>
                <div v-if="item.answerForStudent">
                    <div class="anwers" v-if="item.answerForStudent">
                        你的答案:<span v-html="item.answerForStudent.split('|').join(',')"></span>
                    </div>
                    <div class="anwers" v-if="item.answer">
                        正确答案:<span v-html="item.answer.split('|').join(',')"></span>
                    </div>
                    <div class="remindbtn clearfix"><span @click="remindclick(index)">答案解析</span></div>
                    <div class="remind" v-html="item.parse" v-if="item.parse&&remindshow&&remindid==index">
                    </div>
                    <div class="remind" v-if="!item.parse&&remindshow&&remindid==index">
                        此题没有解析
                    </div>
                </div>
                <div @click="Selectionclick(item.answer)" class="btn" v-if="!item.answerForStudent"><span>提交答案</span></div>
            </div>
          </div>
            <div class="btn2" @click="btnclick" v-if="Selectionshow==false">{{btn2text}}</div>
      </div>
        <loading v-if="loading"/>
    </div>
  </template>

  <script>
      import {aiPushQuestions, getSubjectPic} from "@/api/student/classroom";
      import PopupPic from "../../../components/topicList/PopupPic";
      import {mapGetters} from 'vuex';
      import {Toast} from 'mint-ui';
      import Loading from '../../../components/public/Loading';
  export default {
    name: "raising",
    components: {
        PopupPic,
        Loading
    },
    data() {
      return {
          msg:'',
          questionId:'',
          diff:'',
          qtypeId:'',
          Selectionanswer:'',//单选
          Selectiontext:'',
          Selectionshow:true,
          remindshow:false,
          remindid:'',
          btn2text:'',
          frequency:3,
          topicList: [],
          addTopicList: [],
          objectiveAnswer: [],
          loading: true,                               //页面加载状态
          pageShow: false                            //页面内容显示
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
        this.msg = this.$route.query.msg+'·智能推题';
        this.questionId = this.$route.query.questionId;
        this.pushQuestions();
    },
    methods: {
        async pushQuestions() {
                  let self = this;
                  self.incQuestions.forEach((obj, index)=>{
                      if(obj.questionId === self.questionId){
                          self.diff = obj.difficulty;
                          self.qtypeId = obj.questionTypeInCN;
                      }
                  });

                  let res = await aiPushQuestions(self.incKnowledgeId, self.qtypeId, self.diff);
                  console.log(res);
                  if(!res.data||!res.data.data||res.data.code!=="0010"){Toast("没有合适题目推送！");return;}
                  self.topicList = res.data.data;
                  self.frequency = self.topicList.length;
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
                self.addTopicList.push(self.topicList[self.addTopicList.length]);
                self.pageShow = true;
                self.loading = false;
              },
              conversion(index) {
                  let num = 65 + index;
                  return String.fromCharCode(num);
              },
              Selection(index){
                  let num = 65 + index;
                  this.Selectionanswer = String.fromCharCode(num)
              },
              Selections(index) {
                  let b =""
                    if(this.Selectiontext.indexOf(index)>-1){
                    let a = this.Selectiontext.split(index)
                    this.Selectiontext = a[0]+a[1]
                    }else{
                    this.Selectiontext = this.Selectiontext+index
                    }
                    for(let i=0;i<this.Selectiontext.length;i++){
                    let d = parseInt(this.Selectiontext[i])+65
                    let e = String.fromCharCode(d)
                    b = b+e
                    }
                    b = b.split("").sort().join('')
                    if(b.length==1){
                        b = b+"|"
                    }else{
                    b = b.split("").join("|")
                    }
                    this.Selectionanswer = b   
                },
      back() {
        this.$router.go(-1); //返回上一层
      },
              remindclick(index){
                if(this.remindid == index){
                  this.remindshow = !this.remindshow
                }else {
                this.remindid = index
                this.remindshow = true
                }
              },
              Selectionclick(answer){
                  this.Selectionshow = false
                //   用于对比当前答案的正确与否
                //答案正确
                if(answer==this.Selectionanswer){
                    this.btn2text = '返回错题集'
                } else {
                    this.addTopicList[this.addTopicList.length-1].answerForStudent = this.Selectionanswer;
                    this.Selectiontext = "";
                    this.frequency = this.frequency-1
                    this.btn2text = '再推一题（剩余'+this.frequency+'次'
                    if(this.frequency == 0) {
                        this.btn2text = '返回错题集'
                    }
                }
              },
              btnclick(){
                  if(this.btn2text == '返回错题集'){
                    this.$router.push({
                    path: '@/pages/student/statistics/mistakescollection',
                    name: 'mistakescollection'
                    });
                  } else {
                    if(this.frequency>0){
                        this.Selectionshow = true;
                        this.Selectionanswer = '';
                        this.addTopicList.push(this.topicList[this.addTopicList.length]);
                    }
                  }
              }
    }
  };
  </script>

  <style scoped lang="scss">
  .raising {
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
          .btn {
              margin-bottom: 2rem;
              span {
              right:15px;
              font-size: 18px;
              padding: 5px 10px;
              background-color: #80d59c;
              color: #fff;
              float: right;
              border-radius: 10px;
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
      .btn2 {
                display: block;
                width: 16rem;
                height: 3rem;
                line-height: 3rem;
                text-align: center;
                margin: 1rem auto;
                color:#fff;
                border-radius: 3rem;
                font-size: 1.6rem;
                background: linear-gradient(to right, #08EBD0, #28A1EC);
              }
  }
  </style>
