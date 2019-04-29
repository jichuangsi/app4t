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
    //学生习题客观题列表
    homeworkObjectiveQs: state => state.teacher.homeworkObjectiveQs,
    //学生习题主观题列表
    homeworkSubjectiveQs: state => state.teacher.homeworkSubjectiveQs,
    //学生是否完成习题
    homeworkCompleted: state => state.teacher.homeworkCompleted,
    //老师批改当前习题的学生id
    homeworkStudentId: state => state.teacher.homeworkStudentId,
    //老师批改当前习题的学生Name
    homeworkStudentName: state => state.teacher.homeworkStudentName,
    //老师端考试数据
    testList: state => state.teacher.testList,
    //老师考试id
    testId: state => state.teacher.testId,
    //老师考试Name
    testName: state => state.teacher.testName,
    //老师考试初始slide
    testInitSlide: state => state.teacher.testInitSlide,
    //老师考试学生列表
    testStudents: state => state.teacher.testStudents,
    //老师考试问题列表
    testQuestions: state => state.teacher.testQuestions,
    //学生考试客观题列表
    testObjectiveQs: state => state.teacher.testObjectiveQs,
    //学生考试主观题列表
    testSubjectiveQs: state => state.teacher.testSubjectiveQs,
    //学生是否完成考试
    testCompleted: state => state.teacher.testCompleted,
    //老师批改当前考试的学生id
    testStudentId: state => state.teacher.testStudentId,
    //老师批改当前考试的学生Name
    testStudentName: state => state.teacher.testStudentName,
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
    isNew: state => state.app.isNew,
};
export default getters
