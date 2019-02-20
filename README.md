
# react-native-file-viewer
Native file viewer for react-native. Preview any type of file supported by the mobile device.

**iOS**: it uses [QuickLook Framework](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/DocumentInteraction_TopicsForIOS/Articles/UsingtheQuickLookFramework.html)

**Android**: it uses `ACTION_VIEW` Intent to start the default app associated with the specified file.

**Windows**: Start the default app associated with the specified file.

## Getting started

`$ npm install react-native-file-viewer --save`

or

`$ yarn add react-native-file-viewer`

### Mostly automatic installation

`$ react-native link react-native-file-viewer`

### Manual installation


#### iOS (CocoaPods)

Add the following to you Podfile:
```
pod 'RNFileViewer', :path => '../node_modules/react-native-file-viewer/ios`
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
4. Copy `android/src/main/res/xml/file_viewer_provider_paths.xml` to your project `res/xml/` directory
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

Follow the instructions in the ['Linking Libraries'](https://github.com/Microsoft/react-native-windows/blob/master/docs/LinkingLibrariesWindows.md) documentation on the react-native-windows GitHub repo. For the first step of adding the project to the Visual Studio solution file, the path to the project should be `../node_modules/react-native-file-viewer/windows/RNFileViewer/RNFileViewer.csproj`.

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
import FileViewer from 'react-native-file-viewer';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

DocumentPicker.show({
  filetype: [DocumentPickerUtil.allFiles()],
}, (error, res) => {
  if(res) {
    FileViewer.open(res.uri)
    .then(() => {
      // success
    })
    .catch(_err => {
      // error
    });
  }
});
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

function getLocalPath (url) {
  const filename = url.split('/').pop();
  // feel free to change main path according to your requirements
  return `${RNFS.DocumentDirectoryPath}/${filename}`;
}

const url = 'https://www.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/PDF32000_2008.pdf';
const localFile = getLocalPath(url);

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
