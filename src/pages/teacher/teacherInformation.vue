<template>
  <div class="teacherInformation">
    <public-header :header="header"/>
    <div class="content">
      <div class="avatar clearfix">
        <div class="title">头像</div>
        <div class="img_warp" @click="oepenPicture">
          <img :src="userimg">
        </div>
      </div>
      <div class="set_box" v-if="setPictrue" @click="setPictrue = false">
        <div class="setbox" @click.stop="setPictrue = true">
          <div class="title">提示</div>
          <div class="text">修改头像</div>
          <div class="pictrue">
            <div class="pictrueBox" @click="cameraTakePicture">
              <!-- <img src="../../../assets/照相机.png"> -->
            </div>
            <div class="pictrueBox1" @click="Picturelibrary">
              <!-- <img src="../../../assets/图库.png"> -->
            </div>
          </div>
          <div class="btn">
            <div class="cancel" @click.stop="setPictrue= false">取消</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="title">名字</div>
        <div class="text">{{this.user.name}}</div>
      </div>
      <div class="row">
        <div class="title">学校</div>
        <div class="text">{{this.user.school}}</div>
      </div>
      <div class="row">
        <div class="title">科目</div>
        <div class="text">{{this.user.subject}}</div>
      </div>
      <div class="row">
        <div class="title">年级</div>
        <div class="text">{{this.user.grade}}</div>
      </div>
      <div class="row">
        <div class="title">班主任</div>
        <div class="text">{{this.user.primaryClass}}</div>
      </div>
      <div class="row">
        <div class="title">负责级班</div>
        <div class="text">{{this.user.secondaryClass}}</div>
      </div>
      <div class="row" @click="setPwd">
        <div class="title">修改密码</div>
        <div class="text"></div>
      </div>
      <div class="set_box" v-if="setshowPwd" @click="setshowPwd = false">
        <div class="setbox" @click.stop="setshowPwd = true">
          <div class="title">提示</div>
          <div class="text">修改密码</div>
          <div class="intPwd">
            <input type="password" placeholder="请输新密码" v-model.trim="oldPwd">
          </div>
          <div class="intPwd">
            <input type="password" placeholder="确认新密码" v-model.trim="newPwd">
          </div>
          <div class="btn">
            <div class="cancel" @click.stop="setshowPwd = false">取消</div>
            <div class="confirm" @click.stop="update">确认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PublicHeader from "../../components/public/PublicHeader";
import { updatePwd, updateImg, getImg } from "@/api/teacher/classroom";
import { Toast } from "mint-ui";

export default {
  name: "personalInformation",
  components: {
    PublicHeader
  },
  data() {
    return {
      header: {
        title: "个人信息",
        url: "/teacherIndex"
      },
      userimg: "",
      setshowPwd: false,
      setPictrue: false,
      ready: false,
      oldPwd: "",
      newPwd: "",
      user: {
        name: "",
        school: "",
        subject: "",
        grade: "",
        primaryClass: "",
        secondaryClass: ""
      }
    };
  },
  mounted() {
    this.initialize();
    this.getteacher();
  },
  methods: {
    initialize() {
      let _this = this;
      document.addEventListener(
        "deviceready",
        _this.onDeviceReady.bind(this),
        false
      );
    },
    // deviceready Event Handler
    onDeviceReady() {
      this.ready = true;
    },
    getteacher() {
      let userInStorage = JSON.parse(localStorage.getItem("user"));
      if (userInStorage) {
        this.user.name = userInStorage.userName;
        if (userInStorage.roles && userInStorage.roles.length > 0) {
          this.user.school = userInStorage.roles[0].school.schoolName;
          this.user.subject = userInStorage.roles[0].primarySubject.subjectName;
          this.user.grade = userInStorage.roles[0].primaryGrade.gradeName;
          if (userInStorage.roles[0].primaryClass)
            this.user.primaryClass =
              userInStorage.roles[0].primaryClass.className;
          if (userInStorage.roles[0].secondaryClass) {
            let arr = [];
            userInStorage.roles[0].secondaryClass.forEach((c, index) => {
              arr.push(c.className);
            });
            this.user.secondaryClass = arr.join(",");
          }
        }
        var img = localStorage.getItem("HeadPortrait")
          ? localStorage.getItem("HeadPortrait")
          : "";
        if (img) {
          this.userimg = "data:image/jpeg;base64," + img;
        } else {
          if (userInStorage.userSex == "FEMALE") {
            this.userimg = require("../../assets/女老师.png");
          } else {
            this.userimg = require("../../assets/男老师.png");
          }
        }
      }
    },
    setPwd() {
      this.setshowPwd = true;
    },
     //打开照相机
    oepenPicture() {
      this.setPictrue = true;
    },
      //打开照相机
    oepenPicture() {
      this.setPictrue = true;
    },
    //测试照相机
    cameraTakePicture() {
      if (this.ready) {
        let _this = this;
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          allowEdit: true,
          targetWidth: 214,
          targetHeight: 214,
          mediaType: 0,
          saveToPhotoAlbum: true,
          cameraDirection: 0,
          encodingType: Camera.EncodingType.PNG
        });
        function onSuccess(imageData) {
          var image = document.getElementById("myImage");
          updateImg(imageData).then(res => {
            if (res.data.code === "0010") {
              Toast("修改成功");
              localStorage.setItem("HeadPortrait", imageData);
            } else {
              Toast("修改失败");
            }
          });
          _this.userimg = "data:image/jpeg;base64," + imageData;
        }
        function onFail(message) {
          Toast("拍照失败，原因为: " + message);
        }
      } else {
        Toast("设备没响应，请稍后重试");
      }
    },
     //图库
    Picturelibrary() {
      if (this.ready) {
        let _this = this;
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
          allowEdit: true,
          targetWidth: 214,
          targetHeight: 214,
          mediaType: 0,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
        });
        function onSuccess(imageData) {
          var image = document.getElementById("myImage");
          updateImg(imageData).then(res => {
            if (res.data.code === "0010") {
              Toast("修改成功");
              localStorage.setItem("HeadPortrait", imageData);
            } else {
              Toast("修改失败");
            }
          });
          _this.userimg = "data:image/jpeg;base64," + imageData;
        }
        function onFail(message) {
          alert("Failed because: " + message);
        }
      } else {
        Toast("设备没响应，请稍后重试");
      }
    },
    update() {
      //修改密码
      this.setshowPwd = false;
      let userInStorage = JSON.parse(localStorage.getItem("user"));
      console.log(userInStorage);
      if (this.oldPwd != "" && this.newPwd != "") {
        if (this.oldPwd == this.newPwd) {
          if (this.newPwd.length >= 6 && this.newPwd.length < 18) {
            let userId = userInStorage.userId;
            updatePwd(userId, this.oldPwd, this.newPwd).then(res => {
              console.log(res);
              if (res.data.code == "0010") {
                Toast("修改成功");
              } else {
                Toast("修改失败");
              }
            });
          } else {
            Toast("密码长度为6~18位,数字字母混合");
          }
        } else {
          Toast("两次密码不一致");
        }
      } else {
        Toast("密码不能为空");
      }
    }
  }
};
</script>

