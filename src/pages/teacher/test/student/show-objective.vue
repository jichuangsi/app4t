<template>
    <div class="objectiveWork">
        <classroom-header :header="header" :jump="jump"/>
        <div class="objective_content">
            <div class="objectiveTitle">
                <span class="icon"></span>
                <span class="title">考试信息</span>
            </div>
            <div class="student_msg">
                <div class="msg">
                    <div class="info" v-html="testInfo"></div>
                    <!--<div class="class"><span>班级</span>&nbsp;初一（1）班</div>-->
                </div>
                <div class="name"><span>学生姓名：</span><span>{{this.studentName}}</span><span v-show="!testCompleted">，未完成。</span><span v-show="testCompleted">，已完成。</span></div>
                <div class="objectiveScore"><span>客观题统计：</span><span>共{{this.objectiveTotal}}题</span><span v-show="!testCompleted">，已提交{{this.objectiveCorrect}}题</span><span v-show="testCompleted">，答对{{this.objectiveCorrect}}题</span></div>
                <div class="subjectiveScore"><span>主观题统计：</span><span>共{{this.subjectiveTotal}}题</span><span v-show="!testCompleted">，已提交{{this.subjectiveCorrect}}题</span><span v-show="testCompleted">，批改{{this.subjectiveCorrect}}题</span></div>
                <div class="clearfix">
                    <div class="right submit" @click.stop.passive="next"></div>
                </div>
            </div>
            <div class="topic_warp">
                <div class="objective_warp" v-for="(item,index) in this.testObjectiveQs" :key="index">
                    <common-objective :objective="item" :index="index" :completed="testCompleted"/>
                </div>
            </div>
        </div>
        <loading v-if="loading"/>
    </div>
</template>

<!--客观题作业-->

