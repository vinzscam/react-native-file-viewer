import { NativeEventEmitter, NativeModules, Platform } from "react-native";

const { RNFileViewer } = NativeModules;
const eventEmitter = new NativeEventEmitter(RNFileViewer);

let lastId = 0;

function open(path, options = {}) {
  const _options =
    typeof options === "string" ? { displayName: options } : options;
  const { onDismiss, ...nativeOptions } = _options;

  if (!["android", "ios"].includes(Platform.OS)) {
    return RNFileViewer.open(path, nativeOptions);
  }

  return new Promise((resolve, reject) => {
    const currentId = ++lastId;

    const openSubscription = eventEmitter.addListener(
      "RNFileViewerDidOpen",
      ({ id, error }) => {
        if (id === currentId) {
          openSubscription.remove();
          return error ? reject(new Error(error)) : resolve();
        }
      }
    );
    const dismissSubscription = eventEmitter.addListener(
      "RNFileViewerDidDismiss",
      ({ id }) => {
        if (id === currentId) {
          dismissSubscription.remove();
          onDismiss && onDismiss();
        }
      }
    );

    RNFileViewer.open(normalize(path), currentId, nativeOptions);
  });
}

function normalize(path) {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    const filePrefix = "file://";
    if (path.startsWith(filePrefix)) {
      path = path.substring(filePrefix.length);
      try {
        path = decodeURI(path);
      } catch (e) {}
    }
  }
  return path;
}

export default { open };
export { open };
