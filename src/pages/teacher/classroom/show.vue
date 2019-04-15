<template>
    <div class="TClassroom">
        <teacher-header :header="header"/>
        <scroll-content ref="myscrollfull" @load="loadData" :mescrollValue="mescrollValue" v-if="pageShow">
            <div class="subjectAvatar">
                <img src="../../../../public/images/classroom.png" v-if="subjectId==null">
                        <img src="../../../assets/语文_03.png" v-if="subjectId==1">
                        <img src="../../../assets/数学_03.png" v-if="subjectId==2">
                        <img src="../../../assets/英语_03.png" v-if="subjectId==3">
                        <img src="../../../assets/历史_03.png" v-if="subjectId==4">
                        <img src="../../../assets/地理_03.png" v-if="subjectId==5">
                        <img src="../../../assets/政治_03.png" v-if="subjectId==6">
                        <img src="../../../assets/生物_03.png" v-if="subjectId==7">
                        <img src="../../../assets/物理_03.png" v-if="subjectId==8">
                        <img src="../../../assets/化学_03.png" v-if="subjectId==9">
            </div>
            <div class="subjectName">{{courseName}}</div>
            <div class="msg">
                <div class="left">
                    <div class="row">班级 &nbsp;<span>{{classMsg.className}}</span></div>
                    <div class="row">上课时间 &nbsp;<span>{{time(classMsg.courseStartTime)}}</span></div>
                    <div class="row">在线人数 &nbsp;<span class="people">{{studentCount}}</span> / {{studentTotal}}</div>
                    <div class="row" v-for="(item,index) in classMsg.attachments" :key="index" >附件 &nbsp;
                        <a @click.capture="downloadAttachment4App(item)">{{item.name}}，</a>
                        <div class="btn fr" v-if="!(sendshow||item.publishFlag=='1')" @click="send(item)">发布附件</div>
                        <div class="btn fr sendbtn" v-if="sendshow||item.publishFlag=='1'">已发布</div>
                    </div>
                </div>
                <!-- <div class="img" @click="zsbtn"><img src="../../../assets/zsbtn.png" alt=""></div> -->
                <div class="right started" @click.stop.passive="updateState"
                     v-if="classMsg.courseStatus === 'NOTSTART'">
                </div>
                <div class="right class" @click.stop.passive="updateState" v-if="classMsg.courseStatus === 'PROGRESS'">
                </div>
                <div class="right view" @click.stop.passive="updateState" v-if="classMsg.courseStatus === 'FINISH'">
                    <img src="../../../assets/课堂已结束.png" alt="">
                </div>
            </div>
            <div class="subjectTitle">
                <span class="icon"></span>
                <span class="title">课堂题目</span>
            </div>
            <teacher-topic v-for="item in showTopicList"
                           :topic="item"
                           :topicCount="item.count"
                           :topicAcc="item.acc"
                           :courseId="courseId"
                           :studentCount="studentCount" :key="item.index"/>
            <div id="btn" :class="{'awbtn':btn===current}">
                <span>{{onestudentname}}<br>已提交</span>
            </div>
        </scroll-content>
        <!-- <div class="AnswerShare" v-show="AnswerShareshow">
            <span class="btnout" @click="btnout">x</span>
            <div class="AnswerShareList" v-for="(item,index) in AnswerShareList" :key="index">
                <div :id="item.studentId" class="question" v-html="item.title">{{item.title}}</div>
                <div class="answerimg"><img :src="item.answer" alt=""></div>
            </div>
        </div> -->
        <loading v-if="loading"/>
        <div class="leftDrawer" :class="{rightDrawer:!Drawershow}" @click="Drawershow = !Drawershow">
            <div class="Onlinestudent" @click.stop="zxbtn"></div>
            <div class="Responder" @click="qdbtn"></div>
            <div class="assistantbtn" @click.stop="zsbtn"></div>
        </div>
        <div class="Responderbox" v-if="qdshow">
            <div class="qdbox">
                <div class="none" @click="qdshow = false">x</div>
                <div class="text">是否发布抢答</div>
                <div class="cancel" @click="cancelshow?qdshow = false:qdshow=true">取消</div>
                <div class="confirm" @click="qdconfirm">确认</div>
            </div>
        </div>
        <div class="studentname" v-if="qdname">
            <div class="studentbox">
                <div class="none" @click="qdname = false">x</div>
                <div class="studentimg"></div>
                <div class="student_name">{{confirmtext}}</div>
            </div>
        </div>
    </div>
