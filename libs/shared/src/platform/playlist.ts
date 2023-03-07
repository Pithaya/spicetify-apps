export type PlaylistAPI = {
    add(
        playlistUri: string,
        tracks: string[],
        options: any | { after: 'end' }
    ): Promise<void>;
    applyModifications(
        playlistUri: string,
        modification: {
            operation: string | 'add';
            uris: string[];
            after: 'end' | string;
        }
    ): Promise<void>;
};
