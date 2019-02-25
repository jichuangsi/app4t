<template>
    <div :id="refName" class="mescroll scrollContent" :ref="refName" immediate-check=”false”>
        <div :class="emptyCls" v-show="showEmptySlot">
            <slot name="empty"></slot>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<!-- 滚动content -->

<script>
    import MeScroll from 'mescroll.js'
    import 'mescroll.js/mescroll.min.css'

    export default {
        name: 'ScrollContent',
        props: {
            list: {
                type: Array,
                default: function () {
                    return []
                }
            },
            //是否启用上/下拉刷新
            mescrollValue: {
                type: Object,
                default: function () {
                    return {up: true, down: true}
                }
            },
            //页面没有数据了，提示语句
            tips: {
                type: String,
                default: ''
            },
            updownRefresh:{
                type:Number
            }
        },
        data() {
            return {
                showEmptySlot: !this.list.length,
                refName: 'mescroll_' + Date.now(),
                instance: null,
                value: 'end'
            }
        },
        computed: {
            emptyCls() {
                return this.refName + '_empty'
            }
        },
        watch:{
            updownRefresh(){
            this.$nextTick(this.$_init())
            }
        },
        mounted() {
            this.$nextTick(this.$_init())
        },
        methods: {
            $_init() {
                this.showEmptySlot = false;
                //console.log(789)
                if (this.instance) this.instance.destroy();
                //console.log(456)
                this.instance = new MeScroll(this.refName, {
                    //是否启用下拉刷新
                    down: {
                        callback: this.getInstance,
                        use: this.mescrollValue.down, //是否启用下拉刷新,如果配置false,则不会初始化下拉刷新的布局
                        auto: false,                  //默认不执行下拉刷新的回调
                        isBoth: false,
                        isLock:false,
                        isBounce: false,             //是否允许ios的bounce回弹;默认true,允许回弹 (v 1.3.0新增)
                        loadFull: {
                            use: false
                        }
                    },
                    //是否启用上拉加载
                    up: {
                        callback: this.$_upCallback, //触发一个方法传一个页码给父组件
                        use: this.mescrollValue.up,  //是否启用上拉加载,如果配置false,则不会初始化上拉加载的布局
                        auto: false,
                        isBoth: false,
                        isBounce: false,             //是否允许ios的bounce回弹;默认true,允许回弹 (v 1.3.0新增)
                        offset: 300,                 //列表滚动到距离底部小于100px,即可触发上拉加载的回调
                        noMoreSize: 1,               //如果列表已无数据,可设置列表的总数量要大于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                        loadFull: {
                            use: false              //不满一屏自动加载
                        },
                        page: {
                            num: 0,                  //默认为0执行一次this.$_upCallback就会加1
                            size: 10,
                            time: null
                        },
                        scrollbar: {
                            use: false
                        },
                        htmlNodata: '<p class="upwarp-nodata">' + this.tips + '</p>'
                    }
                });
                let _this = this;
                this.instance.showEmpty = function () {
                    _this.showEmptySlot = true
                };
                this.instance.removeEmpty = function () {
                    _this.showEmptySlot = false
                }
            },
            // 上拉回调
            $_upCallback(page) {
                this.$emit('load', page.num)
            },
            // 下拉刷新
            getInstance() {
                this.$emit('reload');
            },
            // 上拉调用
            endByPage(curPagelen, totalPage) {
                this.instance && this.instance.endByPage(curPagelen, totalPage)
            },
            // 下拉调用
            endSuccess(){
                this.instance.endSuccess();
            }
        }
    }
</script>

<style lang="scss">
    .mescroll-hardware {
        /*line-height: 30px;*/
        .upwarp-nodata {
            text-align: center;
            font-size: 18px;
        }
    }
</style>
