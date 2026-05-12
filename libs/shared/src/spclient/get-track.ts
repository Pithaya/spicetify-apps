import { getPlatform } from '@shared/utils/spicetify-utils';

type TrackImage = {
    file_id: string;
    size: 'DEFAULT' | 'SMALL' | 'LARGE';
    width: number;
    height: number;
};

type TrackArtist = {
    gid: string;
    name: string;
};

type TrackLicensor = {
    uuid: string;
};

type TrackOriginalAudio = {
    uuid: string;
    format: string;
};

type TrackAlbum = {
    gid: string;
    name: string;
    artist: TrackArtist[];
    label: string;
    date: {
        year: number;
        month?: number;
        day?: number;
    };
    cover_group: {
        image: TrackImage[];
    };
    licensor: TrackLicensor;
};

type TrackExternalId = {
    type: string;
    id: string;
};

type TrackArtistWithRole = {
    artist_gid: string;
    artist_name: string;
    role: string;
};

type TrackAudioFormat = {
    original_audio: TrackOriginalAudio;
};

type TrackImplementationDetails = {
    catalog_insertion_date: {
        seconds: number;
        nanos: number;
    };
};

type GetTrackResponse = {
    gid: string;
    name: string;
    album: TrackAlbum;
    artist: TrackArtist[];
    number: number;
    disc_number: number;
    duration: number;
    popularity: number;
    external_id: TrackExternalId[];
    earliest_live_timestamp: number;
    has_lyrics: boolean;
    licensor: TrackLicensor;
    language_of_performance: string[];
    original_audio: TrackOriginalAudio;
    original_title: string;
    artist_with_role: TrackArtistWithRole[];
    canonical_uri: string;
    content_authorization_attributes: string;
    audio_formats: TrackAudioFormat[];
    media_type: string;
    implementation_details: TrackImplementationDetails;
};

export async function getTrack(uri: string): Promise<GetTrackResponse> {
    if (!Spicetify.URI.isTrack(uri)) {
        throw new Error('The source URI must be a track.');
    }

    const spicetifyUri = Spicetify.URI.fromString(uri);
    const id = spicetifyUri.id;

    if (!id) {
        throw new Error('Invalid track URI.');
    }

    const hexId = Spicetify.URI.idToHex(id);

    const requestBuilder = getPlatform().RequestBuilder;

    const response = await requestBuilder
        .build()
        .withHost('https://spclient.wg.spotify.com/metadata/4')
        .withPath(`/track/${hexId}`)
        .withEndpointIdentifier('/track/{hexId}')
        .withQueryParameters({
            'response-format': 'json',
        })
        .withoutMarket()
        .send<GetTrackResponse>();

    if (response.status !== 200) {
        throw new Error('Failed to get the track.');
    }

    return response.body;
}
