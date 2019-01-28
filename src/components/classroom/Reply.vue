<template>
    <div class="classroomOneReply">
        <div class="reply_objective"
             v-for="(item,index) in select" v-if="item" :key="index">
            <div class="bubble">
                <div class="answer" v-if="true">{{item}}</div>
            </div>
            <public-avatar/>
        </div>
    </div>
</template>

<!--客观题答案-->

<script>
    import PublicAvatar from "./avatar"

    export default {
        name: 'Reply',
        props: {
            id: {
                type: [String,Number],
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            reply: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        components: {
            PublicAvatar
        },
        data() {
            return {
                select: [],
                arr:[],
                show: false
            }
        },
        watch: {
            reply: {
                handler() {
                    let w = ""
                    for (let i = 0; i < this.reply.length; i++) {
                        for (let q =0;q<this.reply[i].answer.length;q++){
                                w = this.reply[i].answer[q].split("|").join(",")
                                this.reply[i].answer[q] = w
                                }
                        if (this.reply[i].id === this.id) {
                            this.select = this.reply[i].answer;
                        }
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .classroomOneReply {
        position: relative;
        height: 100%;
        .reply_objective {
            position: relative;
            height: 4.71rem;
            margin-bottom: 2rem;
            .bubble {
                position: absolute;
                top: 50%;
                right: 6.5rem;
                padding: 0 3.29rem;
                transform: translateY(-50%);
                font-size: 20px;
                border-radius: 18px;
                color: rgba(53, 53, 53, 1);
                background: rgba(235, 240, 243, 1);
                cursor: pointer;
                .answer {
                    height: 3.47rem;
                    line-height: 3.47rem;
                }
                &:before {
                    position: absolute;
                    content: "";
                    width: 0;
                    height: 0;
                    right: -1rem;
                    top: 1.17rem;
                    z-index: 999;
                    border-top: .55rem solid transparent;
                    border-left: 1.1rem solid rgba(235, 240, 243, 1);
                    border-bottom: .55rem solid transparent;
                }
            }
        }
    }
</style>
