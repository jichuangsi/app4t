<template>
    <mt-popup
        class="board"
        v-model="isPopup">
        <div class="board-head">
            <div class="head-left" @click="onClose">
                取消
            </div>
            <div class="head-right">
                  <span
                      v-for="item in controls"
                      :key="item.action"
                      :class="item.className"
                      @click="controlCanvas(item.action)">
                      <i class="iconfont" :class="item.title"></i>
                  </span>
            </div>
        </div>
        <div class="board-wrap">
            <canvas id="BoardCanvas" width="904" height="1264">
            </canvas>
        </div>
        <div class="board-control">
            <div class="control-color">
                <div class="color-title">
                    画笔颜色
                </div>
                <div class="color-con">

                </div>
            </div>
            <div class="board-control-con">
                <div class="control-item">
                    <div class="control-title">
                        画笔大小
                    </div>
                    <div class="control-con">
                        <div><i class="iconfont icon-shiwu-huabi"></i>
                        </div>
                        <div><i class="iconfont icon-shiwu-huabi"></i>
                        </div>
                        <div><i class="iconfont icon-shiwu-huabi"></i>
                        </div>
                    </div>
                </div>
                <div class="control-item">
                    <div class="control-title">
                        画板操作
                    </div>
                    <div class="control-con">
                        <div><i class="iconfont icon-houtui-shi"></i></div>
                        <div><i class="iconfont icon-qianjin-shi"></i></div>
                        <div><i class="iconfont icon-qingkong"></i>
                        </div>
                    </div>
                </div>
                <div class="control-item">
                    <div class="control-title">
                        提交答案
                    </div>
                    <div class="control-con">
                        <div>
                            <button class="control-btn">
                                提交答案
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </mt-popup>
</template>

