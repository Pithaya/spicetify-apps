import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { LikedSongsSourceNode } from '../../components/nodes/sources/LikedSongs/LikedSongsSourceNode';
import { ResultNode } from '../../components/nodes/result/ResultNode';
import { LocalTracksSourceNode } from '../../components/nodes/sources/LocalTracks/LocalTracksSourceNode';
import { DeduplicateNode } from '../../components/nodes/processing/DeduplicateNode';
import { GenreNode } from '../../components/nodes/filter/GenreNode';
import { LibraryPlaylistSourceNode } from '../../components/nodes/sources/LibraryPlaylist/LibraryPlaylistSourceNode';
import { ShuffleNode } from '../../components/nodes/processing/ShuffleNode';
import { TopTracksSourceNode } from '../../components/nodes/sources/TopTracks/TopTracksSourceNode';

export type CustomNodeType =
    // Sources
    | 'likedSongsSource'
    | 'localTracksSource'
    | 'libraryPlaylistSource'
    | 'topTracksSource'
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
    libraryPlaylistSource: LibraryPlaylistSourceNode,
    topTracksSource: TopTracksSourceNode,
    deduplicate: DeduplicateNode,
    genre: GenreNode,
    result: ResultNode,
    shuffle: ShuffleNode,
};
