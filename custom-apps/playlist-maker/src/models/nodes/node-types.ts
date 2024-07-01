import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { LikedSongsSourceNode } from '../../components/nodes/sources/LikedSongs/LikedSongsSourceNode';
import { ResultNode } from '../../components/nodes/result/ResultNode';
import { LocalTracksSourceNode } from '../../components/nodes/sources/LocalTracks/LocalTracksSourceNode';
import { DeduplicateNode } from '../../components/nodes/processing/DeduplicateNode';
import { GenreNode } from '../../components/nodes/filter/GenreNode';
import { PlaylistSourceNode } from '../../components/nodes/sources/Playlist/PlaylistSourceNode';
import { ShuffleNode } from '../../components/nodes/processing/ShuffleNode';

export type CustomNodeType =
    // Sources
    | 'likedSongsSource'
    | 'localTracksSource'
    | 'playlistSource'
    // Filters
    | 'genre'
    // Processing
    | 'deduplicate'
    | 'shuffle'
    // Result
    | 'result';

export const nodeTypes: Record<CustomNodeType, ComponentType<NodeProps>> = {
    likedSongsSource: LikedSongsSourceNode,
    localTracksSource: LocalTracksSourceNode,
    playlistSource: PlaylistSourceNode,
    deduplicate: DeduplicateNode,
    genre: GenreNode,
    result: ResultNode,
    shuffle: ShuffleNode,
};
