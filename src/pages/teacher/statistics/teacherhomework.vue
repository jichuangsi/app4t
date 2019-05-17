<template>
  <div class="teacherhomework">
    <div class="top">
      <div class="nav">
        <i class="iconfont icon-icon-arrow-left2" @click="back"></i>
        <ul>
          <li v-for="(item,index) in nav" @click="allocation(item,index)" :key="index">
            <span :class="{'color':index==current}">{{item.className}}</span>
          </li>
        </ul>
      </div>
      <div class="topimg">
        <h2>{{value}}</h2>
      </div>
    </div>
    <div class="homelist">
      <div class="hometimenav">
        <ul>
          <li v-for="(item,index) in hometimenav" @click="hometime(item,index)" :key="index" :class="{'hometimecolor':index==hometimecurrent}">
            {{item}}
          </li>
        </ul>
      </div>
      <div class="homelistnav">
        <div class="listnav" v-for="(item,index) in homelist" :key="index" v-if="hometimetext == item.homeworkEndTime" @click="homedetails(item)">{{item.homeworkName}}</div>
      </div>
    </div>
     <!-- v-if="centershow" -->
    <div class="center" :class="{centercolor:!centershow}">
      <h4>总人数:{{Total}}人</h4>
      <div class="echarts">
        <div id="myChart"></div>
        <div class="text">
          <div class="left">
            <p>总人数</p>
            <p>已提交作业</p>
            <p>未提交作业</p>
          </div>
          <div class="right">
            <p>{{Total}}人</p>
            <p>{{Submission}}人</p>
            <p>{{Notsubmitted}}人</p>
          </div>
        </div>
      </div>
      <div class="homeworktotal">
        <ul>
          <li v-for="(item,index) in homeworkobjective" :key="index">
            <div class="left">
              <div class="text">客观题</div>
              <div class="percentile">{{item.percentile}}</div>
              <div class="subject">{{item.questionType}}-{{index+1}}</div>
            </div>
            <div class="right">
              <p>作答正确人数：{{item.trueNum}}人</p>
              <p>作答错误人数：{{item.wrongNum}}人</p>
            </div>
          </li>
        </ul>
        <ul>
          <li v-for="(item,index) in homeworksubjective" :key="index">
            <div class="left">
              <div class="text">主观题</div>
              <div class="percentile color">{{item.percentile}}</div>
              <div class="subject">{{item.questionType}}-{{index+1}}</div>
            </div>
            <div class="right">
              <p>作答正确人数：{{item.trueNum}}人</p>
              <p>作答错误人数：{{item.wrongNum}}人</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {getSubjectQuestion,getSubjectQuestionRate} from '@/api/teacher/statistics'
