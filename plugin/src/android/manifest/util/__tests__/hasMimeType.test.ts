import { Query } from "../../../interface/AndroidManifest";
import { queryHasMimeType, queriesHasMimeType } from "../hasMimeType";

const query: Query = {
  intent: [
    {
      action: {
        $: {
          "android:name": "android.intent.action.VIEW",
        },
      },
      data: [
        {
          $: {
            "android:mimeType": "application/json",
          },
        },
      ],
    },
  ],
};

describe("hasMimeType test", () => {
  describe(queryHasMimeType, () => {
    it('has "application/json" mimeType', () => {
      expect(queryHasMimeType(query, "application/json")).toBe(true);
    });
    it('does not have "image/jpeg" mimeType', () => {
      expect(queryHasMimeType(query, "image/jpeg")).toBe(false);
    });
  });

  describe(queriesHasMimeType, () => {
    it('has "application/json" mimeType', () => {
      expect(queriesHasMimeType([query], "application/json")).toBe(true);
    });
    it('does not have "image/jpeg" mimeType', () => {
      expect(queriesHasMimeType([query], "image/jpeg")).toBe(false);
    });
  });
});
