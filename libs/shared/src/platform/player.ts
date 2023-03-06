export type PlayerAPI = {
    addToQueue(tracks: { uri: string }[]): Promise<void>;
};
