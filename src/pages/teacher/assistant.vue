<template>
  <div class="assistant" :class="{'assistantbox':screenWidth>800}">
    <div class="center" v-if="screenWidth<=800">
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
            <ul :class="{selectli:seletshow}">
                <li v-for="(item,index) in seletnav" :key="index" @click.stop="seletclick(item,index)">{{item}}</li>
            </ul>
        </div>
        <div class="img" v-if="type=='小组'||type=='计时'" @click="message"><img src="../../assets/形状 1.png" alt=""></div>
        <div class="state" @click="state" :class="{selectclass:seletshow}">开始</div>
        <div class="stop" @click="stop" :class="{selectclass:seletshow}">停止</div>
    </div>
    <div class="center" v-if="screenWidth>800">
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
            <ul :class="{selectli:seletshow}">
                <li v-for="(item,index) in seletnav" :key="index" @click.stop="seletclick(item,index)">{{item}}</li>
            </ul>
        </div>
        <div class="img" v-if="type=='小组'||type=='计时'" @click="message"><img src="../../assets/形状 1.png" alt=""></div>
        <div class="state" @click="state" :class="{selectleft:seletshow}">开始</div>
        <div class="stop" @click="stop" :class="{selectright:seletshow}">停止</div>
    </div>
    <div id="box">
        <audio id="audios" :src="audiosrc">您的浏览器不支持 audio 标签。</audio>
    </div>
  </div>
</template>

<script>
import { MessageBox,Toast } from 'mint-ui';
export default {
  name: "assistant",
  data() {
    return {
        audiosrc:require('../../assets/4204.mp3'),
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
        four:'0',
        screenWidth: document.body.clientWidth,
        interval:'',
        status:true
    };
  },
  watch:{
      screenWidth(val) {
          console.log(val)
      }
  },
  methods: {
      qqq(){
          document.getElementById('audio').play()
      },
      //选择
      seletclick(val,index){
          this.selet = val
          this.seletshow = false
          this.type = val
          if(this.type=='个人'&&this.studentname.length>0){
              this.clear = true
              this.textname = this.studentname[0]
          }else{
              this.clear = true
              this.textname = '';
          }
      },
      // 输入
      message(){
          if(this.type=='小组'){
              MessageBox.prompt('',{message:'请输入小组个数',inputType:'number'}).then((value) => {
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
              let s
              let m
              MessageBox.prompt('',{message:'请输入秒数',inputType:'number'}).then((value) => {
              this.jishi = Number(value.value)
              if((/(^[1-9]\d*$)/.test(this.jishi))){
                s=parseInt(this.jishi)
                if(s>60){
                    m = parseInt(s / 60)
                    s = parseInt(s % 60);
                }
                console.log(s)
                console.log(m)
                if(s<10){
                    this.three = 0
                    this.four = s
                }
                if(s>=10){
                    this.three = String(s)[0]
                    this.four = String(s)[1]
                }
                if(m<10){
                    this.one = 0
                    this.two = m
                }
                if(m>=10){
                    this.one = String(m)[0]
                    this.two = String(m)[1]
                }
                if(!m){
                    this.one = 0
                    this.two = 0
                }
                if(!(0<this.jishi&&this.jishi<=3600)){
                    this.one = 0
                    this.two = 0
                    this.three = 0
                    this.four = 0
                    Toast('请输入1-3600的整数');
                    return
                }
              }else {
                this.jishi=''
                Toast('请输入1-3600的整数');
              }

            //   if((/(^[1-9]\d*$)/.test(Number(this.jishi)))){
            //       if(Number(this.jishi)<10 && Number(this.jishi)>0){
            //           this.one = 0
            //           this.two = this.jishi
            //           this.three = 0
            //           this.four = 0
            //       }
            //       if(Number(this.jishi) >= 10 &&Number(this.jishi) <= 60) {
            //           this.one = this.jishi.split('')[0]
            //           this.two = this.jishi.split('')[1]
            //           this.three = 0
            //           this.four = 0
            //       }
            //       if(!(Number(this.jishi) > 0 &&Number(this.jishi) <= 60)){
            //         Toast('请输入1-60的整数');
            //       }
            //   }else {
            //       this.jishi=''
            //     Toast('请输入1-60的整数');
            //   }
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
            self.interval = setInterval(function(){
                if(self.clear || self.type!='个人'){
                clearInterval(self.interval)
                }
            let i = Math.floor(Math.random()*(self.studentname.length));
            self.textname = self.studentname[i]
            },60)
          }
          if(self.type=='小组'){
              if(self.xiaozu){
                  self.interval = setInterval(function(){
                if(self.clear || self.type!='小组'){
                clearInterval(self.interval)
                }
                let i = Math.ceil(Math.random() * self.xiaozu)
                self.textname = i
                },60)
              }else{
                  Toast('请输入小组个数');
              }
          }
          if(self.type=='计时'){
              if(self.jishi&&self.status){
                  self.status = false
                self.interval = setInterval(function(){
                    if(self.clear||self.type!='计时'){
                    clearInterval(self.interval)
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
                            clearInterval(self.interval)
                            self.clear = true
                            self.status = true
                            document.getElementById('audios').play()
                            Toast('时间到');
                        }
                    }
                },1000)
              }else{
              }
          }
      },
      //停止
      stop(){
          this.clear = true
            this.status = true
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
      },
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

      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          self.screenWidth = window.screenWidth
        })()
      }
      if(self.screenWidth>800){
          console.log(123)
      }
    //   this.getradio()
  },
  destroyed: function () {
      this.clear = true
      clearInterval(this.interval)
  }
};
</script>

