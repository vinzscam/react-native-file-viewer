
import { NativeModules } from 'react-native';

const { RNFileViewer } = NativeModules;

export function open(path, title) {
  return RNFileViewer.open(path, title);
}

export default { open };
