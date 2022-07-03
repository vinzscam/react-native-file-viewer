import { ConfigPlugin } from "@expo/config-plugins";
declare type MimeParentTypes = "application" | "image" | "audio" | "video" | "text";
declare type MimeType = `${"*" | MimeParentTypes}/${string}`;
export interface Props {
    android?: {
        mimeTypes?: MimeType[] | MimeType;
    };
}
declare const _default: ConfigPlugin<Props>;
export default _default;
