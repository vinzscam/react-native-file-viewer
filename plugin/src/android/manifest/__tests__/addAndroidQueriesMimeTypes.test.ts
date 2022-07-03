import {
  AndroidManifest,
  Query,
  QueryIntent,
} from "../../interface/AndroidManifest";
import {
  addAndroidQueriesMimeTypes,
  MIMETYPE_IS_NOT_VALID_MIMETYPE,
  MIMETYPE_IS_NOT_VALID_TYPE,
} from "../addAndroidQueriesMimeTypes";

const androidManifest: AndroidManifest = {
  manifest: {
    $: {
      "xmlns:android": "",
    },
  },
};

const imageIntent: QueryIntent = {
  action: { $: { "android:name": "android.intent.action.VIEW" } },
  data: [{ $: { "android:mimeType": "image/*" } }],
};

const applicationIntent: QueryIntent = {
  action: { $: { "android:name": "android.intent.action.VIEW" } },
  data: [{ $: { "android:mimeType": "application/*" } }],
};

describe(addAndroidQueriesMimeTypes, () => {
  it('did add "image/*"', () => {
    expect(
      addAndroidQueriesMimeTypes(androidManifest, "image/*").manifest.queries
    ).toStrictEqual<Query[]>([{ intent: [imageIntent] }]);
  });
  it('did add ["image/*", "application/*"]', () => {
    expect(
      addAndroidQueriesMimeTypes(androidManifest, ["image/*", "application/*"])
        .manifest.queries
    ).toStrictEqual<Query[]>([{ intent: [imageIntent, applicationIntent] }]);
  });
  it("should throw with wrong type", () => {
    expect(() => addAndroidQueriesMimeTypes(androidManifest, 1 as any)).toThrow(
      MIMETYPE_IS_NOT_VALID_TYPE
    );
  });
  it("should throw if mimetype is invalid", () => {
    expect(() =>
      addAndroidQueriesMimeTypes(androidManifest, "*/application" as any)
    ).toThrow(MIMETYPE_IS_NOT_VALID_MIMETYPE);
    expect(() =>
      addAndroidQueriesMimeTypes(androidManifest, [
        "*/application",
        "*/*",
      ] as any)
    ).toThrow(MIMETYPE_IS_NOT_VALID_MIMETYPE);
  });
});
