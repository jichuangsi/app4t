<template>
    <div class="teacherenquiry">
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
        <div class="center">
            <!-- <h4>总人数:{{Total}}人</h4> -->
            <div class="centernav" v-if="false">
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
import {getCourseSubjectResult} from '@/api/teacher/statistics'
export default {
  name: 'teacherenquiry',
  components: {
  },
  data () {
    return {
      current: 0,
      nav: [],
      value: '',
      Total: '46',
      Average: '96.3', // 平均分
      Highestscore: '56', // 最高分
      beat: '3', // 击败年级
      tableth: ['知识模块', '权重占比', '本班的正确率', '年级平均正确率'],
      tabletd: [],
      dataname:[],
      datalist:[]
    }
  },
  mounted () {
    this.drawLine()
    this.getdata()
  },
  methods: {
    getdata() {
      let arr = []
      let arr1 = []
      let arr2 = []
      let arr3 = []
      let subjectName = JSON.parse(localStorage.getItem('user')).roles[0].primarySubject.subjectName
      let secondaryClass = JSON.parse(localStorage.getItem('user')).roles[0].secondaryClass
      for (let i = 0; i < secondaryClass.length; i++) {
        arr.push({className:secondaryClass[i].className,classId:secondaryClass[i].classId})
      }
      this.nav = arr
      this.value = subjectName
      console.log(secondaryClass[0].classId,subjectName)
      getCourseSubjectResult(secondaryClass[0].classId,subjectName).then(res=>{
        console.log(res)
        this.resnav = res.data.data.studentResultModels
        for(let j = 0 ;j<this.resnav.length;j++){
          arr1.push({id:j+1,value:[this.resnav[j].knowledgeName,(Number(this.resnav[j].knowledgeRate)*100).toFixed()+'%',(Number(this.resnav[j].classResultRate)*100).toFixed()+'%',(Number(this.resnav[j].gradeResultRate)*100).toFixed()+'%']}) 
          arr2.push(this.resnav[j].knowledgeName)
          arr3.push({value:(Number(this.resnav[j].knowledgeRate)*100).toFixed(),name:this.resnav[j].knowledgeName})
        }
        this.tabletd = arr1
        this.dataname = arr2
        this.datalist = arr3
        this.drawLine()
      }).catch(e=>{
        console.log(e)
      })
    },
    // 判断当前选中哪个
    allocation (item, index) {
      this.current = index
      let classId = item.classId
      let arr1 = []
      let arr2 = []
      let arr3 = []
      getCourseSubjectResult(classId,this.value).then(res=>{
        console.log(res)
        this.resnav = res.data.data.studentResultModels
        for(let j = 0 ;j<this.resnav.length;j++){
          arr1.push({id:j+1,value:[this.resnav[j].knowledgeName,(Number(this.resnav[j].knowledgeRate)*100).toFixed()+'%',(Number(this.resnav[j].classResultRate)*100).toFixed()+'%',(Number(this.resnav[j].gradeResultRate)*100).toFixed()+'%']}) 
          arr2.push(this.resnav[j].knowledgeName)
          arr3.push({value:(Number(this.resnav[j].knowledgeRate)*100).toFixed(),name:this.resnav[j].knowledgeName})
        }
        this.tabletd = arr1
        this.dataname = arr2
        this.datalist = arr3
        this.drawLine()
      }).catch(e=>{
        console.log(e)
      })
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
          formatter: '{b} <br/>{c} ({d}%)'
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
      color:#fff;
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
        justify-content: center;
        align-items: center;
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
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.6rem;
          background-color: #f5f5f5;
          // padding-top: 2.5rem;
          border-left: 1px solid #b3b3b3;
          border-bottom: 1px solid #b3b3b3;
        }
        td:nth-child(1){
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style>
