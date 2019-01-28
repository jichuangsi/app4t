<template>
    <div class="avatar_warp">
        <img :src="userimg" alt="头像">
    </div>
</template>

<!--学生头像-->

<script>
    export default {
        name: 'avatar',
        data() {
            return {
                userimg: ''
            }
        },
    mounted(){
      this.getstudent()
    },
    methods:{
      getstudent(){
      let user = JSON.parse(localStorage.getItem('user'))
      if(user.userSex=="FEMALE"){
        this.userimg = require('../../assets/女学生.png')
      }else{
        this.userimg = require('../../assets/男学生.png')
      }
      }
    }
    }
</script>

<style lang="scss">
    .avatar_warp {
        position: absolute;
        top: 0;
        right: 0;
        width: 4.86rem;
        height: 4.71rem;
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
        img {
            width: 100%;
            border-radius: 50%;
        }
    }
</style>
