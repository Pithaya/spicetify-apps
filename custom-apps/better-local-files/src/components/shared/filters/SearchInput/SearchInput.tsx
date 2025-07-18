import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { getTranslation } from '@shared/utils/translations.utils';
import { Search } from 'lucide-react';
import { useObservableRef, useSubscription } from 'observable-hooks';
import React from 'react';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import styles from './SearchInput.module.scss';

export type Props = {
    search: string;
    setSearch: (value: string) => void;
    setDebouncedSearch: (value: string) => void;
};

export function SearchInput(props: Readonly<Props>): JSX.Element {
    // TODO: useDebouncedCallback
    const [search, search$] = useObservableRef(props.search);
    useSubscription(
        search$.pipe(debounceTime(400), distinctUntilChanged()),
        props.setDebouncedSearch,
    );

    function onSearchChange(value: string): void {
        search.current = value;
        props.setSearch(value);
    }

    return (
        <div className={styles['search-container']}>
            <div className={styles['search-icon']}>
                <Search size={18}></Search>
            </div>

            <input
                role="searchbox"
                maxLength={80}
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                placeholder={getTranslation(['navbar.search'])}
                aria-hidden="true"
                tabIndex={-1}
                value={props.search}
                onChange={(e) => {
                    onSearchChange(e.target.value);
                }}
            />

            <Spicetify.ReactComponent.ButtonTertiary
                iconOnly={() => <SpotifyIcon icon="x" iconSize={16} />}
                buttonSize="sm"
                className={styles['clear-icon']}
                onClick={() => {
                    onSearchChange('');
                }}
                style={{ visibility: props.search ? 'visible' : 'hidden' }}
            ></Spicetify.ReactComponent.ButtonTertiary>
        </div>
    );
}
