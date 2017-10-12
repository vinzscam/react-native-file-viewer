
package com.vinzscam.reactnativefileviewer;

import android.content.Intent;
import android.net.Uri;
import android.support.v4.content.FileProvider;
import android.webkit.MimeTypeMap;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.File;

public class RNFileViewerModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private static final String E_OPENING_ERROR = "E_OPENING_ERROR";

  public RNFileViewerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @ReactMethod
  public void open(String path, String _displayName, Promise promise) {
    File newFile = new File(path);
    Uri contentUri = null;
    try {
      final String packageName = getCurrentActivity().getPackageName();
      final String authority = new StringBuilder(packageName).append(".provider").toString();
      contentUri = FileProvider.getUriForFile(getCurrentActivity(), authority, newFile);
    }
    catch(IllegalArgumentException e) {
      promise.reject(E_OPENING_ERROR, e);
      return;
    }

    if(contentUri == null) {
      promise.reject(E_OPENING_ERROR, "Invalid file");
      return;
    }

    String extension = MimeTypeMap.getFileExtensionFromUrl(path);
    String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);

    Intent shareIntent = new Intent();
    shareIntent.setAction(Intent.ACTION_VIEW);
    shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    shareIntent.setDataAndType(contentUri, mimeType);
    shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
    try {
      getCurrentActivity().startActivity(shareIntent);
      promise.resolve(null);
    }
    catch(Exception e) {
      promise.reject(E_OPENING_ERROR, e);
    }
  }


  @Override
  public String getName() {
    return "RNFileViewer";
  }
}