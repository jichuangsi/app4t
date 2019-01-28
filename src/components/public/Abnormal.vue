<template>
  <div class="abnormal">
    <div class="picture">
      <img src="http://pd0qnho0l.bkt.clouddn.com/Group%207.png" alt="">
    </div>
    <div class="text">网络异常</div>
    <div class="details">网络出现问题啦，请稍后再试</div>
    <div class="reload" @click="reload">重新加载</div>
  </div>
</template>
<!--网络异常-->
<script>
  import {Toast} from 'mint-ui';

  export default {
    name: "abnormal",
    data() {
      return {}
    },
    methods: {
      reload() {
        Toast({
          message: '网络不给力',
          position: 'bottom'
        });
      }
    }
  }
</script>

<style lang="scss">
  .abnormal {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    .picture {
      width: 164px;
      height: 114px;
      padding-bottom: 6.51rem;
      margin: 0 auto;
    }
    .text {
      font-size: 30px;
      color: #565656;
      padding-bottom: 1.14rem;
    }
    .details {
      font-size: 21px;
      color: #565656;
      padding-bottom: 6.14rem;
    }
    .reload {
      width: 12.43rem;
      height: 4.71rem;
      line-height: 4.71rem;
      font-size: 24px;
      margin: 0 auto;
      border-radius: 33px;
      color: white;
      background-color: rgba(128, 213, 156, 1);
    }
  }
</style>
