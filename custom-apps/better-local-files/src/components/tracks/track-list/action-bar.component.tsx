import styles from '../../../css/app.module.scss';
import React from 'react';
import {
    IProps as SearchProps,
    SearchInput,
} from '../../shared/filters/search-input';
import { PlayButton } from '../../shared/buttons/play-button';
import { SortMenu } from '../menus/sort-menu';

export interface IProps extends SearchProps {
    onPlayClicked: () => void;
}

export function ActionBar(props: IProps) {
    return (
        <>
            <div className={`${styles['action-bar']}`}>
                <PlayButton
                    size={60}
                    iconSize={24}
                    onClick={props.onPlayClicked}
                />

                <div className={styles['controls']}>
                    <SearchInput
                        search={props.search}
                        setSearch={props.setSearch}
                        debouncedSearch={props.debouncedSearch}
                        setDebouncedSearch={props.setDebouncedSearch}
                    />

                    <SortMenu />
                </div>
            </div>
        </>
    );
}
