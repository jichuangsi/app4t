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
      this.simulation()
      //console.log(secondaryClass[0].classId,subjectName)
      // if(arr.length>0){
      //     getCourseSubjectResult(arr[0].classId,subjectName).then(res=>{
      //         //console.log(res)
      //         this.resnav = res.data.data.studentResultModels
      //         for(let j = 0 ;j<this.resnav.length;j++){
      //             arr1.push({id:j+1,value:[this.resnav[j].knowledgeName,(Number(this.resnav[j].knowledgeRate)*100).toFixed()+'%',(Number(this.resnav[j].classResultRate)*100).toFixed()+'%',(Number(this.resnav[j].gradeResultRate)*100).toFixed()+'%']})
      //             arr2.push(this.resnav[j].knowledgeName)
      //             arr3.push({value:(Number(this.resnav[j].knowledgeRate)*100).toFixed(),name:this.resnav[j].knowledgeName})
      //         }
      //         this.tabletd = arr1
      //         this.dataname = arr2
      //         this.datalist = arr3
      //         this.drawLine()
      //     }).catch(e=>{
      //         console.log(e)
      //     })
      // }


    },
    
    simulation(){
      if(this.value == '语文'){
          this.tabletd = [
            {id:'1',value:['成语','20%','60%','90%']},
            {id:'2',value:['病句辨析','20%','30%','80%']},
            {id:'3',value:['一词多义','40%','40%','90%']},
            {id:'4',value:['仿写句子','20%','60%','70%']}
          ]
          this.dataname = ['成语','病句辨析','一词多义','仿写句子']
          this.datalist =[
            {value:20,name:'成语'},
            {value:20,name:'病句辨析'},
            {value:40,name:'一词多义'},
            {value:20,name:'仿写句子'}
          ]
      }
      //
      if(this.value == '数学'){
          this.tabletd = [
            {id:'1',value:['有理数的大小比较','10%','100%','90%']},
            {id:'2',value:['整式化简求值','20%','60%','85%']},
            {id:'3',value:['一元一次方程','40%','40%','90%']},
            {id:'4',value:['实数','30%','60%','70%']}
          ]
          this.dataname = ['有理数的大小比较','整式化简求值','一元一次方程','实数']
          this.datalist =[
            {value:10,name:'有理数的大小比较'},
            {value:20,name:'整式化简求值'},
            {value:40,name:'一元一次方程'},
            {value:30,name:'实数'}
          ]
      }
      //
      if(this.value == '英语'){
          this.tabletd = [
            {id:'1',value:['专有名词','10%','80%','90%']},
            {id:'2',value:['字母','20%','70%','85%']},
            {id:'3',value:['一般疑问句','40%','60%','80%']},
            {id:'4',value:['单词，词组','30%','50%','95%']}
          ]
          this.dataname = ['专有名词','字母','一般疑问句','单词，词组']
          this.datalist =[
            {value:10,name:'专有名词'},
            {value:20,name:'字母'},
            {value:40,name:'一般疑问句'},
            {value:30,name:'单词，词组'}
          ]
      }
      //
      if(this.value == '政治'){
          this.tabletd = [
            {id:'1',value:['理智面对学习压力','20%','80%','70%']},
            {id:'2',value:['社区生活','40%','50%','90%']},
            {id:'3',value:['自立与自强','10%','90%','80%']},
            {id:'4',value:['培养良好习惯','30%','70%','95%']}
          ]
          this.dataname = ['理智面对学习压力','社区生活','自立与自强','培养良好习惯']
          this.datalist =[
            {value:20,name:'理智面对学习压力'},
            {value:40,name:'社区生活'},
            {value:10,name:'自立与自强'},
            {value:30,name:'培养良好习惯'}
          ]
      }
      //
      if(this.value == '地理'){
          this.tabletd = [
            {id:'1',value:['地球的大小','20%','80%','70%']},
            {id:'2',value:['重要的经纬线','10%','50%','90%']},
            {id:'3',value:['经纬网的含义','30%','90%','80%']},
            {id:'4',value:['降水的类型以及区别','40%','70%','95%']}
          ]
          this.dataname = ['地球的大小','重要的经纬线','经纬网的含义','降水的类型以及区别']
          this.datalist =[
            {value:20,name:'地球的大小'},
            {value:10,name:'重要的经纬线'},
            {value:30,name:'经纬网的含义'},
            {value:40,name:'降水的类型以及区别'}
          ]
      }
      //
      if(this.value == '历史'){
          this.tabletd = [
            {id:'1',value:['中国文化起源','15%','80%','80%']},
            {id:'2',value:['西周的结束','35%','70%','90%']},
            {id:'3',value:['丝绸之路','30%','80%','95%']},
            {id:'4',value:['百家争鸣','20%','85%','90%']}
          ]
          this.dataname = ['中国文化起源','西周的结束','丝绸之路','百家争鸣']
          this.datalist =[
            {value:15,name:'中国文化起源'},
            {value:35,name:'西周的结束'},
            {value:30,name:'丝绸之路'},
            {value:20,name:'百家争鸣'}
          ]
      }
      //
      if(this.value == '生物'){
          this.tabletd = [
            {id:'1',value:['画细胞结构图注意事项','15%','70%','75%']},
            {id:'2',value:['动物细胞的结构','45%','50%','80%']},
            {id:'3',value:['生态农业','10%','80%','90%']},
            {id:'4',value:['人体骨骼的组成','20%','75%','80%']}
          ]
          this.dataname = ['画细胞结构图注意事项','动物细胞的结构','生态农业','人体骨骼的组成']
          this.datalist =[
            {value:15,name:'画细胞结构图注意事项'},
            {value:45,name:'动物细胞的结构'},
            {value:10,name:'生态农业'},
            {value:20,name:'人体骨骼的组成'}
          ]
      }
      //
      if(this.value == '物理'){
          this.tabletd = [
            {id:'1',value:['运动和力','30%','70%','75%']},
            {id:'2',value:['新材料及应用','20%','50%','80%']},
            {id:'3',value:['压强','40%','80%','90%']},
            {id:'4',value:['静电现象','10%','75%','80%']}
          ]
          this.dataname = ['运动和力','新材料及应用','压强','静电现象']
          this.datalist =[
            {value:30,name:'运动和力'},
            {value:20,name:'新材料及应用'},
            {value:40,name:'压强'},
            {value:10,name:'静电现象'}
          ]
      }
      //
      if(this.value == '化学'){
          this.tabletd = [
            {id:'1',value:['科学的探究能力','30%','70%','75%']},
            {id:'2',value:['二氧化碳对环境的影响','20%','50%','80%']},
            {id:'3',value:['气体的净化','40%','80%','90%']},
            {id:'4',value:['影响溶解的快慢因素','10%','75%','80%']}
          ]
          this.dataname = ['科学的探究能力','二氧化碳对环境的影响','气体的净化','影响溶解的快慢因素']
          this.datalist =[
            {value:30,name:'科学的探究能力'},
            {value:20,name:'二氧化碳对环境的影响'},
            {value:40,name:'气体的净化'},
            {value:10,name:'影响溶解的快慢因素'}
          ]
      }
      
        this.drawLine()
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
