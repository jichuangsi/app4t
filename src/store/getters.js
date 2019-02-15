const getters = {
    //学生端课堂数据
    classroomList: state => state.classList.classroomList,
    //老师端课堂courseId
    userMobile: state => state.login.userMobile,
    //老师端课堂数据
    classList: state => state.teacher.classList,
    //老师端习题数据
    homeworkList: state => state.teacher.homeworkList,
    //老师习题id
    homeworkId: state => state.teacher.homeworkId,
    //老师习题Name
    homeworkName: state => state.teacher.homeworkName,
    //老师习题初始slide
    homeworkInitSlide: state => state.teacher.homeworkInitSlide,
    //老师习题学生列表
    homeworkStudents: state => state.teacher.homeworkStudents,
    //老师习题问题列表
    homeworkQuestions: state => state.teacher.homeworkQuestions,
    //老师端课堂名字
    courseName: state => state.teacher.courseName,
    //老师端老师id
    teacherId: state => state.teacher.teacherId,
    //老师端老师名字
    teacherName: state => state.teacher.teacherName,
    //老师端课堂题目id
    topicId: state => state.topic.topicId,
    //老师课堂题目标题
    title: state => state.topic.title,
    studentId: state => state.topic.studentId,
    //错题集相关
    incKnowledgeId: state => state.incorrectQuestions.knowledgeId,
    incKnowledge: state => state.incorrectQuestions.knowledge,
    incQuestions: state => state.incorrectQuestions.questions,
    //错题集相关
    //老师课堂id
    courseId: state => state.teacher.courseId,
    userPassword: state => state.login.userPassword,
    isBlueTooth: state => state.app.isBlueTooth,
    isBoard: state => state.app.isBoard,
    boardImg: state => state.app.boardImg,
    blueToothList: state => state.app.blueToothList,
    isPopupBoard: state => state.app.isPopupBoard,
    boardPoint: state => state.app.boardPoint,
    bluetoothValue: state => state.bluetooth.bluetoothValue,
    isPopupUpgrade: state => state.app.isPopupUpgrade,
    upgradeInfo: state => state.app.upgradeInfo,
};
export default getters