<style lang="scss">
.teacherInformation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .content {
    width: 100%;
    padding-top: 3.14rem;
    padding-left: 2.14rem;
    background-color: white;
    box-sizing: border-box;
    .avatar {
      width: 100%;
      height: 13.21rem;
      padding-right: 6.64rem;
      box-sizing: border-box;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 1px solid rgba(222, 222, 222, 1);
        -webkit-transform: scaleY(0.5);
        -webkit-transform-origin: 0 0;
      }
      .title {
        line-height: 13.21rem;
        float: left;
        font-size: 28px;
        color: rgba(97, 97, 97, 1);
      }
      .img_warp {
        width: 8.93rem;
        height: 8.93rem;
        margin-top: 2.14rem;
        float: right;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      &:after {
        content: " ";
        display: inline-block;
        height: 12.7px;
        width: 12.7px;
        border-width: 4px 4px 0 0;
        border-color: rgba(137, 137, 137, 1);
        border-style: solid;
        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
        position: absolute;
        top: 50%;
        right: 2.19rem;
        margin-top: -4px;
      }
    }
    .row {
      height: 6.21rem;
      line-height: 6.21rem;
      padding-right: 6.64rem;
      box-sizing: border-box;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 1px solid rgba(222, 222, 222, 1);
        -webkit-transform: scaleY(0.5);
        -webkit-transform-origin: 0 0;
      }
      .title {
        float: left;
        font-size: 28px;
      }
      .text {
        float: right;
        font-size: 24px;
        color: #a5a5a5;
      }
    }
  }
}
.set_box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.3);
   z-index: 100;
  .setbox {
    width: 85%;
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    background-color: #fff;
    transform: translate(-50%, -50%);
    .title {
      font-size: 24px;
      color: #333;
      font-weight: 700;
      padding-top: 10px;
    }
    .text {
      font-size: 22px;
      color: #a5a5a5;
      padding-top: 20px;
    }
    .intPwd {
      width: 100%;
      padding-top: 20px;
      padding-left: 140px;
      padding-right: 140px;
      padding-bottom: 15px;
      // padding: 20px 140px;
      line-height: 40px;
      font-size: 22px;
      text-align: center;
      display: flex;
      justify-content: space-between;

      input {
        text-indent: 25px;
        display: inline-block;
        width: 10%;
        height: 40px;
        font-size: 20px;
        border: 1px solid #666;
      }
      input {
        width: 100%;
      }
    }
    .pictrue {
      width: 100%;
      padding: 15px 28% 15px 28%;
      text-align: center;
      display: flex;
      justify-content: space-between;
      .pictrueBox {
        line-height: 100px;
        width: 100px;
        height: 100px;
        background: url("../../assets/按钮.png") no-repeat;
        background-size: 600px 1750px;
        background-position: -289px -1593.5px;
      }
      .pictrueBox1 {
        line-height: 100px;
        width: 100px;
        height: 100px;
        background: url("../../assets/按钮.png") no-repeat;
         background-size: 600px 1750px;
        background-position: -61px -1589px;
      }
    }
    .btn {
      width: 100%;
      font-size: 22px;
      display: flex;
      div {
        flex: 1;
        height: 40px;
        line-height: 40px;
        border: 1px solid #ddd;
        border-bottom: none;
      }
      .cancel {
        border-left: none;
      }
      .confirm {
        color: #26a2ff;
        border-right: none;
      }
    }
  }
}
</style>
