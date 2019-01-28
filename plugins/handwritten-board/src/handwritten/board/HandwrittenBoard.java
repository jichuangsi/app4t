package handwritten.board;

import android.app.Activity;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import com.royole.drawinglib.Constant;
import com.royole.drawinglib.RyDrawingManager;
import com.royole.drawinglib.interfaces.IDrawingDataListener;
import com.royole.drawinglib.interfaces.IDrawingServiceConnectionListener;
import com.royole.drawinglib.interfaces.IPushEventListener;
import com.royole.drawinglib.interfaces.IScanListener;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class HandwrittenBoard extends CordovaPlugin implements IScanListener, IDrawingServiceConnectionListener,
        IPushEventListener, IDrawingDataListener {
    protected RyDrawingManager mRyDrawingManager;
    protected CallbackContext mCallbackContext;
    protected List<BluetoothDevice> mBluetoothDevices;
    private static final int OPEN_DRAW_PAINT = 0;

    protected PluginResult result(String method, PluginResult.Status status, String msg) {
        return result(method, status, msg, null);
    }

    protected PluginResult result(String method, PluginResult.Status status, String msg, Map<String, Object> data) {
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("method", method);
        res.put("code", status == PluginResult.Status.OK ? 0 : -1);
        res.put("message", msg);
        if (data != null) {
            res.put("data", data);
        }
        PluginResult r = new PluginResult(status, new JSONObject(res));
        r.setKeepCallback(true);
        return r;
    }

    protected BluetoothDevice getDeviceByAddress(String macAddress) {
        if (mBluetoothDevices != null) {
            for (BluetoothDevice device : mBluetoothDevices) {
                if (device.getAddress().equals(macAddress)) {
                    return device;
                }
            }
        }
        return null;
    }


    @Override
    public void onLowPowerEvent(int percent) {

    }

    @Override
    public void onButtonAClick() {

    }

    @Override
    public void onButtonBClick() {

    }

    @Override
    public void onFormatFlashDone() {

    }

    @Override
    public void onBluetoothConnectionStateChange(int oldState, int newState) {

    }

    @Override
    public boolean execute(final String action, JSONArray params, CallbackContext callbackContext) {
        switch (action) {
            case "initialize":
                this.mCallbackContext = callbackContext;
                return initialize();
            case "exploration":
                return exploration(params);
            case "connect":
                return connect(params);
            case "isConnect":
                return isConnect(callbackContext);
            case "destroy":
                return destroy(callbackContext);
            case "getBase64img":
                return getBase64img(params);
            default:
                return false;
        }
    }

    private boolean getBase64img(JSONArray params) {
        if (mCallbackContext != null) {
            try {
                Intent intent = new Intent(cordova.getActivity(), Class.forName("handwritten.board.DrawActivity"));
                try {
                    intent.putExtra("baseimg", params.getString(0));
                } catch (Exception e) {
                }
                this.cordova.startActivityForResult(this, intent, OPEN_DRAW_PAINT);
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        if (requestCode == OPEN_DRAW_PAINT && resultCode == Activity.RESULT_OK) {
            String img = intent.getStringExtra("img");
            mCallbackContext.sendPluginResult(result("getBase64img", PluginResult.Status.OK, "获取图片成功！"));
        } else {
            mCallbackContext.sendPluginResult(result("getBase64img", PluginResult.Status.ERROR, "获取图片失败！"));
        }
    }

    private boolean initialize() {
        try {
            mRyDrawingManager = RyDrawingManager.getInstance();
            mRyDrawingManager.init(this.cordova.getActivity().getApplicationContext());
            mRyDrawingManager.setLeScanListener(this);
            mRyDrawingManager.setRyDrawingServiceConnectionListener(this);
            mRyDrawingManager.setPushEventListener(this);
            mCallbackContext.sendPluginResult(result("initialize", PluginResult.Status.OK, "初始化完成"));
        } catch (Exception e) {
            mCallbackContext.sendPluginResult(result("initialize", PluginResult.Status.ERROR, String.format("初始化失敗,"
                    + "原因" + " %s", e.getMessage())));
        }
        return true;
    }

    private boolean exploration(JSONArray params) {
        if (mRyDrawingManager.isLeScanning()) {
            mCallbackContext.sendPluginResult(result("exploration", PluginResult.Status.OK, "正在搜索藍牙設備中"));
            return true;
        }
        int timeout;
        if (mRyDrawingManager.isSupportBle()) {
            if (mRyDrawingManager.isBluetoothEnable()) {
                try {
                    timeout = params == null ? 30000 : params.getInt(0);
                } catch (JSONException e) {
                    timeout = 30000;
                }
                mRyDrawingManager.startScanRyDrawingDevice(timeout);
                mCallbackContext.sendPluginResult(result("exploration", PluginResult.Status.OK, "正在啟用藍牙功能"));
            } else {
                mCallbackContext.sendPluginResult(result("exploration", PluginResult.Status.ERROR, "請打開您的藍牙設備開關"));
            }
        } else {
            mCallbackContext.sendPluginResult(result("exploration", PluginResult.Status.ERROR, "抱歉，您的設備不支持BLE"));
        }
        return true;
    }

    private boolean connect(JSONArray params) {
        if (mRyDrawingManager.getConnectedDevice() != null) {
            return true;
        }
        if (mBluetoothDevices != null && mBluetoothDevices.size() > 0) {
            try {
                mRyDrawingManager.connectDevice(getDeviceByAddress(params.getString(0)));
            } catch (JSONException e) {
                try {
                    mRyDrawingManager.connectDevice(mBluetoothDevices.get(0));
                } catch (Exception ex) {
                    mCallbackContext.sendPluginResult(result("connect", PluginResult.Status.ERROR, String.format
                            ("連接失敗，原因：%s", ex.getMessage())));
                }
            } catch (Exception e) {
                mCallbackContext.sendPluginResult(result("connect", PluginResult.Status.ERROR, String.format
                        ("連接失敗，原因：%s", e.getMessage())));
            }
        } else {
            mCallbackContext.sendPluginResult(result("connect", PluginResult.Status.ERROR, "連接失敗，原因：無可用設備"));
        }
        return true;
    }

    private boolean isConnect(CallbackContext mCallbackContext) {
        if (mCallbackContext != null) {
            Map<String, Object> data = new HashMap<String, Object>();
            data.put("status", mRyDrawingManager.getRyConnectionState());
            mCallbackContext.sendPluginResult(result("isConnect", PluginResult.Status.OK, "獲取設備狀態", data));
        }
        return true;
    }

    private boolean destroy(CallbackContext mCallbackContext) {
        if (mCallbackContext != null) {
            mRyDrawingManager.destroy();
            mCallbackContext.sendPluginResult(result("destroy", PluginResult.Status.OK, "銷毀成功"));
        }
        return true;
    }


    @Override
    public void onNoDeviceFoundByMacError(String message) {
        if (mCallbackContext != null) {
            mCallbackContext.sendPluginResult(result("exploration", PluginResult.Status.ERROR, "找不到任何設備"));
        }
    }

    @Override
    public void onDrawingServiceNotFoundError() {
        if (mCallbackContext != null) {
            mCallbackContext.sendPluginResult(result("connect", PluginResult.Status.ERROR, "無法找到手寫板服務"));
        }
    }

    @Override
    public void onConnectDeviceByNameTimeout(String message) {
        if (mCallbackContext != null) {
            mCallbackContext.sendPluginResult(result("connect", PluginResult.Status.ERROR, "連接藍牙設備超時"));
        }
    }

    @Override
    public void onDrawingServiceStateChange(int oldState, int newState) {
        if (newState == Constant.ServiceConnectionState.STATE_CONNECTED) {
            mCallbackContext.sendPluginResult(result("connect", PluginResult.Status.OK, " 連接設備成功"));
            if (mRyDrawingManager.isLeScanning()) {
                mRyDrawingManager.stopLeScan();
            }
            mRyDrawingManager.prepareDevice();//连接成功后要调用此方法初始化设备
        } else if (newState == Constant.ServiceConnectionState.STATE_DISCONNECTED) {
            mCallbackContext.sendPluginResult(result("connect", PluginResult.Status.ERROR, "設備已斷開連接"));
        }
    }

    @Override
    public void onDrawingServiceConnectError(int state) {
        if (mCallbackContext != null) {
            mCallbackContext.sendPluginResult(result("connect", PluginResult.Status.ERROR, "連接設備異常"));
        }
    }

    @Override
    public void onLeScanStart() {
        if (mCallbackContext != null) {
            mCallbackContext.sendPluginResult(result("exploration", PluginResult.Status.OK, "正在掃描設備"));
        }
    }

    @Override
    public void onLeScanEnd() {
        if (mCallbackContext != null && mRyDrawingManager.getConnectedDevice() == null) {
            mCallbackContext.sendPluginResult(result("exploration", PluginResult.Status.ERROR, "掃描結束,未發現設備"));
        }
    }

    @Override
    public void onDeviceFound(BluetoothDevice bluetoothDevice, int rsId, byte[] bytes) {
        if (mBluetoothDevices == null) {
            mBluetoothDevices = new ArrayList<BluetoothDevice>();
        }
        if (!mBluetoothDevices.contains(bluetoothDevice)) {
            mBluetoothDevices.add(bluetoothDevice);
        }
        if (mCallbackContext != null) {
            Map<String, Object> data = new HashMap<String, Object>();
            for (BluetoothDevice device : mBluetoothDevices) {
                data.put(device.getName(), device.getAddress());
            }
            mCallbackContext.sendPluginResult(result("exploration", PluginResult.Status.OK, "發現設備", data));
        }

    }


    @Override
    public void onDrawingDataChange(int x, int y, int p, long time) {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("x", x);
        data.put("y", y);
        data.put("p", p);
        data.put("width", mRyDrawingManager.getDeviceWidth());
        data.put("height", mRyDrawingManager.getDeviceHeight());
        data.put("time", time);
        mCallbackContext.sendPluginResult(result("drawing", PluginResult.Status.OK, "開始手寫", data));
    }
}

