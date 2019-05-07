<template>
  <div class="homeworkChart">
    <div class="tips">
      提交人数：{{total.submited}}人<span v-if="question.questionType ==='objective'">，正确率{{initial.acc*100}}%</span>
    </div>
    <div id="chart">
      <div :id="'chart1'+question.questionId" class="chart1">

      </div>
      <div :id="'chart2'+question.questionId" class="chart2" v-if="question.questionType ==='objective'">

      </div>
    </div>
  </div>
</template>

<script>

    export default {
      name: "questionChart",
      props: {
          question: {
              type: Object,
              default: function () {
                  return {}
              }
          },
          studentCount: {
              type: Number,
              default: 0
          },
      },
      data() {
        return {
            total: {
                submited: 0,
                all: 0
            },
            //题目的初始值
            initial: {
                acc: '',
                count: ''
            },
        }
      },
      watch:{
        question(){
            this.drawChart();
        }
      },
      mounted() {
        this.drawChart();
        let self = this;
          screen.orientation.addEventListener('change', function(){
              //Toast(screen.orientation.type); // e.g. portrait
              if("landscape-primary"===screen.orientation.type){
                  document.getElementById('chart').setAttribute('style', 'height:20rem;padding-bottom:0rem;');
              }else if("portrait-primary"===screen.orientation.type){
                  document.getElementById('chart').setAttribute('style', 'height:15rem;padding-bottom:1.7rem;');
              }
              self.$echarts.getInstanceByDom(document.getElementById('chart1'+self.question.questionId)).resize();
              self.$echarts.getInstanceByDom(document.getElementById('chart2'+self.question.questionId)).resize();
              //self.$forceUpdate();
          });
      },
      methods: {
          drawChart(){
              this.total.all = this.studentCount;
              this.total.submited = this.question.answerModelForStudent.length;
              let count = 0
              this.question.answerModelForStudent.forEach((ans, index)=>{
                  if(ans.result==='CORRECT') count++;
              });
              if(this.total.submited===0){
                  this.initial.acc = 0;
              }else{
                  this.initial.acc = count/this.total.submited;
              }
              this.initial.count = this.total.submited;
              this.drawLine1();
              if(this.question.questionType ==='objective') this.drawLine2();
          },
        //第一个饼图
        drawLine1() {
            this.$nextTick(function () {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('chart1'+this.question.questionId));
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'horizontal',
                        left: 'left',
                        top: 0,
                        data: [{name: "提交", icon: 'circle'}, {name: "未提交", icon: 'circle'}],
                        formatter: function (a) {
                            return a;
                        }
                    },
                    series: [
                        {
                            name: this.question.questionTypeInCN?this.question.questionTypeInCN:'',
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '60%'],
                            data: [
                                {value: this.total.submited, name: "提交"},
                                {value: this.total.all - this.total.submited, name: "未提交"}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color: ['rgba(103,233,117,1)', 'rgba(48,154,60,1)']

                });
            });
        },
        //第二个饼图
        drawLine2() {
            this.$nextTick(function () {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('chart2'+this.question.questionId))
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'horizontal',
                        left: 'left',
                        top: '0',
                        width: 150,
                        data: [
                            {name: "正确", icon: 'circle'},
                            {name: "错误", icon: 'circle'}
                        ],
                        formatter: function (a) {
                            return a;
                        }
                    },
                    series: [
                        {
                            name: this.question.questionTypeInCN?this.question.questionTypeInCN:'',
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '60%'],
                            data: [
                                {value: this.initial.acc, name: "正确"},
                                {value: 1 - this.initial.acc, name: "错误"}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color: ['rgba(103,216,233,1)', 'rgba(48,137,154,1)', 'rgba(48,83,154,1)', 'rgba(68,48,154,1)']
                });
            })
        },
    }
  }
</script>

<style lang="scss">
  .homeworkChart{
    .tips {
      padding: 3.43rem 0 1.36rem;
      font-size: 18px;
      color: rgba(105, 180, 130, 1);
    }
    #chart {
      width: 100%;
      height: 15rem;
      display: flex;
      position: relative;
      padding-bottom: 1.7rem;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 2px solid rgba(230, 230, 230, .5);
        -webkit-transform: scaleY(.5);
        -webkit-transform-origin: 0 0;
      }
      .chart1 {
        width: 50%;
        height: 100%;
      }
      .chart2 {
        width: 50%;
        height: 100%;
      }
    }
  }
</style>
