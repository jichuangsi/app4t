<template>
  <div>
    <tests :subjectList="subjectList" @show="show"/>
  </div>
</template>

<script>
  import tests from "../../components/test/test"

  export default {
    name: 'test1',
    components: {
      tests
    },
    data() {
      return {
        subjectList: [
          {
            id: 1,
            subject: '有两根铁丝，第一根用去 米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
            answer: [
              {title: 'A', text: '第一根长'},
              {title: 'B',text: '第二根长'},
              {title: 'C',text: '一样长'},
              {title: 'D',text: '无法确定'}
            ]
          },
          {
            id: 2,
            subject: '有两根铁丝，第一根用去 米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
            answer: [
              {title: 'A', text: '第一根长'},
              {title: 'B',text: '第二根长'},
              {title: 'C',text: '一样长'},
              {title: 'D',text: '无法确定'}
            ]
          }, {
            id: 3,
            subject: '有两根铁丝，第一根用去 米，第二根用去 ，剩下的一样长，两根铁丝原来相比（    ）。',
            answer: [
              {title: 'A', text: '第一根长'},
              {title: 'B',text: '第二根长'},
              {title: 'C',text: '一样长'},
              {title: 'D',text: '无法确定'}
            ]
          }],
      }
    },
    methods: {
      show(arr) {
        console.log(arr);
      }
    }
  }
</script>

<style>

</style>
