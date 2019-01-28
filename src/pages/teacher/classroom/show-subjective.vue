<template>
  <div class="subjectiveShow">
    <classroom-header :header="header" />
    <div class="content" v-if="pageShow">
      <div class="subjective_warp">
        <subjective :subjectiveTopic="subjectiveMsg" @subjectiveId="subjectiveId" />
        <div class="button_warp">
          <!-- @click="modifyAnswer(subjectiveMsg.questionId)" -->
          <div class="subjective_submit" @click="zz(subjectiveMsg.questionId)">批改答案
          </div>
          <div class="subjective_submit_box" v-if="cover_box==1" @click="qq">确认批改</div>
        </div>
        <board :id="this.topicId" :subjectiveAnswer="subjectiveAnswer" />
        <!-- <div id="div" class="ass"></div> -->
      </div>
    </div>
    <div class="footer" v-if="pageShow">
      <div class="score">
        得分:&nbsp;{{scores}}&nbsp;
        <span class="iconfont edit" @click="score">&#xe60c;</span>
        <mt-popup v-model="popupVisible">
          <div class="popup_warp" v-if="inputState">
            <div class="title">请输入分数</div>
            <input class="inputScore" type="text" v-model="fraction" />
            <div class="operation">
              <div @click="determine">是</div>
              <div @click="signOut">否</div>
            </div>
          </div>
          <div class="warning_warp" v-if="warningState">
            <div class="img_warp">
              <img src="../../../../public/images/warning.png">
            </div>
            <div class="title">警告</div>
            <div class="text">您输入的分数有误</div>
            <div class="close" @click="upperLevel">知道了</div>
          </div>
        </mt-popup>
      </div>
      <div class="share" @click="share" v-show="sharebtn">共享</div>
      <div class="submit" @click="submited" v-show="buttonSate">提交</div>
    </div>
    <loading v-if="loading" />
  </div>
</template>

<!--课堂主观题-->

<script>
import ClassroomHeader from "../../../components/public/PublicHeader";
import subjective from "../../../components/topicList/subjective";
import board from "../../../components/board/Board";
import Loading from "../../../components/public/Loading";
import {
  getQuestion,
  getSubjectPic,
  sendAnswer,
  shareAnswer,
  sendSubjectPicByString
} from "@/api/teacher/classroom";
import { Toast } from "mint-ui";
import { mapGetters } from "vuex";
import store from "@/store";
// import html2canvas from "html2canvas";

