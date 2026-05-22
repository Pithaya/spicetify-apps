export type GetRecentlyPlayedTracksParams = {
    limit: number;
    offset: number;
};

export type AssistedCurationAPI = {
    /**
     * Get the URIs of the user's most recently played tracks.
     * @param params Page parameters. The API requires a positive `limit`.
     * @returns An array of `spotify:track:*` URIs, most-recent first.
     */
    getRecentlyPlayedTracks: (
        params: GetRecentlyPlayedTracksParams,
    ) => Promise<string[]>;
};
