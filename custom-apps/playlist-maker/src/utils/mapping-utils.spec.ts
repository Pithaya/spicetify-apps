import type { Track } from '@shared/api/models/track';
import type { LibraryAPITrack } from '@shared/platform/library';
import { type LocalTrack } from '@shared/platform/local-files';
import type {
    PlaylistTrack,
    RecommendedTrack,
} from '@shared/platform/playlist';
import { describe, expect, it } from 'vitest';
import { type WorkflowTrack } from '../types/workflow-track';
import {
    type GraphQLAlbum,
    type GraphQLTrack,
    mapGraphQLTrackToWorkflowTrack,
    mapInternalTrackToWorkflowTrack,
    mapRecommendedPlaylistTrackToWorkflowTrack,
    mapWebAPITrackToWorkflowTrack,
} from './mapping-utils';

describe('mapInternalTrackToWorkflowTrack', () => {
    it('should map a LocalTrack correctly', () => {
        const track: LocalTrack = {
            type: 'track',
            uid: '1',
            addedAt: new Date('2025-05-12T21:12:53.000Z'),
            uri: 'spotify:local:track',
            name: 'Track name',
            album: {
                type: 'album',
                uri: 'spotify:local:album',
                name: '',
                images: [
                    {
                        url: 'spotify:localfileimage:path',
                        label: 'standard',
                    },
                ],
            },
            artists: [
                {
                    type: 'artist',
                    uri: 'spotify:local:artist',
                    name: 'Artist names',
                },
            ],
            discNumber: 1,
            trackNumber: 2,
            duration: {
                milliseconds: 232000,
            },
            isExplicit: false,
            isLocal: true,
            isPlayable: true,
            is19PlusOnly: false,
            isBanned: false,
        };

        const mapped = mapInternalTrackToWorkflowTrack(track, {
            source: 'Source',
        });

        expect(mapped).toStrictEqual<WorkflowTrack>({
            uri: 'spotify:local:track',
            name: 'Track name',
            duration: 232000,
            artists: [
                {
                    uri: 'spotify:local:artist',
                    name: 'Artist names',
                },
            ],
            album: {
                uri: 'spotify:local:album',
                name: '',
                images: [
                    {
                        url: 'spotify:localfileimage:path',
                    },
                ],
            },
            isPlayable: true,
            isExplicit: false,
            source: 'Source',
        });
    });

    it('should map a LibraryAPITrack correctly', () => {
        const track: LibraryAPITrack = {
            type: 'track',
            uri: 'spotify:track:xxx',
            name: 'Track name',
            duration: {
                milliseconds: 232000,
            },
            album: {
                type: 'album',
                uri: 'spotify:album:xxx',
                name: 'Album name',
                artist: {
                    type: 'artist',
                    uri: '',
                    name: '',
                },
                images: [
                    {
                        url: 'spotify:image:standard',
                        label: 'standard',
                    },
                    {
                        url: 'spotify:image:small',
                        label: 'small',
                    },
                    {
                        url: 'spotify:image:large',
                        label: 'large',
                    },
                    {
                        url: 'spotify:image:xlarge',
                        label: 'xlarge',
                    },
                ],
            },
            artists: [
                {
                    type: 'artist',
                    uri: 'spotify:artist:xxx',
                    name: 'Artist name',
                },
            ],
            discNumber: 1,
            trackNumber: 2,
            isExplicit: false,
            isPlayable: true,
            isLocal: false,
            is19PlusOnly: false,
            addedAt: '2025-05-12T21:12:53.000Z',
            hasAssociatedVideo: false,
            hasAssociatedAudio: false,
            isBanned: false,
        };

        const mapped = mapInternalTrackToWorkflowTrack(track, {
            source: 'Source',
        });

        expect(mapped).toStrictEqual<WorkflowTrack>({
            uri: 'spotify:track:xxx',
            name: 'Track name',
            duration: 232000,
            artists: [
                {
                    uri: 'spotify:artist:xxx',
                    name: 'Artist name',
                },
            ],
            album: {
                uri: 'spotify:album:xxx',
                name: 'Album name',
                images: [
                    {
                        url: 'spotify:image:standard',
                    },
                    {
                        url: 'spotify:image:small',
                    },
                    {
                        url: 'spotify:image:large',
                    },
                    {
                        url: 'spotify:image:xlarge',
                    },
                ],
            },
            isPlayable: true,
            isExplicit: false,
            source: 'Source',
        });
    });

    it('should map a PlaylistTrack correctly', () => {
        const track: PlaylistTrack = {
            type: 'track',
            uri: 'spotify:track:xxx',
            uid: '37663662613339356634636637656234',
            name: 'Track name',
            duration: {
                milliseconds: 232000,
            },
            album: {
                type: 'album',
                uri: 'spotify:album:xxx',
                name: 'Album name',
                artists: [
                    {
                        type: 'artist',
                        uri: 'spotify:artist:xxx',
                        name: 'Artist name',
                    },
                ],
                images: [
                    {
                        url: 'spotify:image:standard',
                        label: 'standard',
                    },
                    {
                        url: 'spotify:image:small',
                        label: 'small',
                    },
                    {
                        url: 'spotify:image:large',
                        label: 'large',
                    },
                    {
                        url: 'spotify:image:xlarge',
                        label: 'xlarge',
                    },
                ],
            },
            artists: [
                {
                    type: 'artist',
                    uri: 'spotify:artist:xxx',
                    name: 'Artist name',
                },
            ],
            discNumber: 1,
            trackNumber: 2,
            isExplicit: false,
            isPlayable: true,
            isLocal: false,
            is19PlusOnly: false,
            addedAt: '2025-05-12T21:12:53.000Z',
            hasAssociatedVideo: false,
            hasAssociatedAudio: false,
            isBanned: false,
            addedBy: {
                uri: 'spotify:user:xxx',
                displayName: 'User',
                username: 'user',
                images: [],
                type: 'user',
            },
            associatedAudioUri: undefined,
            bpm: undefined,
            formatListAttributes: {},
            isMixable: false,
            key: undefined,
            mediaType: undefined,
            playIndex: null,
        };

        const mapped = mapInternalTrackToWorkflowTrack(track, {
            source: 'Source',
        });

        expect(mapped).toStrictEqual<WorkflowTrack>({
            uri: 'spotify:track:xxx',
            name: 'Track name',
            duration: 232000,
            artists: [
                {
                    uri: 'spotify:artist:xxx',
                    name: 'Artist name',
                },
            ],
            album: {
                uri: 'spotify:album:xxx',
                name: 'Album name',
                images: [
                    {
                        url: 'spotify:image:standard',
                    },
                    {
                        url: 'spotify:image:small',
                    },
                    {
                        url: 'spotify:image:large',
                    },
                    {
                        url: 'spotify:image:xlarge',
                    },
                ],
            },
            isPlayable: true,
            isExplicit: false,
            source: 'Source',
        });
    });
});

