import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { highlightSearchTerm } from 'highlight-search-term';
import { Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
    clearAll,
    getAllSorted,
} from '../../db/audio-features/audio-features-db';

export function SettingsModal(): JSX.Element {
    const [search, setSearch] = React.useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = React.useState<string>('');

    const cachedFeatures = useLiveQuery(
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
            selector: '#audio-features-table tbody',
        });
    }, [debouncedSearch]);

    return (
        <>
            <div className="tw:mb-4 tw:flex tw:flex-row tw:items-center tw:justify-between tw:gap-2">
                <div>
                    <TextComponent elementType="h1">
                        Audio features cache
                    </TextComponent>
                    <TextComponent
                        elementType="p"
                        fontSize="small"
                        semanticColor="textSubdued"
                    >
                        Set when audio feature filter nodes run.
                    </TextComponent>
                </div>
                <Spicetify.ReactComponent.TooltipWrapper label="Clear cache">
                    <Spicetify.ReactComponent.ButtonSecondary
                        disabled={cachedFeatures.length === 0}
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
                placeholder="Search track"
                className="tw:mb-4 tw:w-full tw:rounded tw:border tw:border-solid tw:border-(--essential-subdued) tw:px-2 tw:py-1 tw:focus:border-(--essential-base)"
                value={search}
                onChange={(e) => {
                    onSearchChanged(e.target.value);
                }}
            />
            <div className="tw:max-h-80 tw:w-full tw:overflow-auto">
                <table
                    id="audio-features-table"
                    className="tw:w-full tw:overflow-x-clip tw:border tw:border-solid tw:border-(--essential-subdued)"
                >
                    <thead>
                        <th className="tw:border tw:border-solid tw:border-(--essential-subdued)">
                            Track
                        </th>
                        <th className="tw:border tw:border-solid tw:border-(--essential-subdued)">
                            URI
                        </th>
                        <th className="tw:w-20 tw:border tw:border-solid tw:border-(--essential-subdued)">
                            Danceability
                        </th>
                        <th className="tw:w-20 tw:border tw:border-solid tw:border-(--essential-subdued)">
                            Energy
                        </th>
                        <th className="tw:w-20 tw:border tw:border-solid tw:border-(--essential-subdued)">
                            Valence
                        </th>
                        <th className="tw:w-20 tw:border tw:border-solid tw:border-(--essential-subdued)">
                            Tempo
                        </th>
                    </thead>
                    <tbody>
                        {cachedFeatures.length > 0 ? (
                            cachedFeatures.map((entry) => (
                                <tr
                                    key={entry.uri}
                                    className="tw:border-y tw:text-sm"
                                    data-testid={`audio-features-${entry.uri}`}
                                >
                                    <td className="tw:p-2 tw:align-middle">
                                        {entry.trackName}
                                    </td>
                                    <td
                                        className="tw:max-w-40 tw:truncate tw:border-x tw:p-2 tw:align-middle"
                                        title={entry.uri}
                                    >
                                        {entry.uri}
                                    </td>
                                    <td className="tw:p-2 tw:text-right tw:align-middle tw:tabular-nums">
                                        {entry.features.danceability.toFixed(2)}
                                    </td>
                                    <td className="tw:border-x tw:p-2 tw:text-right tw:align-middle tw:tabular-nums">
                                        {entry.features.energy.toFixed(2)}
                                    </td>
                                    <td className="tw:p-2 tw:text-right tw:align-middle tw:tabular-nums">
                                        {entry.features.valence.toFixed(2)}
                                    </td>
                                    <td className="tw:border-l tw:p-2 tw:text-right tw:align-middle tw:tabular-nums">
                                        {entry.features.tempo.toFixed(0)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="tw:py-4 tw:text-center"
                                >
                                    <TextComponent
                                        elementType="p"
                                        fontSize="small"
                                        semanticColor="textSubdued"
                                    >
                                        No audio features cached.
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