<script>
    import {mapGetters} from 'vuex'

    import {Indicator} from 'mint-ui';

    export default {
        data() {
            return {
                drawing: false,
                timeout: undefined,
                isPopup: false,
                colors: ['#fef4ac', '#0018ba', '#ffc200', '#f32f15', '#cccccc', '#5ab639'],
                brushs: [{
                    className: 'small fa fa-paint-brush',
                    lineWidth: 3
                }, {
                    className: 'middle fa fa-paint-brush',
                    lineWidth: 6
                }, {
                    className: 'big fa fa-paint-brush',
                    lineWidth: 12
                }],
                context: {},
                imgUrl: [],
                canvasMoveUse: true,
                // 存储当前表面状态数组-上一步
                preDrawAry: [],
                // 存储当前表面状态数组-下一步
                nextDrawAry: [],
                // 中间数组
                middleAry: [],
                // 配置参数
                config: {
                    lineWidth: 2,
                    lineColor: '#000000',
                    canvasWidth: 904,
                    canvasHeight: 1264
                }
            }
        },
        computed: {
            controls() {
                // return [{
                //     title: 'icon-qianjin-shi',
                //     action: 'prev',
                //     className: this.preDrawAry.length ? 'active' : ''
                // }, {
                //     title: 'icon-houtui-shi',
                //     action: 'next',
                //     className: this.nextDrawAry.length ? 'active' : ''
                // }, {
                //     title: 'icon-qingkong',
                //     action: 'clear',
                //     className: (this.preDrawAry.length || this.nextDrawAry.length) ? 'active' : ''
                // }, {
                //     title: 'icon-chenggong',
                //     action: 'done',
                //     className: (this.preDrawAry.length || this.nextDrawAry.length) ? 'active' : ''
                // }]
                return [{
                    title: 'icon-qingkong',
                    action: 'clear',
                    className: (this.preDrawAry.length || this.nextDrawAry.length) ? 'active' : ''
                }, {
                    title: 'icon-chenggong',
                    action: 'done',
                    className: (this.preDrawAry.length || this.nextDrawAry.length) ? 'active' : ''
                }]
            },
            ...mapGetters([
                'isPopupBoard',
                'boardPoint',
                'boardImg'
            ])
        },
        watch: {
            isPopupBoard(state) {
                if (state) {
                    const canvas = document.getElementById('BoardCanvas');
                    this.context = canvas.getContext('2d');
                    this.context.lineWidth = this.config.lineWidth;
                    this.context.strokeStyle = this.config.lineColor;

                    // let self=this;
                    // setTimeout(function () {
                    //     self.drawScreen(110,200);
                    // },80);
                    // setTimeout(function () {
                    //     self.drawScreen(140,200);
                    // },150);
                    // setTimeout(function () {
                    //     self.drawScreen(600,280);
                    // },200);
                    // setTimeout(function () {
                    //     self.drawScreen(600,380);
                    // },600);
                    // setTimeout(function () {
                    //     self.drawScreen(600,400);
                    // },700);
                } else {
                    this.context = '';
                }
                this.isPopup = state;
            },
            boardPoint(obj) {
                console.log('boardPoint', obj.p);
                if (Number(obj.p) !== 0) {
                    this.drawScreen(Number(obj.x) / 10, Number(obj.y) / 10);
                } else {
                    this.drawing = false;
                }
            }
        },
        methods: {
            onClose() {
                this.$store.commit('SET_POPUP_BLUETOOTH', false);
                this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
                Indicator.close();
            },
            drawScreen(canvasX, canvasY) {
                var self = this;
                if (!self.drawing) {
                    this.context.beginPath();
                    this.context.moveTo(canvasX, canvasY);
                    self.drawing = true;
                }
                this.context.lineTo(canvasX, canvasY);
                this.context.stroke();
            },
            // 设置颜色
            setColor(color) {
                this.config.lineColor = color
            },
            // 设置笔刷大小
            setBrush(type) {
                this.config.lineWidth = type
            },
            // 操作
            controlCanvas(action) {
                switch (action) {
                    case 'prev':
                        if (this.preDrawAry.length) {
                            const popData = this.preDrawAry.pop()
                            const midData = this.middleAry[this.preDrawAry.length + 1]
                            this.nextDrawAry.push(midData)
                            this.context.putImageData(popData, 0, 0)
                        }
                        break;
                    case 'next':
                        if (this.nextDrawAry.length) {
                            const popData = this.nextDrawAry.pop()
                            const midData = this.middleAry[this.middleAry.length - this.nextDrawAry.length - 2]
                            this.preDrawAry.push(midData)
                            this.context.putImageData(popData, 0, 0)
                        }
                        break;
                    case 'clear':
                        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
                        break;
                    case 'done':
                        this.getImage();
                        break
                }
            },
            // 生成图片
            getImage() {
                Indicator.open({
                    text: '获取图片中...',
                    spinnerType: 'fading-circle'
                });
                let self = this;
                setTimeout(function () {
                    Indicator.close();
                    const canvas = document.getElementById('BoardCanvas');
                    const src = canvas.toDataURL('image/png');
                    self.$store.commit('SET_BOARD_IMG', src);
                    self.$store.commit('SET_POPUP_BLUETOOTH', false);
                    self.context.clearRect(0, 0, self.context.canvas.width, self.context.canvas.height);
                }, 300);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .board {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        z-index: 100;
        transform: translate3d(0, 0, 0);
        .board-wrap {
            width: 100%;
            height: 100%;
            padding-top: 44px;
            #BoardCanvas {
                width: 100%;
                height: 100%;
            }
        }
        .board-head {
            position: absolute;
            top: 0;
            z-index: 1;
            width: 100%;
            height: 3.15rem;
            background-color: #ffffff;
            -webkit-box-shadow: 0 0.14rem 0.57rem 0 rgba(0, 0, 0, 0.21);
            box-shadow: 0 0.14rem 0.57rem 0 rgba(0, 0, 0, 0.21);
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            .head-right {
                text-align: right;
                height: 3.15rem;
                width: 100%;
                padding-left: 1.14rem;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                span {
                    display: inline-block;
                    width: 56px;
                    height: 3.15rem;
                    line-height: 3.15rem;
                    vertical-align: middle;
                    text-align: center;
                    i {
                        font-size: 24px;
                        /*color: #8b8b8b;*/
                        color: #1b1b1b;
                    }
                    &.active {
                        i {
                            color: #1b1b1b;
                        }
                    }
                }
            }
            .head-left {
                position: absolute;
                left: 1.14rem;
                top: 0;
                height: 3.15rem;
                width: 70px;
                line-height: 3.15rem;
                font-size: 20px;
                color: #333333;
            }
        }
        .board-control {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 6rem;
            display: -webkit-box;
            display: -ms-flexbox;
            display: none;
            background-color: #FFFFFF;
            -webkit-box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.12);
            box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.12);
            .control-color {
                display: flex;
                .color-title {
                    flex: 1;
                }
                .color-con {
                    flex: 3;
                }
            }
            .board-control-con {
                display: flex;
                .control-item {
                    padding: 10px 20px;
                    flex: 1;
                    .control-title {
                        font-size: 18px;
                        text-align: center;
                    }
                    .control-con {
                        display: flex;
                        div {
                            flex: 1;
                            text-align: center;
                            i {
                                font-size: 24px;
                            }
                        }
                        button {
                            display: inline-block;
                            width: 6.57rem;
                            height: 36px;
                            line-height: 32px;
                            border: 2px solid #9A84FF;
                            text-align: center;
                            border-radius: 1.145rem;
                            color: #9A84FF;
                            font-size: 18px;
                            background-color: #ffffff;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }
</style>
