interface RNFileViewerOptions {
  displayName?: string;
  showAppsSuggestions?: boolean;
  showOpenWithDialog?: boolean;
  intentFlagActivityNewTask?: boolean; // 2023-06-24 (JJ): Supporting intentFlagActivityNewTask in FileViewer.open options parameter
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
