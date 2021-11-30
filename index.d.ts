interface RNFileViewerOptions {
  displayName?: string;
  showAppsSuggestions?: boolean;
  showOpenWithDialog?: boolean;
  onDismiss?(): any;
}

declare function open(
  path: string,
  options?: RNFileViewerOptions | string
): Promise<void>;

declare namespace _default {
  export { open };
}

export default _default;
