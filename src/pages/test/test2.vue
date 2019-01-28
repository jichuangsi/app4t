<template>
  <div class="test2">
    <div v-for="(item,index) in checkbox">
      <div class="checkbox" @click="select(index,item.id)">
        <div class="point" v-if="arr[index]"></div>
      </div>
    </div>
    <div class="checkbox" @click="all">全选</div>
  </div>
</template>

<script>
  export default {
    name: "test2",
    data() {
      return {
        checkbox: [{
          id: 1,
          title: 'A'
        }, {
          id: 2,
          title: 'B'
        }, {
          id: 3,
          title: 'C'
        }, {
          id: 4,
          title: 'D'
        }],
        arr: [false, false, false, false],
        selected: []
      }
    },
    methods: {
      select(index, id) {
        if (this.arr[index] === true) {
          this.arr.splice(index, 1, false);
          for (let i = 0; i < this.selected.length; i++) {
            if (this.selected[i] === id) {
              Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                  this.splice(index, 1);
                }
              };
              this.selected.remove(id);
              console.log(this.selected);
            }
          }
        } else {
          this.arr.splice(index, 1, true);
          this.selected.push(id);
          console.log(this.selected);
        }
      },
      all() {
        let temporarily = [];
        for (let i = 0; i < this.arr.length; i++) {
          if (this.arr.length === 0 || this.arr[i] === false) {
            for (let j = 0; j < this.arr.length; j++) {
              temporarily.push(true);
            }
            break;
          } else {
            for (let z = 0; z < this.arr.length; z++) {
              temporarily.push(false);
            }
          }
          break;
        }
        this.arr = temporarily;
        console.log(this.arr);
      }
    }
  }
</script>

<style lang="scss">
  .test2 {
    font-size: 28px;
    .checkbox {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 1px solid black;
      margin-bottom: 20px;
      position: relative;
      .point {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
        background-color: #69b482;
      }
    }
  }
</style>
