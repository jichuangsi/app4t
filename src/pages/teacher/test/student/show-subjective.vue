<template>
    <div class="subjectiveWork">
        <classroom-header :header="headers" :jump="jump"/>
        <div class="subjectiveContent">
            <swiper ref="mySwiper" :options="swiperOption">
                <swiper-slide v-for="(item,index) in testSubjectiveQs" :key="index" v-if="pageShow">
                    <scroll-content ref="myscrollfull" :mescrollValue="mescrollValue">
                        <div class="subjective_warp">
                            <!--<subjective :subjectiveTopic="item" :id="item.id"/>-->
                            <div class="subjective">
                                <div class="centertext">左右滑动切换题目</div>
                                <div class="topic_warp" :id="'qc'+item.questionId">
                                    <div class="title">主观题-{{index+1}} <span v-if="item.questionTypeInCN">({{item.questionTypeInCN}})</span></div>
                                    <div class="topic" :id="'tp'+item.questionId" v-html="item.questionContent">
                                        {{item.questionContent}}
                                    </div>
                                </div>
                                <PopupPic :questionPic="item.questionPic"/>
                                <div class="anwers" v-if="testCompleted">
                                    此题答案为:<span v-html="item.answer"></span>
                                </div>
                                <div class="remind" v-html="item.parse" v-if="testCompleted">
                                </div>
                                <div class="button_warp">
                                    <div class="subjective_submit" @click="zz(item.questionId)">
                                    </div>
                                    <div class="subjective_submit_box" v-if="cover_box[item.questionId]==1" @click="qq"></div>
                                </div>
                            </div>
                            <!--<div class="button_warp" v-if="!homeworkCompleted&&subjectiveAnswer[index].show">
                                <div class="subjective_submit Answerstart" v-show="!subjectiveAnswer[index].answer"
                                     @click="answerQuestions(item.questionId, item.questionContent, item.questionPic)">
                                </div>
                                <div class="subjective_submit Answermodify" v-show="subjectiveAnswer[index].answer"
                                     @click="modifyAnswer(item.questionId, item.questionContent, item.questionPic)">
                                </div>
                            </div>-->
                            <board :subjectiveAnswer="subjectiveAnswer" :id="item.questionId" v-show="subjectiveAnswer[index].answer"/>
                        </div>
                    </scroll-content>
                </swiper-slide>
            </swiper>
            <div class="footer" v-if="pageShow">
                <div class="score">
                    <div @click="score">
                        得分:&nbsp;{{scores}}&nbsp;
                        <span class="iconfont edit">&#xe60c;</span>
                    </div>
                    <mt-popup v-model="popupVisible">
                        <div class="popup_warp" v-if="inputState">
                            <div class="title">请输入分数</div>
                            <input class="inputScore" type="text" v-model="fraction" />
                            <div class="operation">
                                <div @click="determine">是</div>
                                <div @click="signOut">否</div>
                            </div>
                        </div>
                        <div class="warning_warp" v-if="warningState">
                            <div class="img_warp">
                                <img src="../../../../../public/images/warning.png">
                            </div>
                            <div class="title">警告</div>
                            <div class="text">您输入的分数有误</div>
                            <div class="close" @click="upperLevel">知道了</div>
                        </div>
                    </mt-popup>
                </div>
                <!--<div class="next" @click="next" v-show="buttonSate"></div>-->
                <div class="submit" @click="submited" v-show="buttonSate"></div>
            </div>
        </div>
        <div class="textmessage" v-if="textmessage">
            此考试没有主观题
        </div>
        <loading v-if="loading"/>
    </div>
</template>

