<template>
    <mt-popup
            class="blueTooth"
            v-model="isPopupBlueTooth"
            position="bottom"
            modal="false"
            :class="{'blueTooth-hide':isPopupBlueTooth}">
        <div class="bluetooth-con">
            <div class="img_warp">
                <img class="bluetooth_img" src="../../public/images/blueTooth.png" preview="0">
                <img class="close_img"
                     @click="close_popup"
                     src="../../public/images/close.png" alt="关闭">
                <div class="bluetooth-title" v-if="!BlueToothSate">
                    <mt-spinner
                            class="blueSpinner"
                            type="fading-circle" color="#0E96FF"></mt-spinner>
                    正在搜索设备…
                </div>
                <div class="bluetooth-title" v-if="BlueToothSate">请选择蓝牙设备并连接</div>
            </div>
            <ul class="bluetooth-list">
                <!--<li class="bluetooth-list-item" v-for="item of blueToothList2"-->
                <li class="bluetooth-list-item" v-for="item of blueToothList"
                    @click="connection(item.val)">
                    <div class="item-left">
                        {{item.key}}
                    </div>
                    <div class="item-right">
                        {{item.val}}
                    </div>
                </li>
            </ul>
        </div>
        <div class="blueTooth-mask" @click="closeMask"></div>
    </mt-popup>
</template>

<script>
    import {Indicator} from 'mint-ui';
    // import {Toast} from 'mint-ui';
    import {Popup} from 'mint-ui';
    import {mapGetters} from 'vuex'
    import store from '@/store'

    export default {
        components: {
            'mt-popup': Popup
        },
        data() {
            return {
                //查找蓝牙跟找到蓝牙状态
                BlueToothSate: false,
                isPopupBlueTooth: false,
                blueToothList2: [
                    {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    },
                    {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }, {
                        'key': '60:03:08:f0:91:ba',
                        'val': '60:03:08:f0:91:ba',
                    }
                ],
            }
        },
        computed: {
            //vuex 调用
            ...mapGetters([
                'isBlueTooth',
                'isBoard',
                'blueToothList',
                'bluetoothValue'
            ])
        },
        watch: {
            isBlueTooth(state) {
                this.isPopupBlueTooth = state;
            },
            blueToothList() {
                if (this.blueToothList.length !== 0) {
                    this.BlueToothSate = true;
                }
            }
        },
        methods: {
            connection(boardID) {
                store.commit('SET_BLUETOOTHVALUE', boardID);
                Indicator.open({
                    text: '连接手写板设备中...',
                    spinnerType: 'fading-circle'
                });
                setTimeout(function () {
                    window.HandwrittenBoard.connect(boardID);
                },300);
                console.log("我是蓝牙的val:"+this.bluetoothValue);
            },
            closeMask() {
                store.commit('SET_BLUETOOTH', false);
            },
            close_popup(){
                store.commit('SET_BLUETOOTH', false);
            }
        }
    }

</script>

<style lang="scss" scoped>
    .blueTooth {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        transform: translate3d(0, 0, 0);
        z-index: 1001;
        background-color: transparent;
        /*background-color: #F0F0F0;*/
        .bluetooth-con {
            position: absolute;
            top: 200px;
            left: 50%;
            width: 100%;
            transform: translateX(-50%);
            display: inline-block;
            border-radius: 10px;
            .img_warp {
                position: relative;
                width: 100%;
                height: 310px;
                line-height: 240px;
                background-color: #f9fdff;
                text-align: center;
                .blueSpinner {
                    position: absolute;
                    bottom: 0;
                    left: 170px;
                }
                .bluetooth-title {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 23px;
                    text-align: center;
                    color: #0E96FF;
                    font-size: 26px;
                    line-height: 26px;
                }
                .bluetooth_img {
                    max-width: 100%;
                }
                .close_img{
                    position: absolute;
                    top: 1.48rem;
                    right: 2.12rem;
                    max-width: 100%;
                }
            }
            .bluetooth-list {
                height: 393px;
                overflow: scroll;
                background-color: #F0F0F0;
                .bluetooth-list-item {
                    position: relative;
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: flex;
                    align-items: center;
                    font-size: 26px;
                    padding: 10px 29px;
                    width: 100%;
                    height: 108px;
                    border-bottom: 1px solid #DDDDDD;
                    box-sizing: border-box;
                    color: #333333;
                    background-color: white;
                    .item-left {
                        flex: 1;
                        text-align: left;
                    }
                    .item-right {
                        position: relative;
                        flex: 1;
                        text-align: right;
                        padding-right: 20px;
                        &:after {
                            content: " ";
                            display: inline-block;
                            height: 10px;
                            width: 10px;
                            border-width: 2px 2px 0 0;
                            border-color: #989898;
                            border-style: solid;
                            -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                            position: absolute;
                            top: 50%;
                            margin-top: -6px;
                            right: 0;
                        }
                    }
                }
                .bluetooth-list-item:last-of-type {
                    border-bottom: none;
                }
            }
        }
        .blueTooth-mask {
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .1);
        }
    }

</style>
