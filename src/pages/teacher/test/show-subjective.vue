<template>
    <div class="subjectiveShow">
        <classroom-header :header="header"/>
        <scroll-content ref="myscrollfull" :mescrollValue="mescrollValue">
            <div class="content" v-if="pageShow">
                <div class="subjective_warp">
                    <div class="topic_warp">
                        <div class="topic" v-html="subjectiveMsg.questionContent">
                            {{subjectiveMsg.questionContent}}
                        </div>
                    </div>
                    <PopupPic :questionPic="subjectiveMsg.questionPic"/>
                    <div class="button_warp">
                        <div class="subjective_submit" @click="zz(subjectiveMsg.questionId)">
                        </div>
                        <div class="subjective_submit_box" v-if="cover_box==1" @click="qq"></div>
                    </div>
                    <board :id="this.topicId" :subjectiveAnswer="subjectiveAnswer" />
                </div>
            </div>
        </scroll-content>
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
                                <img src="../../../../public/images/warning.png">
                            </div>
                            <div class="title">警告</div>
                            <div class="text">您输入的分数有误</div>
                            <div class="close" @click="upperLevel">知道了</div>
                        </div>
                    </mt-popup>
                </div>
                <div class="next" @click="next" v-show="buttonSate"></div>
                <div class="submit" @click="submited" v-show="buttonSate"></div>
            </div>
            <loading v-if="loading" />
    </div>
</template>

<!--课堂主观题-->