<script>
    import classroomHeader from "../../../../components/public/PublicHeader"
    import board from "../../../../components/board/MultiBoard"
    import Loading from '../../../../components/public/Loading'
    import ScrollContent from '../../../../components/public/ScrollContent'
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import {
        getPicByString,
        sendPicByString,
        sendAnswer
    } from "@/api/teacher/test";
    import PopupPic from "@/components/topicList/PopupPic";
    import { Toast,Indicator } from "mint-ui";
    import html2canvas from 'html2canvas';

    let vm = null;
    export default {
        components: {
            classroomHeader,
            board,
            Loading,
            PopupPic,
            ScrollContent
        },
        data() {
            return {
                textmessage : false,
                objectiveAnswerbtn:false,
                loading: true,                      //加载状态
                pageShow: false,                    //页面显示状态
                headers: {                           //头部标题显示
                    title: '',
                    url: '/teststudentlist'
                },
                jump: {name: '转至客观题', url: '/testStudentObjective'},
                mescrollValue: {up: false, down: false},        //是否需要下拉上拉加载数据
                swiperOption: {
                    notNextTick: true,
                    //循环
                    loop: false,
                    //设定初始化时slide的索引
                    initialSlide: 0,
                    //自动播放
                    // autoplay: true,
                    // autoplay: {
                    //     delay: 3000,
                    //     stopOnLastSlide: false,
                    //     disableOnInteraction: true,
                    // },
                    // 设置轮播
                    //   effect : 'flip',
                    //滑动速度
                    speed: 800,
                    //滑动方向
                    direction: "horizontal",
                    //小手掌抓取滑动
                    // grabCursor : true,
                    //滑动之后回调函数
                    on: {
                        transitionEnd: function() {
                            //console.log(this.realIndex);
                            //console.log(vm.subjectiveAnswer);
                            //console.log(vm.subjectiveAnswer[this.realIndex]);
                            vm.scores = vm.fraction = vm.subjectiveAnswer[this.realIndex].score;
                        },
                        /*slideChange: function(){
                            //console.log(this.activeIndex);
                            //console.log(this.realIndex);
                        },
                        touchMoveOpposite(event){
                            console.log("touchMoveOpposite");
                        },
                        touchMove: function(event){
                            console.log("touchMove");
                            if(!vm.correction){
                                Toast({
                                    message: "请完成当前页面的修改和提交！",
                                    position: "bottom",
                                    duration: 1000
                                });
                            }
                        },*/
                    },
                    //左右点击
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                    }
                    //分页器设置
                    //   pagination: {
                    //       el: '.swiper-pagination',
                    //       clickable :true
                    //   }
                },
                subjectiveId: '',                   //主观题id
                subjectiveAnswer: [],
                buttonSate: false, //控制button显示
                scores: "", //分数
                popupVisible: false, //弹出层状态
                inputState: false, //输入层状态
                warningState: false, //错误层状态
                fraction: "", //输入框的分数
                cover_box: [],
                correction: true,
                answerId: "", //问题答案id
                picForSubjective: "", //图片上传到服务器的地址
            }
        },
        watch: {
            /*subjective: {
                handler() {
                    for (let i = 0; i < this.subjective.length; i++) {
                        this.subjectiveAnswer.push({id: this.subjective[i].id, answer: ''})
                    }
                    console.log("here1");
                    console.log(this.subjectiveAnswer);
                },
                //immediate: true,
                deep: true
            },*/
            /*boardImg(val) {
                let _this = this;
                _this.subjectiveAnswer.forEach((answer, index) => {
                    if (answer.id === _this.subjectiveId) {
                        answer.answer = val.data;
                        this.$set(_this.subjectiveAnswer, index, answer);
                    }
                });
                Indicator.open({
                    text: '答案提交中...',
                    spinnerType: 'fading-circle'
                });
                /!*console.log("here2");
                console.log(_this.subjectiveAnswer);*!/
                //主观题答案存根
                sendPicByString(val.data)
                    .then(res => {
                        Toast({
                            message: "图片存储成功！",
                            position: "middle",
                            duration: 1000
                        });
                        let sub = res.data.data;
                        //提交主观题答案
                        sendSubjectiveAnswer(
                            _this.homeworkId,
                            _this.subjectiveId,
                            sub
                        )
                            .then(res => {
                                console.log(res);
                                Toast({
                                    message: "答案提交成功！",
                                    position: "middle",
                                    duration: 1000
                                });
                                Indicator.close();
                                /!*for(let i = 0; i < _this.homeworkSubjectiveQs.length; i++){
                                    if(_this.homeworkSubjectiveQs[i].questionId === _this.subjectiveId){
                                        if(_this.homeworkSubjectiveQs[i].answerModelForStudent){
                                            _this.homeworkSubjectiveQs[i].answerModelForStudent.stubForSubjective = sub;
                                        }else{
                                            let answer = {stubForSubjective:sub};
                                            _this.homeworkSubjectiveQs[i].answerModelForStudent = answer;
                                        }
                                        store.commit('SET_HOMEWORKSUBJECTIVEQS', _this.homeworkSubjectiveQs);
                                        break;
                                    }
                                }*!/
                            })
                            .catch(err => {
                                Toast({
                                    message: "答案提交失败！",
                                    position: "middle",
                                    duration: 1000
                                });
                                Indicator.close();
                                console.log(err);
                            });
                    })
                    .catch(err => {
                        Toast({
                            message: "图片存储失败！",
                            position: "middle",
                            duration: 1000
                        });
                        console.log(err);
                    });
            }*/
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            },
            //vuex 调用
            ...mapGetters([
                //'isBoard',
                //'isBlueTooth',
                'boardImg',
                'testId',
                'testName',
                'testCompleted',
                'testSubjectiveQs'
            ])
        },
        created() {
            vm = this;
        },
        mounted() {
            this.getSubjectiveWork();
        },
        methods: {
            qq() {
                this.bse();
                $(".answer"+this.subjectiveId).jSignature("disable");
            },
            zz(id) {
                this.swiper.allowSlideNext = false;
                this.swiper.allowSlidePrev = false;
                this.subjectiveId = id;
                this.$set(this.cover_box, this.subjectiveId, 1);
                this.$forceUpdate();
                this.correction = false
                $(".answer"+this.subjectiveId).jSignature({
                    width: "100%",
                    height: "100%",
                    color: 'red',
                    backcolor:'blue',
                    cssclass:'backcolor',
                    lineWidth: 1
                });
                $(".answer"+this.subjectiveId).jSignature("enable");
            },
            // bse
            bse() {
                Indicator.open({
                    text: '答案提交中...',
                    spinnerType: 'fading-circle'
                });
                let self = this;
                let datapair = $(".answer"+this.subjectiveId).jSignature("getData");
                //console.log(this.subjectiveAnswer);
                for (let i = 0; i < this.subjectiveAnswer.length; i++) {
                    if (this.subjectiveAnswer[i].id === this.subjectiveId && this.subjectiveAnswer[i].answer) {
                        this.answerId = this.subjectiveAnswer[i].answerId;
                        this.imgawer = this.subjectiveAnswer[i].answer;
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        var imgObj = new Image();
                        imgObj.setAttribute("crossOrigin", "anonymous");
                        imgObj.src = "data:image/png;base64,"+self.imgawer
                        imgObj.onload = function() {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            console.log(this.width,this.height)
                            ctx.drawImage(this, 0, 0);
                            var imgq = new Image();
                            imgq.setAttribute("crossOrigin", "anonymous");
                            imgq.src = datapair;
                            imgq.onload = function() {
                                //console.log(this.width,this.height)
                                //ctx.drawImage(this, 0, 0,772,1000);
                                //ctx.drawImage(this, 0, 0,1200,1652);
                                ctx.drawImage(this, 0, 0,canvas.width,canvas.height);
                                var imgq = canvas.toDataURL("image/png", 0.5);
                                let img = imgq.split("data:image/png;base64,")[1];
                                sendPicByString(img)
                                    .then(res => {
                                        self.picForSubjective = res.data.data;
                                        //console.log("成功");
                                        self.correction = true;
                                        self.swiper.allowSlideNext = true;
                                        self.swiper.allowSlidePrev = true;
                                        //self.cover_box[self.subjectiveId] = 0;
                                        self.$set(self.cover_box, self.subjectiveId, 0);
                                        self.$forceUpdate();
                                        Toast({
                                            message: "储存图片成功",
                                            position: "bottom"
                                        });
                                        self.buttonSate = true;
                                        Indicator.close();
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        Toast({
                                            message: "储存图片失败",
                                            position: "bottom"
                                        });
                                        self.buttonSate = true;
                                        Indicator.close();
                                    });
                            };
                        }
                        break;
                    }
                }
            },
            //触发弹出层
            score() {
                this.popupVisible = true;
                this.inputState = true;
            },
            //弹出层确定
            determine() {
                this.inputState = false;
                // this.warningState = true;
                if (this.fraction !== "" && (/(^[1-9]\d*$)/.test(this.fraction))) {
                    this.popupVisible = false;
                    this.inputState = false;
                    this.scores = this.fraction;
                } else {
                    this.warningState = true;
                }
            },
            //弹出层退出
            signOut() {
                this.popupVisible = false;
                this.inputState = false;
                this.warningState = false;
            },
            //弹出层确定错误
            upperLevel() {
                this.inputState = true;
                this.warningState = false;
            },
            //提交
            submited() {
                let self = this;
                //console.log(self.picForSubjective)
                if (self.correction || self.scores) {
                    try {
                        sendAnswer(
                            self.subjectiveId,
                            self.answerId,
                            self.scores,
                            self.picForSubjective,
                        ).then(res => {
                            if(res.data.code==='0010'){
                                Toast({
                                    message: "提交成功",
                                    position: "bottom"
                                });
                                self.updateQuestionsInPage();
                            }else{
                                console.log(res.data.msg);
                                Toast({
                                    message: "提交失敗",
                                    position: "bottom"
                                });
                            }
                        });
                    } catch (e) {
                        Toast({
                            message: "提交失敗",
                            position: "bottom"
                        });
                    }
                } else {
                    Toast({
                        message: "请确认批改或调整分数后再提交",
                        position: "bottom"
                    });
                }
            },
            getSubjectiveWork() {
                this.headers.title = this.testName;
                for (let i = 0; i < this.testSubjectiveQs.length; i++) {
                    this.subjectiveAnswer.push({id: this.testSubjectiveQs[i].questionId, answerId: '', answer: '', show: false, score: ''})
                    this.cover_box[this.testSubjectiveQs[i].questionId] = 0;
                }
                if(this.subjectiveAnswer.length>0){
                    //this.initCollection(0);
                    this.pageShow = true;
                    this.loading = false;
                    this.textmessage = false
                    this.initImgs();
                }else {
                    this.pageShow = true;
                    this.loading = false;
                    this.textmessage = true
                }
            },
            initImgs(){
                for (let i = 0; i < this.testSubjectiveQs.length; i++) {
                    this.getSubjectiveImg(this.testSubjectiveQs[i]);
                }
            },
            async getSubjectiveImg(t){
                //console.log(t);
                let self =this;
                if (t&&t.answerModelForStudent || t.answerModelForTeacher) {
                    let img = await getPicByString(
                        t.answerModelForTeacher
                            ? t.answerModelForTeacher.stubForSubjective
                            : t.answerModelForStudent.stubForSubjective
                    );
                    let i = self.subjectiveAnswer.findIndex(x => {
                        return x.id === t.questionId;
                    });
                    //console.log(i);
                    if(i != -1){
                        let answer = self.subjectiveAnswer[i];
                        if (img.data.data) {
                            answer.answerId = t.answerModelForStudent.answerId;
                            answer.answer = img.data.data.content;
                            answer.score = t.answerModelForStudent.subjectiveScore;
                            if(i === 0){
                                self.scores = self.fraction = t.answerModelForStudent.subjectiveScore;
                            }
                            answer.show = true;
                            self.$set(self.subjectiveAnswer, i, answer);
                        }
                    }
                }else {
                    let i = self.subjectiveAnswer.findIndex(x => {
                        return x.id === t.questionId;
                    });
                    if(i != -1){
                        let answer = self.subjectiveAnswer[i];
                        answer.show = true;
                        self.$set(self.subjectiveAnswer, i, answer);
                    }
                }
            },
            updateQuestionsInPage(){
                let self = this;
                let i = this.subjectiveAnswer.findIndex(x=>{
                    return x.id === self.subjectiveId;
                })
                if(i != -1){
                    let answer = self.subjectiveAnswer[i];
                    answer.score = self.scores;
                    self.$set(self.subjectiveAnswer, i, answer);
                }
                this.subjectiveId = '';
                this.answerId = '';
                this.picForSubjective = '';
                //this.scores = '';
                //self.fraction = '';
                this.buttonSate = false;
            }
            /*
            //开始答题
            answerQuestions(id, content, pic) {
                if(!this.objectiveAnswerbtn){
                    this.objectiveAnswerbtn = true;
                }else{
                    return;
                }
                Indicator.open({
                    text: "正在启动手写板...",
                    spinnerType: "fading-circle"
                });
            let self = this;
            document.getElementById('tp'+id).setAttribute('style', 'letter-spacing: 4px !important;padding-top: 8px !important');
            html2canvas(document.getElementById('tp'+id),{
                useCORS: true,
                logging:false,
                ignoreElements(element){
                    let type = element.type
                    if ( type && type === 'text' ) {
                        //console.log(element);
                        return true;
                    }
                    return false;
                }
                //backgroundColor: null
            }).then((canvas) => {
                let dataURL = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
                //console.log(dataURL)
                document.getElementById('tp'+id).setAttribute('style', 'letter-spacing:"";padding-top: ""');
                self.subjectiveId = id;
                window.HandwrittenBoard.isConnect(
                    function(res) {
                        console.log(res);
                    },
                    function(res) {
                        console.log(res);
                        //Indicator.close();
                        switch (res.data.status) {
                            case 0:
                                if(!localStorage.getItem("bluetooth")) store.commit("SET_BLUETOOTH", true);
                                window.HandwrittenBoard.exploration();
                                console.log("第一个");
                                self.objectiveAnswerbtn = false;
                                break;
                            case 2:
                                var q = {content:dataURL,pic:pic,base64img:""};
                                window.HandwrittenBoard.getBase64img(q);
                                console.log("第二个");
                                self.objectiveAnswerbtn = false;
                                break;
                            default:
                                break;
                        }
                    }
                );
            });
            },
            //修改答案
            modifyAnswer(id, content, pic) {
                if(!this.objectiveAnswerbtn){
                    this.objectiveAnswerbtn = true;
                }else{
                    return;
                }
                Indicator.open({
                    text: "正在启动手写板...",
                    spinnerType: "fading-circle"
                });
                let self = this;
                document.getElementById('tp'+id).setAttribute('style', 'letter-spacing: 4px !important;padding-top: 8px !important');
                html2canvas(document.getElementById('tp'+id),{
                    useCORS: true,
                    logging:false,
                    ignoreElements(element){
                        let type = element.type
                        if ( type && type === 'text' ) {
                            console.log(element);
                            return true;
                        }
                        return false;
                    }
                    //backgroundColor: null
                }).then((canvas) => {
                    let dataURL = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
                    //console.log(dataURL)
                    document.getElementById('tp'+id).setAttribute('style', 'letter-spacing:"";padding-top: ""');
                    self.subjectiveId = id;
                    let answer = "";
                    for (let i = 0; i < this.subjectiveAnswer.length; i++) {
                        if (id === this.subjectiveAnswer[i].id) {
                            answer = this.subjectiveAnswer[i].answer;
                        }
                    }
                    window.HandwrittenBoard.isConnect(
                        function(res) {
                            console.log(res);
                        },
                        function(res) {
                            console.log(res);
                            //Indicator.close();
                            switch (res.data.status) {
                                case 0:
                                    if(!localStorage.getItem("bluetooth")) store.commit("SET_BLUETOOTH", true);
                                    window.HandwrittenBoard.exploration();
                                    console.log("第一个");
                                    self.objectiveAnswerbtn = false;
                                    break;
                                case 2:
                                    var q = {content:dataURL,pic:pic,base64img:answer};
                                    window.HandwrittenBoard.getBase64img(q);
                                    console.log("第二个");
                                    self.objectiveAnswerbtn = false;
                                    break;
                                default:
                                    break;
                            }
                        }
                    );
                });
            },
            initCollection(index){
                //console.log(index);
                //console.log(this.homeworkSubjectiveQs[index]);
                if(this.homeworkSubjectiveQs[index].favor){
                    this.Collectionsrc = require('../../../assets/已收藏.png');
                }else{
                    this.Collectionsrc = require('../../../assets/未收藏.png');
                }
            }*/
        }
    }
