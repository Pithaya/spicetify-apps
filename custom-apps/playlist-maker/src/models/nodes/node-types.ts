import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { AcousticnessNode } from '../../components/nodes/filter/AcousticnessNode';
import { DanceabilityNode } from '../../components/nodes/filter/DanceabilityNode';
import { EnergyNode } from '../../components/nodes/filter/EnergyNode';
import { InstrumentalnessNode } from '../../components/nodes/filter/InstrumentalnessNode';
import { IsPlayableNode } from '../../components/nodes/filter/IsPlayableNode';
import { LivenessNode } from '../../components/nodes/filter/LivenessNode';
import { LoudnessNode } from '../../components/nodes/filter/LoudnessNode';
import { ModeNode } from '../../components/nodes/filter/ModeNode';
import { ReleaseDateNode } from '../../components/nodes/filter/ReleaseDateNode';
import { SpeechinessNode } from '../../components/nodes/filter/SpeechinessNode';
import { TempoNode } from '../../components/nodes/filter/TempoNode';
import { ValenceNode } from '../../components/nodes/filter/ValenceNode';
import { DeduplicateNode } from '../../components/nodes/processing/DeduplicateNode';
import { ShuffleNode } from '../../components/nodes/processing/ShuffleNode';
import { SortProcessorNode } from '../../components/nodes/processing/SortProcessorNode';
import { ResultNode } from '../../components/nodes/result/ResultNode';
import { LibraryAlbumSourceNode } from '../../components/nodes/sources/LibraryAlbumSourceNode';
import { LibraryArtistSourceNode } from '../../components/nodes/sources/LibraryArtistSourceNode';
import { LibraryPlaylistSourceNode } from '../../components/nodes/sources/LibraryPlaylistSourceNode';
import { LikedSongsSourceNode } from '../../components/nodes/sources/LikedSongsSourceNode';
import { LocalTracksSourceNode } from '../../components/nodes/sources/LocalTracksSourceNode';
import { RadioAlbumSourceNode } from '../../components/nodes/sources/RadioAlbumSourceNode';
import { RadioArtistSourceNode } from '../../components/nodes/sources/RadioArtistSourceNode';
import { RadioTrackSourceNode } from '../../components/nodes/sources/RadioTrackSourceNode';
import { SearchAlbumSourceNode } from '../../components/nodes/sources/SearchAlbumSourceNode';
import { SearchArtistSourceNode } from '../../components/nodes/sources/SearchArtistSourceNode';
import { SearchPlaylistSourceNode } from '../../components/nodes/sources/SearchPlaylistSourceNode';
import { TopTracksSourceNode } from '../../components/nodes/sources/TopTracksSourceNode';

type SourceNodes =
    | 'likedSongsSource'
    | 'localTracksSource'
    | 'libraryPlaylistSource'
    | 'searchPlaylistSource'
    | 'topTracksSource'
    | 'libraryAlbumSource'
    | 'searchAlbumSource'
    | 'libraryArtistSource'
    | 'searchArtistSource'
    | 'radioAlbumSource'
    | 'radioArtistSource'
    | 'radioTrackSource';

type FilterNodes =
    | 'isPlayable'
    | 'acousticness'
    | 'danceability'
    | 'energy'
    | 'instrumentalness'
    | 'liveness'
    | 'loudness'
    | 'speechiness'
    | 'valence'
    | 'tempo'
    | 'mode'
    | 'releaseDate';

type ProcessingNodes = 'deduplicate' | 'shuffle' | 'sort';

export type CustomNodeType =
    | SourceNodes
    | FilterNodes
    | ProcessingNodes
    | 'result';

export const nodeTypes: Record<CustomNodeType, ComponentType<NodeProps>> = {
    likedSongsSource: LikedSongsSourceNode,
    localTracksSource: LocalTracksSourceNode,
    libraryPlaylistSource: LibraryPlaylistSourceNode,
    searchPlaylistSource: SearchPlaylistSourceNode,
    topTracksSource: TopTracksSourceNode,
    libraryAlbumSource: LibraryAlbumSourceNode,
    searchAlbumSource: SearchAlbumSourceNode,
    libraryArtistSource: LibraryArtistSourceNode,
    searchArtistSource: SearchArtistSourceNode,
    deduplicate: DeduplicateNode,
    isPlayable: IsPlayableNode,
    result: ResultNode,
    shuffle: ShuffleNode,
    sort: SortProcessorNode,
    acousticness: AcousticnessNode,
    danceability: DanceabilityNode,
    energy: EnergyNode,
    instrumentalness: InstrumentalnessNode,
    liveness: LivenessNode,
    loudness: LoudnessNode,
    speechiness: SpeechinessNode,
    valence: ValenceNode,
    tempo: TempoNode,
    mode: ModeNode,
    radioAlbumSource: RadioAlbumSourceNode,
    radioArtistSource: RadioArtistSourceNode,
    radioTrackSource: RadioTrackSourceNode,
    releaseDate: ReleaseDateNode,
};
