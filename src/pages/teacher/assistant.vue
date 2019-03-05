<template>
  <div class="assistant">
    <img
      src="../../assets/zsbj.png"
      alt=""
    >
    <div class="back" @click="back">返回</div>
    <div class="text" v-if="type!='计时'">{{textname}}</div>
    <div class="box" v-if="type=='计时'">
        <div>{{one}}</div>
        <div>{{two}}</div>
        :
        <div>{{three}}</div>
        <div>{{four}}</div>
    </div>
    <div class="selet" @click="seletshow= !seletshow">
        {{selet}}<i></i>
        <ul v-if="seletshow">
            <i></i>
            <li v-for="(item,index) in seletnav" :key="index" @click.stop="seletclick(item,index)">{{item}}</li>
        </ul>
    </div>
    <div class="img" v-if="type=='小组'||type=='计时'" @click="message"><img src="../../assets/形状 1.png" alt=""></div>
    <div class="state" @click="state">开始</div>
    <div class="stop" @click="stop">停止</div>
  </div>
</template>

<script>
import { MessageBox,Toast } from 'mint-ui';
export default {
  name: "assistant",
  data() {
    return {
        textname:'',
        selet:'请选择',
        studentlist:[],
        studentid:[],
        studentname:[],
        clear: false,
        seletshow:false,
        seletnav:['个人','小组','计时'],
        type:'',
        xiaozu:'',
        jishi:'',
        one:'0',
        two:'0',
        three:'0',
        four:'0'
    };
  },
  methods: {
      //选择
      seletclick(val,index){
          this.selet = val
          this.seletshow = false
          this.type = val
          if(this.type=='个人'&&this.studentname.length>0){
              this.textname = this.studentname[0]
          }else{
              this.textname = '';
          }
      },
      // 输入
      message(){
          if(this.type=='小组'){
              MessageBox.prompt('请输入小组个数').then((value) => {
              console.log(value)
              this.xiaozu = Number(value.value)
              if((/(^[1-9]\d*$)/.test(this.xiaozu))){
                if(this.xiaozu === "" || this.xiaozu ==null ||isNaN(this.xiaozu)){
                    Toast('请输入小组个数');
                }else {
                    this.textname=value.value;
                }
              }else {
                  this.xiaozu=''
                  Toast('请输入整数');
              }
            }).catch(err=>{
                console.log(err)
            })
          }
          if(this.type=='计时'){
              MessageBox.prompt('请输入分钟').then((value) => {
              this.jishi = value.value
              if((/(^[1-9]\d*$)/.test(Number(this.jishi)))){
                  if(Number(this.jishi)<10 && Number(this.jishi)>0){
                      this.one = 0
                      this.two = this.jishi
                      this.three = 0
                      this.four = 0
                  }
                  if(Number(this.jishi) >= 10 &&Number(this.jishi) <= 60) {
                      this.one = this.jishi.split('')[0]
                      this.two = this.jishi.split('')[1]
                      this.three = 0
                      this.four = 0
                  }
                  if(!(Number(this.jishi) > 0 &&Number(this.jishi) <= 60)){
                    Toast('请输入1-60的整数');
                  }
              }else {
                  this.jishi=''
                Toast('请输入1-60的整数');
              }
            }).catch(err=>{
                console.log(err)
            })
          }
      },
      //开始
      state(){
          let self = this
            self.clear = false
          if(self.type=='个人'){
            let interval = setInterval(function(){
                if(self.clear || self.type!='个人'){
                clearInterval(interval)
                }
            let i = Math.floor(Math.random()*(self.studentname.length));
            self.textname = self.studentname[i]
            },60)
          }
          if(self.type=='小组'){
              if(self.xiaozu){
                  let interval = setInterval(function(){
                if(self.clear || self.type!='小组'){
                clearInterval(interval)
                }
                let i = Math.ceil(Math.random() * self.xiaozu)
                self.textname = i
                },60)
              }else{
                  Toast('请输入小组个数');
              }
          }
          if(self.type=='计时'){
              if(self.jishi){
                let interval = setInterval(function(){
                    if(self.clear||self.type!='计时'){
                    clearInterval(interval)
                    }else{
                        if(self.four==0){
                        self.four = 10
                        }
                        if(self.four!=0){
                            self.four = self.four-1
                        }
                        if(self.four==9&&self.three==0){
                            self.three = 6
                        }
                        if(self.four==9&&self.three!=0){
                            self.three = self.three-1
                        }
                        if(self.four==9&&self.three==5&&self.two==0){
                            self.two = 10
                        }
                        if(self.four==9&&self.three==5&&self.two!=0){
                            self.two = self.two-1
                        }
                        if(self.four==9&&self.three==5&&self.two==9&&self.one!=0){
                            self.one = self.one-1
                        }
                        if(self.four==0&&self.three==0&&self.two==0&&self.one==0){
                            clearInterval(interval)
                            console.log(132)
                            Toast('时间到');
                        }
                    }
                },1000)
              }else{
                  Toast('请输入1-60的数字');
              }
          }
      },
      //停止
      stop(){
          this.clear = true
          console.log(this.clear)
      },
      //返回
      back(){
          this.clear = true
          if(this.$route.query.from&&this.$route.query.from === 'dc'){
              this.$router.push({path: '/teacherIndex'});
          }else{
              this.$router.go(-1)
          }
      }
  },
  mounted() {
      this.studentlist = this.$route.query.students
      let self = this
      if(self.studentlist){
        self.seletnav=['个人','小组','计时']
        for(let i = 0 ;i < self.studentlist.length;i++){
            self.studentname.push(self.studentlist[i].studentName)
        }
      }else {
        self.seletnav=['小组','计时']
      }
  }
};
</script>

