export type LocalStorageAPI = {
    clearItem: (key: string) => void;
    getItem: (key: string) => object | string | null;
    setItem: (key: string, item: object | string) => void;
};
