<template>
    <div class="subjective">
      <div class="Collection" @click="Collection" v-if="subjectiveTopic.questionStatus == 'FINISH'">
        <img :src="Collectionsrc" alt="">
      </div>
        <div class="topic_warp">
            <div class="title">{{subjectiveTopic.title}}</div>
            <div class="topic" v-html="subjectiveTopic.questionContent">
                {{subjectiveTopic.questionContent}}
            </div>
        </div>
        <!--<div class="remind" v-if="subjectiveTopic.questionPic" @click.stop="picimg(subjectiveTopic.questionPic)">
            （点开查看图片）
        </div>
        <div class="bigimg" v-if="dsadsa">
            <div class="btn" @click.stop="picimgshow">x</div>
            <img :src="bigimg" alt="">
        </div>-->
        <PopupPic :questionPic="subjectiveTopic.questionPic"/>
        <div class="anwers" v-if="subjectiveTopic.questionStatus == 'FINISH'">
          此题答案为:<span v-html="subjectiveTopic.answer"></span>
        </div>
        <div class="remind" v-html="subjectiveTopic.parse" v-if="subjectiveTopic.questionStatus == 'FINISH'">
        </div>
    </div>
</template>

<!--主观题-->

<script>
    import { addFavorQuestion, removeFavorQuestion } from "@/api/student/classroom";
    import PopupPic from "./PopupPic";
    import { Toast } from "mint-ui";
export default {
  name: "subjective",
    components: {PopupPic},
    props: {
    subjectiveTopic: {
      type: Object,
      default: function() {
        return {
        };
      }
    }
  },
  data() {
    return {
      /*bigimg: "",
      dsadsa: false*/
      Collectionsrc:require('../../assets/未收藏.png'),
      Collectiontype:false
    };
  },
  mounted() {
     if(this.subjectiveTopic.favor){
        this.Collectiontype = true
        this.Collectionsrc = require('../../assets/已收藏.png')
     }
  },
  methods: {
    //点击收藏
      Collection(){
          if(this.Collectiontype){
              removeFavorQuestion(this.subjectiveTopic.questionId).then(res => {
                  if (res.data.code === '0010') {
                      this.Collectiontype = false
                      this.Collectionsrc = require('../../assets/未收藏.png')
                  }else{
                      Toast({
                          message: res.data.msg,
                          position: "middle",
                          duration: 1000
                      });
                  }
              });
          } else{
              addFavorQuestion(this.subjectiveTopic.questionId).then(res => {
                  if (res.data.code === '0010') {
                      this.Collectiontype = true
                      this.Collectionsrc = require('../../assets/已收藏.png')
                  }else{
                      Toast({
                          message: res.data.msg,
                          position: "middle",
                          duration: 1000
                      });
                  }
              });
          }
      }
    /*picimgshow() {
      let self = this;
      self.dsadsa = false;
    },
    picimg(src) {
      let self = this;
      self.dsadsa = true;
      getQuestionPic(src).then(res => {
        // console.log(res.data.data.content)
        self.bigimg = //res.data.data.content;
          "data:image/png;base64," +
          res.data.data.content.replace(",", "");
      });
    }*/
  }
};
</script>

<style lang="scss" scoped>
.subjective {
  width: 100%;
  .Collection {
    width: 2.5rem;
    height: 2.5rem;
    position: absolute;
    right: 2rem;
    z-index: 100;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .anwers{
   font-size: 18px;
    line-height: 24px;
    padding: 15px;
    span {
      color: red;
    }
  }
  .remind {
    font-size: 18px;
    line-height: 24px;
    padding: 15px;
  }
  /*.bigimg {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #fff;
    z-index: 101;
      padding: 4rem 2rem;
    .btn {
      font-size: 4rem;
      font-weight: 700;
      color: yellowgreen;
      position: absolute;
      right: 2rem;
      top: 1rem;
    }
    img {
        height: 100%;
        width: 100%;
    }
  }
  .remind {
    font-size: 16px;
    color: #666;
    position: absolute;
    right: 40%;
    z-index: 11;
    // bottom: 0%
  }*/
  .topic_warp {
    position: relative;
    .title {
      font-size: 18px;
      color: #69b482;
    }
    .topic {
      color: #353535;
      font-size: 18px;
      line-height: 34px;
      padding: 0 2.57rem;
    }
  }
}

.MathJye table {
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  line-height: normal;
  font-size: inherit;
  _font-size: 100%;
  font-style: normal;
  font-weight: normal;
  border: 0;
  float: none;
  display: inline-block;
  zoom: 0;
}
.mathjye-underpoint2 {
  border-bottom: 2px dotted #000;
  padding-bottom: 3px;
}
#q_answer {
  display: none;
}
table.edittable {
  border-collapse: collapse;
  text-align: center;
  margin: 2px;
}
table.edittable td,
table.edittable th {
  line-height: 30px;
  padding: 5px;
  white-space: normal;
  word-break: break-all;
  border: 1px solid #000;
  vertical-align: middle;
}
table.composition {
  border-collapse: collapse;
  text-align: left;
  margin: 2px;
  width: 98%;
}
table.composition td,
table.composition th {
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border-width: 0;
  vertical-align: middle;
}
table.composition2 {
  border-collapse: collapse;
  width: auto;
}
table.composition2 td,
table.composition2 th {
  text-align: left;
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border: none;
  border-width: 0;
  vertical-align: middle;
}
sup {
  vertical-align: super;
}
sub{
    vertical-align: sub;
}

</style>
