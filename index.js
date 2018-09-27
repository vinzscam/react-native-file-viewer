import { NativeModules } from 'react-native';

const { RNFileViewer } = NativeModules;

function open(path, options = { }) {
  const _options = (typeof options === 'string')
    ? { displayName: options }
    : options;
  return RNFileViewer.open(path, _options);
}

export default { open };
