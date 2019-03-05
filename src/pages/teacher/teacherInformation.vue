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
        user: {name:'',school:'',subject:'',grade:'',primaryClass:'',secondaryClass:''}
      }
    },
    mounted(){
      this.getteacher()
    },
    methods:{
      getteacher(){
          let userInStorage = JSON.parse(localStorage.getItem('user'));
          if(userInStorage){
              this.user.name = userInStorage.userName;
              if(userInStorage.roles&&userInStorage.roles.length>0){
                  this.user.school = userInStorage.roles[0].school.schoolName;
                  this.user.subject = userInStorage.roles[0].primarySubject.subjectName;
                  this.user.grade = userInStorage.roles[0].primaryGrade.gradeName;
                  if(userInStorage.roles[0].primaryClass) this.user.primaryClass = userInStorage.roles[0].primaryClass.className;
                  if(userInStorage.roles[0].secondaryClass){
                      let arr = [];
                      userInStorage.roles[0].secondaryClass.forEach((c, index) => {
                          arr.push(c.className)
                      })
                      this.user.secondaryClass = arr.join(',');
                  }
              }
              if(userInStorage.userSex=="FEMALE"){
                  this.userimg = require('../../assets/女老师.png')
              }else{
                  this.userimg = require('../../assets/男老师.png')
              }
          }
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
