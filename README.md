
# react-native-file-viewer
Native file viewer for react-native. Preview any type of file supported by the mobile device.

**iOS**: it uses [QuickLook Framework](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/DocumentInteraction_TopicsForIOS/Articles/UsingtheQuickLookFramework.html)

**Android**: it uses `ACTION_VIEW` Intent to start the default app associated with the specified file.

**Windows**: Start the default app associated with the specified file.

## Android X Breaking changes

The library supports [Android X](https://developer.android.com/jetpack/androidx/) and React Native 0.60+.

If you're using **React Native < 0.60**, please append the following snippet to your `android/app/build.gradle` file:

```
preBuild.doFirst {
    ant.replaceregexp(match:'androidx.core.content.', replace:'android.support.v4.content.', flags:'g', byline:true) {
        fileset(dir: '../../node_modules/react-native-file-viewer/android/src/main/java/com/vinzscam/reactnativefileviewer', includes: '*.java')
    }
}
```

If you prefer to not touch your gradle file, you can still use version `1.0.15` which is perfectly compatible.

## Getting started

`$ npm install react-native-file-viewer --save`

or

`$ yarn add react-native-file-viewer`

### Mostly automatic installation (recommended)

```
# RN >= 0.60
cd ios && pod install

# RN < 0.60
react-native link react-native-file-viewer
```

### Manual installation


#### iOS (CocoaPods)

Add the following to you Podfile:

```
pod 'RNFileViewer', :path => '../node_modules/react-native-file-viewer'
```

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-file-viewer` and add `RNFileViewer.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNFileViewer.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;` to the imports at the top of the file
  - Add `new RNFileViewerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:

  	```
  	include ':react-native-file-viewer'
  	project(':react-native-file-viewer').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-file-viewer/android')
  	```

3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:

  	```
   compile project(':react-native-file-viewer')
  	```

4. Locate `react-native-file-viewer` inside `node_modules` folder and copy `android/src/main/res/xml/file_viewer_provider_paths.xml` to your project `res/xml/` directory
5. Add the following lines to `AndroidManifest.xml` between the main `<application></application>` tag:

	```
	...
	<application>
	...
		<provider
			android:name="com.vinzscam.reactnativefileviewer.FileProvider"
			android:authorities="${applicationId}.provider"
			android:exported="false"
			android:grantUriPermissions="true">
			<meta-data
				android:name="android.support.FILE_PROVIDER_PATHS"
				android:resource="@xml/file_viewer_provider_paths"
			/>
		</provider>
	</application>
	....
	```

#### Windows

1. Open the Visual Studio solution created inside the `windows` folder.
2. Right click on the solution in File Explorer and choose `Add -> Existing Project`.
3. Look for the `RNFileViewer.csproj` file in the `node_modules/react-native-file-viewer/windows/RNFileViewer` and press `Open`.
4. Right click on the main Windows project and choose `Add reference`.
5. Select the `RNFileViewer` project you have just added from the list.
6. Open the `pch.h` file included in the main Windows project
7. Add the following declaration at the end:

    ```cpp
    #include <winrt/RNFileViewer.h>
    ```

8. Open the `App.cpp` file included in the main Windows project (expand the `App.xaml` node if you don't see it)
9. Look for the following line of code:

    ```cpp
    PackageProviders().Append(make<ReactPackageProvider>());
    ```
10. Add the following line of code just below:

    ```cpp
    PackageProviders().Append(winrt::RNFileViewer::ReactPackageProvider());
    ```

11. Build and deploy the Windows project

## API

### `open(filepath: string, options?: Object): Promise<void>`

Parameter | Type | Description
--------- | ---- | -----------
**filepath** | string | The absolute path where the file is stored. The file needs to have a valid extension to be successfully detected. Use [react-native-fs constants](https://github.com/itinance/react-native-fs#constants) to determine the absolute path correctly.
**options** (optional) | Object | Some options to customize the behaviour. See below.

#### Options

Parameter | Type | Description
--------- | ---- | -----------
**displayName** (optional) | string | Customize the QuickLook title (iOS only).
**onDismiss** (optional) | function | Callback invoked when the viewer is being dismissed (iOS and Android only).
**showOpenWithDialog** (optional) | boolean | If there is more than one app that can open the file, show an *Open With* dialogue box (Android only).
**showAppsSuggestions** (optional) | boolean | If there is not an installed app that can open the file, open the Play Store with suggested apps (Android only).

## Usage

### Open a local file

```javascript
import FileViewer from 'react-native-file-viewer';

const path = // absolute-path-to-my-local-file.
FileViewer.open(path)
.then(() => {
	// success
})
.catch(error => {
	// error
});
```

### Pick up and open a local file (using [react-native-document-picker](https://github.com/Elyx0/react-native-document-picker))

```javascript
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";

try {
  const res = await DocumentPicker.pick({
    type: [DocumentPicker.types.allFiles],
  });
  await FileViewer.open(res.uri);
}
catch(e) {
  // error
}
```

### Prompt the user to choose an app to open the file with (if there are multiple installed apps that support the mimetype)

```javascript
import FileViewer from 'react-native-file-viewer';

const path = // absolute-path-to-my-local-file.
FileViewer.open(path, { showOpenWithDialog: true })
.then(() => {
	// success
})
.catch(error => {
	// error
});
```

### Open a file from Android assets folder

Since the library works only with absolute paths and Android assets folder doesn't have any absolute path, the file needs to be copied first. Use [copyFileAssets](https://github.com/itinance/react-native-fs#copyfileassetsfilepath-string-destpath-string-promisevoid) of [react-native-fs](https://github.com/itinance/react-native-fs).

Example (using react-native-fs):

```javascript
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const file = 'file-to-open.doc'; // this is your file name

// feel free to change main path according to your requirements
const dest = `${RNFS.DocumentDirectoryPath}/${file}`;

RNFS.copyFileAssets(file, dest)
.then(() => FileViewer.open(dest))
.then(() => {
   // success
})
.catch(error => {
   /* */
});

```

### Download and open a file (using [react-native-fs](https://github.com/itinance/react-native-fs))
No function about file downloading has been implemented in this package.
Use [react-native-fs](https://github.com/itinance/react-native-fs) or any similar library for this purpose.

Example (using react-native-fs):

```javascript
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { Platform } from 'react-native';

const url = 'https://www.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/PDF32000_2008.pdf';

// Feel free to change main path according to your requirements.

// IMPORTANT: A file extension is always required on iOS.
// You might encounter issues if the file extension isn't included
// or if the extension doesn't match the mime type of the file.
const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.pdf`;

const options = {
  fromUrl: url,
  toFile: localFile
};
RNFS.downloadFile(options).promise
.then(() => FileViewer.open(localFile))
.then(() => {
	// success
})
.catch(error => {
	// error
});
```
