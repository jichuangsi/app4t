# Cordova Android Handwritten Board Plugin

## 手寫板插件 使用教程

### 使用 Cordova 安裝插件到您的項目
````shell
cordova plugin add git+ssh://git@gitlab.com:tangway/handwrittenboard.git#master
````
#### 接口功能
##### 初始化
````javascript
HandwrittenBoard.initialize(callback); //callback 為手寫板所有事件的回調入口
````
##### 獲取附近的藍牙設備
````javascript
HandwrittenBoard.exploration();
````
##### 連接藍牙設備
````javascript
HandwrittenBoard.connect("60:03:08:f0:91:ba");
````
##### 清空手寫板內容
````javascript
HandwrittenBoard.cleanup();
````
##### 獲取手寫板的圖片
````javascript
HandwrittenBoard.take();
````
##### 釋放手寫板插件（釋放內存）
````javascript
HandwrittenBoard.destroy();
````
#### 調用插件實例
````javascript
//初始化插件
window.HandwrittenBoard.initialize(function (result){
    if(parseInt(result.code)!==0) {
        onError(result.method, result.message);
    } else {
        console.log(result); //返回數據 裡面含有4個鍵：method code message data
        switch(result.method) {
            case "initialize":
                onInitialize(result.data);
                break;
            case "exploration":
                onExploration(result.data);
                break;
            case "connect":
                onConnect(result.data);
                break;
            case "cleanup":
                onCleanup(result.data);
                break;
            case "take":
                onTake(result.data);
                break;
            case "destroy":
                onDestroy(result.data);
                break;
        }
    }
});

function onInitialize(res){
    //window.HandwrittenBoard.initialize(handler) 回調函數
    //初始化成功后一般會開啟藍牙掃描，也可通過用戶事件觸發
    window.HandwrittenBoard.exploration();
}

function onExploration(res){
    //window.HandwrittenBoard.exploration() 回調函數
    //res 裡面保存了所有藍牙設備
    if(isNotEmpty(res)){
        // 在有內容的情況下才處理
        for(var name in res){
            var macAddress = res[name];// {} value 為 MAC地址 key 為 名稱
        }
        //這裡可以通過 MAC地址 連接指定的藍牙設備，可自動，可手動
        window.HandwrittenBoard.connect(macAddress);
    }
}

function onConnect(res){
    //window.HandwrittenBoard.connect() 回調函數
    //連接成功代表手寫板準備好，畫板已經在內存了，可以操作 take() cleanup() 等
}

function onCleanup(res){
    //window.HandwrittenBoard.cleanup() 回調函數
    //清理畫板成功，清理后 window.HandwrittenBoard.take() 會是空白圖片
}

function onTake(res){
    //window.HandwrittenBoard.take() 回調函數
    //圖片數據這里是 base64/png 格式
    img.src = res.image;
}

function onDestroy(res){
    //window.HandwrittenBoard.destroy() 回調函數
    //銷毀成功   
}

function onError(method, message){
    //所有出錯回調函數
    console.log(method,message);
}

````

### 使用協議
此項目含有保密內容，不允許外部共享，洩露
