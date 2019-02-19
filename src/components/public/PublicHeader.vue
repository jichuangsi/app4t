<template>
    <div class="classroomHeader">
        <router-link v-if="header.url" tag="div" :to="header.url" class="previous_page item">返回
        </router-link>
        <div class="title item">{{header.title}}</div>
        <router-link :to="jump.url" tag="div" class="jump item" v-if="jump.name !== ''">{{jump.name}}</router-link>
    </div>
</template>

<!--课堂的头部-->

<script>
    export default {
        name: 'classroomHeader',
        props: {
            header: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            jump: {
                tyPe: Object,
                default: function () {
                    return {name: '', url: ''}
                }
            }
        },
        data() {
            return {}
        },
        methods: {
            backPage() {
                this.$emit('backPage')
            }
        }
    }
</script>

<style lang="scss">
    .classroomHeader {
        position: fixed;
        top: 0;
        z-index: 1005;
        width: 100%;
        height: 3.15rem;
        line-height: 3.15rem;
        // padding: 0 1.14rem;
        box-sizing: border-box;
        // background-color: rgba(128, 213, 156, 1);
        // box-shadow: 0 .14rem .57rem 0 rgba(0, 0, 0, 0.21);
        background: url('../../assets/上方导航栏.png') no-repeat;
        background-size: 110% 110%;
        .item {
            padding-top: 1px;
            font-size: 1.5rem;//18px;
            color: #ffffff;
        }
        .previous_page {
            position: absolute;
            left: 1.4rem;
            padding-left: 1.4rem;
            &:before {
                content: " ";
                display: inline-block;
                height: 11px;
                width: 11px;
                border-width: 0 0 2px 2px;
                border-color: #fff;
                border-style: solid;
                -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
                position: absolute;
                top: 50%;
                left: 0;
                margin-top: -3px;
            }
        }
        .title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
        .jump {
            position: absolute;
            right: 2.5rem;
            &:before {
                content: " ";
                display: inline-block;
                height: 11px;
                width: 11px;
                border-width: 2px 2px 0 0;
                border-color: #ffffff;
                border-style: solid;
                -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
                position: absolute;
                top: 50%;
                right: -.8rem;
                margin-top: -3px;
            }
        }
    }
</style>
