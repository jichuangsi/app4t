package com.jichuangsi.school.teacher;

import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import com.example.tangdao.gcharms1.freedrawview.FreeDrawView;
import com.example.tangdao.gcharms1.freedrawview.PathRedoUndoCountChangeListener;
import com.royole.drawinglib.Constant;
import com.royole.drawinglib.RyDrawingManager;
import com.royole.drawinglib.data.PointData;
import com.royole.drawinglib.interfaces.IDrawingDataListener;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class DrawActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "DrawActivity";

    //取消按钮
    private Button btnMainCancel;
    //撤销
    private ImageView ivMainUndo;
    //反撤销
    private ImageView ivMainRedo;
    //橡皮擦
    private ImageView ivMainClear;
    //清除
    private ImageView ivMainClearAll;
    //确认
    private Button ivMainRight;
    //红色色块
    private ImageView ivColorRed;
    //黑色色块
    private ImageView ivColorBalck;

    private FreeDrawView drawView;
    private RyDrawingManager mRyDrawingManager;
    private static final float DEFAULT_PAINT_STROKE = 1;
    private static final float DEFAULT_ERASER_STROKE = 20;
    private ArrayList<BluetoothDevice> mDevDataList = new ArrayList<>(8);
    //当前蓝牙连接状态
    private int mCurrentConnectedState;
    public static byte[] points;
    private MyDataListener mDataListener;
    /**
     * 这是手写板宽
     */
    private static final float DEFAULTWIDTH = 9035F;
    /**
     * 这是手写板高
     */
    private static final float DEFAULTHEIGHT = 12649F;
    Handler timerHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            drawView.setDataComming(false);
        }
    };
    /**
     * base64格式图片
     */
    private String mBase64;

    /**
     * 只有2中颜色切换，就这样吧
     * 画笔颜色，0：黑色  1：红色 -1:橡皮擦
     */
    private int paintColor = 0;
    private int mDrawViewWidth;
    private int mDrawViewHeight;
    private boolean eraser;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_draw);
        findViews();
        String img = getIntent().getStringExtra("baseimg");
        connectBle();

        //这里监听手写板坐标变化
        mDataListener = new MyDataListener();
        mRyDrawingManager.setDrawingDataListener(mDataListener);
        if (points != null) {
            List<PointData.Point> pointList = mRyDrawingManager.parseRawDataToPointList(points);
            if (pointList != null) {
                for (PointData.Point point : pointList) {
                    mDataListener.onDrawingDataChange(point.x, point.y, point.pressure, point.time);
                }
            }
        }
        if (!TextUtils.isEmpty(img)) {
            drawView.setBitmap(base64ToBitmap(img));
            Log.d(TAG, "图片");
        } else {
            Log.d(TAG, "空图片");
        }
    }

    /**
     * 每次进入画板，检查下蓝牙连接吧
     */
    @Override
    protected void onRestart() {
        super.onRestart();
        connectBle();
    }

    /**
     * 这里获取手机画板view的宽高
     */
    @Override
    protected void onResume() {
        super.onResume();
        drawView.post(new Runnable() {
            @Override
            public void run() {
                mDrawViewWidth = drawView.getWidth();
                mDrawViewHeight = drawView.getHeight();
            }
        });
    }

    private void connectBle() {
        if (null == mRyDrawingManager) {
            try {
                mRyDrawingManager = handwritten.board.HandwrittenBoard.getRyDrawingManager();
            } catch (Exception e) {
                mRyDrawingManager = RyDrawingManager.getInstance();
                mRyDrawingManager.init(this);
                e.printStackTrace();
            }
        }
        mCurrentConnectedState = mRyDrawingManager.getRyConnectionState();
        if (mCurrentConnectedState == Constant.ServiceConnectionState.STATE_CONNECTED) {
            Toast.makeText(DrawActivity.this, "蓝牙已连接", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(DrawActivity.this, "蓝牙未连接", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onClick(View v) {
        if (v == btnMainCancel) {
            finish();
        } else if (v == ivMainUndo) {
            Toast.makeText(DrawActivity.this, "暂不可用", Toast.LENGTH_SHORT).show();
            //drawView.undoLast();
        } else if (v == ivMainRedo) {
            Toast.makeText(DrawActivity.this, "暂不可用", Toast.LENGTH_SHORT).show();
            //drawView.redoLast();
        } else if (v == ivMainClear) {
            Toast.makeText(DrawActivity.this, "暂不可用", Toast.LENGTH_SHORT).show();
            //selectEraser();
        } else if (v == ivMainClearAll) {
            Toast.makeText(DrawActivity.this, "暂不可用", Toast.LENGTH_SHORT).show();
            //drawView.clearDraw();
        } else if (v == ivMainRight) {
            drawView.getDrawScreenshot(new MyDrawScreenshot());
        } else if (v == ivColorBalck) {
            Toast.makeText(DrawActivity.this, "暂不可用", Toast.LENGTH_SHORT).show();
            //setPaintColor(0);
        } else if (v == ivColorRed) {
            Toast.makeText(DrawActivity.this, "暂不可用", Toast.LENGTH_SHORT).show();
            //setPaintColor(1);
        }
    }

    /**
     * 设置橡皮擦
     */
    private void selectEraser() {
        drawView.setPaintColor(getResources().getColor(R.color.white));
        drawView.setPaintWidthDp(DEFAULT_ERASER_STROKE);
        drawView.setMode(FreeDrawView.Mode.ERASER);
        eraser = true;
        paintColor = -1;
        ivColorBalck.setImageResource(R.drawable.default_black_pan);
        ivColorRed.setImageResource(R.drawable.default_red_pan);
    }

    /**
     * 这里设置画笔颜色
     */
    private void setPaintColor(int color) {
        if (paintColor != color) {
            switch (color) {
                case 1:
                    paintColor = 1;
                    ivColorRed.setImageResource(R.drawable.select_red_pan);
                    ivColorBalck.setImageResource(R.drawable.default_black_pan);
                    drawView.setPaintColor(getResources().getColor(R.color.paintRedColor));
                    break;
                case 0:
                default:
                    paintColor = 0;
                    ivColorRed.setImageResource(R.drawable.default_red_pan);
                    ivColorBalck.setImageResource(R.drawable.select_black_pan);
                    drawView.setPaintColor(getResources().getColor(R.color.paintBlackColor));
                    break;
            }

            if (drawView.getPaintWidth(true) != DEFAULT_PAINT_STROKE) {
                drawView.setPaintWidthDp(DEFAULT_PAINT_STROKE);
            }
            drawView.setMode(FreeDrawView.Mode.PEN);
            eraser = false;
        }
    }

    private void findViews() {
        btnMainCancel = findViewById(R.id.btn_main_cancel);
        btnMainCancel.setOnClickListener(this);

        ivMainUndo = findViewById(R.id.iv_main_undo);
        ivMainUndo.setOnClickListener(this);

        ivMainRedo = findViewById(R.id.iv_main_redo);
        ivMainRedo.setOnClickListener(this);

        ivMainClear = findViewById(R.id.iv_main_clear);
        ivMainClear.setOnClickListener(this);

        ivMainClearAll = findViewById(R.id.iv_main_clear_all);
        ivMainClearAll.setOnClickListener(this);

        ivMainRight = findViewById(R.id.iv_main_right);
        ivMainRight.setOnClickListener(this);

        drawView = findViewById(R.id.drawing_view);
        drawView.setPathRedoUndoCountChangeListener(new MyPathRedoUndoCountChangeListener());

        ivColorBalck = findViewById(R.id.iv_color_black);
        ivColorBalck.setOnClickListener(this);

        ivColorRed = findViewById(R.id.iv_color_red);
        ivColorRed.setOnClickListener(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mRyDrawingManager.setDrawingDataListener(null);
        drawView.release();
        points = null;
    }

    /**
     * 手写板坐标回调监听
     */
    private class MyDataListener implements IDrawingDataListener {
        @Override
        public void onDrawingDataChange(int x, int y, int p, long time) {
            if (p == 0) {
                return;
            }
            if (!eraser) {
                //注意啊：手写板分辨率跟平板不一样，需要根据比例缩放手写板传过来的point坐标。
                drawView.drawPoints((int) (mDrawViewWidth / DEFAULTWIDTH * x), (int) (mDrawViewHeight / DEFAULTHEIGHT
                        * y));
                drawView.setDataComming(true);
                timerHandler.removeMessages(10000);
                timerHandler.sendEmptyMessageDelayed(10000, 50);
            }
        }
    }

    /**
     * 创建图片的监听，在这里可以拿到绘画完的图片
     */
    private class MyDrawScreenshot implements FreeDrawView.DrawCreatorListener {
        @Override
        public void onDrawCreated(final Bitmap draw) {
            mBase64 = bitmapToBase64(draw);
            setResult(RESULT_OK, new Intent().putExtra("img", mBase64));
            finish();
        }

        @Override
        public void onDrawCreationError() {

        }
    }

    /**
     * 这里获取Base64格式图片
     */
    public String getBase64() {
        return mBase64;
    }

    /**
     * 将bitmap转为Base64，给前端用
     *
     * @param bitmap JPEG格式的图片，当然可以改其他格式
     * @return 返回Base64字符串
     */
    public String bitmapToBase64(Bitmap bitmap) {
        String result = null;
        ByteArrayOutputStream stream = null;
        try {
            if (null != bitmap) {
                stream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
                stream.flush();
                stream.close();
                byte[] bytes = stream.toByteArray();
                result = Base64.encodeToString(bytes, Base64.DEFAULT);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (null != stream) {
                try {
                    stream.flush();
                    stream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return result;
    }

    /**
     * 前端给回的图片，用于修改
     */
    public Bitmap base64ToBitmap(String base64Data) {
        byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
        return BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
    }

    private class MyPathRedoUndoCountChangeListener implements PathRedoUndoCountChangeListener {
        @Override
        public void onUndoCountChanged(int undoCount) {
            if (undoCount > 0) {
                ivMainUndo.setClickable(true);
                ivMainUndo.setImageResource(R.drawable.undo_canclick);
            } else {
                ivMainUndo.setClickable(false);
                ivMainUndo.setImageResource(R.drawable.undo_default);
            }
        }

        @Override
        public void onRedoCountChanged(int redoCount) {
            if (redoCount > 0) {
                ivMainRedo.setClickable(true);
                ivMainRedo.setImageResource(R.drawable.redo_canclick);
            } else {
                ivMainRedo.setClickable(false);
                ivMainRedo.setImageResource(R.drawable.redo_default);
            }
        }
    }
}
