import React, { useEffect, useState } from 'react';
import styles from '../../../css/app.module.scss';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Search } from 'lucide-react';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';

// TODO: clear button

export interface IProps {
    search: string;
    setSearch: (value: string) => void;
    debouncedSearch: string;
    setDebouncedSearch: (value: string) => void;
}

export function SearchInput(props: IProps) {
    const [onSearchSubject] = useState<Subject<string>>(new Subject<string>());

    useEffect(() => {
        const subscription = onSearchSubject
            .asObservable()
            .pipe(debounceTime(600), distinctUntilChanged())
            .subscribe((debounced) => props.setDebouncedSearch(debounced));

        return () => subscription.unsubscribe();
    }, [onSearchSubject]);

    function onSearchChange(value: string) {
        onSearchSubject.next(value);
        props.setSearch(value);
    }

    return (
        <div
            className={styles['search-container']}
            role="search"
            aria-expanded="false"
        >
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
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
}
