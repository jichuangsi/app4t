<template>
  <div class="popupPic">
    <div
      class="remind"
      v-if="questionPic"
      @click.stop="picimg(questionPic)"
    >
      （点开查看图片）
    </div>
    <div
      class="bigimg"
      v-if="dsadsa"
    >
      <div
        class="btn"
        @click.stop="picimgshow"
      >x</div>
      <div class="img">
      <img
        :src="bigimg"
        alt=""
        :class="{'imgwidth':imgwidth,'imgheight':imgheight}"
      >
      </div>
    </div>
  </div>
</template>

<script>
import { getQuestionPic } from "@/api/teacher/classroom";

export default {
  name: "PopupPic",
  props: {
    questionPic: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      bigimg: "",
      dsadsa: false,
      imgwidth: false,
      imgheight: false
    };
  },
  mounted(){
    this.ifimg()
  },
  methods: {
    ifimg(){
          if (this.bigimg) {
            let img = new Image();
            img.src = this.bigimg;
            console.log(img.width,img.height)
            if (img.width > img.height) {
              this.imgwidth = true;
              this.imgheight = false;
            } else {
              this.imgwidth = false;
              this.imgheight = true;
            }
          }
      },
    picimgshow() {
      let self = this;
      self.dsadsa = false;
    },
    picimg(src) {
      let self = this;
      self.dsadsa = true;
      if (this.bigimg === "") {
        getQuestionPic(src).then(res => {
          // console.log(res.data.data.content)
          self.bigimg = //res.data.data.content;
            "data:image/png;base64," + res.data.data.content.replace(",", "");
            this.ifimg()
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.popupPic {
  .bigimg {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #fff;
    z-index: 101;
    .btn {
      padding: 1rem 2rem;
      float: right;
      font-size: 2.5rem;
      color: yellowgreen;
    }
    .imgwidth {
      transform: rotate(90deg);
    //   margin-top: 40px;
      width: 100%;
      height: 50%;
    }
    .imgheight {
      width: 100%;
      height: 100%;
    }
  }
  .remind {
    font-size: 16px;
    color: #666;
    position: absolute;
    right: 40%;
    // bottom: 0%
  }
}
</style>