const incorrectQuestions = {
    state: {
        //知识点id
        knowledgeId: '',
        //知识点
        knowledge: '',
        //错题集
        questions: []
    },
    mutations: {
        SET_KNOWLEDGEID: (state, knowledgeId) => {
            state.knowledgeId = knowledgeId;
        },
        SET_KNOWLEDGE: (state, knowledge) => {
            state.knowledge = knowledge;
        },
        SET_QUESTIONS: (state, questions) => {
            state.questions = questions;
        }
    }
};

// 暴露出去
export default incorrectQuestions
