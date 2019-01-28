<template>
  <div class="classroom">
    <public-header :header="header" />
    <scroll-content ref="myscrollfull" :mescrollValue="mescrollValue" v-if="pageShow">
      <!--时间-->
      <div class="time">{{hours}}:{{minutes}}</div>
      <!--预习要点-->
      <preview-points :preview="preview" v-if="preview" />
      <div class="class_topic_warp" v-for="(item,index) in showTopicList" :key="index">
        <!--客观题-->
        <div class="objective_warp" v-if="item.quesetionType==='objective'">
          <class-objective :objective="item" @selectAnswer="selectAnswer" @Multipleanswers="Multipleanswers"/>
          <div class="submit_warp" v-if="item.questionStatus !== 'FINISH'">
            <div class="objective_submit" @click="objective_submit(item.questionId)">
              提交
            </div>
          </div>
          <reply :reply="reply" :type="item.type" :id="item.questionId" />
          <!--老师关闭回答-->
          <div class="closeReply" v-if="item.questionStatus === 'FINISH'">
            <span class="text">老师已终止{{item.title}}的作答</span>
          </div>
        </div>
        <!--主观题-->
        <div class="subjective_warp" v-if="item.quesetionType ==='subjective'">
          <subjective :subjectiveTopic="item" />
          <div class="button_warp" v-if="item.questionStatus !=='FINISH'">
            <div class="subjective_submit" v-show="!objectiveAnswer[index].answer" @click="answerQuestions(item.questionId)">开始答题
            </div>
            <div class="subjective_submit" v-show="objectiveAnswer[index].answer" @click="modifyAnswer(item.questionId)">修改答案
            </div>
          </div>
          <board :subjectiveAnswer="objectiveAnswer" :id="item.questionId" v-show="isAnswer(objectiveAnswer[index].answer)" />
          <!--老师关闭回答-->
          <div class="closeReply" v-if="item.questionStatus === 'FINISH'">
            <span class="text">老师已终止{{item.title}}的作答</span>
          </div>
        </div>
      </div>
      <div id="btn" :class="{'awbtn':btn===current}" @click="Answerbtn">
        <img src="@/assets/答案.png" alt="">
      </div>
    </scroll-content>
    <div class="AnswerShare" v-show="AnswerShareshow">
      <span class="btnout" @click="btnout">x</span>
      <div class="AnswerShareList" v-for="(item,index) in AnswerShareList" :key="index">
        <div :id="item.id" class="question" v-html="item.title">{{item.title}}</div>
        <div class="answerimg"><img :src="item.img" alt=""></div>
      </div>
    </div>
    <loading v-if="loading" />
  </div>
</template>

<!--课堂详情-->

<script>
import ClassObjective from "../../../components/topicList/classObjective";
import PublicHeader from "../../../components/public/PublicHeader";
import ScrollContent from "../../../components/public/ScrollContent";
import PreviewPoints from "../../../components/topicList/previewPoints";
import Subjective from "../../../components/topicList/subjective";
import Reply from "../../../components/classroom/Reply";
import Board from "../../../components/board/Board";
import Loading from "../../../components/public/Loading";
import {
  getCourse,
  getSubjectPic,
  sendObjectiveAnswer,
  sendSubjectiveAnswer,
  sendSubjectPicByString
} from "@/api/student/classroom";
import { Indicator, Toast } from "mint-ui";
import { mapGetters } from "vuex";
import store from "@/store";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
// import topic from "../../../store/modules/teacher/topic";