<style lang="scss" scoped>
.assistant {
  width: 100%;
  height: 100%;
  position: fixed;
  font-size: 24px;
  letter-spacing: 2px;
  background: url('../../assets/助手背景（竖）.png') no-repeat;
  background-size: 100% 100%;
  audio {
      opacity: 1;
  }
  #box {
      width: 320px;
      height: 50px;
      background-color: transparent;
  }
  .back {
      font-size: 2rem;
      position: absolute;
      top: 3%;
      left: 3%;
      color: #48f3f9;
      font-weight: 700;
  }
    .text {
        width: 424px;
        position: absolute;
        left: 50%;
        top: 27.5%;
        font-size: 4rem;
        text-align: center;
        color: #B8784A;
        transform: translateX(-48%);
    }
    .box {
         width: 328px;
         height: 12%;
         line-height: 190%;
         text-align: center;
         color: #3591B6;
         position: absolute;
         transform-style: preserve-3d;
         top: 24.5%;
         left: 50%;
         font-size: 6rem;
         transform: translateX(-48%);
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
        width: 279px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        color: #48f3f9;
        background: url('../../assets/助手按钮.png') no-repeat;
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        i {
            display: inline-block;
            width: 13px;
            height: 11px;
            margin-left: 15px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: url('../../assets/助手下拉.png') no-repeat;
        }
        ul {
            width: 279px;
            height: 0px;
            position: absolute;
            right: 0px;
            top: 49px;
            transition: height 1s;
            overflow: hidden;
            opacity: 0;
            li {
                display: inline-block;
                width: 100%;
                height: 49px;
                line-height: 49px;
                text-align: center;
                color: #48f3f9;
                background: url('../../assets/助手按钮.png') no-repeat;
                list-style-type: none;
                position: absolute;
                left: 0px;
            }
            li:nth-child(1){
                top: 0px;
            }
            li:nth-child(2){
                top: 49px;
            }
            li:nth-child(3){
                top: 98px;
            }
        }
    }
    .state {
        width: 279px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        color: #48f3f9;
        background: url('../../assets/助手按钮.png') no-repeat;
        position: absolute;
        top: 52%;
        left: 50%;
        transform: translateX(-50%);
        transition: left 1s,opacity 1s;
    }
    .stop {
        width: 279px;
        height: 49px;
        line-height: 49px;
        text-align: center;
        color: #48f3f9;
        background: url('../../assets/助手按钮.png') no-repeat;
        position: absolute;
        top: 59%;
        left: 50%;
        transform: translateX(-50%);
        transition: left 1s,opacity 1s;
    }
    .img {
        width: 65px;
        height: 40px;
        position: absolute;
        left: 50%;
        top: 39%;
        transform: translateX(-50%);
        img {
            width: 100%;
            height: 100%;
        }
    }
}
.assistantbox {
  background: url('../../assets/助手背景（横）.png') no-repeat;
  background-size: 100% 100%;
  .text {
      top: 34% !important;
      font-size: 3rem;
  }
  .box {
      top: 31% !important;
      height: 17% !important;
      line-height: 170% !important;
      font-size: 4rem;
  }
  .img {
      top: 51% !important;
      width: 50px;
    height: 30px;
  }
  .selet {
      top: 57% !important;
  }
  .state {
      top: 67% !important;
      transform: translateX(-95%) !important;
  }
  .stop {
      top: 67% !important;
      transform: translateX(5%) !important;
  }
}
.selectclass {
    opacity: 0;
}
.selectleft {
    opacity: 0;
    left: 25% !important;
}
.selectright {
    opacity: 0;
    left: 75% !important;
}
.selectli {
    height: 147px !important;
    opacity: 1 !important;
}
</style>
