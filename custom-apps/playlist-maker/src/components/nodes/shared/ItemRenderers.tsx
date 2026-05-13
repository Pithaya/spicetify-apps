import { type AlbumItem } from 'custom-apps/playlist-maker/src/hooks/use-album-combobox-fetchers';
import { type ArtistItem } from 'custom-apps/playlist-maker/src/hooks/use-artist-combobox-fetchers';
import { type PlaylistItem } from 'custom-apps/playlist-maker/src/hooks/use-playlist-combobox-fetchers';
import { type TrackItem } from 'custom-apps/playlist-maker/src/hooks/use-track-combobox-fetchers';
import React from 'react';
import { type ItemRendererProps } from '../../inputs/ComboBox';
import { MusicComboboxItem } from './MusicComboboxItem';

export function ArtistItemRenderer(
    props: Readonly<ItemRendererProps<ArtistItem>>,
): JSX.Element {
    return (
        <MusicComboboxItem
            image={props.item.image}
            name={props.item.name}
            isSelected={props.isSelected}
            imageShape="circle"
            imageAlt="artist"
        />
    );
}

export function AlbumItemRenderer(
    props: Readonly<ItemRendererProps<AlbumItem>>,
): JSX.Element {
    return (
        <MusicComboboxItem
            image={props.item.image}
            name={props.item.name}
            subtitle={props.item.artists}
            isSelected={props.isSelected}
            imageShape="square"
            imageAlt="album"
        />
    );
}

export function PlaylistItemRenderer(
    props: Readonly<ItemRendererProps<PlaylistItem>>,
): JSX.Element {
    return (
        <MusicComboboxItem
            image={props.item.image}
            name={props.item.name}
            subtitle={`by ${props.item.ownerName}`}
            isSelected={props.isSelected}
            imageShape="square"
            imageAlt="playlist"
        />
    );
}

export function TrackItemRenderer(
    props: Readonly<ItemRendererProps<TrackItem>>,
): JSX.Element {
    return (
        <MusicComboboxItem
            image={props.item.image}
            name={props.item.name}
            subtitle={`${props.item.album} - ${props.item.artists}`}
            isSelected={props.isSelected}
            imageShape="square"
            imageAlt="album"
        />
    );
}