</template>
<!--课堂详情-->
<script>
    import Vue from 'vue'
    import TeacherHeader from '../../../components/public/PublicHeader'
    import ScrollContent from '../../../components/public/ScrollContent'
    import TeacherTopic from '../../../components/teacherClassroom/teacherTopic'
    import {
        //changeCourseStatus,
        courseStart,
        courseEnd,
        getCourse,
        getCourseStatistics,
        getQuestionStatisticsList,
        getAttachment
    } from '@/api/teacher/classroom'
    import Loading from '../../../components/public/Loading'
    import {mapGetters} from 'vuex'
    import SockJS from 'sockjs-client'
    import Stomp from 'stompjs'
    import {MessageBox, Toast, Indicator} from 'mint-ui'
    import {publishFile} from '@/api/teacher/statistics'
    import {pubRaceQuestion} from '@/api/teacher/classroom'
    import store from '@/store'

    export default {
        components: {
            TeacherHeader,
            ScrollContent,
            TeacherTopic,
            Loading
        },
        data() {
            return {
                qdname:false,
                confirmbtn:true,
                confirmtext:'',
                classId:'',
                cancelshow:true,
                confirmshow:false,
                sendshow:false,
                qdshow:false,
                Drawershow:true,
                img:"",
                onestudentname:"",
                students:[],
                allquestions:[],
                AnswerShareList: [],
                AnswerShareshow: false,
                btn: 1,
                current: 0,
                subjectId: null,
                //当前班总人数
                studentTotal: 0,
                //课堂人数
                studentCount: 0,
                //课堂状态
                courseStatus: '',
                loading: true,                               //页面加载状态
                pageShow: false,                             //页面内容显示
                mescrollValue: {up: false, down: false},     //页面你是否需要下拉上拉加载
                header: {                                    //头部标题内容
                    title: '课堂详情',
                    url: '/teacherIndex'
                },
                //课堂的所有内容
                classMsg: {},
                showTopicList: [],
                //ws地址
                wsUrl: this.apiHost(), //'http://api.jichuangsi.com',
                //保存ws的对象
                stompClient: null,
                subscription: null,
                //用户token
                token: localStorage.getItem('token'),
                ready: false
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'courseId',
                'courseName',
                'classList'
            ])
        },
        mounted() {
            this.getTClassroom();
            this.connect();
            /*this.connectCS();
            this.connectQS();
            this.connectQP();*/
            this.start();
            this.initialize();

            var arry = [
            {user_id:1,money:100},
            {user_id:2,money:33},
            {user_id:1,money:12},
            {user_id:3,money:21},
            {user_id:2,money:43},
            {user_id:1,money:12} 
        ]

  var temp = {};
  for(var i in arry) {
       var key= arry[i].user_id;
       if(temp[key]) {
           temp[key].money += arry[i].money;
           temp[key].user_id = arry[i].user_id;
           
       } else {
           temp[key] = {};
           temp[key].money = arry[i].money;
           temp[key].user_id = arry[i].user_id;
       }
   }
   console.log(temp)
   
   var newArry = [];
   for(var k in temp){
       newArry.push(temp[k])
   }
   console.log(newArry)


        },
        methods: {
            send(val) {
                console.log(this.classMsg.courseId,val.name,val.sub)
                    MessageBox.confirm('是否共享此附件').then(action => {
                        publishFile(this.classMsg.courseId,val.name,val.sub).then(res=>{
                        if(res.data.code == '0010') {
                            this.sendshow = true
                            Toast('共享成功')
                        }
                    })
                    }).catch(e=>{
                        console.log(e)
                    })
            },
            //在线学生
            zxbtn(){
                this.$router.push({
                    path: '@/pages/teacher/classroom/onlinestudent',
                    name: 'onlinestudent',
                    query: {
                        courseId: this.courseId,
                        classId: this.classId,
                    }
                });
            },
            //抢答
            qdbtn() {
                this.qdshow = true
                this.Drawershow = false
                this.confirmshow = false
                this.confirmbtn = true
                console.log(this.Drawershow)
            },
            qdconfirm() {
                this.cancelshow = false
                if(this.confirmbtn){
                    this.confirmbtn = false
                    var timestamp=new Date().getTime()
                    pubRaceQuestion(this.courseId,timestamp).then(res=>{
                        console.log(res)
                        if(res.data.code == '0010') {
                            Toast('发布成功')
                            return
                        }
                    })
                }
            },
            //小助手
            zsbtn(){
                this.$router.push({
                    path: '@/pages/teacher/assistant',
                    name: 'assistant',
                    query: {
                        students: this.allstudents
                    }
                });
            },
            // Answerbtn(){
            //     this.AnswerShareshow = true;
            //     },
            //     btnout() {
            //     this.btn = 1;
            //     this.AnsswerShareshow = false;
            //     },
            initialize() {
                let _this = this;
                document.addEventListener(
                    'deviceready',
                    _this.onDeviceReady.bind(this),
                    false
                );
            },
            // deviceready Event Handler
            onDeviceReady() {
                this.ready = true;
            },
            // 创建文件路径
            downloadAttachment4App(attachmentInfo) {
                let _this = this;
                if (_this.ready) {
                    Indicator.open({
                        text: '加载中...',
                        spinnerType: 'fading-circle'
                    });
                    window.resolveLocalFileSystemURL(
                        //cordova.file.externalCacheDirectory,
                        cordova.file.externalDataDirectory,
                        /*window.requestFileSystem(
                        LocalFileSystem.PERSISTENT,
                        0,*/
                        //5 * 1024 * 1024,
                        function (fs) {
                            console.log('file system open: ' + fs.nativeURL);
                            _this.createFile(fs, attachmentInfo);
                    }, function(error) {
                        Toast('进入文件系统失败！');
                    });
                } else {
                    Toast('设备没响应，请稍后重试');
                }
            },

            async createFile(dirEntry, attachmentInfo) {
                let _this = this;

                    // Creates a new file or returns the file if it already exists.
                    dirEntry.getFile(attachmentInfo.name, {create: true, exclusive: true}, function(fileEntry) {
                        _this.requestAttachment(fileEntry, attachmentInfo);
                    }, function(error) {
                        Indicator.close();
                        console.log(error);
                        dirEntry.getFile(
                            attachmentInfo.name,
                            { create: false },
                            function(fileEntry) {
                                // 成功读取文件后调用cordova-plugin-file-opener2插件打开文件
                                _this.preview(fileEntry, attachmentInfo);
                            },
                            function(err) {
                                Toast('读取文件失败');
                            }
                        );
                    });
            },
            async requestAttachment(fileEntry, attachmentInfo) {
                try{
                    let attachment = await getAttachment(attachmentInfo.sub);
                    Indicator.close();
                    if(!attachment||!attachment.data) {Toast('下载失败，请稍后重试'); throw new Error("返回值为空:" + attachment + "," + attachment.data);}
                    let myBlob = new Blob([attachment.data]);
                    this.writeFile(fileEntry, myBlob, attachmentInfo);
                }catch (e) {
                    console.log(e);
                    Indicator.close();
                    Toast({
                        message: "下载失败，请稍后重试！",
                        duration: 1000
                    });
                    fileEntry.remove(
                        function () {
                            console.log("删除成功");
                        },
                        function (file_error) {
                            console.log("删除错误：" + file_error);
                        }
                    );
                }
            },
            writeFile(fileEntry, dataObj, attachmentInfo) {
                let _this = this;
                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function() {
                        console.log("Successful file write...");
                        //_this.readFile(fileEntry);
                        _this.preview(fileEntry, attachmentInfo);
                    };

                    fileWriter.onerror = function (e) {
                        console.log("Failed file write: " + e.toString());
                    };

                    // If data object is not passed in,
                    // create a new Blob instead.
                    if (!dataObj) {
                        throw new Error("返回值为空:" + dataObj);
                    }

                    fileWriter.write(dataObj);
                });
            },
            /*readFile(fileEntry) {

                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function() {
                        console.log("Successful file read: " + this.result);
                        console.log(fileEntry.fullPath + ": " + this.result);
                    };

                    reader.readAsArrayBuffer(file);

                }, function(error) {
                    Toast('读取文件系统失败！');
                });
            },
            // fileTransfer plugin
            downloadFile(fileEntry) {
                let _this = this;
                //实例化
                let fileTransfer = new window.FileTransfer();
                //监听下载进度
                fileTransfer.onprogress = function(e) {
                    //opener.showOpenWithDialog()
                };
                // 使用fileTransfer.download开始下载
                fileTransfer.download(
                    encodeURI(_this.savePath), //uri网络下载路径
                    fileEntry.toURL(), //文件本地存储路径
                    function(entry) {
                        // 下载完成执行本地预览
                        if (_this.progress > 1 || _this.progress === 1) {
                            _this.showProgress = false;
                            entry.file(data => {
                                //_this.preView(fileEntry);
                                // 此处data.type可以直接得到文件的MIME-TYPE类型
                            });
                        }
                    },
                    function(error) {
                        Toast('下载失败！');
                    },
                    null,
                    {
                        //headers: {
                        //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        //}
                    }
                );
            },*/
            preview(fileEntry, attachmentInfo){
                console.log("file name:" + fileEntry.name + ",file path:"+ fileEntry.toInternalURL());
                // 调用cordova-plugin-file-opener2插件实现用第三方app打开文件
                cordova.plugins.fileOpener2.showOpenWithDialog(
                    // 此处必须填写cdvfile://地址，不然android7.0+会报文件权限错误
                    fileEntry.toInternalURL(), //文件本地地址转cdvfile://地址
                    attachmentInfo.contentType, //文件类型
                    function onSuccess(data) {
                        console.log('成功预览:' + data);
                    },
                    function onError(error) {
                        Toast(
                            '出错！请在' + cordova.file.externalDataDirectory + '目录下查看'
                        );
                    }
                );
            },
            //网页下载附件
            async downloadAttachment4Web(attachmentInfo){
                let attachment = await getAttachment(attachmentInfo.sub);
                console.log(attachment);
                let myBlob = new Blob([attachment.data]);
                let URL = window.URL || window.webkitURL;
                let bloburl = URL.createObjectURL(myBlob);
                let anchor = document.createElement("a");
                if ('download' in anchor) {
                    anchor.style.visibility = "hidden";
                    anchor.href = bloburl;
                    anchor.download = attachmentInfo.name;
                    document.body.appendChild(anchor);
                    let evt = document.createEvent("MouseEvents");
                    evt.initEvent("click", true, true);
                    anchor.dispatchEvent(evt);
                    document.body.removeChild(anchor);
                } else if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(myBlob, name);
                } else {
                    location.href = bloburl;
                } //移除链接释放资源
            },
            //页面获取数据
            getTClassroom() {
                let _this = this;
                getCourse(_this.courseId)
                    .then(res => {
                        console.log(res)
                        _this.subjectId = res.data.data.subjectId
                        _this.pageShow = true;
                        _this.loading = false;
                        _this.classMsg = res.data.data;
                        _this.allquestions = res.data.data.questions
                        _this.allstudents = res.data.data.students
                        _this.classId = res.data.data.classId
                        let objective = 0;
                        let subjective = 0;
                        _this.courseStatus = this.classMsg.courseStatus;
                        _this.studentTotal = this.classMsg.students.length;
                        sessionStorage.setItem("curClassStudentsList", JSON.stringify(this.classMsg.students));
                        for (let i = 0; i < this.classMsg.questions.length; i++) {
                            if (this.classMsg.questions[i].quesetionType === 'objective') {
                                objective++;
                                this.classMsg.questions[i].title = '客观题-' + objective;
                                this.classMsg.questions[i].acc = 0;
                                this.classMsg.questions[i].count = 0;
                                this.showTopicList.push(this.classMsg.questions[i])

                            } else if (this.classMsg.questions[i].quesetionType === 'subjective') {
                                subjective++;
                                this.classMsg.questions[i].title = '主观题-' + subjective;
                                this.classMsg.questions[i].acc = 0;
                                this.classMsg.questions[i].count = 0;
                                this.showTopicList.push(this.classMsg.questions[i])
                            }
                        }
                        this.getQuestionStatisticsList();
                    })
                    .catch(err => {
                        console.log('err', err);
                        /*let msg = this.getMsg(err);
                        if(msg){
                            Toast({
                                message: msg,
                                position: 'middle',
                                duration: 2000
                            });
                        }*/
                    });
                //获取当前课堂人数
                getCourseStatistics(_this.courseId)
                    .then(res => {
                        _this.studentCount = res.data.data.studentCount;
                        _this.pageShow = true;
                        _this.loading = false;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //获取题目的正确率人数初始值
            getQuestionStatisticsList() {
                let self = this;
                getQuestionStatisticsList(self.courseId)
                    .then(res => {
                        self.showTopicList.forEach((topic, i) => {
                            res.data.data.list.forEach((r) => {
                                if (r.questionId === topic.questionId) {
                                    topic.acc = r.acc;
                                    topic.count = r.count;
                                    self.$set(self.showTopicList[i], i, topic);
                                }
                            })
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //改变课堂状态
            async updateState() {
                switch (this.courseStatus) {
                    case 'NOTSTART':
                        try {
                            await MessageBox.confirm('', {message: '是否开始上课'});
                            //await changeCourseStatus(this.courseId, "PROGRESS");
                            let res = await courseStart(this.courseId);
                            if(res.data.code==='0010'){
                                this.classMsg.courseStatus = this.courseStatus = 'PROGRESS';
                                for(let i = 0; i < this.classList.length; i++){
                                    if(this.classList[i].courseId === this.courseId){
                                        let tempCourse = this.classList.splice(i, 1);
                                        //console.log(tempCourse);
                                        if(tempCourse && tempCourse.length === 1){
                                            tempCourse[0].courseStatus = 'PROGRESS';
                                            this.classList.unshift(tempCourse[0]);
                                        }
                                        break;
                                    }
                                }
                                store.commit('SET_CLASSHISTORY', []);
                                store.commit('SET_CLASS', this.classList);
                            }else{
                                Toast('开始课程失败');
                            }
                        } catch (e) {
                            console.log(e);

                        }
                        break;
                    case 'PROGRESS':
                        try {
                            await MessageBox.confirm('', {message: '是否结束课程'});
                            //await changeCourseStatus(this.courseId, "FINISH");
                            let res = await courseEnd(this.courseId);
                            if(res.data.code==='0010'){
                                this.classMsg.courseStatus = this.courseStatus = 'FINISH';
                                this.showTopicList.forEach((item, index) => {
                                    item.questionStatus = 'FINISH';
                                });
                                for(let i = 0; i < this.classList.length; i++){
                                    if(this.classList[i].courseId === this.courseId){
                                        let tempCourse = this.classList.splice(i, 1);
                                        //console.log(tempCourse);
                                        if(tempCourse && tempCourse.length === 1){
                                            let j = this.classList.findIndex(x=>{
                                                return x.courseStatus === 'FINISH';
                                            });
                                            tempCourse[0].courseStatus = 'FINISH';
                                            if(j === -1){
                                                this.classList.push(tempCourse[0]);
                                            }else{
                                                this.classList.splice(j, 0, tempCourse[0]);
                                            }
                                        }
                                        break;
                                    }
                                }
                                store.commit('SET_CLASSHISTORY', []);
                                store.commit('SET_CLASS', this.classList);
                            }else{
                                Toast('结束课程失败');
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        break;
                    case 'FINISH':
                        break;
                }
            },
            async start() {
                if (this.courseStatus == 'PROGRESS') {
                    await courseStart(this.courseId);
                    //await changeCourseStatus(this.courseId, this.courseStatus);
                }
            },
            //下拉刷新
            loadData(pageIndex) {
                setTimeout(() => {
                    this.$refs.myscrollfull.endByPage(1, 1);
                    //第一个参数：当前页获取的数据总数；第二个参数：列表总页数
                }, 2000)
            },
            //转换时间
            time(courseEndTime) {
                let times = parseInt(courseEndTime);
                let date = new Date(times);
                let month = (date.getMonth() + 1 > 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1);
                let day = date.getDate();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return month + '月' + day + '日\t' + hours + ':' + minutes;
            },
            //连接方法
            connect() {
                //地址+端点路径，构建websocket链接地址
                let socket = new SockJS(this.wsUrl + '/websocket/course');
                this.stompClient = Stomp.over(socket);//一些老的浏览器不支持WebSocket的脚本或者使用别的名字。默认下，stomp.js会使用浏览器原生的WebSocket class去创建WebSocket。利用Stomp.over(ws)这个方法可以使用其他类型的WebSockets。这个方法得到一个满足WebSocket定义的对象
                this.stompClient.heartbeat.outgoing = 400000;  // client will send heartbeats every 40000ms
                this.stompClient.heartbeat.incoming = 0;      // client does not want to receive heartbeats from the server
                //连接时的请求头部信息
                let headers = {
                    login: 'mylogin',
                    passcode: 'mypasscode',
                    // additional header
                    userId: 'curUserId',
                    accessToken: this.token
                };

                //创建连接并在连接成功后订阅班级为“2018001”班级的信息
                let _this = this;
                this.stompClient.connect(headers, function (frame) {
                    console.log('Connected:' + frame);

                    let subHeader = {
                        userId: 'curUserId',
                        accessToken: _this.token
                    };//订阅时的头信息
                    //监听的路径以及回调。返回的subscription用于取消订阅
                    //监听课堂人数
                    _this.subscription = _this.stompClient.subscribe('/queue/course/teacher/course/' + _this.courseId, function (response) {
                        console.log(response);
                        if(response.body){
                            _this.classData(response);
                        }
                    }, subHeader);
                    /*//监听课堂提交答案
                    _this.stompClient.subscribe('/queue/course/teacher/qs/' + _this.courseId, function (response) {
                        _this.classAnswer(response);
                    }, subHeader);
                    //监听课堂提交答案
                    _this.stompClient.subscribe('/queue/course/teacher/question/' + _this.courseId, function (response) {
                        console.log(response)
                        _this.classAnswerSubmit(response);
                    }, subHeader);*/
                });
            },
            
            classData(response) {
                let classData = JSON.parse(response.body);
                if(classData.data&&classData.data.notifyType){
                    console.log(classData.data.notifyType);
                    switch(classData.data.notifyType){
                        case "CourseStatistics": this.classNumber(response); break;
                        case "QuestionStatistics": this.classAnswer(response); break;
                        case "StudentAnswer": this.classAnswerSubmit(response); break;
                    }
                }
                if (classData.data&&classData.data.quType){
                for (let i =0;i<this.allstudents.length;i++){
                    if(this.allstudents[i].studentId == classData.data.studentId){
                        this.confirmtext = this.allstudents[i].studentName
                        this.confirmshow = true
                        this.cancelshow = true
                        this.qdshow = false
                        this.qdname = true
                    }
                }
                }
            },
            connectWithParam(param, method) {
                //地址+端点路径，构建websocket链接地址
                let socket = new SockJS(this.wsUrl + '/websocket/course');
                this.stompClient = Stomp.over(socket);//一些老的浏览器不支持WebSocket的脚本或者使用别的名字。默认下，stomp.js会使用浏览器原生的WebSocket class去创建WebSocket。利用Stomp.over(ws)这个方法可以使用其他类型的WebSockets。这个方法得到一个满足WebSocket定义的对象
                this.stompClient.heartbeat.outgoing = 400000;  // client will send heartbeats every 40000ms
                this.stompClient.heartbeat.incoming = 0;      // client does not want to receive heartbeats from the server
                //连接时的请求头部信息
                let headers = {
                    login: 'mylogin',
                    passcode: 'mypasscode',
                    // additional header
                    userId: 'curUserId',
                    accessToken: this.token
                };

                //var classId = userInfo.classId;
                let _this = this;
                this.stompClient.connect(headers, function(frame) {
                    //setConnected(true);
                    console.log('Connected:' + frame);

                    _this.call(eval('_this.'+method),param);
                });
            },
            call(a,n){
                return a(n)
            },
            connectCS(){
                this.connectWithParam(null, 'subscribeCS');
            },
            subscribeCS(param){
                let subHeader = {
                    userId: 'curUserId',
                    accessToken: this.token
                };//订阅时的头信息
                //监听的路径以及回调。返回的subscription用于取消订阅
                //监听课堂人数
                let _this = this;
                this.subscription = this.stompClient.subscribe('/queue/course/teacher/cs/' + this.courseId, function (response) {
                    _this.classNumber(response);
                }, subHeader);
            },
            connectQS(){
                this.connectWithParam(null, 'subscribeQS');
            },
            subscribeQS(param){
                let subHeader = {
                    userId: 'curUserId',
                    accessToken: this.token
                };//订阅时的头信息
                let _this = this;
                this.stompClient.subscribe('/queue/course/teacher/qs/' + this.courseId, function (response) {
                    _this.classAnswer(response);
                }, subHeader);
            },
            connectQP(){
                this.connectWithParam(null, 'subscribeQP');
            },
            subscribeQP(param){
                let subHeader = {
                    userId: 'curUserId',
                    accessToken: this.token
                };//订阅时的头信息
                let _this = this;
                this.stompClient.subscribe('/queue/course/teacher/question/' + this.courseId, function (response) {
                    console.log(response)
                    _this.classAnswerSubmit(response);
                }, subHeader);
            },
            //
            classAnswerSubmit(resopnse){
                let self = this
                let subjectivesubmit = JSON.parse(resopnse.body);
                // console.log(subjectivesubmit.hasOwnProperty('quType'))
                if(subjectivesubmit.data.quType){
                // for (let i =0; i<self.allquestions.length;i++){
                // if (self.allquestions[i].questionId == AnswerSubmit.data.questionId){
                    self.btn = 0
                //     getSubjectPic(self.allquestions[i].answerForStudent.stubForSubjective).then(res => {
                //     if (res.data.data) {
                //     self.img =
                //         "data:image/png;base64," +
                //         res.data.data.content.replace(",", "");
                //     }
                // });
                //     self.AnswerShareList = [{questionId:AnswerSubmit.data.questionId,
                //                             studentId:AnswerSubmit.data.studentId,
                //                             title:self.allquestions[i].questionContent,
                //                             answer:self.img}]
                //                             console.log(self.AnswerShareList)
                // }
                console.log(self.allstudents)
                // }
                for (let i =0;i<self.allstudents.length;i++){
                    if(self.allstudents[i].studentId == subjectivesubmit.data.studentId){
                        self.onestudentname = self.allstudents[i].studentName
                    }
                }
                setTimeout(function(){
                    self.btn = 1;
                },2000)
                }
            },
            //上课人数
            classNumber(response) {
                console.log(response)
                let classData = JSON.parse(response.body);
                if (classData.data) {
                    this.studentCount = classData.data.studentCount;
                }
            },
            //上课提交的答案
            classAnswer(response) {
                // console.log(response)
                let _this = this;
                let classData = JSON.parse(response.body);
                if (classData.data) {
                    _this.showTopicList.forEach((topic, index) => {
                        if (topic.questionId && topic.questionId === classData.data.questionId) {
                            if (topic.questionId === classData.data.questionId) {
                                topic.acc = classData.data.acc;
                                topic.count = classData.data.count;
                                Vue.set(_this.showTopicList, index, topic);
                            }
                        }
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
    .TClassroom {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .mescroll {
            box-sizing: border-box;
            position: absolute;
            top: 3.15rem;
            bottom: 0;
            padding: 2.36rem 3.34rem 3.14rem;
            height: auto !important;
            .subjectAvatar {
                width: 13.43rem;
                height: 13.43rem;
                // background-color: red;
                margin: 0 auto;
                border-radius: 10%;
                img {
                    width:100%;
                    height:100%;
                }
            }
            .subjectName {
                padding-top: 1.14rem;
                padding-bottom: 2.29rem;
                text-align: center;
                font-size: 32px;
                position: relative;
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
            .msg {
                padding: 1.71rem 0;
                height: 15rem;
                font-size: 18px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                .left {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .row {
                        span {
                            color: #999999;
                        }
                        .people {
                            color: #80D59C;
                            font-size: 34px;
                        }
                        a {
                            color: #999999;
                        }
                        a:hover {
                            color: #0b01ff;
                            text-decoration: underline
                        }

                    }
                }
                    .img {
                        position: fixed;
                        right: 3rem;
                        top: 8rem;
                        transform: scale(0.6)
                    }
                .right {
                    width: 8.57rem;
                    height: 3rem;
                    // background-color: rgba(128, 213, 156, 1);
                    border-radius: 100px;
                    text-align: center;
                    line-height: 3rem;
                    color: rgba(255, 255, 255, 1);
                }
                .class {
                    width: 150px;
                    height: 56px;
                    background: url('../../../assets/按钮.png') no-repeat;
                    background-position: -135px -208px;
                    // background-size: 100% 100%;
                    // background-color: #8E78F0;
                }
                .class:active {
                    background: url('../../../assets/按钮.png') no-repeat;
                    background-position: -592px -209px;
                    // background-color: #7262c2;
                    // box-shadow: 0 2px 6px 3px #7262c2;
                }
                .view {
                    width: 150px;
                    height: 56px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    // background-color: #888888;
                }
                .started {
                    width: 150px;
                    height: 56px;
                    background: url('../../../assets/按钮.png') no-repeat;
                    background-position: -135px -16px;
                    // background-color: #69B482;
                }
                .started:active {
                    background: url('../../../assets/按钮.png') no-repeat;
                    background-position: -592px -16px;
                    // background-color: #4a9460;
                    // box-shadow: 0 2px 6px 3px #4a9460;
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
            .subjectTitle {
                height: 2rem;
                position: relative;
                margin: 1.43rem 0 1.07rem;
                .icon {
                    display: inline-block;
                    width: .57rem;
                    height: 1.43rem;
                    margin-top: .285rem;
                    background-color: rgba(128, 213, 156, 1);
                }
                .title {
                    position: absolute;
                    top: 50%;
                    margin-left: .57rem;
                    transform: translateY(-50%);
                    font-size: 20px;
                    color: rgba(53, 53, 53, 1);
                }
            }
        }
    }
     #btn {
    width: 10rem;
    height: 10rem;
    position: fixed;
    top: 40%;
    left: -10rem;
    background: url("../../../assets/提交.png") no-repeat;
    background-size: 100% 100%;
    transition: left 1s;
    overflow: hidden;
    z-index: 900;
    span {
            display: block;
            color: #fff;
            line-height: 1.5rem;
            font-size: 1.3rem;
            font-weight: 600;
            text-align: center;
            margin-top: 4.9rem;
            letter-spacing: 0.2rem;
    }
  }
  .awbtn {
    left: 18rem !important; 
    img {
      width: 100%;
      height: 100%;
    }
  }
  .AnswerShare {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #fff;
    z-index: 1000;
    top: 0;
    .btnout {
      font-size: 4rem;
      font-weight: 700;
      color: yellowgreen;
      position: absolute;
      right: 2rem;
      top: 1rem;
    }
    .AnswerShareList {
      padding: 3rem 1rem;
      .question {
        line-height: 2.43rem;
        font-size: 18px;
        padding: 0 3.71rem;
      }
      .answerimg {
        width: 100%;
        height: 100%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
  }
    .MathJye table{
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
    #q_answer{display:none;}
    table.edittable{border-collapse:collapse;text-align:center;margin:2px}table.edittable td,table.edittable th{line-height:30px;padding:5px;white-space:normal;word-break:break-all;border:1px solid #000;vertical-align:middle}table.composition{border-collapse:collapse;text-align:left;margin:2px;width:98%}table.composition td,table.composition th{line-height:30px;white-space:normal;word-break:break-all;border-width:0;vertical-align:middle}table.composition2{border-collapse:collapse;width:auto}table.composition2 td,table.composition2 th{text-align:left;line-height:30px;white-space:normal;word-break:break-all;border:none;border-width:0;vertical-align:middle}
    sup {
        vertical-align: super;
    }
    sub{
        vertical-align: sub;
    }
    .leftDrawer {
        position: fixed;
        width: 335px;
        height: 308px;
        top: 30%;
        right: -300px;
        background:  url("../../../assets/按钮.png") no-repeat;
        background-position: -135px -2479px;
        transition: right 0.5s linear;
        z-index: 2005;
        display: flex;
        align-items: center;
        // justify-content: center;
        flex-wrap: wrap;
    }
    .rightDrawer {
        width: 335px;
        height: 308px;
        background-position: -592px -2479px;
        right: 0px;
    }
    .Onlinestudent {
        margin-left: 75px;
        width: 207px;
        height: 46px;
        background:  url("../../../assets/按钮.png") no-repeat;
        background-position: -135px -2171px;
    }
       .Onlinestudent:active {
            background-position: -592px -2173px;
        }
    .Responder {
        margin-left: 75px;
        width: 207px;
        height: 46px;
        background:  url("../../../assets/按钮.png") no-repeat;
        background-position: -135px -2258px;
    }
        .Responder:active {
            background-position: -590px -2260px;
        }
    .assistantbtn {
        margin-left: 75px;
        width: 248px;
        height: 38px;
        background:  url("../../../assets/按钮.png") no-repeat;
        background-position: -135px -2356px;
    }
        .assistantbtn:active {
            background-position: -592px -2358px;
        }
        .btn {
            padding: 5px 10px;
            border-radius: 10px;
            transform: translateY(-25%);
            background-color: #5AA5EF;
            color: #f2f2f2;
        }
        .btn:active {
            background-color: #f2f2f2;
            color: #5AA5EF;
        }
        .sendbtn {
            background-color: #f2f2f2;
            color: #5AA5EF;
        }
        .Responderbox {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 2007;
            .qdbox {
                width: 600px;
                height: 200px;
                background-color: #fff;
                position: absolute;
                left: 50%;
                top: 40%;
                transform: translate(-50%,-50%);
            }
            .none {
                font-size: 30px;
                float: right;
                padding:5px 15px;
            }
            .text {
                font-size: 24px;
                text-align: center;
                font-weight: 700;
                margin: 50px 0;
            }
            .cancel {
                position: absolute;
                left: 0px;
                bottom: 0px;
                width: 50%;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 22px;
                border: 1px solid #999;
            }
            .confirm {
                position: absolute;
                right: 0px;
                bottom: 0px;
                width: 50%;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 22px;
                border: 1px solid #999;
            }
        }
        
        .studentname {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 2007;
            .none {
                font-size: 30px;
                float: right;
                padding:5px 15px;
            }
            .studentbox {
                width: 400px;
                height: 200px;
                background-color: #fff;
                position: absolute;
                left: 50%;
                top: 40%;
                transform: translate(-50%,-50%);
                .studentimg {
                    width: 82px;
                    height: 82px;
                    margin-bottom: 10px;
                    background:  url("../../../assets/按钮.png") no-repeat;
                    background-position: -135px -2807px;
                    margin: 30px auto;
                }
                .student_name {
                    font-size: 24px;
                    text-align: center;
                }
            }
        }
        .mint-toast {
            z-index: 9999 !important;
        }
</style>