</script>

<style lang="scss" scoped>
    .subjectiveWork {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        overflow: auto;
        .jump {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 2.5rem;
            color: rgba(255, 255, 255, 1);
            font-size: 18px;
            &:before {
                content: " ";
                display: inline-block;
                height: 12px;
                width: 12px;
                border-width: 2px 2px 0 0;
                border-color: #ffffff;
                border-style: solid;
                -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
                position: absolute;
                top: 50%;
                right: -.8rem;
                margin-top: -2px;
            }
        }
        .subjectiveContent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            .swiper-container {
                width: 100%;
                height: 100%;
                overflow-y: scroll;
                .mescroll {
                    box-sizing: border-box;
                    position: absolute;
                    top: 0rem;
                    bottom: 0;
                    padding: 0rem 1rem 0rem;
                    padding-bottom: 6rem;
                    height: auto !important;
                    background-color: rgba(255, 255, 255, 1);
                    .subjective_warp {
                        width: 100%;
                        height: 100%;
                        padding: 4.29rem 1.14rem 1.14rem;
                        box-sizing: border-box;
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
                            .button_warp {
                                padding-bottom: 60px;
                                position: relative;
                                height: 2.7rem;
                                .subjective_submit {
                                    position: absolute;
                                    right: 3.71rem;
                                    width: 154px;
                                    height: 46px;
                                    border-radius: 1.145rem;
                                    font-size: 18px;
                                    z-index: 100;
                                    background: url('../../../../assets/按钮.png') no-repeat;
                                    background-position: -135px -922px;
                                }
                                .subjective_submit:active {
                                    background: url('../../../../assets/按钮.png') no-repeat;
                                    background-position: -592px -922px;
                                }
                                .subjective_submit_box {
                                    position: absolute;
                                    right: 3.71rem;
                                    width: 154px;
                                    height: 46px;
                                    border-radius: 1.145rem;
                                    font-size: 18px;
                                    z-index: 101;
                                    background: url('../../../../assets/按钮.png') no-repeat;
                                    background-position: -135px -826px;
                                }
                                .subjective_submit_box:active {
                                    background: url('../../../../assets/按钮.png') no-repeat;
                                    background-position: -592px -826px;
                                }
                            }
                            .centertext {
                                text-align: center;
                                margin-top: 1rem;
                                font-size: 20px;
                                color: #3d72fe;
                                font-weight: 600;
                            }
                            .topic_warp {
                                position: relative;
                                padding-top: 5px;
                                .title {
                                    font-size: 24px;
                                    color: #69b482;
                                }
                                .topic {
                                    color: #353535;
                                    font-size: 22px;
                                    line-height: 34px;
                                    padding: 0 2.57rem;
                                }
                            }
                        }
                        .button_warp {
                            padding-bottom: 20px;
                            position: relative;
                            height: 2.7rem;
                            .subjective_submit {
                                position: absolute;
                                right: 3.71rem;
                                border-radius: 1.145rem;
                                color: #9A84FF;
                                font-size: 18px;
                            }
                            .Answerstart {
                                width: 154px;
                                height: 46px;
                                //background: url('../../../assets/按钮.png') no-repeat;//
                                background-position: -135px -1321px;
                            }
                            .Answerstart:active{
                                //background: url('../../../assets/按钮.png') no-repeat;
                                background-position: -592px -1321px;
                            }
                            .Answermodify {
                                width: 154px;
                                height: 46px;
                                //background: url('../../../assets/按钮.png') no-repeat;//
                                background-position: -135px -623px;
                            }
                            .Answermodify:active{
                                //background: url('../../../assets/按钮.png') no-repeat;
                                background-position: -592px -623px;
                            }
                        }
                    }
                }
            }
            .footer {
                width: 100%;
                height: 6rem;
                padding: 0 4.86rem;
                box-sizing: border-box;
                position: fixed;
                bottom: 0;
                z-index: 999;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #fafafa;
                .score {
                    font-size: 24px;
                    .edit {
                        display: inline-block;
                        width: 1.43rem;
                        height: 1.43rem;
                        text-align: center;
                        line-height: 20px;
                        font-size: 20px;
                    }
                    .mint-popup {
                        background-color: #f7f7f7;
                        border-radius: 5px;
                        .popup_warp {
                            padding: 3.57rem 5.15rem 2.86rem;
                            .title {
                                text-align: center;
                                padding-bottom: 3.43rem;
                                color: #a2a2a2;
                                font-size: 20px;
                            }
                            .inputScore {
                                border: 1px solid #f7f7f7;
                                padding: 0.65rem 0.72rem;
                                margin-bottom: 3.43rem;
                                font-size: 20px;
                                color: #777777;
                                border-radius: 5px;
                                background-color: white;
                            }
                            .operation {
                                display: flex;
                                justify-content: space-between;
                                div {
                                    background-color: #f7f7f7;
                                    font-size: 20px;
                                    color: #777777;
                                }
                                div:nth-child(1) {
                                    color: #80d59c;
                                }
                            }
                        }
                        .warning_warp {
                            padding: 1.36rem 7.2rem 1.6rem;
                            text-align: center;
                            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
                            .img_warp {
                                width: 59px;
                                height: 56px;
                                margin: 0 auto;
                                padding-bottom: 1.86rem;
                                img {
                                    width: 100%;
                                }
                            }
                            .title {
                                padding-bottom: 1.36rem;
                                font-size: 24px;
                                color: #656565;
                            }
                            .text {
                                white-space: nowrap;
                                padding-bottom: 2.29rem;
                                font-size: 16px;
                                color: #a7a7a7;
                            }
                            .close {
                                padding: 1rem 2.5rem;
                                color: #8b8b8b;
                                font-size: 16px;
                                background-color: #e6ebf0;
                                border: 1px solid #e4e4e4;
                                box-sizing: border-box;
                            }
                        }
                    }
                }
                .next{
                    font-size: 18px;
                    // padding: 0.57rem 3.14rem;
                    // background-color: #9a84ff;
                    border-radius: 100px;
                    width: 186px;
                    height: 49px;
                    background: url('../../../../assets/按钮.png') no-repeat;
                    background-position: -135px -1822px;
                }
                .next:active {
                    background: url('../../../../assets/按钮.png') no-repeat;
                    background-position: -592px -1822px;
                }
                .submit {
                    font-size: 18px;
                    border-radius: 100px;
                    width: 162px;
                    height: 49px;
                    background: url('../../../../assets/按钮.png') no-repeat;
                    background-position: -135px -1009px;
                }
                .submit:active {
                    // box-shadow: 0 2px 6px 3px #7c6fd1;
                    // background-color: #7c6fd1;
                    background: url('../../../../assets/按钮.png') no-repeat;
                    background-position: -592px -1009px;
                }
            }
        }
    }
    .textmessage {
        margin-top: 80px;
        font-size: 24px;
        color: #666;
        text-align: center;
    }
</style>
