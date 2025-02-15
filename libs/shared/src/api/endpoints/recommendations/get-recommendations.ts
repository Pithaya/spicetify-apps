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

export async function getRecommendations(
    params: Params,
): Promise<RecommendationsResponse> {
    ParamsSchema.parse(params);

    if (!params.seedArtists && !params.seedGenres && !params.seedTracks) {
        throw new Error(
            'At least one of seed_artists, seed_genres or seed_tracks is required',
        );
    }

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/recommendations`)
        .withEndpointIdentifier('/recommendations')
        .withQueryParameters({
            limit: params.limit?.toString(),
            seed_artists: params.seedArtists?.join(','),
            seed_genres: params.seedGenres?.join(','),
            seed_tracks: params.seedTracks?.join(','),
            min_acousticness: params.minAcousticness?.toString(),
            max_acousticness: params.maxAcousticness?.toString(),
            target_acousticness: params.targetAcousticness?.toString(),
            min_danceability: params.minDanceability?.toString(),
            max_danceability: params.maxDanceability?.toString(),
            target_danceability: params.targetDanceability?.toString(),
            min_duration_ms: params.minDurationMs?.toString(),
            max_duration_ms: params.maxDurationMs?.toString(),
            target_duration_ms: params.targetDurationMs?.toString(),
            min_energy: params.minEnergy?.toString(),
            max_energy: params.maxEnergy?.toString(),
            target_energy: params.targetEnergy?.toString(),
            min_instrumentalness: params.minInstrumentalness?.toString(),
            max_instrumentalness: params.maxInstrumentalness?.toString(),
            target_instrumentalness: params.targetInstrumentalness?.toString(),
            min_key: params.minKey?.toString(),
            max_key: params.maxKey?.toString(),
            target_key: params.targetKey?.toString(),
            min_liveness: params.minLiveness?.toString(),
            max_liveness: params.maxLiveness?.toString(),
            target_liveness: params.targetLiveness?.toString(),
            min_loudness: params.minLoudness?.toString(),
            max_loudness: params.maxLoudness?.toString(),
            target_loudness: params.targetLoudness?.toString(),
            min_mode: params.minMode?.toString(),
            max_mode: params.maxMode?.toString(),
            target_mode: params.targetMode?.toString(),
            min_popularity: params.minPopularity?.toString(),
            max_popularity: params.maxPopularity?.toString(),
            target_popularity: params.targetPopularity?.toString(),
            min_speechiness: params.minSpeechiness?.toString(),
            max_speechiness: params.maxSpeechiness?.toString(),
            target_speechiness: params.targetSpeechiness?.toString(),
            min_tempo: params.minTempo?.toString(),
            max_tempo: params.maxTempo?.toString(),
            target_tempo: params.targetTempo?.toString(),
            min_time_signature: params.minTimeSignature?.toString(),
            max_time_signature: params.maxTimeSignature?.toString(),
            target_time_signature: params.targetTimeSignature?.toString(),
            min_valence: params.minValence?.toString(),
            max_valence: params.maxValence?.toString(),
            target_valence: params.targetValence?.toString(),
        })
        .send<RecommendationsResponse>();

    return response.body;
}