describe('mapWebAPITrackToWorkflowTrack', () => {
    it('should map correctly', () => {
        const track: Track = {
            album: {
                album_type: 'album',
                artists: [
                    {
                        external_urls: {
                            spotify: 'https://open.spotify.com/artist/xxx',
                        },
                        href: 'https://api.spotify.com/v1/artists/xxx',
                        id: 'xxx',
                        name: 'Arrtist name',
                        type: 'artist',
                        uri: 'spotify:artist:xxx',
                    },
                ],
                external_urls: {
                    spotify: 'https://open.spotify.com/album/xxx',
                },
                href: 'https://api.spotify.com/v1/albums/xxx',
                id: 'xxx',
                images: [
                    {
                        url: 'https://i.scdn.co/image/xlarge',
                        width: 640,
                        height: 640,
                    },
                    {
                        url: 'https://i.scdn.co/image/large',
                        width: 300,
                        height: 300,
                    },
                    {
                        url: 'https://i.scdn.co/image/small',
                        width: 64,
                        height: 64,
                    },
                ],
                is_playable: true,
                name: 'Album name',
                release_date: '2019-04-28',
                release_date_precision: 'day',
                total_tracks: 10,
                type: 'album',
                uri: 'spotify:album:xxx',
            },
            artists: [
                {
                    external_urls: {
                        spotify: 'https://open.spotify.com/artist/xxx',
                    },
                    href: 'https://api.spotify.com/v1/artists/xxx',
                    id: 'xxx',
                    name: 'Artist name',
                    type: 'artist',
                    uri: 'spotify:artist:xxx',
                },
            ],
            disc_number: 1,
            duration_ms: 232000,
            explicit: false,
            external_ids: { isrc: 'XXX' },
            external_urls: {
                spotify: 'https://open.spotify.com/track/xxx',
            },
            href: 'https://api.spotify.com/v1/tracks/xxx',
            id: 'xxx',
            is_local: false,
            is_playable: true,
            name: 'Track name',
            popularity: 40,
            preview_url: 'https://p.scdn.co/mp3-preview/xxx',
            track_number: 2,
            type: 'track',
            uri: 'spotify:track:xxx',
        };

        const mapped = mapWebAPITrackToWorkflowTrack(track, {
            source: 'Source',
        });

        expect(mapped).toStrictEqual<WorkflowTrack>({
            uri: 'spotify:track:xxx',
            name: 'Track name',
            duration: 232000,
            artists: [
                {
                    uri: 'spotify:artist:xxx',
                    name: 'Artist name',
                },
            ],
            album: {
                uri: 'spotify:album:xxx',
                name: 'Album name',
                images: [
                    {
                        url: 'https://i.scdn.co/image/xlarge',
                    },
                    {
                        url: 'https://i.scdn.co/image/large',
                    },
                    {
                        url: 'https://i.scdn.co/image/small',
                    },
                ],
            },
            isPlayable: true,
            isExplicit: false,
            source: 'Source',
        });
    });
});

