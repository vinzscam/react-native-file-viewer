interface RNFileViewerOptions {
    displayName?: string;
    showAppsSuggestions?: boolean;
    showOpenWithDialog?: boolean;
}

export function open(
  path: string,
  options?: RNFileViewerOptions | string
): Promise<void>;
