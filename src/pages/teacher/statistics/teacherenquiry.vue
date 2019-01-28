<template>
    <div class="teacherenquiry">
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
            <div class="centernav">
                <ul>
                    <li>
                        <div>击败年级</div>
                        <span>{{beat}}</span>
                    </li>
                    <li>
                        <div>班级平均分</div>
                        <span>{{Average}}</span>
                    </li>
                    <li>
                        <div>班级最高分</div>
                        <span>{{Highestscore}}</span>
                    </li>
                </ul>
            </div>
            <div class="situation">
                <div class="xian"></div>
                <div class="text">知识模块得分情况</div>
                <div class="xian"></div>
            </div>
            <h3>
                <div></div>知识模块权重</h3>
            <div class="echarts">
                <div id="myChart"></div>
            </div>
            <h3>
                <div></div>知识模块权重</h3>
            <div class="table">
                <table>
                    <tr>
                        <th v-for="(item,index) in tableth" :key="index">{{item}}</th>
                    </tr>
                    <tr v-for="(item,index) in tabletd" :key="index">
                        <td v-for="(value,index) in item.value" :key="index">{{value}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'teacherenquiry',
  components: {
  },
  data () {
    return {
      current: 1,
      nav: ['全科', '语文', '数学', '英语', '政治', '地理', '历史', '生物', '物理', '化学'],
      value: '语 文',
      Total: '46',
      Average: '96.3', // 平均分
      Highestscore: '56', // 最高分
      beat: '3', // 击败年级
      tableth: ['知识模块', '权重占比', '您的正确率', '年纪平均正确率'],
      tabletd: [
        {id: 1,
          value: ['基础知识', '75%', '75%', '80%']
        },
        {id: 2,
          value: ['基础知识', '75%', '75%', '80%']
        },
        {id: 3,
          value: ['基础知识', '75%', '75%', '80%']
        },
        {id: 4,
          value: ['基础知识', '75%', '75%', '80%']
        }
      ],
      dataname:['基础知识','背诵默读','诗词鉴赏','现代文阅读','文言文阅读理解','作文'],
      datalist:[
              {
                value: 10,
                name: '基础知识'  
              },
              {
                value: 20,
                name: '背诵默读'
              },
              {
                value: 15,
                name: '诗词鉴赏'
              },
              {
                value: 25,
                name: '现代文阅读'
              },
              {
                value: 20,
                name: '文言文阅读理解'
              },
              {
                value: 35,
                name: '作文'
              }
            ]
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    // 判断当前选中哪个
    allocation (item, index) {
      this.current = index
      this.value = item
      if(index ==0){
        this.tabletd=[
                    {id: 1,
                      value: ['语文', '75%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['数学', '65%', '75%', '80%']
                    },
                    {id: 3,
                      value: ['英语', '55%', '75%', '80%']
                    },
                    {id: 4,
                      value: ['政治', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['地理', '75%', '75%', '80%']
                    },
                    {id: 6,
                      value: ['历史', '85%', '75%', '80%']
                    },
                    {id: 7,
                      value: ['生物', '85%', '75%', '80%']
                    },
                    {id: 8,
                      value: ['物理', '85%', '75%', '80%']
                    },
                    {id: 9,
                      value: ['化学', '85%', '75%', '80%']
                    }
                  ]
            this.dataname=['语文','数学','英语','政治','地理','历史','生物','物理','化学'],
            this.datalist=[
              {
                value: 40,
                name: '语文'  
              },
              {
                value: 30,
                name: '数学'
              },
              {
                value: 25,
                name: '英语'
              },
              {
                value: 25,
                name: '政治'
              },
              {
                value: 20,
                name: '地理'
              },
              {
                value: 25,
                name: '历史'
              },
              {
                value: 35,
                name: '生物'
              },
              {
                value: 30,
                name: '物理'
              },
              {
                value: 35,
                name: '化学'
              }
            ]
            this.drawLine()
      }
      if(index ==1){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '75%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['背诵默读', '65%', '75%', '80%']
                    },
                    {id: 3,
                      value: ['诗词鉴赏', '55%', '75%', '80%']
                    },
                    {id: 4,
                      value: ['现代文阅读', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['文言文阅读理解', '75%', '75%', '80%']
                    },
                    {id: 6,
                      value: ['作文', '85%', '75%', '80%']
                    }
                  ]
            this.dataname=['基础知识','背诵默读','诗词鉴赏','现代文阅读','文言文阅读理解','作文'],
            this.datalist=[
              {
                value: 10,
                name: '基础知识'  
              },
              {
                value: 20,
                name: '背诵默读'
              },
              {
                value: 15,
                name: '诗词鉴赏'
              },
              {
                value: 25,
                name: '现代文阅读'
              },
              {
                value: 20,
                name: '文言文阅读理解'
              },
              {
                value: 35,
                name: '作文'
              }
            ]
            this.drawLine()
      }
      if(index==2){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '75%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['计算', '55%', '75%', '50%']
                    },
                    {id: 3,
                      value: ['应用题', '75%', '75%', '40%']
                    },
                    {id: 4,
                      value: ['选择题', '35%', '75%', '90%']
                    }
                  ]
        this.dataname = ['基础知识','计算','应用题','选择题']
        this.datalist = [
              {
                value: 10,
                name: '基础知识'  
              },
              {
                value: 20,
                name: '计算'
              },
              {
                value: 15,
                name: '应用题'
              },
              {
                value: 25,
                name: '选择题'
              }
            ]
            this.drawLine()
      }
      if(index==3){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '75%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['听力', '15%', '75%', '80%']
                    },
                    {id: 3,
                      value: ['作文', '85%', '75%', '80%']
                    },
                    {id: 4,
                      value: ['选择题', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['填空', '75%', '75%', '80%']
                    },
                    {id: 6,
                      value: ['阅读', '85%', '75%', '80%']
                    }
                  ]
        this.dataname = ['基础知识','听力','作文','选择题','填空','阅读']
        this.datalist = [
              {
                value: 12,
                name: '基础知识'  
              },
              {
                value: 10,
                name: '听力'
              },
              {
                value: 15,
                name: '作文'
              },
              {
                value: 25,
                name: '选择题'
              },
              {
                value: 23,
                name: '填空'
              },
              {
                value: 33,
                name: '阅读'
              }
            ]
            this.drawLine()
      }
      if(index==4){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '55%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['填空', '15%', '75%', '80%']
                    },
                    {id: 3,
                      value: ['阅读', '85%', '75%', '80%']
                    },
                    {id: 4,
                      value: ['判断', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['理解', '75%', '75%', '80%']
                    }
                  ]
        this.dataname = ['基础知识','填空','阅读','判断','理解']
        this.datalist = [
              {
                value: 20,
                name: '基础知识'  
              },
              {
                value: 40,
                name: '理解'
              },
              {
                value: 35,
                name: '阅读'
              },
              {
                value: 15,
                name: '判断'
              },
              {
                value: 20,
                name: '填空'
              }
            ]
            this.drawLine()
      }
      if(index==5){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '55%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['填空', '15%', '75%', '80%']
                    },
                    {id: 3,
                      value: ['阅读', '85%', '75%', '80%']
                    },
                    {id: 4,
                      value: ['判断', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['理解', '75%', '75%', '80%']
                    }
                  ]
        this.dataname = ['基础知识','填空','阅读','判断','理解']
        this.datalist = [
              {
                value: 20,
                name: '基础知识'  
              },
              {
                value: 30,
                name: '理解'
              },
              {
                value: 30,
                name: '阅读'
              },
              {
                value: 25,
                name: '判断'
              },
              {
                value: 30,
                name: '填空'
              }
            ]
            this.drawLine()
      }
      if(index==6){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '55%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['填空', '15%', '75%', '80%']
                    },
                    {id: 3,
                      value: ['阅读', '25%', '75%', '80%']
                    },
                    {id: 4,
                      value: ['判断', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['理解', '65%', '75%', '80%']
                    }
                  ]
        this.dataname = ['基础知识','填空','阅读','判断','理解']
        this.datalist = [
              {
                value: 60,
                name: '基础知识'  
              },
              {
                value: 15,
                name: '理解'
              },
              {
                value: 10,
                name: '阅读'
              },
              {
                value:23,
                name: '判断'
              },
              {
                value: 25,
                name: '填空'
              }
            ]
            this.drawLine()
      }
      if(index==7){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '55%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['填空', '15%', '75%', '80%']
                    },
                    {id: 3,
                      value: ['选择', '25%', '75%', '80%']
                    },
                    {id: 4,
                      value: ['判断', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['理解', '65%', '75%', '80%']
                    }
                  ]
        this.dataname = ['基础知识','填空','选择','判断','理解']
        this.datalist = [
              {
                value: 45,
                name: '基础知识'  
              },
              {
                value: 25,
                name: '理解'
              },
              {
                value: 30,
                name: '选择'
              },
              {
                value:20,
                name: '判断'
              },
              {
                value: 15,
                name: '填空'
              }
            ]
            this.drawLine()
      }
      if(index==8){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '55%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['填空', '25%', '75%', '80%']
                    },
                    {id: 3,
                      value: ['选择', '25%', '75%', '80%']
                    },
                    {id: 4,
                      value: ['判断', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['理解', '65%', '75%', '80%']
                    }
                  ]
        this.dataname = ['基础知识','填空','选择','判断','理解']
        this.datalist = [
              {
                value: 40,
                name: '基础知识'  
              },
              {
                value: 35,
                name: '理解'
              },
              {
                value: 25,
                name: '选择'
              },
              {
                value: 15,
                name: '判断'
              },
              {
                value: 30,
                name: '填空'
              }
            ]
            this.drawLine()
      }
      if(index==9){
        this.tabletd=[
                    {id: 1,
                      value: ['基础知识', '55%', '75%', '80%']
                    },
                    {id: 2,
                      value: ['填空', '35%', '45%', '80%']
                    },
                    {id: 3,
                      value: ['选择', '25%', '55%', '80%']
                    },
                    {id: 4,
                      value: ['判断', '45%', '75%', '80%']
                    },
                    {id: 5,
                      value: ['理解', '65%', '75%', '80%']
                    }
                  ]
        this.dataname = ['基础知识','填空','选择','判断','理解']
        this.datalist = [
              {
                value: 40,
                name: '基础知识'  
              },
              {
                value: 45,
                name: '理解'
              },
              {
                value: 15,
                name: '选择'
              },
              {
                value: 10,
                name: '判断'
              },
              {
                value: 40,
                name: '填空'
              }
            ]
            this.drawLine()
      }
    },
    back (){
      this.$router.push({
        path: '/teacherIndex'
    })
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let self = this
      let myChart = self.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
              textStyle: {
                fontSize: 14
              },
              icon: 'circle',
          data: self.dataname
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            }
          }
        },
        // calculable: true,
        series: [
          {
            type: 'pie',
            radius: [100, 160],
            center: ['50%', '50%'],
            data: self.datalist,
            color:['#347cf9','#58ce52','#ffc051','#4ba8ff','#ff7d8b','#ba61e8','#c622e5','#2feaf6','#ff7f8b']
          }
        ]
      })
    }
  }
}
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
    .iconfont{
    font-size: 2rem;
    display: inline-block;
    padding-right:1rem;
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
  background-color: #fff;
  overflow: hidden;
  h4 {
    font-size: 2.9rem;
    margin-top: 3rem;
    margin-left: 4rem;
    color: #666666;
  }
  h2 {
    font-size: 6.2rem;
    color: #ff532b;
    text-align: center;
    margin-top: 3.7rem;
    span {
      font-size: 1.4rem;
    }
  }
  .centernav {
    width: 100%;
    padding: 0 2.2rem;
    height: 11.75rem;
    margin-top: 6.2rem;
    ul {
      width: 100%;
      height: 11.75rem;
      background-color: #94b8f7;
      border-radius: 1.5rem;
      overflow: hidden;
      display: flex;
      li {
        flex: 1;
        height: 11.75rem;
        color: #fff;
        text-align: center;
        border-right: 2px solid #cfddf6;
        div {
          font-size: 1.8rem;
          margin-top: 3rem;
          margin-bottom: 2rem;
        }
        span {
          font-size: 2.2rem;
        }
      }
      :nth-child(3) {
        border-right: none;
      }
    }
  }
  .situation {
    color: #347cf9;
    margin-top: 7rem;
    font-size: 2.8rem;
    text-align: center;
    display: flex;
    justify-content: center;
    .xian {
      width: 2.9rem;
      height: 0.4rem;
      background-color: #347cf9;
      margin-top: 1rem;
    }
    .text {
      padding: 0 1.3rem;
    }
  }
  h3 {
    font-size: 2.2rem;
    margin-top: 4.7rem;
    div {
      display: inline-block;
      background-color: #347cf9;
      width: 1.7rem;
      height: 1.7rem;
      margin-right: 2rem;
      margin-left: 4rem;
    }
  }
  .echarts {
    width: 100%;
    height: 42.25rem;
    padding: 0 5rem;
    #myChart {
      width: 100%;
      height: 100%;
    }
  }
  .table {
    width: 100%;
    padding: 0 5rem;
    table {
      width: 100%;
      font-size: 2rem;
      margin-top: 3.9rem;
      // overflow: hidden;
      border: 1px solid #b3b3b3;
      tr {
        height: 7.9rem;
        text-align: center;
        display: flex;
        overflow: hidden;
        th {
          flex: 1;
          height: 7.9rem;
          display: inline;
          background-color: #fff;
          padding-top: 2.5rem;
        border-left: 1px solid #b3b3b3;
        border-bottom: 1px solid #b3b3b3;
        }
        :nth-child(1){
            border-left: none;
        }
        td {
          flex: 1;
          height: 7.9rem;
          display: inline;
          background-color: #ffffff;
          padding-top: 2.5rem;
        border-left: 1px solid #b3b3b3;
        border-bottom: 1px solid #b3b3b3;
        }
      }
    }
  }
}
</style>
