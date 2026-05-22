import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    RecentlyPlayedTracksDataSchema,
    type RecentlyPlayedTracksData,
} from 'custom-apps/playlist-maker/src/models/processors/sources/recently-played-tracks-source-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NumberController } from '../../inputs/NumberController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { NodeField } from '../shared/NodeField';
import { SourceNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function RecentlyPlayedTracksSourceNode(
    props: Readonly<NodeProps<RecentlyPlayedTracksData>>,
): JSX.Element {
    const { control, errors, updateNodeField } =
        useNodeForm<RecentlyPlayedTracksData>(
            props.id,
            props.data,
            getDefaultValueForNodeType('recentlyPlayedTracksSource'),
            RecentlyPlayedTracksDataSchema,
        );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <SourceNodeHeader />
            <NodeContent>
                <NodeTitle title="Recently played" />

                <NodeField
                    label="Limit"
                    tooltip="Number of tracks to take."
                    error={errors.limit}
                >
                    <NumberController
                        control={control}
                        name="limit"
                        placeholder="50"
                        onChange={(value) => {
                            updateNodeField({ limit: value });
                        }}
                    />
                </NodeField>

                <NodeField
                    label="Offset"
                    tooltip="Number of tracks to skip."
                    error={errors.offset}
                >
                    <NumberController
                        control={control}
                        name="offset"
                        placeholder="0"
                        onChange={(value) => {
                            updateNodeField({ offset: value });
                        }}
                    />
                </NodeField>
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '40px' }}
            />
        </Node>
    );
}
