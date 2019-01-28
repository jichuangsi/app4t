  <template>
    <div class="My">
        <div class="top">
            <h2>个人中心</h2>
            <div class="fr">
                <router-link to="/myShow">
                    <i class="iconfont icon-shezhi" style="font-size:2rem"></i>设置
                </router-link>
            </div>
        </div>
        <div class="center">
            <div class="user">
                <div class="userimg">
                    <div class="img"><img :src="userimg" alt="" style="width: 100%;height: 100%;"></div>
                </div>
                <div class="username">{{username}}</div>
                <div class="usertext">{{usertext}}</div>
            </div>
            <div class="nav">
                <ul>
                    <router-link to="/studentenquiry">
                        <li>
                            <div class="left">我的成绩</div>
                            <div class="right">
                                <i class="iconfont icon-icon-arrow-right2"></i>
                            </div>
                        </li>
                    </router-link>
                    <router-link to="/studenthomework">
                        <li>
                            <div class="left">作业详情</div>
                            <div class="right">
                                <i class="iconfont icon-icon-arrow-right2"></i>
                            </div>
                        </li>
                    </router-link>
                    <router-link to="/studentCollection">
                        <li>
                            <div class="left">我的收藏</div>
                            <div class="right">
                                <i class="iconfont icon-icon-arrow-right2"></i>
                            </div>
                        </li>
                    </router-link>
                    <router-link to="/mistakescollection">
                        <li>
                            <div class="left">错题集</div>
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
        <loading v-if="loading" />
    </div>
</template>
<script>
import Loading from "../public/Loading";

export default {
  name: "my",
  components: {
    Loading
  },
  data() {
    return {
      loading: true, //加载状态
      pageShow: false, //内容状态
      username: "韩梅梅",
      usertext: "学如逆水行舟，不进则退。",
      userimg: ''
    };
  },
  mounted() {
    this.getMy();
  },
  methods: {
    //获取数据
    getMy() {
      this.pageShow = true;
      this.loading = false;
      let user = JSON.parse(localStorage.getItem('user'))
      if(user.userSex=="FEMALE"){
        this.userimg = require('../../assets/女学生.png')
      }else{
        this.userimg = require('../../assets/男学生.png')
      }
      this.username = user.userName
      // let _this = this;
      // this.api.getMy()
      //     .then(function (res) {
      //         _this.pageShow = true;
      //         _this.loading = false;
      //     })
      //     .catch(function (err) {
      //
      //     });
    },
    loginout() {
      localStorage.removeItem('token');
      window.HandwrittenBoard.disconnect();
      this.$router.push({ path: "/", name: "login" })
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
  h2 {
    text-align: center;
    font-size: 3.8rem;
    padding-top: 6.8rem;
  }
  .fr {
    float: right;
    position: absolute;
    top: 2.7rem;
    right: 3.1rem;
    font-size: 2rem;
    color: #fff;
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
    // height: 68.7rem;
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
