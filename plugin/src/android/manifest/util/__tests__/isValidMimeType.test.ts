import { isValidMimeType } from "../isValidMimeType";

describe(isValidMimeType, () => {
  it('should match "*/*"', () => expect(isValidMimeType("*/*")).toBe(true));
  it('should match "image/*"', () =>
    expect(isValidMimeType("image/*")).toBe(true));
  it('should not match "*/image"', () =>
    expect(isValidMimeType("*/image")).toBe(false));
  it('should not match "application"', () =>
    expect(isValidMimeType("application")).toBe(false));
  it('should not match "image/jpeg\\napplication/json"', () =>
    expect(isValidMimeType("image/jpeg\napplication/json")).toBe(false));
});
