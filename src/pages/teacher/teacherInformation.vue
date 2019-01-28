<template>
  <div class="teacherInformation">
    <public-header :header="header"/>
    <div class="content">
      <div class="avatar clearfix">
        <div class="title">头像</div>
        <div class="img_warp">
          <img :src="userimg">
        </div>
      </div>
      <div class="row">
        <div class="title">名字</div>
        <div class="text">{{username}}</div>
      </div>
      <div class="row">
        <div class="title">班级</div>
        <div class="text">六年一斑</div>
      </div>
    </div>
  </div>
</template>

<script>
  import PublicHeader from "../../components/public/PublicHeader"

  export default {
    name: "personalInformation",
    components: {
      PublicHeader
    },
    data() {
      return {
        header: {
          title: "个人信息",
          url: '/teacherIndex'
        },
        userimg:'',
        username:'韩梅梅'
      }
    },
    mounted(){
      this.getteacher()
    },
    methods:{
      getteacher(){
      let user = JSON.parse(localStorage.getItem('user'))
      if(user.userSex=="FEMALE"){
        this.userimg = require('../../assets/女老师.png')
      }else{
        this.userimg = require('../../assets/男老师.png')
      }
      this.username = user.userName
      }
    }
  }
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
          -webkit-transform: scaleY(.5);
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
          -webkit-transform: scaleY(.5);
          -webkit-transform-origin: 0 0;
        }
        .title {
          float: left;
          font-size: 28px;
        }
        .text {
          float: right;
          font-size: 24px;
          color: #A5A5A5;;
        }
      }
    }
  }
</style>
