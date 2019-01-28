<template>
    <div class="topic_content">
        <div class="title">{{title}}</div>
        <div class="item">
            {{preview}}
        </div>
    </div>
</template>

<!--预习要点-->

<script>
    import '../../../src/assets/styles/topicList.scss'

    export default {
        name: 'previewPoints',
        props: {
            preview: {
                type: String,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                title: '预习要点'
            }
        }
    }
</script>

<style lang="scss">

</style>
