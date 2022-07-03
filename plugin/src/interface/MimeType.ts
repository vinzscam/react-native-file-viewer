type MimeParentTypes = "application" | "image" | "audio" | "video" | "text";
export type MimeType = "*/*" | `${MimeParentTypes}/${string}`;
