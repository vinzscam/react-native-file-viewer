import { ConfigPlugin, withAndroidManifest } from "@expo/config-plugins";
import { Props } from "../../interface/Props";
import { addAndroidQueriesMimeTypes } from "./addAndroidQueriesMimeTypes";

export const withFileViewerAndroidManifest: ConfigPlugin<Props["android"]> = (
  config,
  props
) => {
  return withAndroidManifest(config, (config) => {
    config.modResults = addAndroidQueriesMimeTypes(
      config.modResults,
      props?.mimeTypes
    );

    return config;
  });
};