<script>
    import ClassroomHeader from "../../../components/public/PublicHeader";
    import ScrollContent from '../../../components/public/ScrollContent'
    import subjective from "../../../components/topicList/subjective";
    import PopupPic from "../../../components/teacherClassroom/PopupPicInHomework";
    import board from "../../../components/board/Board";
    import Loading from "../../../components/public/Loading";
    import {
        getPicByString,
        sendPicByString,
        sendAnswer
    } from "@/api/teacher/test";
    import { Toast, Indicator } from "mint-ui";
    import { mapGetters } from "vuex";
    import store from "@/store";

    export default {
        components: {
            ClassroomHeader,
            subjective,
            board,
            Loading,
            PopupPic,
            ScrollContent
        },
        data() {
            return {
                correction: false,
                imgawer:'',
                cover_box: 0,
                //图片URL
                picUrl: "",
                subjectiveId: "",
                loading: true, //加载状态
                pageShow: false, //内容状态
                mescrollValue: {up: false, down: false},        //是否需要下拉上拉加载数据
                header: {
                    //页面头部
                    title: '',
                    url: "/testquestions"
                },
                subjectiveTopic: [
                    {
                        //页面内容
                        id: 1,
                        type: "subjective",
                        title: "主观题-1",
                        content:
                            "有两根铁丝，第一根用去 米，第二根用去 ，剩下的一样长，两根铁丝和原来相比如何。"
                    }
                ],
                scores: "", //分数
                popupVisible: false, //弹出层状态
                inputState: false, //输入层状态
                warningState: false, //错误层状态
                subjectiveAnswer: [],
                subjectiveMsg: {},
                fraction: "", //输入框的分数
                answerId: "", //问题答案id
                picForSubjective: "", //图片上传到服务器的地址
                buttonSate: false, //控制button显示
                topicId: ''
            };
        },
        watch: {
            boardImg(val) {
                this.buttonSate = false;
                for (let i = 0; i < this.subjectiveAnswer.length; i++) {
                    if (this.subjectiveAnswer[i].id === this.subjectiveId) {
                        this.subjectiveAnswer[i].answer = val.data;
                        sendSubjectPicByString(val.data)
                            .then(res => {
                                this.picForSubjective = res.data.data.stubForSubjective;
                                Toast({
                                    message: "储存图片成功",
                                    position: "bottom"
                                });
                                this.buttonSate = true;
                            })
                            .catch(err => {
                                console.log(err);
                                Toast({
                                    message: "储存图片失败",
                                    position: "bottom"
                                });
                                this.buttonSate = true;
                            });
                    }
                }
            }
        },
        mounted() {
            /*this.pageShow = true;
            this.loading = false;*/
            this.getSubjectPic();
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                "studentId",
                'testQuestions',
                'testInitSlide'
            ])
        },
        methods: {
            qq() {
                this.bse();
                $(".answer").jSignature("disable");
            },
            zz(id) {
                this.subjectiveId = id;
                this.cover_box = 1;
                this.correction = false
                $(".answer").jSignature({
                    width: "100%",
                    height: "100%",
                    color: 'red',
                    backcolor:'blue',
                    cssclass:'backcolor',
                    lineWidth: 1
                });
                $(".answer").jSignature("enable");
            },
            getSubjectPic() {
                //获取题目基本信息
                this.subjectiveMsg = this.testQuestions[this.testInitSlide];
                this.topicId = this.subjectiveMsg.questionId;
                //console.log(this.subjectiveMsg);
                this.getImg();
                this.pageShow = true;
                this.loading = false;
            },
            //根据api的链接那图片路径
            async getImg() {
                let self = this;
                let stubForSubjective = undefined;
                if (self.subjectiveMsg.answerModelForStudent) {
                    stubForSubjective =
                        self.subjectiveMsg.answerModelForStudent[
                            self.subjectiveMsg.answerModelForStudent.findIndex(x => {
                                return x.studentId == self.studentId;
                            })
                            ];
                }
                if(stubForSubjective)
                    this.header.title = stubForSubjective.studentName;
                    if(stubForSubjective.subjectiveScore) this.fraction = stubForSubjective.subjectiveScore;
                    try {
                        let res = await getPicByString(
                            stubForSubjective.result === "PASS"
                                ? stubForSubjective.reviseForSubjective
                                : stubForSubjective.stubForSubjective
                        );
                        self.answerId = stubForSubjective.answerId;
                        if(res.data.code==='0050'){
                            Toast({
                                message: res.data.msg,
                                position: "bottom"
                            });
                            return;
                        }
                        //console.log(res.data.data);
                        self.picForSubjective = res.data.data.name;
                        if (res.data.data) {
                            self.picUrl = res.data.data.content;
                            self.subjectiveAnswer.push({ id: self.topicId, answer: self.picUrl });
                            self.buttonSate = true;
                            self.scores = self.fraction = stubForSubjective.subjectiveScore;
                            //console.log($(".topic_warp").outerHeight(true))
                            //console.log($(".button_warp").outerHeight(true))
                            $(".content").height(
                                ($(".topic_warp").outerHeight()
                                    +$(".button_warp").outerHeight(true)
                                    +$("#answer").height()+200)+"px");
                            //console.log($(".content").height())
                        }
                    } catch (e) {
                        console.log(e);
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
                            self.topicId,
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
            // bse
            bse() {
                Indicator.open({
                    text: '答案提交中...',
                    spinnerType: 'fading-circle'
                });
                let self = this;
                let datapair = $(".answer").jSignature("getData");
                //(this.subjectiveAnswer);
                for (let i = 0; i < this.subjectiveAnswer.length; i++) {
                    if (this.subjectiveAnswer[i].id === this.topicId && this.subjectiveAnswer[i].answer) {
                        this.imgawer = this.subjectiveAnswer[i].answer;
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        var imgObj = new Image();
                        imgObj.setAttribute("crossOrigin", "anonymous");
                        imgObj.src = "data:image/png;base64,"+self.imgawer
                        imgObj.onload = function() {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            //console.log(this.width,this.height)
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
                                        self.cover_box = 0
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
                /*
                    getSubjectPic(self.picForSubjective).then(res=>{
                        this.imgawer = res.data.data.content
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
                                console.log(this.width,this.height)
                                ctx.drawImage(this, 0, 0,772,1000);
                                var imgq = canvas.toDataURL("image/png", 0.5);
                                let img = imgq.split("data:image/png;base64,")[1];
                                for (let i = 0; i < self.subjectiveAnswer.length; i++) {
                                    if (self.subjectiveAnswer[i].id === self.subjectiveId) {
                                        // console.log(self.bseimg);
                                        sendSubjectPicByString(img)
                                            .then(res => {
                                                self.picForSubjective = res.data.data.stubForSubjective;
                                                console.log("成功");
                                                self.correction = true;
                                                self.cover_box = 0
                                                Toast({
                                                    message: "储存图片成功",
                                                    position: "bottom"
                                                });
                                                self.buttonSate = true;
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                Toast({
                                                    message: "储存图片失败",
                                                    position: "bottom"
                                                });
                                                self.buttonSate = true;
                                            });
                                    }
                                }
                            };
                        };
                    })
                */
            },
            next(){
                let self = this;
                let stubForSubjective = undefined;
                if (self.subjectiveMsg.answerModelForStudent) {
                    stubForSubjective =
                        self.subjectiveMsg.answerModelForStudent[
                            self.subjectiveMsg.answerModelForStudent.findIndex(x => {
                                return x.studentId != self.studentId&&!x.reviseForSubjective&&x.result!="PASS";
                            })
                            ];
                }
                //console.log(stubForSubjective);
                if(stubForSubjective){
                    store.commit('SET_STUDENTID', stubForSubjective.studentId);
                    this.cover_box = 0;
                    this.getSubjectPic();
                    if(this.subjectiveId) $(".answer").jSignature("reset");
                }else{
                    Toast({
                        message: "最后一个",
                        position: "bottom"
                    });
                }
            },
            updateQuestionsInPage(){
                //console.log(this.testQuestions);
                for(let i = 0; i < this.testQuestions.length; i++){
                    let stop = false;
                    if(this.testQuestions[i].questionId===this.topicId){
                        for(let j = 0; j < this.testQuestions[i].answerModelForStudent.length; j++){
                            if(this.testQuestions[i].answerModelForStudent[j].studentId===this.studentId){
                                this.testQuestions[i].answerModelForStudent[j].reviseForSubjective = this.picForSubjective;
                                this.testQuestions[i].answerModelForStudent[j].subjectiveScore = this.scores;
                                this.testQuestions[i].answerModelForStudent[j].result = 'PASS';
                                //console.log(this.testQuestions[i].answerModelForStudent[j])
                                store.commit('SET_TESTQUESTIONS', this.testQuestions);
                                stop = true;
                                break;
                            }
                        }
                        if(stop) break;
                    }
                }
                this.topicId = '';
                this.answerId = '';
                this.picForSubjective = '';
                //this.scores = '';
                //this.fraction = '';
                //this.buttonSate = false;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .subjectiveShow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        .jSignature {
            transform: rotate(30deg)
        }
        .mescroll {
            box-sizing: border-box;
            position: absolute;
            top: 0;
            bottom: 0;
            //padding: 3.5rem 4.86rem 3.14rem;
            height: auto !important;
            background-color: rgba(255, 255, 255, 1);
            .content {
                position: absolute;
                top: 0;
                bottom: 6rem;
                width: 100%;
                box-sizing: border-box;
                .subjective_warp {
                    width: 100%;
                    height: 100%;
                    padding: 4.19rem 1.14rem 1.14rem;
                    margin-bottom: 13px;
                    background-color: white;
                    box-sizing: border-box;
                    .topic_warp {
                        position: relative;
                        .topic {
                            color: #353535;
                            font-size: 18px;
                            line-height: 34px;
                            padding: 0 2.57rem;
                        }
                    }
                    .button_warp {
                        padding-bottom: 20px;
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
                            background: url('../../../assets/按钮.png') no-repeat;
                            background-position: -135px -922px;
                        }
                        .subjective_submit:active {
                            background: url('../../../assets/按钮.png') no-repeat;
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
                            background: url('../../../assets/按钮.png') no-repeat;
                            background-position: -135px -826px;
                        }
                        .subjective_submit_box:active {
                            background: url('../../../assets/按钮.png') no-repeat;
                            background-position: -592px -826px;
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
                background: url('../../../assets/按钮.png') no-repeat;
                background-position: -135px -1822px;
            }
            .next:active {
                background: url('../../../assets/按钮.png') no-repeat;
                background-position: -592px -1822px;
            }
            .submit {
            font-size: 18px;
            border-radius: 100px;
            width: 162px;
            height: 49px;
            background: url('../../../assets/按钮.png') no-repeat;
            background-position: -135px -1009px;
            }
            .submit:active {
            // box-shadow: 0 2px 6px 3px #7c6fd1;
            // background-color: #7c6fd1;
            background: url('../../../assets/按钮.png') no-repeat;
            background-position: -592px -1009px;
            }
        }
    }
</style>
