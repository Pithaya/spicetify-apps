import { useComboboxValues } from 'custom-apps/playlist-maker/src/hooks/use-combobox-values';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    type TrackItem,
    useTrackComboboxFetchers,
} from 'custom-apps/playlist-maker/src/hooks/use-track-combobox-fetchers';
import {
    type SearchTrackData,
    SearchTrackDataSchema,
} from 'custom-apps/playlist-maker/src/models/processors/sources/search-track-source-processor';
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

export function SearchTrackSourceNode(
    props: Readonly<NodeProps<SearchTrackData>>,
): JSX.Element {
    const { uri } = props.data;
    const { errors, control, updateNodeField } = useNodeForm<SearchTrackData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('searchTrackSource'),
        SearchTrackDataSchema,
    );

    const onTrackNotFound = useCallback(() => {
        updateNodeField({ uri: '' });
    }, [updateNodeField]);

    const { getTrack, getTracks, itemToString } =
        useTrackComboboxFetchers(onTrackNotFound);

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
                <NodeTitle
                    title="Track"
                    tooltip="Search for a track using Spotify's search. You can use advanced search tags such as 'genre:' or 'year:'."
                />

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
                        placeholder="Search for a track"
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
