export type Show = {
    items: [
        {
            headerField: string;
            episodeMetadata: {
                link: string;
                name: string;
                length: number;
                covers: {
                    standardLink: string;
                    smallLink: string;
                    largeLink: string;
                    xlargeLink: string;
                };
                manifestId: string;
                description: string;
                publishDate: number;
                language: string;
                available: boolean;
                mediaTypeEnum: string;
                number: number;
                backgroundable: boolean;
                previewManifestId: string;
                isExplicit: boolean;
                previewId: string;
                episodeType: string;
                isMusicAndTalk: boolean;
                extension: [];
                is19PlusOnly: boolean;
                isBookChapter: boolean;
                isPodcastShort: boolean;
            };
            episodeCollectionState: {
                isFollowingShow: boolean;
                isNew: boolean;
                isInListenLater: boolean;
            };
            episodeOfflineState: {
                offlineState: string;
                syncProgress: number;
            };
            episodePlayState: {
                timeLeft: number;
                isPlayable: boolean;
                isPlayed: boolean;
                lastPlayedAt: number;
                playabilityRestriction: string;
            };
        }
    ];
    header: {
        showMetadata: {
            link: string;
            name: string;
            description: string;
            popularity: number;
            publisher: string;
            language: string;
            isExplicit: boolean;
            covers: {
                standardLink: string;
                smallLink: string;
                largeLink: string;
                xlargeLink: string;
            };
            numEpisodes: number;
            consumptionOrder: string;
            mediaTypeEnum: number;
            copyright: [];
            trailerUri: string;
            isMusicAndTalk: boolean;
            extension: [];
            isBook: boolean;
            isCreatorChannel: boolean;
        };
        showCollectionState: {
            isInCollection: boolean;
        };
        showPlayState: {
            latestPlayedEpisodeLink: string;
            playedTime: number;
            isPlayable: boolean;
            playabilityRestriction: string;
            label: string;
        };
        showOfflineState: {
            offlineState: string;
            syncProgress: number;
        };
    };
    unfilteredLength: number;
    length: number;
    loadingContents: boolean;
    unrangedLength: number;
    rangeOffset: number;
};
