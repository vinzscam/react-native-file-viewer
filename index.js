
import { NativeModules } from 'react-native';

const { RNFileViewer } = NativeModules;

function open(path, title) {
  return RNFileViewer.open(path, title);
}

export { open };