<script>
    import classroomHeader from "../../../../components/public/PublicHeader"
    import Loading from '../../../../components/public/Loading'
    import commonObjective from "../../../../components/topicList/commonObjective"
    import {mapGetters} from 'vuex'
    import store from '@/store'
    import {getStudentTest} from "@/api/teacher/test"
    import {MessageBox,Indicator,Toast} from 'mint-ui';

    export default {
        components: {
            classroomHeader,
            commonObjective,
            Loading
        },
        data() {
            return {
                header: {                       //头部标题
                    title: '',
                    url: '/teststudentlist'
                },
                loading: true,                 //加载状态
                pageShow: false,               //页面状态
                jump: {name: '转至主观题', url: '/testStudentSubjective'},              //头部多加一个按钮
                objectiveAnswer: [],
                testInfo: '',
                objectiveTotal: 0,
                objectiveCorrect: 0,
                subjectiveTotal: 0,
                subjectiveCorrect: 0,
                objectiveSubmitted: [],
                studentId: '',
                studentName: ''
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'testId',
                'testName',
                'testCompleted',
                'testObjectiveQs',
                'testSubjectiveQs',
                'testStudentId',
                'testStudentName',
                'testStudents',
                //'homeworkList'
            ])
        },
        mounted() {
            this.studentId = this.$route.query.studentId?this.$route.query.studentId:this.testStudentId;
            this.studentName = this.$route.query.studentName?this.$route.query.studentName:this.testStudentName;
            if(this.$route.query.studentId) store.commit('SET_TESTSTUDENTID', this.studentId);
            if(this.$route.query.studentName) store.commit('SET_TESTSTUDENTNAME', this.studentName);
            this.getStudentTestDetail();
        },
        methods: {
            getStudentTestDetail(){
                getStudentTest(this.testId, this.studentId).then(res=>{
                    //console.log(res.data.data);
                    if(res.data.code!=='0010'){
                        //console.log(res.data.msg);
                        Toast({
                            message:  "加载出错，请重新进入！",
                            position: "middle",
                            duration: 1000
                        });
                        return;
                    }
                    let objectiveQs = [];
                    let subjectiveQs = [];
                    let count = 0;
                    let count1 = 0;
                    let self = this;
                    res.data.data.questions.forEach((q, index) => {
                        switch (q.questionType) {
                            case 'objective' : {
                                objectiveQs.push(q);
                                if(res.data.data.completed&&q.answerModelForStudent
                                    &&q.answerModelForStudent.answerForObjective
                                    &&q.answerModelForStudent.result==='CORRECT'){
                                    count++;
                                    this.objectiveAnswer.push({ id: q.questionId, answer: q.answerModelForStudent.answerForObjective, modify: false });
                                }else if(!res.data.data.completed&&q.answerModelForStudent
                                    &&q.answerModelForStudent.answerForObjective){
                                    count++;
                                    this.objectiveSubmitted.push(q.questionId);
                                    this.objectiveAnswer.push({ id: q.questionId, answer: q.answerModelForStudent.answerForObjective, modify: false });
                                }else{
                                    this.objectiveAnswer.push({ id: q.questionId, answer: "", modify: false });
                                }
                                break;
                            }
                            case 'subjective' : {
                                subjectiveQs.push(q);
                                if(res.data.data.completed&&q.answerModelForTeacher
                                    &&q.answerModelForTeacher.stubForSubjective){
                                    count1++;
                                }else if(!res.data.data.completed&&q.answerModelForStudent
                                    &&q.answerModelForStudent.stubForSubjective){
                                    count1++;
                                }
                                break;
                            }
                        }
                    });
                    this.objectiveCorrect = count;
                    this.subjectiveCorrect = count1;
                    this.objectiveTotal = objectiveQs.length;
                    this.subjectiveTotal = subjectiveQs.length;
                    //console.log(this.objectiveCorrect);
                    //console.log(this.objectiveTotal);
                    //console.log(objectiveQs);
                    //console.log(subjectiveQs);
                    store.commit('SET_TESTOBJECTIVEQS', objectiveQs);
                    store.commit('SET_TESTSUBJECTIVEQS', subjectiveQs);
                    store.commit('SET_TESTNAME', res.data.data.testName);
                    store.commit('SET_TESTCOMPLETED', res.data.data.completed);
                    this.header.title = res.data.data.testName;
                    this.testInfo = res.data.data.testInfo;
                    this.pageShow = true;
                    this.loading = false;
                }).catch(err=>{
                    //console.log(err);
                })
            },
            next(){
                //console.log(this.testStudents);
                let i = this.testStudents.findIndex(x=>{
                   return x.studentId ===  this.studentId;
                });
                if(i != -1){
                    if(i === this.testStudents.length - 1){
                        this.studentId = this.testStudents[0].studentId;
                        this.studentName = this.testStudents[0].studentName;
                        store.commit('SET_TESTSTUDENTID', this.studentId);
                        store.commit('SET_TESTSTUDENTNAME', this.studentName);
                        this.getStudentTestDetail();
                    }else{
                        if(this.testStudents[i+1].completedTime>0){
                            this.studentId = this.testStudents[i+1].studentId;
                            this.studentName = this.testStudents[i+1].studentName;
                            store.commit('SET_TESTSTUDENTID', this.studentId);
                            store.commit('SET_TESTSTUDENTNAME', this.studentName);
                            this.getStudentTestDetail();
                        }else{
                            this.studentId = this.testStudents[0].studentId;
                            this.studentName = this.testStudents[0].studentName;
                            store.commit('SET_TESTSTUDENTID', this.studentId);
                            store.commit('SET_TESTSTUDENTNAME', this.studentName);
                            this.getStudentTestDetail();
                        }
                    }
                    this.$forceUpdate();
                }
            }
            //提交作业弹出层点击是操作
            /*async determine() {
                let res = await submitHomework(this.homeworkId);
                //console.log(res.data);
                if(res.data.code === '0010'){
                    //console.log(132)
                    for(let i = 0; i < this.homeworkList.length; i++){
                        if(this.homeworkList[i].homeworkId===this.homeworkId){
                            this.homeworkList[i].completed = true;
                            break;
                        }
                    }
                    store.commit('SET_HOMEWORK', this.homeworkList);
                    //store.commit('SET_HOMEWORKCOMPLETED', true);
                    await getHomework(this.homeworkId).then(res=>{
                        let count = this.objectiveCorrect = 0;
                        if(res.data.code==='0010'){
                            res.data.data.questions.forEach((q, index) => {
                                if (q.questionType==='objective') {
                                    if(this.homeworkCompleted&&q.answerModelForStudent
                                        &&q.answerModelForStudent.answerForObjective
                                        &&q.answerModelForStudent.result==='CORRECT'){
                                        count++;
                                    }
                                }
                            })
                            this.objectiveCorrect = count;
                        }
                    });
                }else{
                    Toast({
                        message: "提交失败！",
                        position: "middle",
                        duration: 1000
                    });
                }
                //this.popupVisible = false;
            },
            //点击提交按钮显示
            show() {
                MessageBox.confirm('',
                    {message: '是否确定提交全部题目？',showCancelButton: true
                }).then(action => {
                    this.determine();
                }).catch(err => {
                    console.log(err)
                });
                //this.popupVisible = true;
                //this.$refs.objective.show();
            },
            // 单选
            selectAnswer(id, title) {
                if(this.homeworkCompleted) return;
                for (let i = 0; i < this.objectiveAnswer.length; i++) {
                    if (this.objectiveAnswer[i].id === id
                            &&title&&this.objectiveAnswer[i].answer!=title) {
                        this.objectiveAnswer[i].answer = title;
                        this.objectiveAnswer[i].modify = true;
                        //console.log(this.objectiveAnswer[i].answer)
                        //this.sendObjective(this.objectiveAnswer[i].id, this.objectiveAnswer[i].answer);
                        break;
                    }
                }
            },
            // 多选题答案
            Multipleanswers(id, title){
                if(this.homeworkCompleted) return;
                for (let i = 0; i < this.objectiveAnswer.length; i++) {
                    if (this.objectiveAnswer[i].id === id
                            &&title&&this.objectiveAnswer[i].answer!=title) {
                        this.objectiveAnswer[i].answer = title;
                        this.objectiveAnswer[i].modify = true;
                        //console.log(this.objectiveAnswer[i].answer);
                        //this.sendObjective(this.objectiveAnswer[i].id, this.objectiveAnswer[i].answer);
                        break;
                    }
                }
            },
            //客观题点击提交
            objectiveSubmit(id) {
                for (let i = 0; i < this.objectiveAnswer.length; i++) {
                    //答案数组id跟当前选中题目id一致
                    if (this.objectiveAnswer[i].id === id) {
                        //当前选中题目的答案为空
                        if (!this.objectiveAnswer[i].answer) {
                            return false;
                        }
                        if(!this.objectiveAnswer[i].modify){
                            console.log(this.objectiveAnswer);
                            Toast({
                                message: "已提交相同答案！",
                                position: "middle",
                                duration: 1000
                            });
                            return false;
                        }
                        this.sendObjective(this.objectiveAnswer[i].id, this.objectiveAnswer[i].answer);
                    }
                }
            },
            //提交客观题答案
            async sendObjective(id, answer) {
                //客观题答案提交
                let res = await sendObjectiveAnswer(this.homeworkId, id, answer);
                //console.log(res.data);
                if(res.data.code!="0010"){
                    Toast({
                        message: "答案提交失败！",
                        position: "middle",
                        duration: 1000
                    });
                }else {
                     Toast({
                        message: "答案提交成功！",
                        position: "middle",
                        duration: 1000
                    });
                    let i = this.objectiveSubmitted.findIndex(x=>{
                        return x === id;
                    });
                    if(i===-1){
                        this.objectiveSubmitted.push(id);
                        this.objectiveCorrect = this.objectiveSubmitted.length;
                    }
                    let j = this.objectiveAnswer.findIndex(x=>{
                        return x.id === id;
                    });
                    this.objectiveAnswer[j].modify = false;
                    //console.log(this.objectiveAnswer);
                }
            }*/
        }
    }
