import { getTrack as getGraphQlTrack } from '@shared/graphQL/queries/get-track';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { type TrackItem } from 'custom-apps/playlist-maker/src/hooks/use-track-combobox-fetchers';
import {
    type LibraryTrackData,
    LibraryTrackDataSchema,
} from 'custom-apps/playlist-maker/src/models/processors/sources/library-track-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React, { useCallback, useEffect } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import { ComboBoxController } from '../../inputs/ComboBoxController';
import { TrackItemRenderer } from '../shared/ItemRenderers';
import { Node } from '../shared/Node';
import { NodeComboField } from '../shared/NodeComboField';
import { NodeContent } from '../shared/NodeContent';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

const LIBRARY_TRACK_SEARCH_LIMIT = 50;

export function LibraryTrackSourceNode(
    props: Readonly<NodeProps<LibraryTrackData>>,
): JSX.Element {
    const { uri } = props.data;
    const { errors, control, updateNodeField } = useNodeForm<LibraryTrackData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('libraryTrackSource'),
        LibraryTrackDataSchema,
    );

    const getTracks = useCallback(
        async (input: string): Promise<TrackItem[]> => {
            const trimmedInput = input.trim();

            if (trimmedInput === '') {
                return [];
            }

            const libraryApi = getPlatform().LibraryAPI;

            const response = await libraryApi.getTracks({
                filters: [trimmedInput],
                limit: LIBRARY_TRACK_SEARCH_LIMIT,
                offset: 0,
                sort: { field: 'NAME', order: 'ASC' },
            });

            const items: TrackItem[] = response.items.map((track) => ({
                id: track.uri,
                uri: track.uri,
                name: track.name,
                image:
                    track.album.images.length > 0
                        ? track.album.images[0].url
                        : null,
                artists: track.artists.map((artist) => artist.name).join(', '),
                album: track.album.name,
            }));

            return items;
        },
        [],
    );

    const getTrack = useCallback(
        async (trackUri: string): Promise<TrackItem | null> => {
            try {
                const trackResponse = await getGraphQlTrack({
                    uri: trackUri,
                });

                if (trackResponse.trackUnion.__typename === 'NotFound') {
                    throw new Error('Track not found');
                }

                const track = trackResponse.trackUnion;
                const trackArtists = [
                    ...track.firstArtist.items,
                    ...track.otherArtists.items,
                ];

                const trackItem: TrackItem = {
                    id: track.uri,
                    name: track.name,
                    uri: track.uri,
                    image:
                        track.albumOfTrack.coverArt.sources.length > 0
                            ? track.albumOfTrack.coverArt.sources[0].url
                            : null,
                    artists: trackArtists
                        .map((artist) => artist.profile.name)
                        .join(', '),
                    album: track.albumOfTrack.name,
                };

                return trackItem;
            } catch (e) {
                console.error('Failed to fetch track', e);
                updateNodeField({ uri: '' });

                return null;
            }
        },
        [updateNodeField],
    );

    const itemToString = useCallback(
        (item: TrackItem): string => item.name,
        [],
    );

    const {
        inputValue,
        items,
        onInputChanged,
        onItemSelected,
        resetSelection,
        selectedItem,
        syncInputWithSelectedItem,
        onSelectedIdChanged,
        fetchLoading,
    } = useComboboxValues<TrackItem>(
        getTrack,
        getTracks,
        itemToString,
        (item) => {
            updateNodeField({ uri: item?.uri ?? '' });
        },
    );

    useEffect(() => {
        void onSelectedIdChanged(uri);
    }, [uri, onSelectedIdChanged]);

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Saved track" />

                <NodeComboField error={errors.uri}>
                    <ComboBoxController
                        control={control}
                        name="uri"
                        selectedItem={selectedItem}
                        onItemSelected={onItemSelected}
                        items={items}
                        itemRenderer={TrackItemRenderer}
                        itemToString={itemToString}
                        label="Track"
                        placeholder="Search your saved tracks"
                        inputValue={inputValue}
                        onInputChanged={onInputChanged}
                        onClear={resetSelection}
                        onBlur={syncInputWithSelectedItem}
                        loading={fetchLoading}
                    />
                </NodeComboField>
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '40px' }}
            />
        </Node>
    );
}
