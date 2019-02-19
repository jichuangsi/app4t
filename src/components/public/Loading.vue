<template>
  <div class="loading">
    <mt-spinner :size="60" color="rgba(61,114,254,1)" type="fading-circle"></mt-spinner>
  </div>
</template>

<script>
  export default {
    name: "Loading",
    data() {
      return {}
    }
  }
</script>

<style lang="scss">
  .loading {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    background-color: white;
    .mint-spinner-fading-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
</style>
