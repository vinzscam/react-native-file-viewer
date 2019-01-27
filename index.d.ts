interface RNFileViewerOptions {
    displayName?: string;
    showAppsSuggestions?: boolean;
    showOpenWithDialog?: boolean;
    onDismiss?();
}

export function open(
  path: string,
  options?: RNFileViewerOptions | string
): Promise<void>;
