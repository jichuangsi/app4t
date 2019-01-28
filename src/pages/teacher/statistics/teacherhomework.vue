<template>
  <div class="teacherhomework">
    <div class="top">
      <div class="nav">
        <i class="iconfont icon-icon-arrow-left2" @click="back"></i>
        <ul>
          <li v-for="(item,index) in nav" @click="allocation(item,index)" :key="index">
            <span :class="{'color':index==current}">{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="topimg">
        <h2>{{value}}</h2>
      </div>
    </div>
    <div class="center">
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
      <div class="homeworknav">
        <ul>
          <li v-for="(item,index) in homenav" :key="index">{{item}}</li>
        </ul>
      </div>
      <div class="homeworktotal">
        <ul v-for="(item,index) in homework" :key="index">
          <li v-for="(itemval,index) in item.value" :key="index">
            <div class="left">
              <div class="text">{{item.text}}</div>
              <div class="percentile" v-if="item.text === '选择题'">{{itemval.percentile}}</div>
              <div class="percentile color" v-if="item.text === '解答题'">{{itemval.percentile}}</div>
              <div class="subject">{{itemval.subject}}</div>
            </div>
            <div class="right">
              <p>作答正确人数：{{itemval.ture}}人</p>
              <p>作答错误人数：{{itemval.false}}人</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "teacherhomework",
  data() {
    return {
      current: 1,
      nav: ['全科', '语文', '数学', '英语', '政治', '地理', '历史', '生物', '物理', '化学'],
      value: "语 文",
      Total: "46",
      Submission: "46",
      Notsubmitted: "0",
      homenav: ["全部", "七年级（2）班", "七年级（3）班"],
      homework: [
        {
          text: "选择题",
          value: [
            {
              subject: "第一题",
              ture: 46,
              false: 0,
              percentile: "100%"
            },
            {
              subject: "第二题",
              ture: 44,
              false: 2,
              percentile: "98%"
            }
          ]
        },
        {
          text: "解答题",
          value: [
            {
              subject: "第一题",
              ture: 46,
              false: 0,
              percentile: "100%"
            }
          ]
        }
      ],
      datalist:[
              {
                value: 45,
                name: "客观题"
              },
              {
                value: 20,
                name: "主观题"
              }
            ]
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    // 判断当前选中哪个
    allocation(item, index) {
      this.current = index;
      this.value = item;
      if(index == 0){
        this.datalist=[
              {
                value: 45,
                name: "客观题"
              },
              {
                value: 55,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 1){
        this.datalist=[
              {
                value: 45,
                name: "客观题"
              },
              {
                value: 20,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 2){
        this.datalist=[
              {
                value: 35,
                name: "客观题"
              },
              {
                value: 20,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 3){
        this.datalist=[
              {
                value: 20,
                name: "客观题"
              },
              {
                value: 30,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 4){
        this.datalist=[
              {
                value: 45,
                name: "客观题"
              },
              {
                value: 45,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 5){
        this.datalist=[
              {
                value: 25,
                name: "客观题"
              },
              {
                value: 20,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 6){
        this.datalist=[
              {
                value: 40,
                name: "客观题"
              },
              {
                value: 30,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 7){
        this.datalist=[
              {
                value: 10,
                name: "客观题"
              },
              {
                value: 20,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 8){
        this.datalist=[
              {
                value: 20,
                name: "客观题"
              },
              {
                value: 20,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
      if(index == 9){
        this.datalist=[
              {
                value: 30,
                name: "客观题"
              },
              {
                value: 38,
                name: "主观题"
              }
            ]
            this.drawLine()
      }
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
          formatter: "{a} <br/>{b}: {c} ({d}%)"
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
    height: 4.7rem;
    line-height: 4.7rem;
    background-color: #80d59c;
    color: #ffffff;
    font-size: 2rem;
    padding-left: 2rem;
    display: flex;
    .iconfont {
      font-size: 2rem;
      display: inline-block;
      padding-right: 1rem;
    }
    ul {
      flex: 1;
      height: 4.7rem;
      overflow: hidden;
      li {
        display: inline-block;
        text-align: center;
        padding-left: 1rem;
        span {
          display: inline-block;
          height: 4.7rem;
        }
        .color {
          border-bottom: 4px solid #347cf9;
        }
      }
      :nth-child(1) {
        padding-left: 0;
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
      margin-left: -2rem;
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
</style>
