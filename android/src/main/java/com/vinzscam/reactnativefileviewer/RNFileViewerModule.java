
package com.vinzscam.reactnativefileviewer;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.v4.content.FileProvider;
import android.webkit.MimeTypeMap;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

import java.io.File;

public class RNFileViewerModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private static final String E_OPENING_ERROR = "E_OPENING_ERROR";
  private static final String SHOW_OPEN_WITH_DIALOG = "showOpenWithDialog" ;
  private static final String SHOW_STORE_SUGGESTIONS ="showAppsSuggestions";

  public RNFileViewerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @ReactMethod
  public void open(String path, ReadableMap options, Promise promise) {
    File newFile = new File(path);
    Uri contentUri = null;
    Boolean showOpenWithDialog = options.hasKey(SHOW_OPEN_WITH_DIALOG) ? options.getBoolean(SHOW_OPEN_WITH_DIALOG) : false;
    Boolean showStoreSuggestions = options.hasKey(SHOW_STORE_SUGGESTIONS) ? options.getBoolean(SHOW_STORE_SUGGESTIONS) : false;

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

    String extension = MimeTypeMap.getFileExtensionFromUrl(path).toLowerCase();
    String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);

    Intent shareIntent = new Intent();

    shareIntent.setAction(Intent.ACTION_VIEW);
    shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    shareIntent.setDataAndType(contentUri, mimeType);
    shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);

    Intent intentActivity;

    if (showOpenWithDialog) {
      intentActivity = Intent.createChooser(shareIntent, "Open with");
    } else {
      intentActivity = shareIntent;
    }

    PackageManager pm =  getCurrentActivity().getPackageManager();

      if (shareIntent.resolveActivity(pm) != null) {
          try {
              getCurrentActivity().startActivity(intentActivity);
              promise.resolve(null);
          }
          catch(Exception e) {
              promise.reject(E_OPENING_ERROR, e);
          }
      } else {
          try {
              if (showStoreSuggestions) {
                  Intent storeIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://search?q=" + mimeType + "&c=apps"));
                  getCurrentActivity().startActivity(storeIntent);
              }
              throw new Exception("No app associated with this mime type");
          }
          catch(Exception e) {
              promise.reject(E_OPENING_ERROR, e);
          }
      }
  }

  @Override
  public String getName() {
    return "RNFileViewer";
  }
}
