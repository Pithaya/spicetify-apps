import React, { useEffect, useState } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import styles from './PlaylistSourceNode.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useAppStore } from '../../../../store/store';
import { NodeHeader } from '../../shared/NodeHeader';
import { Node } from '../../shared/Node';
import { NodeContent } from '../../shared/NodeContent';
import type { PlaylistData } from 'custom-apps/playlist-maker/src/models/nodes/sources/my-playlists-source-processor';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import type { Folder, Playlist, RootlistAPI } from '@shared/platform/rootlist';
import type { UserAPI } from '@shared/platform/user';
import { Select } from '@shared/components/inputs/Select/Select';

export function PlaylistSourceNode(
    props: NodeProps<PlaylistData>,
): JSX.Element {
    const rootlistAPI = getPlatformApiOrThrow<RootlistAPI>('RootlistAPI');
    const userAPI = getPlatformApiOrThrow<UserAPI>('UserAPI');

    const updateNodeData = useAppStore((state) => state.updateNodeData);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [onlyMine, setOnlyMine] = useState<boolean>(false);

    useEffect(() => {
        async function getPlaylists(): Promise<void> {
            const rootlistFolder = await rootlistAPI.getContents();
            const user = await userAPI.getUser();

            const isPlaylist = (item: Folder | Playlist): item is Playlist =>
                item.type === 'playlist';

            let filteredPlaylists: Playlist[] = rootlistFolder.items
                .flatMap((i) => (i.type === 'playlist' ? i : i.items))
                .filter(isPlaylist);

            if (onlyMine) {
                filteredPlaylists = filteredPlaylists.filter(
                    (p) => p.owner.uri === user.uri,
                );
            }

            setPlaylists(filteredPlaylists);

            if (
                !filteredPlaylists
                    .map((p) => p.uri)
                    .includes(props.data.playlistUri)
            ) {
                updateNodeData<PlaylistData>(props.id, {
                    playlistUri: '',
                });
            }
        }

        void getPlaylists();
    }, [onlyMine]);

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Source"
                backgroundColor="cornflowerblue"
                textColor="black"
            />
            <NodeContent className={styles['node-content']}>
                <TextComponent paddingBottom="8px" weight="bold">
                    Playlist
                </TextComponent>
                <label>
                    <TextComponent elementType="small">
                        Only my playlists
                    </TextComponent>
                    <input
                        type="checkbox"
                        checked={onlyMine}
                        onChange={(e) => {
                            setOnlyMine(!onlyMine);
                        }}
                    />
                </label>
                <label>
                    <TextComponent elementType="small">Playlist</TextComponent>
                    <Select
                        selectLabel="Select a playlist"
                        selectedItemId={
                            props.data.playlistUri === ''
                                ? null
                                : props.data.playlistUri
                        }
                        items={playlists.map((p) => ({
                            id: p.uri,
                            label: p.name,
                        }))}
                        onItemClicked={(uri) => {
                            updateNodeData<PlaylistData>(props.id, {
                                playlistUri: uri,
                            });
                        }}
                    />
                </label>
                <label>
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={'Search filter to apply'}
                        showDelay={100}
                    >
                        <TextComponent elementType="small">
                            Filter
                        </TextComponent>
                    </Spicetify.ReactComponent.TooltipWrapper>
                    <input
                        type="text"
                        placeholder="Search"
                        value={props.data.filter}
                        onChange={(e) => {
                            updateNodeData<PlaylistData>(props.id, {
                                filter: e.target.value,
                            });
                        }}
                    />
                </label>
                <label>
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={'Number of elements to skip'}
                        showDelay={100}
                    >
                        <TextComponent elementType="small">
                            Offset
                        </TextComponent>
                    </Spicetify.ReactComponent.TooltipWrapper>
                    <input
                        type="number"
                        placeholder="0"
                        value={props.data.offset}
                        onChange={(e) => {
                            updateNodeData<PlaylistData>(props.id, {
                                offset: e.target.valueAsNumber,
                            });
                        }}
                    />
                </label>
                <label>
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={
                            'Number of elements to take. Leave empty to take all elements.'
                        }
                        showDelay={100}
                    >
                        <TextComponent elementType="small">Limit</TextComponent>
                    </Spicetify.ReactComponent.TooltipWrapper>
                    <input
                        type="number"
                        placeholder="0"
                        value={props.data.limit}
                        onChange={(e) => {
                            updateNodeData<PlaylistData>(props.id, {
                                limit: e.target.valueAsNumber,
                            });
                        }}
                    />
                </label>
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                id="result"
                style={{ top: '40px' }}
            />
        </Node>
    );
}