export default {
  components: {
    PublicHeader,
    ScrollContent,
    PreviewPoints,
    Subjective,
    Reply,
    Board,
    Loading,
    ClassObjective
  },
  data() {
    return {
      AnswerShareList: [],
      AnswerShareshow: false,
      btn: 1,
      current: 0,
      //计算现在是第几个客观题
      objectiveCount: 0,
      //计算现在是第几个主观题
      subjectiveCount: 0,
      //课堂传过来的id
      course: "",
      progress: 0,
      subjectiveId: "",
      //题目列表
      topicList: [],
      //发过来的id
      topicListId: [],
      //渲染的数组
      showTopicList: [],
      //页面是否需要滚动
      mescrollValue: {
        up: false,
        down: false
      },
      //页面加载状态
      loading: true,
      //页面显示状态
      pageShow: false,
      //头部显示标题
      header: {
        //title是课堂列表传过来的
        title: "",
        url: "/studentIndex"
      },
      //预习要点内容
      preview: "",
      //题目当前选择答案
      objectiveAnswer: [],
      //客观题历史答案答案
      reply: [],
      //时
      hours: 0,
      //分
      minutes: 0,
      wsUrl: "http://school.jichuangsi.com:81",
      stompClient: null,
      subscription: null,
      token: localStorage.getItem("token")
    };
  },
  watch: {
    boardImg(val) {
      let _this = this;
      _this.objectiveAnswer.forEach((answer, index) => {
        if (answer.id === _this.subjectiveId) {
          answer.answer = val.data;
          this.$set(_this.objectiveAnswer, index, answer);
        }
      });
      //主观题答案存根
      sendSubjectPicByString(val.data)
        .then(res => {
          Toast({
            message: "图片存储成功！",
            position: "middle",
            duration: 1000
          });
          //提交主观题答案
          sendSubjectiveAnswer(
            this.course,
            this.subjectiveId,
            123,
            "test",
            res.data.data.stubForSubjective
          )
            .then(res => {
              console.log(res);
              Toast({
                message: "答案提交成功！",
                position: "middle",
                duration: 1000
              });
            })
            .catch(err => {
              Toast({
                message: "答案提交失败！",
                position: "middle",
                duration: 1000
              });
              console.log(err);
            });
        })
        .catch(err => {
          Toast({
            message: "图片存储失败！",
            position: "middle",
            duration: 1000
          });
          console.log(err);
        });
    }
  },
  mounted() {
    this.getCourseId();
    this.getClassrooms();
    let time = new Date(); //修改数据date
    this.hours = time.getHours();
    this.minutes = time.getMinutes();
    if (this.minutes < 10) {
      this.minutes = "0" + this.minutes;
    }
    this.time();
    this.connect();
  },
  computed: {
    //vuex 调用
    ...mapGetters(["isBoard", "isBlueTooth", "boardImg"])
  },
  methods: {
    Answerbtn(){
      this.AnswerShareshow = true;
    },
    btnout() {
      this.btn = 1;
      this.AnswerShareshow = false;
    },
    //判断学生有没有回答主观题，终止作答时图片位置显不显示
    isAnswer(answer) {
      if (answer) {
        return true;
      } else {
        return false;
      }
    },
    //开始回答
    answerQuestions(id) {
      this.subjectiveId = id;
      window.HandwrittenBoard.isConnect(
        function(res) {
          console.log(res);
        },
        function(res) {
          console.log(res);
          switch (res.data.status) {
            case 0:
              store.commit("SET_BLUETOOTH", true);
              window.HandwrittenBoard.exploration();
              console.log("第一个");
              break;
            case 2:
              window.HandwrittenBoard.getBase64img();
              console.log("第二个");
              break;
            default:
              break;
          }
        }
      );
    },
    //添加题目
    addTopic(topicId) {
      let self = this;
      self.topicList.forEach(topic => {
        if (topic.questionId === topicId) {
          let tmp = JSON.parse(JSON.stringify(topic));
          switch (topic.quesetionType) {
            case "objective":
              self.objectiveCount++;
              tmp.title = "客观题-" + self.objectiveCount;
              break;
            case "subjective":
              self.subjectiveCount++;
              tmp.title = "主观题-" + self.subjectiveCount;
              break;
            default:
              //TODO:UNUSE CASE
              return;
          }
          self.showTopicList.push(tmp);
          self.objectiveAnswer.push({ id: topic.questionId, answer: "" });
        }
      });
    },
    //修改答案
    modifyAnswer(id) {
      this.subjectiveId = id;
      let answer = "";
      for (let i = 0; i < this.objectiveAnswer.length; i++) {
        if (id === this.objectiveAnswer[i].id) {
          answer = this.objectiveAnswer[i].answer;
        }
      }
      window.HandwrittenBoard.isConnect(
        function(res) {
          console.log(res);
        },
        function(res) {
          console.log(res);
          switch (res.data.status) {
            case 0:
              store.commit("SET_BLUETOOTH", true);
              window.HandwrittenBoard.exploration();
              console.log("第一个");
              break;
            case 2:
              window.HandwrittenBoard.getBase64img(answer);
              console.log("第二个");
              break;
            default:
              break;
          }
        }
      );
    },
    //选择题答案
    // 单选
    selectAnswer(id, title) {
      for (let i = 0; i < this.objectiveAnswer.length; i++) {
        if (this.objectiveAnswer[i].id === id) {
          this.objectiveAnswer[i].answer = title;
        }
      }
    },
    // 多选题答案
    Multipleanswers(id, title){
      for (let i = 0; i < this.objectiveAnswer.length; i++) {
        if (this.objectiveAnswer[i].id === id) {
          this.objectiveAnswer[i].answer = title;
          console.log(this.objectiveAnswer[i].answer)
        }
      }
    },
    //客观题点击提交
    objective_submit(id) {
      for (let i = 0; i < this.objectiveAnswer.length; i++) {
        //答案数组id跟当前选中题目id一致
        if (this.objectiveAnswer[i].id === id) {
          //当前选中题目的答案为空
          if (!this.objectiveAnswer[i].answer) {
            return false;
          }
          //答案数组长度为零的时候
          if (this.reply.length === 0) {
            this.reply.push({
              id: id,
              answer: [this.objectiveAnswer[i].answer]
            });
            this.sendObjective(id, this.objectiveAnswer[i].answer);
            return false;
          }

          let state = false;
          //答案数组不为零，但是又没有跟这个当前选中题目id相同的就是把state改成true
          for (let j = 0; j < this.reply.length; j++) {
            //判断上次一次的答案跟这一次是否一样
            if (this.reply[j].id === id) {
              if (
                this.reply[j].answer[this.reply[j].answer.length - 1] ===
                this.objectiveAnswer[i].answer
              ) {
                return false;
              } else {
                this.reply[j].answer.push(this.objectiveAnswer[i].answer);
                this.sendObjective(id, this.objectiveAnswer[i].answer);
                state = true;
                return false;
              }
            }
          }
          //当state状态为false执行
          if (state === false) {
            console.log(this.objectiveAnswer[i].answer);
            this.reply.push({
              id: id,
              answer: [this.objectiveAnswer[i].answer]
            });
            this.sendObjective(id, this.objectiveAnswer[i].answer);
            return false;
          }
        }
      }
    },
    //提交客观题答案
    sendObjective(id, answer) {
      //客观题答案提交
      sendObjectiveAnswer(this.course, id, 123, "test", answer)
        .then(res => {
          Toast({
            message: "答案提交成功！",
            position: "middle",
            duration: 1000
          });
          console.log(this.reply);
        })
        .catch(err => {
          Toast({
            message: "答案提交失败！",
            position: "middle",
            duration: 1000
          });
          console.log(err);
        });
    },
    questions() {
      if (this.isBoard) {
        Indicator.open({
          text: "正在获取手写板内容...",
          spinnerType: "fading-circle"
        });
        let self = this;
        setTimeout(function() {
          window.HandwrittenBoard.take(function(res) {
            console.log(res);
            self.img = res.data.image;
            Indicator.close();
            Toast("获取手写板内容成功!");
            window.HandwrittenBoard.cleanup(function() {});
          });
        }, 300);
      } else {
        window.HandwrittenBoard.exploration();
      }
    },
    //页面运行去获取数据
    async getClassrooms() {
      let self = this;
      let res = await getCourse(self.course);
      console.log(res);
      self.topicList = res.data.data.questions;
      self.preview = res.data.data.courseInfo;

      for (let index = 0; index < self.topicList.length; index++) {
        let t = self.topicList[index];
        if (t.questionStatus != "NOTSTART") {
          self.addTopic(t.questionId);
        }
        if (t.answerForStudent) {
          if (t.quesetionType === "objective") {
            self.reply.push({
              id: t.questionId,
              answer: [t.answerForStudent.answerForObjective]
            });
          } else {
            if (t.answerForStudent || t.answerForTeacher) {
              let img = await getSubjectPic(
                t.answerForTeacher
                  ? t.answerForTeacher.stubForSubjective
                  : t.answerForStudent.stubForSubjective
              );
              let i = self.objectiveAnswer.findIndex(x => {
                return x.id === t.questionId;
              });
              if(i != -1){
                let answer = self.objectiveAnswer[i];
                if (img.data.data) {
                  answer.answer = img.data.data.content;
                  self.$set(self.objectiveAnswer, i, answer);
                }
              }
            }
          }
        }
        self.pageShow = true;
        self.loading = false;
      }
    },
    //计算定时器
    time() {
      let _this = this;
      let timer = setInterval(function() {
        let time = new Date(); //修改数据date
        _this.hours = time.getHours();
        _this.minutes = time.getMinutes();
        if (_this.minutes < 10) {
          _this.minutes = "0" + _this.minutes;
        }
      }, 1000);
    },
    //获取课堂列表穿过来的数据
    getCourseId() {
      this.course = this.$route.query.courseId;
      this.header.title = this.$route.query.courseName;
    },
    //连接socket
    connect() {
      //地址+端点路径，构建websocket链接地址
      let socket = new SockJS(this.wsUrl + "/websocket/course");
      this.stompClient = Stomp.over(socket); //一些老的浏览器不支持WebSocket的脚本或者使用别的名字。默认下，stomp.js会使用浏览器原生的WebSocket class去创建WebSocket。利用Stomp.over(ws)这个方法可以使用其他类型的WebSockets。这个方法得到一个满足WebSocket定义的对象

      this.stompClient.heartbeat.outgoing = 400000; // client will send heartbeats every 40000ms
      this.stompClient.heartbeat.incoming = 0; // client does not want to receive heartbeats from the server
      //连接时的请求头部信息
      let headers = {
        login: "mylogin",
        passcode: "mypasscode",
        // additional header
        userId: "curUserId",
        accessToken: this.token
      };

      //创建连接并在连接成功后订阅班级为“2018001”班级的信息
      let _this = this;
      this.stompClient.connect(headers, function(frame) {
        console.log("Connected:" + frame);

        let subHeader = {
          userId: "curUserId",
          accessToken: _this.token
        }; //订阅时的头信息
        //监听的路径以及回调。返回的subscription用于取消订阅
        _this.subscription = _this.stompClient.subscribe(
          "/topic/course/student/" + _this.course,
          function(response) {
            _this.classData(response);
          },
          subHeader
        );
      });
    },
    //订阅课堂
    classData(response) {
      let classData = JSON.parse(response.body);
      let self = this;
      if (classData.data) {
        //发布题目
        if (classData.data.wsType === "QuestionForPublish") {
          this.addTopic(classData.data.questionId);
        }
        if (classData.data.wsType === "QuestionClose") {
          //终止答题
          self.showTopicList.forEach((topic, index) => {
            if (
              topic.questionId &&
              topic.questionId === classData.data.questionId
            ) {
              topic.questionStatus = "FINISH";
              self.$set(self.showTopicList, index, topic);
            }
          });
        }
        if (classData.data.wsType === "AnswerShare") {
          let self = this;
          self.btn = 0;
          for (let i = 0; i < self.topicList.length; i++) {
            let val = self.topicList[i];
            if (val.questionId === classData.data.questionId) {
              getSubjectPic(classData.data.picPath).then(res => {
                if (res.data.data) {
                  let img =
                    "data:image/png;base64," +
                    res.data.data.content.replace(",", "");
                  self.AnswerShareList=[{
                    id: val.questionId,
                    title: val.questionContent,
                    img: img
                  }];
                }
              });
            }
          }
        }
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); //在vue实例销毁钱，清除我们的定时器
    }
    //取消订阅
    this.stompClient.unsubscribe("/topic/course/student/" + this.course);
  }
};
</script>

