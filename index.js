import { NativeModules } from 'react-native';

const { RNFileViewer } = NativeModules;

function open(path, title, openWith = false, showStore = false) {
  return RNFileViewer.open(path, title, openWith, showStore);
}

export default { open };
