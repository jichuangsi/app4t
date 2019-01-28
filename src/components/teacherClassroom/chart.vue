<template>
  <div class="chart">
    <div id="myChart" :style="{width: '384px', height: '300px'}"></div>
    <div id="myChart2" :style="{width: '384px', height: '300px'}"></div>
  </div>
</template>

<script>
  export default {
    name: "chart",
    data() {
      return {
        num: {
          a: 10,
          b: 20,
          c: 30,
          d: 40
        },
        name: '蓝色'
      }
    },
    mounted() {
      this.drawLine();
      this.drawLine2();
    },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            top: '10px',
            data: ['未交人数', '已交人数']
          },
          series: [
            {
              name: '客观题',
              type: 'pie',
              radius: '50%',
              center: ['50%', '50%'],
              data: [
                {value: this.a, name: '未交人数'},
                {value: this.b, name: '已交人数'},
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      },
      drawLine2() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart2'));
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            top: '10px',
            data: [{
              name: this.num.a,
            }, this.num.b, this.num.c, this.num.d],
            textStyle: {
              color: '#333'
            },
            formatter: function (a) {
              console.log(a);
              return '选择A';
            }
          },
          series: [
            {
              name: '客观题',
              type: 'pie',
              radius: '30%',
              center: ['50%', '50%'],
              data: [
                {value: this.num.a, name: this.num.a},
                {value: this.num.b, name: this.num.b},
                {value: this.num.c, name: this.num.c},
                {value: this.num.d, name: this.num.d}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      },
    }
  }
</script>

<style lang="scss">
  .chart {
    display: flex;
  }
</style>
