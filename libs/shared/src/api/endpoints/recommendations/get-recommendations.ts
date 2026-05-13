import type { Track } from '@shared/api/models/track';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

const MAX_GET_RECOMMENDATIONS_LIMIT = 100;

const getPositiveNumber = (
    max: number = Number.MAX_SAFE_INTEGER,
): z.ZodOptional<z.ZodNumber> => z.number().nonnegative().max(max).optional();

const getPositiveInteger = (
    max: number = Number.MAX_SAFE_INTEGER,
): z.ZodOptional<z.ZodNumber> =>
    z.number().nonnegative().int().max(max).optional();

const ParamsSchema = z
    .object({
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_GET_RECOMMENDATIONS_LIMIT)
            .optional(),
        seedArtists: z
            .array(z.string())
            .nonempty()
            .refine(
                (value) => value.every((uri) => Spicetify.URI.isArtist(uri)),
                {
                    message: 'Invalid artist URIs',
                },
            )
            .optional(),
        seedGenres: z.array(z.string()).nonempty().optional(),
        seedTracks: z
            .array(z.string())
            .nonempty()
            .refine(
                (value) => value.every((uri) => Spicetify.URI.isTrack(uri)),
                {
                    message: 'Invalid track URIs',
                },
            )
            .optional(),
        minAcousticness: getPositiveNumber(1),
        maxAcousticness: getPositiveNumber(1),
        targetAcousticness: getPositiveNumber(1),
        minDanceability: getPositiveNumber(1),
        maxDanceability: getPositiveNumber(1),
        targetDanceability: getPositiveNumber(1),
        minDurationMs: getPositiveInteger(),
        maxDurationMs: getPositiveInteger(),
        targetDurationMs: getPositiveInteger(),
        minEnergy: getPositiveNumber(1),
        maxEnergy: getPositiveNumber(1),
        targetEnergy: getPositiveNumber(1),
        minInstrumentalness: getPositiveNumber(1),
        maxInstrumentalness: getPositiveNumber(1),
        targetInstrumentalness: getPositiveNumber(1),
        minKey: getPositiveInteger(11),
        maxKey: getPositiveInteger(11),
        targetKey: getPositiveInteger(11),
        minLiveness: getPositiveNumber(1),
        maxLiveness: getPositiveNumber(1),
        targetLiveness: getPositiveNumber(1),
        minLoudness: getPositiveNumber(),
        maxLoudness: getPositiveNumber(),
        targetLoudness: getPositiveNumber(),
        minMode: getPositiveInteger(1),
        maxMode: getPositiveInteger(1),
        targetMode: getPositiveInteger(1),
        minPopularity: getPositiveInteger(100),
        maxPopularity: getPositiveInteger(100),
        targetPopularity: getPositiveInteger(100),
        minSpeechiness: getPositiveNumber(1),
        maxSpeechiness: getPositiveNumber(1),
        targetSpeechiness: getPositiveNumber(1),
        minTempo: getPositiveNumber(),
        maxTempo: getPositiveNumber(),
        targetTempo: getPositiveNumber(),
        minTimeSignature: getPositiveInteger(11),
        maxTimeSignature: getPositiveInteger(11),
        targetTimeSignature: getPositiveInteger(11),
        minValence: getPositiveNumber(1),
        maxValence: getPositiveNumber(1),
        targetValence: getPositiveNumber(1),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type RecommendationSeed = {
    id: string;
    href: string;
    type: string;

    initialPoolSize: number;
    afterFilteringSize: number;
    afterRelinkingSize: number;
};

export type RecommendationsResponse = {
    seeds: RecommendationSeed[];
    tracks: Track[];
};

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getRecommendations(
    params: Params,
): Promise<RecommendationsResponse> {
    const parsedParams = ParamsSchema.parse(params);

    if (
        !parsedParams.seedArtists &&
        !parsedParams.seedGenres &&
        !parsedParams.seedTracks
    ) {
        throw new Error(
            'At least one of seed_artists, seed_genres or seed_tracks is required',
        );
    }

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/recommendations`)
        .withEndpointIdentifier('/recommendations')
        .withQueryParameters({
            limit: parsedParams.limit?.toString(),
            seed_artists: parsedParams.seedArtists?.join(','),
            seed_genres: parsedParams.seedGenres?.join(','),
            seed_tracks: parsedParams.seedTracks?.join(','),
            min_acousticness: parsedParams.minAcousticness?.toString(),
            max_acousticness: parsedParams.maxAcousticness?.toString(),
            target_acousticness: parsedParams.targetAcousticness?.toString(),
            min_danceability: parsedParams.minDanceability?.toString(),
            max_danceability: parsedParams.maxDanceability?.toString(),
            target_danceability: parsedParams.targetDanceability?.toString(),
            min_duration_ms: parsedParams.minDurationMs?.toString(),
            max_duration_ms: parsedParams.maxDurationMs?.toString(),
            target_duration_ms: parsedParams.targetDurationMs?.toString(),
            min_energy: parsedParams.minEnergy?.toString(),
            max_energy: parsedParams.maxEnergy?.toString(),
            target_energy: parsedParams.targetEnergy?.toString(),
            min_instrumentalness: parsedParams.minInstrumentalness?.toString(),
            max_instrumentalness: parsedParams.maxInstrumentalness?.toString(),
            target_instrumentalness:
                parsedParams.targetInstrumentalness?.toString(),
            min_key: parsedParams.minKey?.toString(),
            max_key: parsedParams.maxKey?.toString(),
            target_key: parsedParams.targetKey?.toString(),
            min_liveness: parsedParams.minLiveness?.toString(),
            max_liveness: parsedParams.maxLiveness?.toString(),
            target_liveness: parsedParams.targetLiveness?.toString(),
            min_loudness: parsedParams.minLoudness?.toString(),
            max_loudness: parsedParams.maxLoudness?.toString(),
            target_loudness: parsedParams.targetLoudness?.toString(),
            min_mode: parsedParams.minMode?.toString(),
            max_mode: parsedParams.maxMode?.toString(),
            target_mode: parsedParams.targetMode?.toString(),
            min_popularity: parsedParams.minPopularity?.toString(),
            max_popularity: parsedParams.maxPopularity?.toString(),
            target_popularity: parsedParams.targetPopularity?.toString(),
            min_speechiness: parsedParams.minSpeechiness?.toString(),
            max_speechiness: parsedParams.maxSpeechiness?.toString(),
            target_speechiness: parsedParams.targetSpeechiness?.toString(),
            min_tempo: parsedParams.minTempo?.toString(),
            max_tempo: parsedParams.maxTempo?.toString(),
            target_tempo: parsedParams.targetTempo?.toString(),
            min_time_signature: parsedParams.minTimeSignature?.toString(),
            max_time_signature: parsedParams.maxTimeSignature?.toString(),
            target_time_signature: parsedParams.targetTimeSignature?.toString(),
            min_valence: parsedParams.minValence?.toString(),
            max_valence: parsedParams.maxValence?.toString(),
            target_valence: parsedParams.targetValence?.toString(),
        })
        .send<RecommendationsResponse>();

    return response.body;
}
