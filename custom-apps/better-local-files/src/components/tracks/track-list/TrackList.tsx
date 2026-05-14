import type {
    DisplayType,
    HeaderKey,
    LibraryHeaders,
    SelectedSortOption,
    SortOption,
    SortOrder,
    TrackListHeaderOption,
} from '@shared/components/track-list/models/sort-option';
import { TrackListGrid } from '@shared/components/track-list/TrackListGrid';
import { TrackListRowAlbumLink } from '@shared/components/track-list/TrackListRowAlbumLink';
import { TrackListRowArtistLink } from '@shared/components/track-list/TrackListRowArtistLink';
import { TrackListRowImageTitle } from '@shared/components/track-list/TrackListRowImageTitle';
import { RowMenu } from '@shared/components/track-list/TrackListRowMenu';
import { PlayButton } from '@shared/components/ui/PlayButton';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { getTranslation } from '@shared/utils/translations.utils';
import {
    ALBUM_ROUTE,
    ARTIST_ROUTE,
} from 'custom-apps/better-local-files/src/constants/constants';
import { queryTracks } from 'custom-apps/better-local-files/src/db/db';
import { navigateTo } from 'custom-apps/better-local-files/src/utils/history.utils';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { useMemo, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { playContext, playTrack } from '../../../utils/player.utils';
import { SearchInput } from '../../shared/filters/SearchInput/SearchInput';
import { SortMenu } from '../../shared/filters/SortMenu/SortMenu';

// TODO: Get / store global view mode
// Spicetify.Platform.LocalStorageAPI.items[Spicetify.Platform.LocalStorageAPI.createNamespacedKey("view-mode")]

// TODO: Store sort option

// FIXME: Changing to compact display when tracks are sorted by title causes "DOMException: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."

function toggleOrder(order: SortOrder): SortOrder {
    return order === 'ascending' ? 'descending' : 'ascending';
}

/**
 * Contains the filtering, ordering, and play logic for the local tracks list.
 * The query against IndexedDB is driven by the search input and the sort option
 * so that filtering and sorting happen at the Dexie level instead of in memory.
 */
export function TrackList(): JSX.Element {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    /**
     * Options for the sort dropdown.
     */
    const sortOptions: SortOption<LibraryHeaders>[] = [
        {
            key: 'date',
            label: getTranslation(['sort.date-added']),
        },
        {
            key: 'title',
            label: getTranslation(['sort.title']),
        },
        {
            key: 'artist',
            label: getTranslation(['sort.artist']),
        },
        {
            key: 'album',
            label: getTranslation(['sort.album']),
        },
        {
            key: 'duration',
            label: getTranslation(['sort.duration']),
        },
    ];

    const [selectedSortOption, setSelectedSortOption] = useState<
        SelectedSortOption<LibraryHeaders>
    >({ ...sortOptions[0], order: 'ascending' });

    const [selectedDisplayType, setSelectedDisplayType] =
        useState<DisplayType>('list');

    const tracks = useLiveQuery(
        () =>
            queryTracks({
                search: debouncedSearch,
                sortKey: selectedSortOption.key,
                sortOrder: selectedSortOption.order,
            }),
        [debouncedSearch, selectedSortOption.key, selectedSortOption.order],
        [],
    );

    const headers = useMemo<
        TrackListHeaderOption<HeaderKey<LibraryHeaders>>[]
    >(() => {
        const result: TrackListHeaderOption<HeaderKey<LibraryHeaders>>[] = [];

        if (selectedDisplayType === 'list') {
            // First header can be artist or title
            result.push(
                selectedSortOption.key === 'artist'
                    ? {
                          key: 'artist',
                          label: getTranslation(['artist']),
                      }
                    : {
                          key: 'title',
                          label: getTranslation(['tracklist.header.title']),
                      },
            );
        } else {
            result.push(
                {
                    key: 'title',
                    label: getTranslation(['tracklist.header.title']),
                },
                {
                    key: 'artist',
                    label: getTranslation(['artist']),
                },
            );
        }

        result.push(
            {
                key: 'album',
                label: getTranslation(['tracklist.header.album']),
            },
            {
                key: 'date',
                label: getTranslation(['tracklist.header.date-added']),
            },
        );

        return result;
    }, [selectedDisplayType, selectedSortOption]);

    function handleSortOptionChange(
        headerKey: HeaderKey<LibraryHeaders>,
        fromDropdownMenu: boolean,
    ): void {
        setSelectedSortOption((previous) => {
            let newKey: HeaderKey<LibraryHeaders>;
            let newOrder: SortOrder;

            if (
                !fromDropdownMenu &&
                headerKey === 'title' &&
                selectedSortOption.order === 'descending' &&
                selectedDisplayType !== 'compact'
            ) {
                newKey = 'artist';
                newOrder = 'ascending';
            } else if (
                !fromDropdownMenu &&
                headerKey === 'artist' &&
                selectedSortOption.order === 'descending' &&
                selectedDisplayType !== 'compact'
            ) {
                newKey = 'title';
                newOrder = 'ascending';
            } else {
                newKey = headerKey;
                newOrder =
                    previous.key === headerKey
                        ? toggleOrder(previous.order)
                        : 'ascending';
            }

            return {
                key: newKey,
                order: newOrder,
            };
        });
    }

    return (
        <>
            <div className="main-actionBar-ActionBar contentSpacing">
                <div className="main-actionBar-ActionBarRow">
                    <div className="main-playButton-PlayButton">
                        <PlayButton
                            size="lg"
                            onClick={() => {
                                void playContext(tracks.map((t) => t.uri));
                            }}
                        />
                    </div>

                    <div className={styles['controls']}>
                        <SearchInput
                            search={search}
                            setSearch={setSearch}
                            setDebouncedSearch={setDebouncedSearch}
                        />

                        <SortMenu
                            sortOptions={sortOptions}
                            selectedSortOption={selectedSortOption}
                            setSelectedSortOption={(key) => {
                                handleSortOptionChange(key, true);
                            }}
                            displayTypes={['list', 'compact']}
                            selectedDisplayType={selectedDisplayType}
                            setSelectedDisplayType={setSelectedDisplayType}
                            displayTypeTranslationPrefix="web-player.your-library-x.sort-and-view-picker."
                        />
                    </div>
                </div>
            </div>

            <TrackListGrid
                tracks={tracks}
                subtracks={[]}
                gridLabel={getTranslation(['local-files'])}
                useTrackNumber={false}
                onPlayTrack={(uri) => {
                    void playTrack(
                        uri,
                        tracks.map((t) => t.uri),
                    );
                }}
                headers={headers}
                onHeaderClicked={(key) => {
                    handleSortOptionChange(key, false);
                }}
                sortedHeader={selectedSortOption}
                getRowContent={(track) => {
                    const contents = [
                        selectedDisplayType === 'compact' ? (
                            <TextComponent
                                className="main-trackList-rowTitle standalone-ellipsis-one-line"
                                variant="ballad"
                                semanticColor="textBase"
                                key={track.uri}
                            >
                                {track.name}
                            </TextComponent>
                        ) : (
                            <TrackListRowImageTitle
                                track={track}
                                withArtists={true}
                                key={track.uri}
                                onArtistClick={(artistUri) => {
                                    navigateTo(ARTIST_ROUTE, artistUri);
                                }}
                            />
                        ),
                    ];

                    if (selectedDisplayType === 'compact') {
                        contents.push(
                            <TrackListRowArtistLink
                                track={track}
                                key={track.uri}
                                onArtistClick={(artistUri) => {
                                    navigateTo(ARTIST_ROUTE, artistUri);
                                }}
                            />,
                        );
                    }

                    contents.push(
                        <TrackListRowAlbumLink
                            track={track}
                            key={track.uri}
                            onAlbumClick={(albumUri) => {
                                navigateTo(ALBUM_ROUTE, albumUri);
                            }}
                        />,
                        <TextComponent
                            variant="mesto"
                            semanticColor="textSubdued"
                            key={track.uri}
                        >
                            {track.addedAt
                                ? track.addedAt.toLocaleDateString()
                                : ''}
                        </TextComponent>,
                    );

                    return contents;
                }}
                displayType={selectedDisplayType}
                getRowMenu={(track) => (
                    <RowMenu
                        track={track}
                        onArtistClick={(uri) => {
                            navigateTo(ARTIST_ROUTE, uri);
                        }}
                        onAlbumClick={(uri) => {
                            navigateTo(ALBUM_ROUTE, uri);
                        }}
                    />
                )}
            />
        </>
    );
}
