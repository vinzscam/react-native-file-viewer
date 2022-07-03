import { AndroidConfig } from "@expo/config-plugins";
import { MimeType } from "../../interface/MimeType";

type InnerManifest = AndroidConfig.Manifest.AndroidManifest["manifest"];

interface ManifestAction {
  $?: { "android:name"?: "android.intent.action.VIEW" };
}

interface ManifestData {
  $?: { "android:mimeType"?: MimeType };
}

export interface QueryIntent {
  action?: ManifestAction;
  data?: ManifestData[];
}

export interface Query {
  intent?: QueryIntent[];
}

export interface AndroidManifest
  extends AndroidConfig.Manifest.AndroidManifest {
  manifest: InnerManifest & {
    queries?: Query[];
  };
}