</script>

<style lang="scss" scoped>
    .objectiveWork {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        // background-color: #F7F7F7;
        /*background-color: #1b1b1b;*/
        .objective_content {
            padding: 0 1.14rem;
            margin-top: 4.5rem;
            .objectiveTitle {
                height: 2rem;
                position: relative;
                margin: 5.5rem 0 1.4rem;
                .icon {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: .57rem;
                    height: 1.43rem;
                    background-color: rgba(128, 213, 156, 1);
                }
                .title {
                    position: absolute;
                    top: 50%;
                    margin-left: 1.14rem;
                    transform: translateY(-50%);
                    font-size: 24px;
                    color: rgba(53, 53, 53, 1);
                }
            }
            .student_msg {
                padding: 2.29rem 2.29rem;
                .msg {
                    position: relative;
                    padding-bottom: 2rem;
                    display: flex;
                    font-size: 22px;
                    justify-content: space-between;
                    line-height: 1.42rem;
                    color: #999999;
                    span {
                        font-size: 20px;
                        color: rgba(53, 53, 53, 1);
                    }
                    &:before {
                        content: "";
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border-bottom: 1px solid rgba(230, 230, 230, 1);
                        -webkit-transform: scaleY(.5);
                        -webkit-transform-origin: 0 0;
                    }
                }
                .name {
                    //position: relative;
                    padding-top: 1.14rem;
                    //color: #69B482;
                    span:nth-child(1) {
                        font-size: 20px;
                        color: #353535;
                    }
                    span:nth-child(2) {
                        //padding-left: 4.59rem;
                        font-size: 18px;
                        color: rgba(105, 180, 130, 1);
                    }
                    span:nth-child(3) {
                        //padding-left: 4.59rem;
                        font-size: 18px;
                        color: rgb(255, 67, 22);
                    }
                    span:nth-child(4) {
                        //padding-left: 4.59rem;
                        font-size: 18px;
                        color: rgba(105, 180, 130, 1);
                    }
                    /*&:before {
                        content: "";
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border-bottom: 1px solid rgba(230, 230, 230, 1);
                        -webkit-transform: scaleY(.5);
                        -webkit-transform-origin: 0 0;
                    }*/
                }
                .objectiveScore {
                    padding: 1.14rem 0;
                    span:nth-child(1) {
                        font-size: 20px;
                        color: #353535;
                    }
                    /*span:nth-child(2) {
                        font-size: 18px;
                        color: #999999;
                    }*/
                    span:nth-child(2) {
                        //padding-left: 4.59rem;
                        font-size: 18px;
                        color: rgba(105, 180, 130, 1);
                    }
                    span:nth-child(3) {
                        //padding-left: 4.59rem;
                        font-size: 18px;
                        color: rgba(105, 180, 130, 1);
                    }
                    span:nth-child(4) {
                        //padding-left: 4.59rem;
                        font-size: 18px;
                        color: rgba(105, 180, 130, 1);
                    }
                }
                .subjectiveScore {
                    //padding-bottom: 2.29rem;
                    span:nth-child(1) {
                        font-size: 20px;
                        color: #353535;
                    }
                    span:nth-child(2) {
                        font-size: 18px;
                        color: #9c8afc;
                    }
                    span:nth-child(3) {
                        font-size: 18px;
                        color: #9c8afc;
                    }
                    span:nth-child(4) {
                        font-size: 18px;
                        color: #9c8afc;
                    }
                }
                .right {
                    width: 8.57rem;
                    height: 3rem;
                    // background-color: rgba(128, 213, 156, 1);
                    border-radius: 100px;
                    text-align: center;
                    line-height: 3rem;
                    color: rgba(255, 255, 255, 1);
                    margin-top: 10px;
                }
                .submit {
                    width: 154px;
                    height: 46px;
                    float: right;
                    background: url('../../../../assets/按钮.png') no-repeat;//
                    background-position: -135px -3023px;
                    // background-color: #69B482;
                }
                .submit:active {
                    background: url('../../../../assets/按钮.png') no-repeat;
                    background-position: -592px -3023px;
                    // background-color: #4a9460;
                    // box-shadow: 0 2px 6px 3px #4a9460;
                }
            }
            .topic_warp {
                padding: 1.14rem;
                border-radius: 18px;
                background-color: white;
                .objective_warp {
                    /*background-color: #0e96ff;*/
                    position: relative;
                    width: 100%;
                    margin-bottom: 2.29rem;
                    &:before {
                        content: "";
                        position: absolute;
                        left: 2.57rem;
                        right: 2.57rem;
                        bottom: 0;
                        border-bottom: 2px solid #CFD1D9;
                        -webkit-transform: scaleY(.5);
                        -webkit-transform-origin: 0 0;
                    }
                }
                .objective_warp:last-of-type {
                    &:before {
                        display: none;
                    }
                }
            }
        }
        .mint-popup {
            background-color: #f7f7f7;
            border-radius: 5px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, .5);
            .popup_warp {
                text-align: center;
                padding: 1.72rem 6.5rem 2.86rem;
            }
            .img_warp {
                padding-bottom: 2.29rem;
            }
            .text {
                padding-bottom: 3.93rem;
                font-size: 18px;
                color: #a2a2a2;
            }
            .operation {
                display: flex;
                justify-content: space-between;
                div {
                    background-color: #f7f7f7;
                    font-size: 20px;
                    color: #777777;
                }
                div:nth-child(2) {
                    color: #80d59c;
                }
            }
        }
    }
</style>