describe('mapGraphQLTrackToWorkflowTrack', () => {
    it('should map correctly', () => {
        const track: GraphQLTrack = {
            name: 'Track name',
            uri: 'spotify:track:xxx',
            duration: {
                totalMilliseconds: 232000,
            },
            discNumber: 1,
            artists: {
                items: [
                    {
                        profile: { name: 'Artist name' },
                        uri: 'spotify:artist:xxx',
                    },
                ],
            },
            playability: {
                playable: true,
            },
            saved: false,
            contentRating: {
                label: 'EXPLICIT',
            },
        };

        const album: GraphQLAlbum = {
            name: 'Album name',
            uri: 'spotify:album:xxx',
            coverArt: {
                sources: [
                    {
                        url: 'https://i.scdn.co/image/medium',
                    },
                    {
                        url: 'https://i.scdn.co/image/small',
                    },
                ],
            },
        };

        const mapped = mapGraphQLTrackToWorkflowTrack(track, album, {
            source: 'Source',
        });

        expect(mapped).toStrictEqual<WorkflowTrack>({
            uri: 'spotify:track:xxx',
            name: 'Track name',
            duration: 232000,
            artists: [
                {
                    uri: 'spotify:artist:xxx',
                    name: 'Artist name',
                },
            ],
            album: {
                uri: 'spotify:album:xxx',
                name: 'Album name',
                images: [
                    {
                        url: 'https://i.scdn.co/image/medium',
                    },
                    {
                        url: 'https://i.scdn.co/image/small',
                    },
                ],
            },
            isPlayable: true,
            isExplicit: true,
            source: 'Source',
        });
    });
});

describe('mapRecommendedPlaylistTrackToWorkflowTrack', () => {
    it('should map correctly', () => {
        const track: RecommendedTrack = {
            id: 'id',
            originalId: 'spotify:track:xxx',
            uri: 'spotify:track:xxx',
            name: 'Track name',
            artists: [
                {
                    id: 'Artist id',
                    name: 'Artist name',
                    uri: 'spotify:artist:xxx',
                },
            ],
            album: {
                id: 'Album id',
                name: 'Album name',
                largeImageUrl: 'https://i.scdn.co/image/large',
                imageUrl: 'https://i.scdn.co/image/medium',
                uri: 'spotify:album:xxx',
            },
            duration: 232000,
            explicit: true,
            popularity: 60,
            score: 88,
            contentRating: [],
            isMOGEFRestricted: false,
        };

        const mapped = mapRecommendedPlaylistTrackToWorkflowTrack(track, {
            source: 'Source',
        });

        expect(mapped).toStrictEqual<WorkflowTrack>({
            uri: 'spotify:track:xxx',
            name: 'Track name',
            duration: 232000,
            artists: [
                {
                    uri: 'spotify:artist:xxx',
                    name: 'Artist name',
                },
            ],
            album: {
                uri: 'spotify:album:xxx',
                name: 'Album name',
                images: [
                    {
                        url: 'https://i.scdn.co/image/medium',
                    },
                    {
                        url: 'https://i.scdn.co/image/large',
                    },
                ],
            },
            isPlayable: true,
            isExplicit: true,
            source: 'Source',
        });
    });
});