<style lang="scss" scoped>
.assistant {
  width: 100%;
  position: fixed;
  img {
    position: relative;
    width: 100%;
      height: 100%;
      overflow: hidden;
    // padding-bottom: 200px;
  }
  .img {
      position: absolute;
      width: 9%;
      height: 4%;
      left: 50%;
      margin-left: -4.5%;
      top: 45%;
  }
  .back {
      font-size: 2rem;
      position: absolute;
      top: 3%;
      left: 3%;
      color:#3591b6;
      font-weight: 700;
  }
    .text {
        width: 56%;
        position: absolute;
        left: 50%;
        top: 26.5%;
        font-size: 5rem;
        text-align: center;
        color: #B8784A;
        margin-left: -28%;
    }
    .box {
         width: 56%;
         height: 11.5rem;
         line-height: 11.5rem;
         text-align: center;
         color: #3591B6;
         position: absolute;
         transform-style: preserve-3d;
         top: 22%;
         left: 50%;
         font-size: 6rem;
         margin-left: -28%;
         vertical-align: text-top;
         div {
             display: inline-block;
             width: 16%;
             height: 100%;
             background-color: #3591B6;
             color: #fff;
             vertical-align: top;
             transform: rotateX(0deg);
            //  transition: transform 1s;
         }
         >div:first-child{
             margin-right: 3%;
         }
         >div:last-child{
             margin-left: 3%;
         }
         .texiao {
             transform: rotateY(0deg);
             animation: te 0.5s infinite linear;
         }
    }
    .selet {
        width: 36.2%;
        position: absolute;
        left: 50%;
        top: 56.2%;
        height: 5.6%;
        line-height: 5rem;
        text-align: center;
        color: #fff;
        font-size: 2rem;
        margin-left: -18.1%;
        letter-spacing:1rem;
        vertical-align: top;
        i {
            display: inline-block;
            border: 0.5rem solid #fff;
            border-color: transparent #fff #fff transparent;
            position: absolute;
            top: 50%;
            right: 20%;
            margin-top: -0.6rem;
            transform: rotate(-45deg)
        }
        ul {
            width: 40%;
            position: absolute;
            background-color: #3591B6;
            left: 100%;
            top: 10%;
            z-index: 10;
            transition: height 1s;
            border-radius: 1rem;
            margin-left: 1rem;
            li {
                line-height: 5rem;
            }
            i {
                display: inline-block;
                width: 0px;
                border: 0.5rem solid #fff;
                border-color: #3591B6 transparent transparent #3591B6;
                position: absolute;
                top: 15%;
                left: 0%;
                margin-left: -0.5rem;
            }
        }
    }
    .state {
        width: 36.2%;
        position: absolute;
        left: 50%;
        top: 64%;
        height: 5.6%;
        line-height: 5rem;
        text-align: center;
        color: #fff;
        font-size: 2rem;
        margin-left: -18.1%;
        letter-spacing:1rem;
    }
    .stop {
        width: 36.2%;
        position: absolute;
        left: 50%;
        top: 72%;
        height: 5.4%;
        line-height: 5rem;
        text-align: center;
        color: #fff;
        font-size: 2rem;
        margin-left: -18.1%;
        letter-spacing:1rem;
    }
}
@keyframes te {
    0% {
        // transform: rotateY(0deg)
    }
    100% {
        // transform: rotateY(180deg)
    }
}
</style>
