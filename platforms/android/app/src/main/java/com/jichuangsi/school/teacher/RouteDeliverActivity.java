package com.jichuangsi.school.teacher;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.apache.cordova.CordovaActivity;
import org.apache.cordova.engine.SystemWebChromeClient;
import org.apache.cordova.engine.SystemWebViewClient;
import org.apache.cordova.engine.SystemWebViewEngine;

public class RouteDeliverActivity extends CordovaActivity {

    private WebView mWebView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Uri uri = getIntent().getData();
        String url = launchUrl;
        if(uri!=null){
            url += "#" + uri.toString();
        }
        loadUrl(url);
        /*mWebView = (WebView)appView.getView();
        //initWebView();*/
    }

    /*@Override
    public Object onMessage(String id, Object data) {
        if (id.equals("onPageFinished")) {
            if (data instanceof String) {
                String url = (String) data;
                //if (isRemote(url)) {
                    //injectCordova();  //在js里没有注入。在这里注入
                //}
            } else {
                //onMessageTypeFailure(id, data);
            }
        }
        return null;
    }


    private void initWebView() {
        mWebView = new WebView(this);
        WebChromeClient client=new SystemWebChromeClient(
                (SystemWebViewEngine)appView.getEngine()){
            @Override
            public void onReceivedTitle(WebView view, String title) {
                super.onReceivedTitle(view, title);
            }
        };
        mWebView.setWebChromeClient(client);

        WebViewClient client1 = new SystemWebViewClient((SystemWebViewEngine)appView.getEngine()){
            @Override
            public void onPageFinished(WebView webView, String s) {
                super.onPageFinished(webView, s);
                //安卓调用js方法。注意需要在 onPageFinished 回调里调用
                mWebView.post(new Runnable() {
                    @Override
                    public void run() {
                        mWebView.evaluateJavascript("javascript:callJsFunction('soloname')", new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String s) {
                                Log.d(TAG,"js返回的结果： " + s);
                            }
                        });
                    }
                });
            }
        };
        mWebView.setWebViewClient(client1);
    }*/
}