<style lang="scss" scoped>
.classroom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .AnswerShare {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #fff;
    z-index: 1000;
    top: 0;
    .btnout {
      font-size: 4rem;
      font-weight: 700;
      color: yellowgreen;
      position: absolute;
      right: 2rem;
      top: 1rem;
    }
    .AnswerShareList {
      padding: 3rem 1rem;
      .question {
        line-height: 2.43rem;
        font-size: 18px;
        padding: 0 3.71rem;
      }
      .answerimg {
        width: 100%;
        height: 100%;
        overflow: hidden;
        img {
          width: 100%;
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
      sub {
        vertical-align: sub;
      }
    }
  #btn {
    width: 10rem;
    height: 10rem;
    position: fixed;
    top: 40%;
    left: -10rem;
    color: #fff;
    border-radius: 50%;
    transition: left 1s;
    overflow: hidden;
    z-index: 900;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .awbtn {
    left: 18rem !important; 
    img {
      width: 100%;
      height: 100%;
    }
  }
  .mescroll {
    box-sizing: border-box;
    position: absolute;
    top: 4.29rem;
    bottom: 0;
    padding: 0 1.14rem 3rem;
    height: auto !important;
    .empty {
      text-align: center;
      font-size: 18px;
      padding-top: 1.79rem;
    }
    .time {
      width: 100%;
      height: 100%;
      line-height: 1.43rem;
      padding: 0.93rem 0 0.79rem;
      font-size: 18px;
      text-align: center;
      color: rgba(200, 200, 200, 1);
    }
    .class_topic_warp {
      position: relative;
      width: 100%;
      height: auto;
      margin-bottom: 13px;
      .objective_warp {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 18px;
        padding: 1.14rem 1.14rem;
        margin-bottom: 13px;
        background-color: white;
        box-sizing: border-box;
        .submit_warp {
          position: relative;
          height: 2.5rem;
          width: 100%;
          margin-bottom: 2.29rem;
          .objective_submit {
            position: absolute;
            right: 3.71rem;
            width: 6.57rem;
            height: 2.29rem;
            border: 2px solid #9a84ff;
            line-height: 2.29rem;
            text-align: center;
            border-radius: 1.145rem;
            color: #9a84ff;
            font-size: 18px;
          }
          .objective_submit:active {
            box-shadow: 10px 40px 10px rgba(0, 17, 27, 0.1) inset;
          }
        }
        .closeReply {
          margin-top: 2.5rem;
          text-align: center;
          .text {
            padding: 0.14rem 1.4rem;
            border-radius: 100px;
            color: rgba(203, 203, 203, 1);
            background-color: rgba(244, 244, 244, 1);
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
        .button_warp {
          padding-bottom: 20px;
          position: relative;
          height: 2.7rem;
          .subjective_submit {
            position: absolute;
            right: 3.71rem;
            padding: 0 20px;
            height: 2.29rem;
            border: 2px solid #9a84ff;
            line-height: 2.29rem;
            text-align: center;
            border-radius: 1.145rem;
            color: #9a84ff;
            font-size: 18px;
          }
          .subjective_submit:active {
            box-shadow: 10px 40px 10px rgba(0, 17, 27, 0.1) inset;
          }
        }
        .closeReply {
          margin-top: 2.5rem;
          text-align: center;
          .text {
            padding: 0.14rem 1.4rem;
            border-radius: 100px;
            color: rgba(203, 203, 203, 1);
            background-color: rgba(244, 244, 244, 1);
          }
        }
      }
    }
  }
}
</style>
