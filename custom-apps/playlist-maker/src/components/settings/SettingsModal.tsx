import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { highlightSearchTerm } from 'highlight-search-term';
import { Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
    clearAll,
    getAllSorted,
} from '../../db/artist-genres/artist-genres-db';

export function SettingsModal(): JSX.Element {
    const [search, setSearch] = React.useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = React.useState<string>('');

    const artistGenres = useLiveQuery(
        async () => await getAllSorted(debouncedSearch),
        [debouncedSearch],
        [],
    );

    const debouncedSearchCallback = useDebouncedCallback((value: string) => {
        setDebouncedSearch(value);
    }, 200);

    const onSearchChanged = (value: string): void => {
        setSearch(value);
        debouncedSearchCallback(value);
    };

    useEffect(() => {
        highlightSearchTerm({
            search: debouncedSearch,
            selector: '#artist-genres-table tbody',
        });
    }, [debouncedSearch]);

    return (
        <>
            <div className="tw:mb-4 tw:flex tw:flex-row tw:items-center tw:justify-between tw:gap-2">
                <div>
                    <TextComponent elementType="h1">
                        Artist genres cache
                    </TextComponent>
                    <TextComponent
                        elementType="p"
                        fontSize="small"
                        semanticColor="textSubdued"
                    >
                        Set by the &quot;Liked songs&quot; source node.
                    </TextComponent>
                </div>
                <Spicetify.ReactComponent.TooltipWrapper label="Clear cache">
                    <Spicetify.ReactComponent.ButtonSecondary
                        disabled={artistGenres.length === 0}
                        aria-label="Clear cache"
                        iconOnly={() => <Trash size={14} />}
                        buttonSize="sm"
                        onClick={() => {
                            void clearAll();
                        }}
                    />
                </Spicetify.ReactComponent.TooltipWrapper>
            </div>
            <input
                type="text"
                placeholder="Search artist"
                className="tw:mb-4 tw:w-full tw:rounded tw:border tw:border-solid tw:border-(--essential-subdued) tw:px-2 tw:py-1 tw:focus:border-(--essential-base)"
                value={search}
                onChange={(e) => {
                    onSearchChanged(e.target.value);
                }}
            />
            <div className="tw:max-h-80 tw:w-full tw:overflow-scroll">
                <table
                    id="artist-genres-table"
                    className="tw:w-full tw:overflow-x-clip tw:border tw:border-solid tw:border-(--essential-subdued)"
                >
                    <thead>
                        <th className="tw:border tw:border-solid tw:border-(--essential-subdued)">
                            Artist
                        </th>
                        <th className="tw:border tw:border-solid tw:border-(--essential-subdued)">
                            Genres
                        </th>
                        <th className="tw:w-28 tw:border tw:border-solid tw:border-(--essential-subdued)">
                            Expires
                        </th>
                    </thead>
                    <tbody>
                        {artistGenres.length > 0 ? (
                            artistGenres.map((artist) => (
                                <tr
                                    key={artist.artistUri}
                                    className="tw:border-y tw:text-sm"
                                    data-testid={`artist-${artist.artistUri}`}
                                >
                                    <td className="tw:p-2 tw:align-middle">
                                        {artist.artistName}
                                    </td>
                                    <td className="tw:border-x tw:p-2 tw:align-middle">
                                        {artist.genres.join(', ')}
                                    </td>
                                    <td className="tw:p-2 tw:align-middle">
                                        {Spicetify.Locale.formatDate(
                                            artist.expiry,
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="tw:py-4 tw:text-center"
                                >
                                    <TextComponent
                                        elementType="p"
                                        fontSize="small"
                                        semanticColor="textSubdued"
                                    >
                                        No genres saved.
                                    </TextComponent>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
