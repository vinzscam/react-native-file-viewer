interface RNFileViewerOptions {
    displayName?: string;
    showAppsSuggestions?: boolean;
    showOpenWithDialog?: boolean;
    onDismiss?(): any;
}

export function open(
  path: string,
  options?: RNFileViewerOptions | string
): Promise<void>;
