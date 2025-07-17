import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    MAX_SPEECHINESS,
    MIN_SPEECHINESS,
    SpeechinessDataSchema,
    type SpeechinessData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/speechiness-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function SpeechinessNode(
    props: Readonly<NodeProps<SpeechinessData>>,
): JSX.Element {
    const { control, updateNodeField } = useNodeForm<SpeechinessData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('speechiness'),
        SpeechinessDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <FilterNodeHeader />
            <NodeContent>
                <div
                    style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingBottom: '8px',
                    }}
                >
                    <NodeTitle
                        title="Speechiness"
                        tooltip="Detects the presence of spoken words in a track. 
                        Values above 0.66 describe tracks that are probably made entirely of spoken words (e.g. talk show, audio book, poetry). 
                        Values below 0.33 most likely represent music and other non-speech-like tracks."
                    />

                    <SliderController
                        control={control}
                        min={MIN_SPEECHINESS}
                        max={MAX_SPEECHINESS}
                        step={0.01}
                        onChange={(value) => {
                            updateNodeField({ range: value });
                        }}
                    />
                </div>
            </NodeContent>
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '42px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '42px' }}
            />
        </Node>
    );
}
