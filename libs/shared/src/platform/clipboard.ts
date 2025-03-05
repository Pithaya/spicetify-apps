export type ClipboardAPI = {
    copy: (value: object | string) => Promise<void>;
    paste: () => Promise<string>;
};
