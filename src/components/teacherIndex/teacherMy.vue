<template>
  <div class="teacherMy">
    <div class="top">
      <div class="fl">版本：{{this.appVersion}}</div>
      <h2>个人中心</h2>
      <div class="fr">
        <router-link to="/teacherInformation">
          <i class="iconfont icon-xinxi" style="font-size:2rem"></i>
          <span>关于</span>
        </router-link>
      </div>
    </div>
    <div class="center">
      <div class="user">
        <div class="userimg">
          <div class="img">
            <img :src="userimg" alt style="width: 100%; height: 100%">
          </div>
        </div>
        <div class="username">{{username}}</div>
        <div class="usertext">{{usertext}}</div>
      </div>
      <div class="nav">
        <ul>
          <router-link to="/principal" v-if="false">
            <li>
              <div class="left">校长统计页面</div>
              <div class="right">
                <i class="iconfont icon-icon-arrow-right2"></i>
              </div>
            </li>
          </router-link>
          <router-link to="/teacherenquiry">
            <li>
              <div class="left">课堂详情</div>
              <div class="right">
                <i class="iconfont icon-icon-arrow-right2"></i>
              </div>
            </li>
          </router-link>
          <router-link to="/teacherhomework">
            <li>
              <div class="left">习题详情</div>
              <div class="right">
                <i class="iconfont icon-icon-arrow-right2"></i>
              </div>
            </li>
          </router-link>
          <router-link to="/assistant">
            <li>
              <div class="left">小助手</div>
              <div class="right">
                <i class="iconfont icon-icon-arrow-right2"></i>
              </div>
            </li>
          </router-link>
          <li @click="loginout">
            <div class="left">退出登录</div>
            <div class="right">
              <i class="iconfont icon-icon-arrow-right2"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <loading v-if="loading"/>
  </div>
</template>
<!--我的-->
<script>
import Loading from "../public/Loading";
import store from "@/store";

export default {
  name: "teacherMy",
  components: {
    Loading
  },
  data() {
    return {
      loading: true,
      pageShow: false,
      username: "韩梅梅",
      usertext: "学如逆水行舟，不进则退。",
      userimg: "",
      appVersion: ""
    };
  },
  activated() {
    this.getTeacherMy();
  },
  methods: {
    getTeacherMy() {
      this.pageShow = true;
      this.loading = false;
      var img = localStorage.getItem("HeadPortrait")
        ? localStorage.getItem("HeadPortrait")
        : "";
      let user = JSON.parse(localStorage.getItem("user"));
      if (img) {
         this.userimg = "data:image/jpeg;base64," + img;
      } else {
        if (user.userSex == "FEMALE") {
          this.userimg = require("../../assets/女老师.png");
        } else {
          this.userimg = require("../../assets/男老师.png");
        }
      }
      this.username = user.userName;
      let _this = this;
      cordova.getAppVersion.getVersionNumber().then(function(version) {
        _this.appVersion = version;
        _this.$forceUpdate();
      });
    },
    loginout() {
      localStorage.removeItem("HeadPortrait");
      localStorage.removeItem("token");
      store.commit("IS_NEW", false);
      //localStorage.removeItem('user');
      this.$router.push({ path: "/", name: "login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  height: 31rem;
  background: url("../../assets/教师端-我的_01.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  position: relative;
  .fl {
    float: left;
    position: absolute;
    top: 2.7rem;
    left: 3.1rem;
    font-size: 2rem;
    color: #fff;
  }
  h2 {
    text-align: center;
    font-size: 3.8rem;
    padding-top: 6.8rem;
    color: #fff;
  }
  .fr {
    float: right;
    position: absolute;
    top: 2.7rem;
    right: 3.1rem;
    font-size: 2rem;
    color: #fff;
    i {
      font-size: 2.8rem !important;
      vertical-align: middle !important;
    }
    span {
      vertical-align: middle;
    }
  }
}
.center {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding: 0 3.4rem 0 2.4rem;
  position: relative;
  .user {
    width: 100%;
    height: 24.3rem;
    border-radius: 10px;
    background-color: #ffffff;
    margin-top: -10rem;
    float: left;
    .userimg {
      width: 13.3rem;
      height: 13.3rem;
      background-color: #fff;
      margin: -6.65rem auto;
      border-radius: 50%;
      padding: 8px;
      .img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .username {
      width: 100%;
      font-size: 3.4rem;
      margin-top: 7.9rem;
      text-align: center;
    }
    .usertext {
      width: 100%;
      text-align: center;
      font-size: 2.7rem;
      margin-top: 4.9rem;
      color: #666666;
    }
  }
  .nav {
    width: 100%;
    // height: 56.7rem;
    padding-top: 23rem;
    margin-bottom: 10rem;
    ul {
      li {
        width: 100%;
        height: 8.1rem;
        line-height: 8.1rem;
        padding-left: 2.5rem;
        padding-right: 2.5rem;
        font-size: 2.6rem;
        border-bottom: 2px solid #e1e1e2;
        color: #333333;
        div {
          display: inline-block;
        }
        .right {
          display: inline-block;
          height: 100%;
          float: right;
          color: #888;
          opacity: 0.6;
          .iconfont {
            font-size: 2.6rem;
          }
        }
      }
    }
  }
}
</style>
