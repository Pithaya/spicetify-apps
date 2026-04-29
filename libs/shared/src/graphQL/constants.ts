import type { QueryDefinition } from './types/shared/query-definition';

export const GRAPHQL_MAX_LIMIT = 100;

export const QueryDefinitionsFallback: Record<
    Spicetify.GraphQL.Query,
    QueryDefinition
> = {
    fetchExtractedColors: {
        name: 'fetchExtractedColors',
        operation: 'query',
        sha256Hash:
            '36e90fcaea00d47c695fce31874efeb2519b97d4cd0ee1abfb4f8dc9348596ea',
        value: null,
    },
    getAlbumNameAndTracks: {
        name: 'getAlbumNameAndTracks',
        operation: 'query',
        sha256Hash:
            '8628ad33de3267d7bef516c76a746979a5f98891a2c9eaff3dfec828abdcd983',
        value: null,
    },
    getEpisodeName: {
        name: 'getEpisodeName',
        operation: 'query',
        sha256Hash:
            '508f9db2e7dc340c338950dc67a6045ee1406703646f23b760986fa689c239b1',
        value: null,
    },
    getPodcastOrBookName: {
        name: 'getPodcastOrBookName',
        operation: 'query',
        sha256Hash:
            '631676b4cf1eb7c93d1133e3f1f17e5bfe8d6a5e2fb9560148bac61f1531f267',
        value: null,
    },
    getTrackName: {
        name: 'getTrackName',
        operation: 'query',
        sha256Hash:
            '3dee761788854e8dd9239e13ce0d712da031fb8c2036f096a1c765062b410660',
        value: null,
    },
    queryWhatsNewFeed: {
        name: 'queryWhatsNewFeed',
        operation: 'query',
        sha256Hash:
            'd889c8c936ab192af8ced595427f5ba2acdf63478fdc0a181c8d477f8322630e',
        value: null,
    },
    whatsNewFeedNewItems: {
        name: 'whatsNewFeedNewItems',
        operation: 'query',
        sha256Hash:
            'd889c8c936ab192af8ced595427f5ba2acdf63478fdc0a181c8d477f8322630e',
        value: null,
    },
    SetItemsStateInWhatsNewFeed: {
        name: 'SetItemsStateInWhatsNewFeed',
        operation: 'mutation',
        sha256Hash:
            'd889c8c936ab192af8ced595427f5ba2acdf63478fdc0a181c8d477f8322630e',
        value: null,
    },
    queryAlbumTrackUris: {
        name: 'queryAlbumTrackUris',
        operation: 'query',
        sha256Hash:
            'a2a17981f8439ca1798f56260277d9d7800ec0ca7040053b564e0f975d8aa344',
        value: null,
    },
    getArtistNameAndTracks: {
        name: 'getArtistNameAndTracks',
        operation: 'query',
        sha256Hash:
            '0adaf1a1a8a94c7ed095639c4d9456d2b1cfac16ac511d5dd2b01b6dd89f748a',
        value: null,
    },
    queryTrackArtists: {
        name: 'queryTrackArtists',
        operation: 'query',
        sha256Hash:
            'ee2b038198f5e62c679c3996584d9249bbee55fe69fc212271c56492a022c798',
        value: null,
    },
    canvas: {
        name: 'canvas',
        operation: 'query',
        sha256Hash:
            '575138ab27cd5c1b3e54da54d0a7cc8d85485402de26340c2145f0f6bb5e7a9f',
        value: null,
    },
    recentSearches: {
        name: 'recentSearches',
        operation: 'query',
        sha256Hash:
            '3f8b6efeae2444ce82a102c50e476374b6b14c4f97010d7fbe3fd15585c32869',
        value: null,
    },
    saveRecentSearches: {
        name: 'saveRecentSearches',
        operation: 'mutation',
        sha256Hash:
            '3f8b6efeae2444ce82a102c50e476374b6b14c4f97010d7fbe3fd15585c32869',
        value: null,
    },
    removeRecentSearches: {
        name: 'removeRecentSearches',
        operation: 'mutation',
        sha256Hash:
            '3f8b6efeae2444ce82a102c50e476374b6b14c4f97010d7fbe3fd15585c32869',
        value: null,
    },
    searchSuggestions: {
        name: 'searchSuggestions',
        operation: 'query',
        sha256Hash:
            '9fe3ad78e43a1684b3a9fabc741c5928928d4d30d7d8fd7fd193c7ebb4a544f4',
        value: null,
    },
    queryNpvEpisodeChapters: {
        name: 'queryNpvEpisodeChapters',
        operation: 'query',
        sha256Hash:
            '367f0e93a0d219ae6f5874bcc460201db0a43467ae94f16298931a704ac62ea6',
        value: null,
    },
    queryNpvEpisode: {
        name: 'queryNpvEpisode',
        operation: 'query',
        sha256Hash:
            '5460cf262b0eed4ca71be308a0e4991ac72184660ed504af77ee2440d79ba7b6',
        value: null,
    },
    npvPageContent: {
        name: 'npvPageContent',
        operation: 'query',
        sha256Hash:
            '28f282055d667fce7095bbd1597fb7f0f0621de4dab51a6e45bc28796c3683ad',
        value: null,
    },
    getAlbum: {
        name: 'getAlbum',
        operation: 'query',
        sha256Hash:
            'b9bfabef66ed756e5e13f68a942deb60bd4125ec1f1be8cc42769dc0259b4b10',
        value: null,
    },
    queryAlbumTracks: {
        name: 'queryAlbumTracks',
        operation: 'query',
        sha256Hash:
            'b9bfabef66ed756e5e13f68a942deb60bd4125ec1f1be8cc42769dc0259b4b10',
        value: null,
    },
    queryArtistOverview: {
        name: 'queryArtistOverview',
        operation: 'query',
        sha256Hash:
            '7f86ff63e38c24973a2842b672abe44c910c1973978dc8a4a0cb648edef34527',
        value: null,
    },
    getVideoTrackAssociatedAlbum: {
        name: 'getVideoTrackAssociatedAlbum',
        operation: 'query',
        sha256Hash:
            'e9ecdc49f7777062fc841415262d47c3927e09ab6e6845b420a373caec602812',
        value: null,
    },
    queryArtistAppearsOn: {
        name: 'queryArtistAppearsOn',
        operation: 'query',
        sha256Hash:
            '9a4bb7a20d6720fe52d7b47bc001cfa91940ddf5e7113761460b4a288d18a4c1',
        value: null,
    },
    queryArtistDiscographyAlbums: {
        name: 'queryArtistDiscographyAlbums',
        operation: 'query',
        sha256Hash:
            '5e07d323febb57b4a56a42abbf781490e58764aa45feb6e3dc0591564fc56599',
        value: null,
    },
    queryArtistDiscographySingles: {
        name: 'queryArtistDiscographySingles',
        operation: 'query',
        sha256Hash:
            '5e07d323febb57b4a56a42abbf781490e58764aa45feb6e3dc0591564fc56599',
        value: null,
    },
    queryArtistDiscographyCompilations: {
        name: 'queryArtistDiscographyCompilations',
        operation: 'query',
        sha256Hash:
            '5e07d323febb57b4a56a42abbf781490e58764aa45feb6e3dc0591564fc56599',
        value: null,
    },
    queryArtistDiscographyAll: {
        name: 'queryArtistDiscographyAll',
        operation: 'query',
        sha256Hash:
            '5e07d323febb57b4a56a42abbf781490e58764aa45feb6e3dc0591564fc56599',
        value: null,
    },
    queryArtistDiscographyOverview: {
        name: 'queryArtistDiscographyOverview',
        operation: 'query',
        sha256Hash:
            '5e07d323febb57b4a56a42abbf781490e58764aa45feb6e3dc0591564fc56599',
        value: null,
    },
    queryArtistDiscoveredOn: {
        name: 'queryArtistDiscoveredOn',
        operation: 'query',
        sha256Hash:
            '71c2392e4cecf6b48b9ad1311ae08838cbdabcfd189c6bf0c66c2430b8dcfdb1',
        value: null,
    },
    queryArtistFeaturing: {
        name: 'queryArtistFeaturing',
        operation: 'query',
        sha256Hash:
            '20842d6d9d2d28ef945984b68cb927bb33edd00eab84a8da1667def21f1f2c54',
        value: null,
    },
    queryArtistPlaylists: {
        name: 'queryArtistPlaylists',
        operation: 'query',
        sha256Hash:
            '54f7e5a5a2af05b7dc98526df376a46c6b15c05440c8dfdc8f6cecb1a807eca7',
        value: null,
    },
    queryArtistRelated: {
        name: 'queryArtistRelated',
        operation: 'query',
        sha256Hash:
            '3d031d6cb22a2aa7c8d203d49b49df731f58b1e2799cc38d9876d58771aa66f3',
        value: null,
    },
    queryArtistRelatedVideos: {
        name: 'queryArtistRelatedVideos',
        operation: 'query',
        sha256Hash:
            '8958042d3dd127ec7882a7117fafa4df21af27ff1560af51e55061e8451de67b',
        value: null,
    },
    queryArtistMinimal: {
        name: 'queryArtistMinimal',
        operation: 'query',
        sha256Hash:
            '53d3f76582c49ad0a05dc685955f20dc2a5f2209b192e5446e5e4e623ce23a48',
        value: null,
    },
    ArtistConcerts: {
        name: 'ArtistConcerts',
        operation: 'query',
        sha256Hash:
            'ef53c43b865496b9890b7167eab1dc614a8949ef9451b3c41184ea888de8bd2b',
        value: null,
    },
    ArtistConcertsPageLocation: {
        name: 'ArtistConcertsPageLocation',
        operation: 'query',
        sha256Hash:
            '320698465a352f0d0247ec8ed02471244106d4199820f99de4d0a785561c2b03',
        value: null,
    },
    concertCount: {
        name: 'concertCount',
        operation: 'query',
        sha256Hash:
            '29be9d486e073a49268e13ed9e2d2180187e669fcb7a19b98011aca7ab61b141',
        value: null,
    },
    searchConcertLocations: {
        name: 'searchConcertLocations',
        operation: 'query',
        sha256Hash:
            '43ededefcba8b3f519fd0c2d6c025dfeec9f742cf47d04a3c3711d95b27deda3',
        value: null,
    },
    saveLocation: {
        name: 'saveLocation',
        operation: 'mutation',
        sha256Hash:
            '5502351e9f201ae29014ca55d3b24b755ba261a1a9eb35fb498cb4c7df419353',
        value: null,
    },
    concertLocationsByLatLon: {
        name: 'concertLocationsByLatLon',
        operation: 'query',
        sha256Hash:
            '8a059d072a17a1199feb21fe846271f1680eda87010c832852ced0c55c6c7c96',
        value: null,
    },
    userLocation: {
        name: 'userLocation',
        operation: 'query',
        sha256Hash:
            '079939378ca79b67c6d047be9152ea940d21f10bbfa2f5d4cf4d8320d87774c2',
        value: null,
    },
    queryNpvArtist: {
        name: 'queryNpvArtist',
        operation: 'query',
        sha256Hash:
            'b2cedf7ed0f29c713567d97ed69b848c8387294edfe58a0e439a3a5669cc27bb',
        value: null,
    },
    getDynamicColorsByUris: {
        name: 'getDynamicColorsByUris',
        operation: 'query',
        sha256Hash:
            'f0f112945d6d745bd8ff790317bbf8d310036da75df33130490e9d6dc96c59d9',
        value: null,
    },
    episodeSponsoredContent: {
        name: 'episodeSponsoredContent',
        operation: 'query',
        sha256Hash:
            'a5c1fe722b60c29ad247ea3df57ace52043382a7f080d525f58745db78a42618',
        value: null,
    },
    getTrack: {
        name: 'getTrack',
        operation: 'query',
        sha256Hash:
            '612585ae06ba435ad26369870deaae23b5c8800a256cd8a57e08eddc25a37294',
        value: null,
    },
    home: {
        name: 'home',
        operation: 'query',
        sha256Hash:
            '23e37f2e58d82d567f27080101d36609009d8c3676457b1086cb0acc55b72a5d',
        value: null,
    },
    homeSection: {
        name: 'homeSection',
        operation: 'query',
        sha256Hash:
            '23e37f2e58d82d567f27080101d36609009d8c3676457b1086cb0acc55b72a5d',
        value: null,
    },
    homePinnedSections: {
        name: 'homePinnedSections',
        operation: 'query',
        sha256Hash:
            '23e37f2e58d82d567f27080101d36609009d8c3676457b1086cb0acc55b72a5d',
        value: null,
    },
    seoRecommendedTrackPlaylistDesktop: {
        name: 'seoRecommendedTrackPlaylistDesktop',
        operation: 'query',
        sha256Hash:
            '2121830f81030dea46648d65a05c430cd822f08db6aaa18c7f35cc9b93c22396',
        value: null,
    },
    similarAlbumsBasedOnThisTrack: {
        name: 'similarAlbumsBasedOnThisTrack',
        operation: 'query',
        sha256Hash:
            '1d1f93a737498adca2c892c73af87fc0b052afe4e1a33c989540c32413dfae17',
        value: null,
    },
    lookupEntity: {
        name: 'lookupEntity',
        operation: 'query',
        sha256Hash:
            '027903e8eb620517d49218421ddb2a4032e64c43ab0f9d015571a71ef2e31c6b',
        value: null,
    },
    addComment: {
        name: 'addComment',
        operation: 'mutation',
        sha256Hash:
            '504a54dcb144fc345869c93887152f53450bd41298b6edb57d9e3b1c5aae92e6',
        value: null,
    },
    addCommentReaction: {
        name: 'addCommentReaction',
        operation: 'mutation',
        sha256Hash:
            '0af9821ff5cc680412c61c470d55493fe26e6cf938101a93b18c7cc8e5590acb',
        value: null,
    },
    addCommentReply: {
        name: 'addCommentReply',
        operation: 'mutation',
        sha256Hash:
            'd4046f61457dad19e9315f8829a92e6d162592729d08ed0f9fe70f4c04cd09ae',
        value: null,
    },
    deleteComment: {
        name: 'deleteComment',
        operation: 'mutation',
        sha256Hash:
            '9ecb2804fc1c8f85f8112ffc962b038a31a1c63d59bcf8b5fb23cb2765b8b6d9',
        value: null,
    },
    deleteCommentReaction: {
        name: 'deleteCommentReaction',
        operation: 'mutation',
        sha256Hash:
            'b93a40eaa470fcaaa886352e3268e3e5c6e303e11e8b849490e98ba158796cca',
        value: null,
    },
    deleteCommentReply: {
        name: 'deleteCommentReply',
        operation: 'mutation',
        sha256Hash:
            '5cef2a525100a08976bf6079771d5b88b1ec8b0fe5eee402185a7449e53d494c',
        value: null,
    },
    getCommentsForEntity: {
        name: 'getCommentsForEntity',
        operation: 'query',
        sha256Hash:
            'bba34fe5f2da3aaa25ab5c90eef1fe2036d325bf32e791ae462b637665185d83',
        value: null,
    },
    getReactions: {
        name: 'getReactions',
        operation: 'query',
        sha256Hash:
            '0d209bf9507779887fe2b3032d1afd8f35de8425b01aead094698ff1abecda71',
        value: null,
    },
    getReplies: {
        name: 'getReplies',
        operation: 'query',
        sha256Hash:
            'a2018b23184ee9c8f355f5bcb0584aa3afbacaed6912195a367aa1bb807359f6',
        value: null,
    },
    assistedCurationSearch: {
        name: 'assistedCurationSearch',
        operation: 'query',
        sha256Hash:
            'f78953bf9207d73493c27284103f5aeb6e728876d5793851bf79bc706127ff70',
        value: null,
    },
    assistedCurationSearchAlbum: {
        name: 'assistedCurationSearchAlbum',
        operation: 'query',
        sha256Hash:
            'e33489c81fdab1986d8b785fb9bf13993a2d5ff171190c575963f97e525870fe',
        value: null,
    },
    assistedCurationSearchArtist: {
        name: 'assistedCurationSearchArtist',
        operation: 'query',
        sha256Hash:
            'a562324cea8976b4d51f08cee971bb180ce9279c947d27e0814675220b160cf7',
        value: null,
    },
    isFollowingUsers: {
        name: 'isFollowingUsers',
        operation: 'query',
        sha256Hash:
            'c00e0cb6c7766e7230fc256cf4fe07aec63b53d1160a323940fce7b664e95596',
        value: null,
    },
    followUsers: {
        name: 'followUsers',
        operation: 'mutation',
        sha256Hash:
            'c00e0cb6c7766e7230fc256cf4fe07aec63b53d1160a323940fce7b664e95596',
        value: null,
    },
    unfollowUsers: {
        name: 'unfollowUsers',
        operation: 'mutation',
        sha256Hash:
            'c00e0cb6c7766e7230fc256cf4fe07aec63b53d1160a323940fce7b664e95596',
        value: null,
    },
    decorateContextEpisodesOrChapters: {
        name: 'decorateContextEpisodesOrChapters',
        operation: 'query',
        sha256Hash:
            '383de00240775c39a6afe0b1055dc562b2a3930894201f9762f3fc32a74971c7',
        value: null,
    },
    decorateContextTracks: {
        name: 'decorateContextTracks',
        operation: 'query',
        sha256Hash:
            '383de00240775c39a6afe0b1055dc562b2a3930894201f9762f3fc32a74971c7',
        value: null,
    },
    createJamSession: {
        name: 'createJamSession',
        operation: 'mutation',
        sha256Hash:
            '9efef22d0efcb333b5e919e454c5f668996fbfc9a011063509bb7f39a8fd1905',
        value: null,
    },
    deleteJamSession: {
        name: 'deleteJamSession',
        operation: 'mutation',
        sha256Hash:
            'fada158e3224d3a6ceeb092294801bca19951c17f42f30786e7cdaa1c714cb95',
        value: null,
    },
    getJamInfo: {
        name: 'getJamInfo',
        operation: 'query',
        sha256Hash:
            '86da65b2a2f9c27e4cd45c7afcb44edd65e0165a232084f14f7ea093e0de0f1c',
        value: null,
    },
    jamStatus: {
        name: 'jamStatus',
        operation: 'query',
        sha256Hash:
            '6c8baf5fcf678c0fb8f36369ba1eecb432ea8cd1bbf605dc12c375fbba39bd8d',
        value: null,
    },
    joinJamSession: {
        name: 'joinJamSession',
        operation: 'mutation',
        sha256Hash:
            '4db659bf7342c26bdaa3fe7441d785c162219e653c12f01b093504af47f5c380',
        value: null,
    },
    leaveJamSession: {
        name: 'leaveJamSession',
        operation: 'mutation',
        sha256Hash:
            '3ab270281fa7672444df5347d15589a853963598fc8bad67bf62538574c16c52',
        value: null,
    },
    removeAllJamMembers: {
        name: 'removeAllJamMembers',
        operation: 'mutation',
        sha256Hash:
            'f0ab9b12619ac19a881153ad090990b0376cb8ac492306c1b313ac24318c75a2',
        value: null,
    },
    removeJamMember: {
        name: 'removeJamMember',
        operation: 'mutation',
        sha256Hash:
            '04af671553551742358971ebc08c23dd2d28d482c256ca3384d1ad5f5a8313f1',
        value: null,
    },
    setDeviceBroadcastStatus: {
        name: 'setDeviceBroadcastStatus',
        operation: 'mutation',
        sha256Hash:
            '50756955954ce12d03d2279c57e6d22fc0c09b8f174f6da285b56b50abb16204',
        value: null,
    },
    setParticipantVolumeControl: {
        name: 'setParticipantVolumeControl',
        operation: 'mutation',
        sha256Hash:
            '0cb9c9ded7c3d1e94638d388a67ed5ee72ee40009fd8fa69c0a2e523deca5147',
        value: null,
    },
    setQueueOnlyMode: {
        name: 'setQueueOnlyMode',
        operation: 'mutation',
        sha256Hash:
            '7ea4a982c8949c8f7288bae754a127150597eb6b4ce4a83ab2144fb4765af20c',
        value: null,
    },
    addToPlaylist: {
        name: 'addToPlaylist',
        operation: 'mutation',
        sha256Hash:
            '47b2a1234b17748d332dd0431534f22450e9ecbb3d5ddcdacbd83368636a0990',
        value: null,
    },
    removeFromPlaylist: {
        name: 'removeFromPlaylist',
        operation: 'mutation',
        sha256Hash:
            '47b2a1234b17748d332dd0431534f22450e9ecbb3d5ddcdacbd83368636a0990',
        value: null,
    },
    moveItemsInPlaylist: {
        name: 'moveItemsInPlaylist',
        operation: 'mutation',
        sha256Hash:
            '47b2a1234b17748d332dd0431534f22450e9ecbb3d5ddcdacbd83368636a0990',
        value: null,
    },
    recents: {
        name: 'recents',
        operation: 'query',
        sha256Hash:
            '698be5892a3cc95331deebeff463d05dfdd5febf5254bea30b895b5a93dfb584',
        value: null,
    },
    isCurated: {
        name: 'isCurated',
        operation: 'query',
        sha256Hash:
            'e4ed1f91a2cc5415befedb85acf8671dc1a4bf3ca1a5b945a6386101a22e28a6',
        value: null,
    },
    applyCurations: {
        name: 'applyCurations',
        operation: 'mutation',
        sha256Hash:
            '05b739a3a73091c213385233b9d3ed8a857c2ca29d2eebadb3d04ed12e288697',
        value: null,
    },
    applyCurationsV2: {
        name: 'applyCurationsV2',
        operation: 'mutation',
        sha256Hash:
            '8d106cadf80dbe8dfaf62746b254b8e90aff782ba50c14a3c451b528b527a382',
        value: null,
    },
    editablePlaylists: {
        name: 'editablePlaylists',
        operation: 'query',
        sha256Hash:
            'd5c4b8096437dcc2ac9528c91dfcd299e35b747cda2f8f75d28f41f49c5092ba',
        value: null,
    },
    isCuratedEntities: {
        name: 'isCuratedEntities',
        operation: 'query',
        sha256Hash:
            'af6bb0d2691f78f9169e1ba2dfed34a414bb4994e858f81487d6a26b95280566',
        value: null,
    },
    curateItems: {
        name: 'curateItems',
        operation: 'mutation',
        sha256Hash:
            '7ec153d699355ef54da22366723b66b11aae0c288b166dc6813b70ac91901af1',
        value: null,
    },
    addToLibrary: {
        name: 'addToLibrary',
        operation: 'mutation',
        sha256Hash:
            '7c5a69420e2bfae3da5cc4e14cbc8bb3f6090f80afc00ffc179177f19be3f33d',
        value: null,
    },
    removeFromLibrary: {
        name: 'removeFromLibrary',
        operation: 'mutation',
        sha256Hash:
            '7c5a69420e2bfae3da5cc4e14cbc8bb3f6090f80afc00ffc179177f19be3f33d',
        value: null,
    },
    pinLibraryItem: {
        name: 'pinLibraryItem',
        operation: 'mutation',
        sha256Hash:
            '7c5a69420e2bfae3da5cc4e14cbc8bb3f6090f80afc00ffc179177f19be3f33d',
        value: null,
    },
    unpinLibraryItem: {
        name: 'unpinLibraryItem',
        operation: 'mutation',
        sha256Hash:
            '7c5a69420e2bfae3da5cc4e14cbc8bb3f6090f80afc00ffc179177f19be3f33d',
        value: null,
    },
    libraryV3: {
        name: 'libraryV3',
        operation: 'query',
        sha256Hash:
            '973e511ca44261fda7eebac8b653155e7caee3675abb4fb110cc1b8c78b091c3',
        value: null,
    },
    areEntitiesInLibrary: {
        name: 'areEntitiesInLibrary',
        operation: 'query',
        sha256Hash:
            '134337999233cc6fdd6b1e6dbf94841409f04a946c5c7b744b09ba0dfe5a85ed',
        value: null,
    },
    fetchLibraryTracks: {
        name: 'fetchLibraryTracks',
        operation: 'query',
        sha256Hash:
            '087278b20b743578a6262c2b0b4bcd20d879c503cc359a2285baf083ef944240',
        value: null,
    },
    fetchPlaylist: {
        name: 'fetchPlaylist',
        operation: 'query',
        sha256Hash:
            '32b05e92e438438408674f95d0fdad8082865dc32acd55bd97f5113b8579092b',
        value: null,
    },
    fetchPlaylistMetadata: {
        name: 'fetchPlaylistMetadata',
        operation: 'query',
        sha256Hash:
            '32b05e92e438438408674f95d0fdad8082865dc32acd55bd97f5113b8579092b',
        value: null,
    },
    fetchPlaylistContents: {
        name: 'fetchPlaylistContents',
        operation: 'query',
        sha256Hash:
            '32b05e92e438438408674f95d0fdad8082865dc32acd55bd97f5113b8579092b',
        value: null,
    },
    getLists: {
        name: 'getLists',
        operation: 'query',
        sha256Hash:
            '0f40e72e0f2469e8d6f474161242af3feda7cf1c4d20785fd73cc2cc8c2dee5f',
        value: null,
    },
    getListsMetadata: {
        name: 'getListsMetadata',
        operation: 'query',
        sha256Hash:
            '0f40e72e0f2469e8d6f474161242af3feda7cf1c4d20785fd73cc2cc8c2dee5f',
        value: null,
    },
    getListsContents: {
        name: 'getListsContents',
        operation: 'query',
        sha256Hash:
            '0f40e72e0f2469e8d6f474161242af3feda7cf1c4d20785fd73cc2cc8c2dee5f',
        value: null,
    },
    playlistPermissions: {
        name: 'playlistPermissions',
        operation: 'query',
        sha256Hash:
            'f4c99a92059b896b9e4e567403abebe666c0625a36286f9c2bb93961374a75c6',
        value: null,
    },
    accountAttributes: {
        name: 'accountAttributes',
        operation: 'query',
        sha256Hash:
            '3030aeca7614b9e00b728c91383fff23d1a7c2982929dc5c9db3dc35e2e5c0be',
        value: null,
    },
    fetchEntitiesForRecentlyPlayed: {
        name: 'fetchEntitiesForRecentlyPlayed',
        operation: 'query',
        sha256Hash:
            '5bb408450626d595cb24363104b612e14f9b966430f599121696e8996ea03794',
        value: null,
    },
    queryShowMetadataV2: {
        name: 'queryShowMetadataV2',
        operation: 'query',
        sha256Hash:
            'aaad798a17a43c0f443c45d630a83df39d2ca1062a090c2e4fb045d6b00ab360',
        value: null,
    },
    queryBookChapters: {
        name: 'queryBookChapters',
        operation: 'query',
        sha256Hash:
            '8f342d1c624755901657fa65cbb80dd3bacbcca2f6d802f570ae3269d59a403e',
        value: null,
    },
    getEpisodeOrChapter: {
        name: 'getEpisodeOrChapter',
        operation: 'query',
        sha256Hash:
            '3416929067571ac4b79db16716be3c6ea5f6265f7975a0ee94b1fc5ee1dc1e9d',
        value: null,
    },
    queryPodcastEpisodes: {
        name: 'queryPodcastEpisodes',
        operation: 'query',
        sha256Hash:
            '06046f9b939d56c8eb7cdbb687da938de1164c006871aec91dc26e4dc7d8eb08',
        value: null,
    },
    centralisedStatePlayerOptions: {
        name: 'centralisedStatePlayerOptions',
        operation: 'query',
        sha256Hash:
            'e2dcfcab470854d4d1c7cb1a851438f14fe0a94d57db7f0b9dde492559d5395d',
        value: null,
    },
    smartShuffle: {
        name: 'smartShuffle',
        operation: 'query',
        sha256Hash:
            '3384085be84fbf2f855b024f99bc06cded1c0fd71af3a8fb8abb84e9656faba2',
        value: null,
    },
    profileAttributes: {
        name: 'profileAttributes',
        operation: 'query',
        sha256Hash:
            '53bcb064f6cd18c23f752bc324a791194d20df612d8e1239c735144ab0399ced',
        value: null,
    },
    trackPreview: {
        name: 'trackPreview',
        operation: 'query',
        sha256Hash:
            'fc26ffc7a1a4f93bd4c2d705649f7dba1de34005b3dc2915549847a9959405d8',
        value: null,
    },
    decorateQueuedByUsers: {
        name: 'decorateQueuedByUsers',
        operation: 'query',
        sha256Hash:
            '1b71b9895bad207fdac0df7ebad17c790260519f853a069ee05f20e51c08636e',
        value: null,
    },
    watchFeedView: {
        name: 'watchFeedView',
        operation: 'query',
        sha256Hash:
            '81276e39c7f8b760711e303d682e0a18bfab83c0ae4aaa33b12b9680fdc1f293',
        value: null,
    },
    watchFeedEntity: {
        name: 'watchFeedEntity',
        operation: 'query',
        sha256Hash:
            'd1a805f815ee0c20281330317d8c00c8fce9026686a86c38bc700ccaefb9ac5c',
        value: null,
    },
    queryTrackCreditsModal: {
        name: 'queryTrackCreditsModal',
        operation: 'query',
        sha256Hash:
            'e2ca40d46cf1fde36562261ccec754f23fb31b561877252e9fe0d6834aabb84b',
        value: null,
    },
    fetchExtractedColorAndImageForAlbumEntity: {
        name: 'fetchExtractedColorAndImageForAlbumEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorAndImageForArtistEntity: {
        name: 'fetchExtractedColorAndImageForArtistEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorAndImageForEpisodeEntity: {
        name: 'fetchExtractedColorAndImageForEpisodeEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorAndImageForPlaylistEntity: {
        name: 'fetchExtractedColorAndImageForPlaylistEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorAndImageForPodcastEntity: {
        name: 'fetchExtractedColorAndImageForPodcastEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorAndImageForTrackEntity: {
        name: 'fetchExtractedColorAndImageForTrackEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorForAlbumEntity: {
        name: 'fetchExtractedColorForAlbumEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorForArtistEntity: {
        name: 'fetchExtractedColorForArtistEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorForEpisodeEntity: {
        name: 'fetchExtractedColorForEpisodeEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorForPlaylistEntity: {
        name: 'fetchExtractedColorForPlaylistEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorForPodcastEntity: {
        name: 'fetchExtractedColorForPodcastEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    fetchExtractedColorForTrackEntity: {
        name: 'fetchExtractedColorForTrackEntity',
        operation: 'query',
        sha256Hash:
            'b2d6d99fb6237952dfa6638385f9c6085f1b1fb9d0468753ca6ad98ff45adc6f',
        value: null,
    },
    showItemsPlayedState: {
        name: 'showItemsPlayedState',
        operation: 'query',
        sha256Hash:
            '4a070b9bfab2e8537a5271e6839bc3ef51501dcac8170b5fb69a98f967c5fb60',
        value: null,
    },
    searchModalEntityPage: {
        name: 'searchModalEntityPage',
        operation: 'query',
        sha256Hash:
            '1bf604eab778ca1b40fabc2a80a9dcd0ae4bfa0d447aea9a8a5551e38682a99e',
        value: null,
    },
    searchModalResults: {
        name: 'searchModalResults',
        operation: 'query',
        sha256Hash:
            '5c10c8121738f9a0e7c685984d237cde29812448b2f87b8b94e85fb52f645fd0',
        value: null,
    },
    getAudiobooksMetadata: {
        name: 'getAudiobooksMetadata',
        operation: 'query',
        sha256Hash:
            '523c71c64749a628f83e6b31a122c76663243730bf02df01fd64abf0f62f572f',
        value: null,
    },
    lookupChildEntities: {
        name: 'lookupChildEntities',
        operation: 'query',
        sha256Hash:
            '91ce02e32b19123de231dc8de91fe4b9ab84eca087d4c015549308d77fbb6d10',
        value: null,
    },
    browseAll: {
        name: 'browseAll',
        operation: 'query',
        sha256Hash:
            'dbd8b55e09a58afc52eab438bc228ba28fd72ac2f2148c6c26354980e4579001',
        value: null,
    },
    searchDesktop: {
        name: 'searchDesktop',
        operation: 'query',
        sha256Hash:
            '8929d7a459f78787b6f0d557f14261faa4d5d8f6ca171cff5bb491ee239caa83',
        value: null,
    },
    searchAlbums: {
        name: 'searchAlbums',
        operation: 'query',
        sha256Hash:
            '5e7d2724fbef31a25f714844bf1313ffc748ebd4bd199eaad50628a4f246a7ab',
        value: null,
    },
    searchArtists: {
        name: 'searchArtists',
        operation: 'query',
        sha256Hash:
            '270905851ba5c7faca81cfe053c2dbd8ceb4f156a0e0ef4b385af75ab69ffd13',
        value: null,
    },
    searchAudiobooks: {
        name: 'searchAudiobooks',
        operation: 'query',
        sha256Hash:
            'e05ac765d02c084f8783d3c1572b23d57761c43f47eb8b87ce2f9ccced3fa068',
        value: null,
    },
    searchAuthors: {
        name: 'searchAuthors',
        operation: 'query',
        sha256Hash:
            '4a9d403a7cbc7e19da5520d619a865472b35382b043bfa458154e73a5c6f46bd',
        value: null,
    },
    searchEpisodes: {
        name: 'searchEpisodes',
        operation: 'query',
        sha256Hash:
            'c9ee277c533bd3f191f9f09bee04f8e4e81bdc48f4d2fadbf67e504c75dc3fe1',
        value: null,
    },
    searchFullEpisodes: {
        name: 'searchFullEpisodes',
        operation: 'query',
        sha256Hash:
            'a63dea054bac1fccbcf2333feaca7165c8077a361649312b41d123791326d09f',
        value: null,
    },
    searchGenres: {
        name: 'searchGenres',
        operation: 'query',
        sha256Hash:
            '9e1c0e056c46239dd1956ea915b988913c87c04ce3dadccdb537774490266f46',
        value: null,
    },
    searchPlaylists: {
        name: 'searchPlaylists',
        operation: 'query',
        sha256Hash:
            'af1730623dc1248b75a61a18bad1f47f1fc7eff802fb0676683de88815c958d8',
        value: null,
    },
    searchPodcasts: {
        name: 'searchPodcasts',
        operation: 'query',
        sha256Hash:
            '0195d9f61b43606d490bca64c3456e3593528cea6cc05c7e822c7c42beed0f4e',
        value: null,
    },
    searchTopResultsOnly: {
        name: 'searchTopResultsOnly',
        operation: 'query',
        sha256Hash:
            '35abe45ebff70bce562d2a995a59df48be3803d4001388f2e59991bac6f20389',
        value: null,
    },
    searchTopResultsList: {
        name: 'searchTopResultsList',
        operation: 'query',
        sha256Hash:
            '329dd73c5051a54df653289fc873ffedb842d095094c2cc58443621836a28ee2',
        value: null,
    },
    searchTracks: {
        name: 'searchTracks',
        operation: 'query',
        sha256Hash:
            '59ee4a659c32e9ad894a71308207594a65ba67bb6b632b183abe97303a51fa55',
        value: null,
    },
    searchUsers: {
        name: 'searchUsers',
        operation: 'query',
        sha256Hash:
            'd3f7547835dc86a4fdf3997e0f79314e7580eaf4aaf2f4cb1e71e189c5dfcb1f',
        value: null,
    },
    getListPlatformListContents: {
        name: 'getListPlatformListContents',
        operation: 'query',
        sha256Hash: '',
        value: null,
    },
};
