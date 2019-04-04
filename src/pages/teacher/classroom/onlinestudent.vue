<template>
  <div class="onlinestudent">
    <teacher-header :header="header" />
    <div class="center">
        <div class="user" v-for="(item,index) in studentlist" :key="index" @click="Fabulous(item)">
            <div class="userimg" :class="{onlineimg:onlineshow}"></div>
            <div class="username">
                <div class="left" :class="{onlineleft:Fabulouslist.indexOf(item.studentId)!=-1}"></div>
                <div class="right" :class="{onlineright:onlineshow}">{{item.studentName}}</div>
            </div>
        </div>
        <div class="user" style="opacity:0" v-if="show3">
            <div class="userimg"></div>
            <div class="username">
                <div class="left"></div>
                <div class="right"></div>
            </div>
        </div>
        <div class="user" style="opacity:0" v-if="show5==2||show5==3||show5==4">
            <div class="userimg"></div>
            <div class="username">
                <div class="left"></div>
                <div class="right"></div>
            </div>
        </div>
        <div class="user" style="opacity:0" v-if="show5==2||show5==3">
            <div class="userimg"></div>
            <div class="username">
                <div class="left"></div>
                <div class="right"></div>
            </div>
        </div>
        <div class="user" style="opacity:0" v-if="show5==2">
            <div class="userimg"></div>
            <div class="username">
                <div class="left"></div>
                <div class="right"></div>
            </div>
        </div>
    </div>
  </div>
</template>
<!--课堂详情-->
<script>
import Vue from "vue";
import TeacherHeader from "../../../components/public/PublicHeader";

export default {
  components: {
    TeacherHeader
  },
  data() {
    return {
      header: {
        //头部标题内容
        title: "在线学生",
        url: "/TClassroom"
      },
      studentlist: [],
      show3:false,
      show5:0,
      onlineshow:false,
      Fabulouslist:''
    };
  },
  mounted() {
    this.studentlist = this.$route.query.students
    console.log(this.studentlist)
    if(this.studentlist.length%3 == 2){
        this.show3 = true
    }else {
        this.show3 = false
    }
    if(this.studentlist.length%5 == 2){
        this.show5 = 2
    }else if(this.studentlist.length%5 == 3) {
        this.show5 = 3
    }else if(this.studentlist.length%5 == 4) {
        this.show5 = 4
    }else {
        this.show5 = 0
    }
  },
  methods: {
      Fabulous(val){
          if(this.Fabulouslist.length == 0){
            this.Fabulouslist = val.studentId
          }else {
              if(this.Fabulouslist.indexOf(val.studentId) != -1){
                 this.Fabulouslist =  this.Fabulouslist.split(val.studentId).join('');
              }else {
                  this.Fabulouslist = this.Fabulouslist + val.studentId
              }
          }
                  console.log(this.Fabulouslist)
      }
  }
};
</script>

<style lang="scss" scoped>
.onlinestudent {
    width: 100%;
    height: 100%;
    background-color: #dbe5ff;
    .center {
        padding: 4rem 3rem;
        background-color: #dbe5ff;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .user {
            padding: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            .userimg {
                width: 82px;
                height: 82px;
                margin-bottom: 10px;
                background:  url("../../../assets/按钮.png") no-repeat;
                background-position: -578px -2208px;
            }
            .onlineimg {
                background-position: -135px -2208px;
            }
            .username {
                width: 180px;
                display: flex;
                .left {
                    width: 27px;
                    height: 28px;
                    margin-right: 10px;
                    background:  url("../../../assets/按钮.png") no-repeat;
                    background-position: -578px -2334px;
                }
                .onlineleft {
                    background-position: -135px -2334px;
                }
                .right {
                    font-size: 22px;
                }
                .onlineright {
                    color: #666;
                }
            }
        }
    }
}
</style>