export default {
  components: {
    ClassroomHeader,
    subjective,
    board,
    Loading
  },
  data() {
    return {
      correction: false,
      sharebtn: "",
      imgawer:'',
      cover_box: 0,
      //图片URL
      picUrl: "",
      subjectiveId: "",
      loading: true, //加载状态
      pageShow: false, //内容状态
      header: {
        //页面头部
        title: this.teacherName,
        url: "/subjectiveDetails"
      },
      subjectiveTopic: [
        {
          //页面内容
          id: 1,
          type: "subjective",
          title: "主观题-1",
          content:
            "有两根铁丝，第一根用去 米，第二根用去 ，剩下的一样长，两根铁丝和原来相比如何。"
        }
      ],
      scores: "", //分数
      popupVisible: false, //弹出层状态
      inputState: false, //输入层状态
      warningState: false, //错误层状态
      subjectiveAnswer: [],
      subjectiveMsg: {},
      fraction: "", //输入框的分数
      answerId: "", //问题答案id
      picForSubjective: "", //图片上传到服务器的地址
      buttonSate: false //控制button显示
    };
  },
  watch: {
    boardImg(val) {
      this.buttonSate = false;
      for (let i = 0; i < this.subjectiveAnswer.length; i++) {
        if (this.subjectiveAnswer[i].id === this.subjectiveId) {
          this.subjectiveAnswer[i].answer = val.data;
          sendSubjectPicByString(val.data)
            .then(res => {
              this.picForSubjective = res.data.data.stubForSubjective;
              Toast({
                message: "储存图片成功",
                position: "bottom"
              });
              this.buttonSate = true;
            })
            .catch(err => {
              console.log(err);
              Toast({
                message: "储存图片失败",
                position: "bottom"
              });
              this.buttonSate = true;
            });
        }
      }
    }
  },
  mounted() {
    // this.getSubjectiveShow();
    this.getCourseId();
    this.getSubjectPic();
  },
  computed: {
    //vuex 调用
    ...mapGetters([
      "isBoard",
      "boardImg",
      "topicId",
      "title",
      "teacherName",
      "teacherId",
      "studentId"
    ])
  },
  methods: {
    qq() {
      this.bse();
      $(".answer").jSignature("disable"); 
    },
    zz(id) {
      this.subjectiveId = id;
      this.cover_box = 1;
      this.correction = false
      $(".answer").jSignature({
        width: "100%",
        height: "100%",
        color: 'red',
        backcolor:'blue',
        cssclass:'backcolor',
        lineWidth: 1
      });
      $(".answer").jSignature("enable"); 
      // console.log(Boolean(this.sharebtn))
    },
    //获取课堂列表穿过来的数据
    getCourseId() {
      this.stubForSubjective = this.$route.query.url;
    },
    getSubjectPic() {
      //获取题目基本信息
      // console.log(this.topicId)
      getQuestion(this.topicId)
        .then(res => {
          console.log(res);
          this.subjectiveMsg = res.data.data;
          this.subjectiveMsg.title = this.title;
          for (let i = 0; i < this.subjectiveMsg.answerForStudent.length; i++) {
            if (
              this.subjectiveMsg.answerForStudent[i].studentId ===
              this.studentId
            ) {
              this.sharebtn = this.subjectiveMsg.answerForStudent[i].result;
              if (this.subjectiveMsg.answerForStudent[i].result) {
                this.picForSubjective = this.subjectiveMsg.answerForStudent[
                  i
                ].reviseForSubjective;
              }
            }
          }
          this.getImg();
          this.pageShow = true;
          this.loading = false;
          // console.log(this.subjectiveMsg);
          // console.log(this.subjectiveAnswer);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //根据api的链接那图片路径
    async getImg() {
      let self = this;
      let stubForSubjective = undefined;
      if (self.subjectiveMsg.answerForTeacher) {
        stubForSubjective =
          self.subjectiveMsg.answerForTeacher[
            self.subjectiveMsg.answerForTeacher.findIndex(x => {
              return x.studentId == self.studentId;
            })
          ];
      } else {
        stubForSubjective =
          self.subjectiveMsg.answerForStudent[
            self.subjectiveMsg.answerForStudent.findIndex(x => {
              return x.studentId == self.studentId;
            })
          ];
      }
      try {
        let res = await getSubjectPic(
          stubForSubjective.result === "PASS"
            ? stubForSubjective.reviseForSubjective
            : stubForSubjective.stubForSubjective
        );
        self.answerId = stubForSubjective.answerId;
        console.log(res.data.data);
        self.picForSubjective = res.data.data.name;
        if (res.data.data) {
          self.picUrl = res.data.data.content;
          self.subjectiveAnswer.push({ id: self.topicId, answer: self.picUrl });
          self.buttonSate = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    //触发弹出层
    score() {
      this.popupVisible = true;
      this.inputState = true;
    },
    //弹出层确定
    determine() {
      this.inputState = false;
      // this.warningState = true;
      if (this.fraction !== "") {
        this.popupVisible = false;
        this.inputState = false;
        this.scores = this.fraction;
      } else {
        this.warningState = true;
      }
    },
    //弹出层退出
    signOut() {
      this.popupVisible = false;
      this.inputState = false;
      this.warningState = false;
    },
    //弹出层确定错误
    upperLevel() {
      this.inputState = true;
      this.warningState = false;
    },
    //修改答案
    modifyAnswer(id) {
      this.subjectiveId = id;
      let answer = "";
      for (let i = 0; i < this.subjectiveAnswer.length; i++) {
        if (id === this.subjectiveAnswer[i].id) {
          answer = this.subjectiveAnswer[i].answer;
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
    //提交
    submited() {
      let self = this;
      // console.log(self.picForSubjective)
      if (self.correction) {
        try {
          sendAnswer(
            self.topicId,
            self.answerId,
            null,
            self.scores,
            self.picForSubjective,
            self.teacherId,
            self.teacherName
          );
          Toast({
            message: "提交成功",
            position: "bottom"
          });

          // sessionStorage.setItem("sharebtn", "共享");
          self.sharebtn = "共享"
        } catch (e) {
          Toast({
            message: "提交失敗",
            position: "bottom"
          });
        }
      } else {
        Toast({
            message: "请确认批改后再提交",
            position: "bottom"
          });
      }
    },
    // bse
    bse() {
      let self = this;
      let datapair = $(".answer").jSignature("getData");
      getSubjectPic(self.picForSubjective).then(res=>{
        this.imgawer = res.data.data.content
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var imgObj = new Image();
        imgObj.setAttribute("crossOrigin", "anonymous");
        imgObj.src = "data:image/png;base64,"+self.imgawer
        imgObj.onload = function() {
          canvas.width = this.width;
          canvas.height = this.height;
          console.log(this.width,this.height)
          ctx.drawImage(this, 0, 0);
          var imgq = new Image();
          imgq.setAttribute("crossOrigin", "anonymous");
          imgq.src = datapair;
          imgq.onload = function() {
          console.log(this.width,this.height)
            ctx.drawImage(this, 0, 0,772,1000);
            var imgq = canvas.toDataURL("image/png", 0.5);
            let img = imgq.split("data:image/png;base64,")[1];
            for (let i = 0; i < self.subjectiveAnswer.length; i++) {
              if (self.subjectiveAnswer[i].id === self.subjectiveId) {
                // console.log(self.bseimg);
                sendSubjectPicByString(img)
                  .then(res => {
                    self.picForSubjective = res.data.data.stubForSubjective;
                    console.log("成功");
                    self.correction = true;
                    self.cover_box = 0
                    Toast({
                      message: "储存图片成功",
                      position: "bottom"
                    });
                    self.buttonSate = true;
                  })
                  .catch(err => {
                    console.log(err);
                    Toast({
                      message: "储存图片失败",
                      position: "bottom"
                    });
                    self.buttonSate = true;
                  });
              }
            }
          };
        };
      })

    },
    //共享
    share() {
      let self = this;
      // console.log(self.topicId, self.answerId);
      // console.log(self.scores,self.teacherId, self.teacherName)
      // console.log(self.picForSubjective);
      try {
        shareAnswer(
          self.topicId,
          self.answerId,
          null,
          self.scores,
          self.picForSubjective,
          self.teacherId,
          self.teacherName
        );
        Toast({
          message: "共享成功",
          position: "bottom"
        });
      } catch (e) {
        Toast({
          message: "共享失敗",
          position: "bottom"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.subjectiveShow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  .jSignature {
    transform: rotate(30deg)
  }
  .content {
    position: absolute;
    top: 0;
    bottom: 6rem;
    width: 100%;
    box-sizing: border-box;
    .subjective_warp {
      width: 100%;
      height: 100%;
      padding: 4.19rem 1.14rem 1.14rem;
      margin-bottom: 13px;
      background-color: white;
      box-sizing: border-box;
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
          z-index: 100;
        }
        .subjective_submit_box {
          position: absolute;
          right: 3.71rem;
          padding: 0 20px;
          height: 2.29rem;
          background-color: #fff;
          border: 2px solid #9a84ff;
          line-height: 2.29rem;
          text-align: center;
          border-radius: 1.145rem;
          color: #9a84ff;
          font-size: 18px;
          z-index: 101;
        }
        .subjective_submit_box_box {
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
          z-index: 102;
        }
        .subjective_submit:active {
          background-color: #b4b4b4;
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 6rem;
    padding: 0 4.86rem;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fafafa;
    .score {
      font-size: 24px;
      .edit {
        display: inline-block;
        width: 1.43rem;
        height: 1.43rem;
        text-align: center;
        line-height: 20px;
        font-size: 20px;
      }
      .mint-popup {
        background-color: #f7f7f7;
        border-radius: 5px;
        .popup_warp {
          padding: 3.57rem 5.15rem 2.86rem;
          .title {
            text-align: center;
            padding-bottom: 3.43rem;
            color: #a2a2a2;
            font-size: 20px;
          }
          .inputScore {
            border: 1px solid #f7f7f7;
            padding: 0.65rem 0.72rem;
            margin-bottom: 3.43rem;
            font-size: 20px;
            color: #777777;
            border-radius: 5px;
            background-color: white;
          }
          .operation {
            display: flex;
            justify-content: space-between;
            div {
              background-color: #f7f7f7;
              font-size: 20px;
              color: #777777;
            }
            div:nth-child(1) {
              color: #80d59c;
            }
          }
        }
        .warning_warp {
          padding: 1.36rem 7.2rem 1.6rem;
          text-align: center;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
          .img_warp {
            width: 59px;
            height: 56px;
            margin: 0 auto;
            padding-bottom: 1.86rem;
            img {
              width: 100%;
            }
          }
          .title {
            padding-bottom: 1.36rem;
            font-size: 24px;
            color: #656565;
          }
          .text {
            white-space: nowrap;
            padding-bottom: 2.29rem;
            font-size: 16px;
            color: #a7a7a7;
          }
          .close {
            padding: 1rem 2.5rem;
            color: #8b8b8b;
            font-size: 16px;
            background-color: #e6ebf0;
            border: 1px solid #e4e4e4;
            box-sizing: border-box;
          }
        }
      }
    }
    .share {
      // position: absolute;
      // right: 42%;
      font-size: 18px;
      padding: 0.57rem 3.14rem;
      background-color: #9a84ff;
      border-radius: 100px;
    }
    .submit {
      font-size: 18px;
      padding: 0.57rem 3.14rem;
      background-color: #9a84ff;
      border-radius: 100px;
    }
    .submit:active {
      box-shadow: 0 2px 6px 3px #7c6fd1;
      background-color: #7c6fd1;
    }
  }
}
</style>
