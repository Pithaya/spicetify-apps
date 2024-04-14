import React, { useRef } from 'react';
import styles from '../../../css/app.module.scss';
import { useIntersectionObserver } from '../../../hooks/use-intersection-observer';
import { navigateTo } from '../../../helpers/history-helper';
import { PlayButton } from '../../shared/buttons/PlayButton';
import type { Album } from 'custom-apps/better-local-files/src/models/album';
import { MultiTrackMenu } from '../../shared/menus/MultiTrackMenu';
import {
    ALBUM_ROUTE,
    ARTIST_ROUTE,
} from 'custom-apps/better-local-files/src/constants/constants';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

export type Props = {
    album: Album;
    onPlayClicked: (a: Album) => void;
};

export function AlbumCard(props: Readonly<Props>): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useIntersectionObserver(ref);
    const dragHandler = Spicetify.ReactHook.DragHandler({
        itemUris: props.album.getTracks().map((t) => t.uri),
        dragLabelText: props.album.name,
        contextUri: props.album.uri,
    });

    const placeholder = <div style={{ height: '250px' }}></div>;
    const imageFallback = `
    <div class="main-image-image main-cardImage-image main-image-loading main-image-loaded ${styles['center-container']}">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
        </svg>
    </div>`;

    const card = (
        <div
            className={`${styles['main-card-card']} main-card-card`}
            draggable
            onClick={() => {
                navigateTo(ALBUM_ROUTE, props.album.uri);
            }}
            onDragStart={dragHandler}
        >
            <div className="main-card-draggable">
                <div className="main-card-imageContainer main-card-imageContainerOld">
                    <div className="main-cardImage-imageWrapper">
                        <img
                            aria-hidden="false"
                            draggable="false"
                            loading="lazy"
                            src={props.album.image}
                            alt="album image"
                            className="main-image-image main-cardImage-image main-image-loading main-image-loaded"
                            onError={(e) =>
                                (e.currentTarget.outerHTML = imageFallback)
                            }
                        />
                    </div>
                    <div className="main-card-PlayButtonContainer">
                        <div className="main-playButton-PlayButton">
                            <PlayButton
                                size="md"
                                onClick={() => {
                                    props.onPlayClicked(props.album);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="main-card-cardMetadata">
                    <TextComponent
                        className="main-cardHeader-link main-cardHeader-text"
                        variant="balladBold"
                        semanticColor="textBase"
                        paddingBottom="4px"
                    >
                        {props.album.name}
                    </TextComponent>
                    <TextComponent
                        className={`main-cardSubHeader-root ${styles['limit-lines-2']}`}
                        variant="mesto"
                        semanticColor="textSubdued"
                    >
                        {props.album.artists
                            .map((a) => (
                                <span key={a.uri}>
                                    <a
                                        href="#"
                                        draggable="false"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateTo(ARTIST_ROUTE, a.uri);
                                        }}
                                    >
                                        {a.name}
                                    </a>
                                </span>
                            ))
                            .reduce(
                                (
                                    accu: JSX.Element[] | null,
                                    elem: JSX.Element,
                                ) => {
                                    return accu === null
                                        ? [elem]
                                        : [...accu, <>{', '}</>, elem];
                                },
                                null,
                            )}
                    </TextComponent>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={ref}>
            {visible ? (
                <Spicetify.ReactComponent.RightClickMenu
                    menu={<MultiTrackMenu tracks={props.album.getTracks()} />}
                >
                    {card}
                </Spicetify.ReactComponent.RightClickMenu>
            ) : (
                placeholder
            )}
        </div>
    );
}
