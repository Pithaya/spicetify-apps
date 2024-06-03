import React from 'react';
import styles from './Sidebar.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

export function Sidenav(): JSX.Element {
    return (
        <div className={styles['sidebar']}>
            <TextComponent elementType="h1">Sources</TextComponent>
            <hr />
            <ul>
                <TextComponent elementType="li">Liked songs</TextComponent>
                <TextComponent elementType="li">Local files</TextComponent>
                <TextComponent elementType="li">Playlist</TextComponent>
            </ul>

            <TextComponent elementType="h1">Filters</TextComponent>
            <hr />
            <ul>
                <TextComponent elementType="li">Genre</TextComponent>
            </ul>

            <TextComponent elementType="h1">Processing</TextComponent>
            <hr />
            <ul>
                <TextComponent elementType="li">Merge</TextComponent>
                <TextComponent elementType="li">Dedup</TextComponent>
            </ul>

            <TextComponent elementType="h1">Result</TextComponent>
            <hr />
            <ul>
                <TextComponent elementType="li">Result</TextComponent>
            </ul>
        </div>
    );
}
