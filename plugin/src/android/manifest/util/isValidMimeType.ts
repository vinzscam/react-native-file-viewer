import { MimeType } from "../../../interface/MimeType";

const ValidMimeTypeRegex = /^(\w+\/(\w+|\*)|\*\/\*)$/;

export const isValidMimeType = (mimeType: string): mimeType is MimeType =>
  ValidMimeTypeRegex.test(mimeType);
