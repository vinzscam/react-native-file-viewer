import { Query } from "../../interface/AndroidManifest";

export const queryHasMimeType = (query: Query, mimeType: string) =>
  !!(
    query.intent &&
    query.intent.find(
      (intent) =>
        intent.action?.$?.["android:name"] === "android.intent.action.VIEW" &&
        intent.data?.find((data) => data.$?.["android:mimeType"] === mimeType)
    )
  );

export const queriesHasMimeType = (queries: Query[], mimeType: string) =>
  !!queries.find((query) => queryHasMimeType(query, mimeType));
