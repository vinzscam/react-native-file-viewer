import { MimeType } from "../../interface/MimeType";
import { AndroidManifest, Query } from "../interface/AndroidManifest";
import { queriesHasMimeType } from "./util/hasMimeType";
import { isValidMimeType } from "./util/isValidMimeType";

export const MIMETYPE_IS_NOT_VALID_TYPE =
  "android.mimeTypes must be a string or array of string.";
export const MIMETYPE_IS_NOT_VALID_MIMETYPE = `android.mimeTypes is not valid. Format should be */* or type/subtype. 
  ie: ["image/png", "application/*"] | "*/*"`;

export const addAndroidQueriesMimeTypes = (
  androidManifest: AndroidManifest,
  mimeTypes: MimeType[] | MimeType = "*/*"
): AndroidManifest => {
  if (!(typeof mimeTypes === "string" || Array.isArray(mimeTypes)))
    throw new Error(MIMETYPE_IS_NOT_VALID_TYPE);

  const queries: Query[] = [
    {
      ...androidManifest.manifest.queries?.[0],
      intent: [...(androidManifest.manifest.queries?.[0].intent || [])],
    },
    ...(androidManifest.manifest.queries?.slice(1) || []),
  ];

  if (Array.isArray(mimeTypes)) {
    mimeTypes.forEach((mimeType) => {
      if (!isValidMimeType(mimeType))
        throw new Error(MIMETYPE_IS_NOT_VALID_MIMETYPE);

      if (!queriesHasMimeType(queries, mimeType))
        queries[0].intent?.push({
          action: { $: { "android:name": "android.intent.action.VIEW" } },
          data: [{ $: { "android:mimeType": mimeType } }],
        });
    });
  } else {
    const mimeType = mimeTypes;
    if (!isValidMimeType(mimeType))
      throw new Error(MIMETYPE_IS_NOT_VALID_MIMETYPE);
    if (!queriesHasMimeType(queries, mimeType))
      queries[0].intent?.push({
        action: { $: { "android:name": "android.intent.action.VIEW" } },
        data: [{ $: { "android:mimeType": mimeType } }],
      });
  }

  androidManifest.manifest.queries = queries;

  return androidManifest;
};