export default {
  name: "teacherhomework",
  data() {
    return {
      hometimetext:'',
      centershow:false,
      hometimecurrent:0,
      hometimenav:[],
      homelist:[],
      current: 0,
      nav: [],
      value: "",
      Total: "46",
      Submission: "46",
      Notsubmitted: "0",
      homeworkobjective: [],
      homeworksubjective: [],
      datalist:[]
    };
  },
  mounted() {
    this.drawLine()
    this.getdata()
  },
  methods: {
    getdata() {
      let arr = []
      let arr1 = []
      let date = new Date();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.hometimetext = month+'月'+day+'日'
      this.hometimenav = [month+'月'+day+'日',month+'月'+(Number(day)-1)+'日',month+'月'+(Number(day)-2)+'日',month+'月'+(Number(day)-3)+'日',month+'月'+(Number(day)-4)+'日',month+'月'+(Number(day)-5)+'日',month+'月'+(Number(day)-6)+'日']
      let subjectName = JSON.parse(localStorage.getItem('user')).roles[0].primarySubject.subjectName;
        if(JSON.parse(localStorage.getItem('user')).roles[0].primaryClass){
            let primaryClass = JSON.parse(localStorage.getItem('user')).roles[0].primaryClass;
            arr.push({className:primaryClass.className,classId:primaryClass.classId})
        }
        if(JSON.parse(localStorage.getItem('user')).roles[0].secondaryClass){
            let secondaryClass = JSON.parse(localStorage.getItem('user')).roles[0].secondaryClass;
            for (let i = 0; i < secondaryClass.length; i++) {
                arr.push({className:secondaryClass[i].className,classId:secondaryClass[i].classId})
            }
        }
      this.nav = arr
      this.value = subjectName
        if(arr.length>0){
           this.homelist = [
             {homeworkName:'习题1',homeworkEndTime:'5月13日'},
             {homeworkName:'习题2',homeworkEndTime:'5月13日'},
             {homeworkName:'习题3',homeworkEndTime:'5月14日'},
             {homeworkName:'习题4',homeworkEndTime:'5月15日'},
             {homeworkName:'习题5',homeworkEndTime:'5月15日'},
             {homeworkName:'习题6',homeworkEndTime:'5月16日'},
             {homeworkName:'习题7',homeworkEndTime:'5月17日'}
           ]
          // getSubjectQuestion(arr[0].classId).then(res=>{
          //   console.log(res)
          //   for(let j = 0; j<res.data.data.length; j++){
          //     res.data.data[j].homeworkEndTime = this.getLocalTime(Number(res.data.data[j].homeworkEndTime)/1000).split(' ')[0].split('/')[1]+'月'+ this.getLocalTime(Number(res.data.data[j].homeworkEndTime)/1000).split(' ')[0].split('/')[2] +'日'
          //   }
          //   this.homelist = res.data.data
          // }).catch(e=>{
          //   console.log(e)
          // })
        }
    },
    //转换日期格式
    getLocalTime(nS) {
     return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    },
    // 判断当前选中哪个
    allocation(item, index) {
      this.current = index;
      this.centershow = false
      getSubjectQuestion(item.classId).then(res=>{
        console.log(res)
        for(let j = 0; j<res.data.data.length; j++){
          res.data.data[j].homeworkEndTime = this.getLocalTime(Number(res.data.data[j].homeworkEndTime)/1000).split(' ')[0].split('/')[1]+'月'+ this.getLocalTime(Number(res.data.data[j].homeworkEndTime)/1000).split(' ')[0].split('/')[2] +'日'
        }
        this.homelist = res.data.data
      }).catch(e=>{
        console.log(e)
      })
    },
    //选择时间
    hometime(item,index){
      this.hometimecurrent = index
      this.hometimetext = item
      this.centershow = false
    },
    //作业详情
    homedetails(item) {
      // getSubjectQuestionRate(item.classId,item.homeworkId).then(res=>{
      //   console.log(res)
      // this.centershow = true
      //   let arr1 = res.data.data.objective
      //   for(let i = 0; i<arr1.length;i++){
      //     arr1[i].percentile = ((Number(arr1[i].trueNum)/Number(res.data.data.studentNum))*100).toFixed() + '%'
      //   }
      //   let arr = res.data.data.subjective
      //   for(let i = 0; i<arr.length;i++){
      //     arr[i].percentile = ((Number(arr[i].trueNum)/Number(res.data.data.studentNum))*100).toFixed() + '%'
      //   }
      //   this.homeworkobjective= arr1
      //   this.homeworksubjective= arr
      //   this.datalist = [
      //         {
      //           value: res.data.data.objectiveNum,
      //           name: "客观题"
      //         },
      //         {
      //           value: res.data.data.subjectiveNum,
      //           name: "主观题"
      //         }
      //       ]
      //       this.Total = res.data.data.studentNum
      //       this.Submission = res.data.data.submitNum
      //       this.Notsubmitted = Number(res.data.data.studentNum) - Number(res.data.data.submitNum)
      //       this.drawLine()
      // }).catch(e=>{
      //   console.log(e)
      // })
       this.centershow = true

      if(item.homeworkName == '习题1'){
        this.homeworkobjective= [
          {percentile:'80%',questionType:'单选题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4},
          {percentile:'70%',questionType:'单选题',trueNum:7,wrongNum:3},
          {percentile:'90%',questionType:'单选题',trueNum:9,wrongNum:1}
        ]
        this.homeworksubjective= [
          {percentile:'80%',questionType:'主观题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'主观题',trueNum:6,wrongNum:4},
          {percentile:'70%',questionType:'主观题',trueNum:7,wrongNum:3},
          {percentile:'90%',questionType:'主观题',trueNum:9,wrongNum:1}
        ]
        this.datalist = [
              {
                value: 4,
                name: "客观题"
              },
              {
                value: 4,
                name: "主观题"
              }
            ]
            this.Total = 10
            this.Submission = 10
            this.Notsubmitted = 0
      }
      //
      if(item.homeworkName == '习题2'){
        this.homeworkobjective= [
          {percentile:'80%',questionType:'单选题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4},
          {percentile:'90%',questionType:'单选题',trueNum:7,wrongNum:3}
        ]
        this.homeworksubjective= [
          {percentile:'80%',questionType:'主观题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'主观题',trueNum:6,wrongNum:4},
          {percentile:'70%',questionType:'主观题',trueNum:7,wrongNum:3},
          {percentile:'90%',questionType:'主观题',trueNum:7,wrongNum:3},
          {percentile:'80%',questionType:'主观题',trueNum:8,wrongNum:2}
        ]
        this.datalist = [
              {
                value: 3,
                name: "客观题"
              },
              {
                value: 5,
                name: "主观题"
              }
            ]
            this.Total = 10
            this.Submission = 8
            this.Notsubmitted = 2
      }
      //
      if(item.homeworkName == '习题3'){
        this.homeworkobjective= [
          {percentile:'80%',questionType:'单选题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4},
          {percentile:'70%',questionType:'单选题',trueNum:7,wrongNum:3},
          {percentile:'70%',questionType:'单选题',trueNum:7,wrongNum:3},
          {percentile:'70%',questionType:'单选题',trueNum:7,wrongNum:3}
        ]
        this.homeworksubjective= [
          {percentile:'80%',questionType:'主观题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'主观题',trueNum:6,wrongNum:4}
        ]
        this.datalist = [
              {
                value: 5,
                name: "客观题"
              },
              {
                value: 2,
                name: "主观题"
              }
            ]
            this.Total = 10
            this.Submission = 10
            this.Notsubmitted = 0
      }
      //
      if(item.homeworkName == '习题4'){
        this.homeworkobjective= [
          {percentile:'80%',questionType:'单选题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4},
          {percentile:'70%',questionType:'单选题',trueNum:7,wrongNum:3},
          {percentile:'70%',questionType:'单选题',trueNum:7,wrongNum:3},
          {percentile:'70%',questionType:'单选题',trueNum:7,wrongNum:3}
        ]
        this.homeworksubjective= [
          {percentile:'80%',questionType:'主观题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'主观题',trueNum:6,wrongNum:4}
        ]
        this.datalist = [
              {
                value: 5,
                name: "客观题"
              },
              {
                value: 2,
                name: "主观题"
              }
            ]
            this.Total = 10
            this.Submission = 10
            this.Notsubmitted = 0
      }
      //
      if(item.homeworkName == '习题5'){
        this.homeworkobjective= [
          {percentile:'80%',questionType:'单选题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4},
          {percentile:'70%',questionType:'多选题',trueNum:7,wrongNum:3},
          {percentile:'70%',questionType:'单选题',trueNum:7,wrongNum:3}
        ]
        this.homeworksubjective= [
          {percentile:'80%',questionType:'主观题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'填空题',trueNum:6,wrongNum:4}
        ]
        this.datalist = [
              {
                value: 4,
                name: "客观题"
              },
              {
                value: 2,
                name: "主观题"
              }
            ]
            this.Total = 10
            this.Submission = 9
            this.Notsubmitted = 1
      }
      //
      if(item.homeworkName == '习题6'){
        this.homeworkobjective= [
          {percentile:'70%',questionType:'多选题',trueNum:7,wrongNum:3},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4},
          {percentile:'70%',questionType:'多选题',trueNum:7,wrongNum:3},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4}
        ]
        this.homeworksubjective= [
          {percentile:'80%',questionType:'主观题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'填空题',trueNum:6,wrongNum:4},
          {percentile:'60%',questionType:'主观题',trueNum:9,wrongNum:1}
        ]
        this.datalist = [
              {
                value: 4,
                name: "客观题"
              },
              {
                value: 3,
                name: "主观题"
              }
            ]
            this.Total = 10
            this.Submission = 10
            this.Notsubmitted = 0
      }
      //
      if(item.homeworkName == '习题7'){
        this.homeworkobjective= [
          {percentile:'70%',questionType:'多选题',trueNum:7,wrongNum:3},
          {percentile:'50%',questionType:'多选题',trueNum:5,wrongNum:5},
          {percentile:'70%',questionType:'多选题',trueNum:7,wrongNum:3},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4},
          {percentile:'60%',questionType:'单选题',trueNum:6,wrongNum:4}
        ]
        this.homeworksubjective= [
          {percentile:'80%',questionType:'主观题',trueNum:8,wrongNum:2},
          {percentile:'60%',questionType:'填空题',trueNum:6,wrongNum:4},
          {percentile:'60%',questionType:'主观题',trueNum:9,wrongNum:1}
        ]
        this.datalist = [
              {
                value: 5,
                name: "客观题"
              },
              {
                value: 3,
                name: "主观题"
              }
            ]
            this.Total = 10
            this.Submission = 10
            this.Notsubmitted = 0
      }
            this.drawLine()
    },
    back() {
      this.$router.push({
        path: '/teacherIndex'
    })
    },
    drawLine() {
      let self = this
      // 基于准备好的dom，初始化echarts实例
      let myChart = self.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          textStyle: {
            fontSize: 36
          },
          text: "作业情况分析",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{c} ({d}%)"
        },
        legend: {
          //   orient: 'vertical',
          // x: [100],
          itemGap: 100,
          y: "bottom",
          data: [
            {
              x: "left",
              name: "客观题",
              textStyle: {
                fontSize: 20,
              color: "#53cc54"
              },
              icon: "circle"
            },
            {
              x: "center",
              name: "主观题",
              textStyle: {
                fontSize: 20,
                color: "#ffce52"
              },
              icon: "circle"
            }
          ]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["30%", "70%"],
            center: ["35%", "50%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: self.datalist,
            color:["#53cc54","#ffce52"]
          }
        ]
      });
    }
  }
};
</script>

<style scoped lang="scss">
.top {
  .nav {
    width: 100%;
    height: 4.4rem;
    line-height: 4.4rem;
    background: url('../../../assets/上方导航栏.png') no-repeat;
    background-size: 100% 110%;
    color: #ffffff;
    font-size: 2rem;
    padding-left: 1rem;
    display: flex;
    .iconfont{
    display: inline-block;
    padding-right:1rem;
    }
    ul {
      flex: 1;
      height: 4.4rem;
      overflow: hidden;
      li {
        font-size: 1.8rem;
        display: inline-block;
        text-align: center;
        span {
          display: inline-block;
          height: 4.4rem;
          opacity: 0.8;
          padding: 0rem 1rem;
        }
        .color {
          background: url('../../../assets/下标识.png') no-repeat;
          background-size: 100% 10%;
          background-position-y: 4rem;
          font-size: 2rem;
          opacity: 1;
        }
      }
    }
  }
  .topimg {
    width: 100%;
    height: 20rem;
    background: url("../../../assets/banner图.png");
    background-size: 100% 100%;
    overflow: hidden;
    h2 {
      font-size: 3.8rem;
      text-align: center;
      margin-top: 5rem;
      margin-left: -1rem;
      color: #fff;
    }
  }
}
.center {
  width: 100%;
  height: 100%;
  padding-bottom: 2rem;
  background-color: #f5f5f5;
  overflow: hidden;
  h4 {
    font-size: 2.9rem;
    padding-top: 3rem;
    padding-left: 4rem;
    color: #666666;
    background-color: #fff;
    padding-bottom: 5rem;
  }
  .echarts {
    width: 100%;
    height: 46.25rem;
    padding: 0 2rem;
    padding-bottom: 11rem;
    position: relative;
    background-color: #fff;
    #myChart {
      width: 100%;
      height: 100%;
    }
    .text {
      position: absolute;
      font-size: 1.8rem;
      top: 18rem;
      right: 2rem;
      div {
        display: inline-block;
        p {
          padding-bottom: 1rem;
        }
      }
      .left {
        padding-right: 3rem;
      }
    }
  }
  .homeworknav {
    width: 100%;
    margin-top: 2.2rem;
    background-color: #fff;
    padding-left: 5rem;
    ul {
      width: 100%;
      height: 10.3rem;
      line-height: 10.3rem;
      font-size: 2.5rem;
      li {
        display: inline-block;
        margin-right: 2rem;
      }
    }
  }
  .homeworktotal {
    width: 100%;
    font-size: 2.8rem;
    text-align: center;
    ul {
      width: 100%;
      margin-bottom: 2rem;
      li {
        width: 100%;
        height: 25.3rem;
        display: flex;
        background-color: #fff;
        border-top: 1px solid #eaeaea;
        border-bottom: 1px solid #eaeaea;
        .left {
          width: 19.75rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-right: 1px solid #eaeaea;
          color: #8f8f8f;
          .percentile {
            width: 10.3rem;
            height: 10.3rem;
            border-radius: 50%;
            border: 1px solid #5d95ff;
            margin: 1.5rem 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #5d95ff;
          }
          .color {
            border-color: #ffc974;
            color: #ffc974;
          }
        }
        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p {
            margin-bottom: 4rem;
          }
        }
      }
    }
  }
}
.homelist {
  margin-top: 30px;
  .hometimenav {
    ul {
      padding-left: 2rem;
      li {
        font-size: 18px;
        display: inline-block;
        padding: 5px 10px;
        text-decoration:underline;
        margin-left: 10px;
        display: inline-block;
      }
      .hometimecolor {
        color:#fff;
        background-color: #5ea6ec;
        border-radius: 5px;
        text-decoration:none;
      }
    }
  }
  .homelistnav {
    margin: 30px auto;
    div {
      margin: 20px auto;
      width: 70%;
      height: 64px;
      line-height: 64px;
      text-indent: 20px;
      font-size: 24px;
      border-radius: 13px;
      box-shadow: inset 0px 0px 16px rgba(0,0,0,0.6),0px 0px 16px rgba(0,0,0,0.3);
    }
  }
}
.centercolor {
  opacity: 0;
}
</style>
