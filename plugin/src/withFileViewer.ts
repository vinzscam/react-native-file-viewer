import {
  withPlugins,
  ConfigPlugin,
  createRunOncePlugin,
} from "@expo/config-plugins";

import { Props } from "./interface/Props";
import { withFileViewerAndroidManifest } from "./android";

interface Package {
  name: string;
  version?: string;
}
let pkg: Package = { name: "react-native-file-viewer" };

try {
  pkg = require("react-native-file-viewer/package.json");
} catch (e) {}

const withFileViewer: ConfigPlugin<Props> = (config, props) => {
  return withPlugins(config, [[withFileViewerAndroidManifest, props.android]]);
};

export default createRunOncePlugin(withFileViewer, pkg.name, pkg.version);
