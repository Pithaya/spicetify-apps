import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React, {
    type DragEvent,
    type KeyboardEvent,
    type PropsWithChildren,
} from 'react';
import { type CustomNodeType } from '../../models/nodes/node-types';
import { useAppStore } from '../../stores/store';
import { Combobox, type ItemRendererProps } from '../inputs/ComboBox';

type SidenavItemProps = {
    nodeType: CustomNodeType;
    label: string;
    tooltip: string;
};

function SidenavItem(props: Readonly<SidenavItemProps>): JSX.Element {
    const addNode = useAppStore((state) => state.addNode);

    const onNodeSelected = (nodeType: CustomNodeType): void => {
        addNode(nodeType, { x: 0, y: 0 });
    };

    const onDragStart = (event: DragEvent, nodeType: CustomNodeType): void => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <li>
            <Spicetify.ReactComponent.TooltipWrapper
                label={props.tooltip}
                showDelay={500}
            >
                <button
                    onDragStart={(event) => {
                        onDragStart(event, props.nodeType);
                    }}
                    draggable
                    tabIndex={0}
                    onKeyDown={(event: KeyboardEvent) => {
                        if (event.key === 'Enter') {
                            onNodeSelected(props.nodeType);
                        }
                    }}
                    className="bg-transparent border-none !py-1 w-full cursor-grab text-start hover:bg-spice-highlight"
                >
                    <TextComponent elementType="span" fontSize="medium">
                        {props.label}
                    </TextComponent>
                </button>
            </Spicetify.ReactComponent.TooltipWrapper>
        </li>
    );
}

function SidenavCollapsible(
    props: Readonly<PropsWithChildren<{ label: string }>>,
): JSX.Element {
    return (
        <details>
            <summary>
                <TextComponent
                    elementType="h2"
                    weight="bold"
                    fontSize="large"
                    className="inline"
                >
                    {props.label}
                </TextComponent>
            </summary>
            <div className="!mt-2">{props.children}</div>
        </details>
    );
}

function SidebarTitle(props: Readonly<{ label: string }>): JSX.Element {
    return (
        <>
            <TextComponent elementType="h1" fontSize="x-large">
                {props.label}
            </TextComponent>
            <hr className="divide-solid opacity-60" />
        </>
    );
}

type Item = {
    id: string;
    author: string;
    title: string;
};

const books: Item[] = [
    { id: 'book-1', author: 'Harper Lee', title: 'To Kill a Mockingbird' },
    { id: 'book-2', author: 'Lev Tolstoy', title: 'War and Peace' },
    { id: 'book-3', author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
    { id: 'book-4', author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
    { id: 'book-5', author: 'George Orwell', title: '1984' },
    { id: 'book-6', author: 'Jane Austen', title: 'Pride and Prejudice' },
    { id: 'book-7', author: 'Marcus Aurelius', title: 'Meditations' },
    {
        id: 'book-8',
        author: 'Fyodor Dostoevsky',
        title: 'The Brothers Karamazov',
    },
    { id: 'book-9', author: 'Lev Tolstoy', title: 'Anna Karenina' },
    {
        id: 'book-10',
        author: 'Fyodor Dostoevsky',
        title: 'Crime and Punishment',
    },
];

function getBooksFilter(inputValue: string): (book: Item) => boolean {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return function booksFilter(book: Item) {
        return (
            !inputValue ||
            book.title.toLowerCase().includes(lowerCasedInputValue) ||
            book.author.toLowerCase().includes(lowerCasedInputValue)
        );
    };
}

function ItemRenderer(props: Readonly<ItemRendererProps<Item>>): JSX.Element {
    return (
        <>
            <span>{props.item.title}</span>
            <span className="text-sm">{props.item.author}</span>
        </>
    );
}

export function Sidenav(): JSX.Element {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 mx-1.5">
                    <Combobox
                        fetchItems={(input) =>
                            books.filter(getBooksFilter(input))
                        }
                        itemRenderer={ItemRenderer}
                        itemToString={(item: Item) => item.title}
                    />

                    <select className="main-dropDown-dropDown">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3" disabled>
                            3
                        </option>
                    </select>
                </div>

                <SidebarTitle label="Sources" />

                <SidenavCollapsible label="Library">
                    <ul>
                        <SidenavItem
                            label="Liked songs"
                            nodeType="likedSongsSource"
                            tooltip="Get tracks from your liked songs."
                        />
                        <SidenavItem
                            label="Local files"
                            nodeType="localTracksSource"
                            tooltip="Get tracks from your local files."
                        />
                        <SidenavItem
                            label="Top tracks"
                            nodeType="topTracksSource"
                            tooltip="Get tracks from your top tracks."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Playlists">
                    <ul>
                        <SidenavItem
                            label="Library playlist"
                            nodeType="libraryPlaylistSource"
                            tooltip="Get tracks from a playlist in your library."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Albums">
                    <ul>
                        <SidenavItem
                            label="Album"
                            nodeType="albumSource"
                            tooltip="Get tracks from an album."
                        />
                    </ul>
                </SidenavCollapsible>
            </div>

            <div className="flex flex-col gap-2">
                <SidebarTitle label="Filters" />

                <SidenavCollapsible label="Genres">
                    <ul>
                        <SidenavItem
                            label="Genre"
                            nodeType="genre"
                            tooltip="Filter tracks by genre."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Track property">
                    <ul>
                        <SidenavItem
                            label="Is playable"
                            nodeType="isPlayable"
                            tooltip="Filter tracks that are playable."
                        />
                    </ul>
                </SidenavCollapsible>

                <SidenavCollapsible label="Audio features">
                    <ul>
                        <SidenavItem
                            label="Acousticness"
                            nodeType="acousticness"
                            tooltip="Filter tracks by acousticness."
                        />
                        <SidenavItem
                            label="Danceability"
                            nodeType="danceability"
                            tooltip="Filter tracks by danceability."
                        />
                        <SidenavItem
                            label="Energy"
                            nodeType="energy"
                            tooltip="Filter tracks by energy."
                        />
                        <SidenavItem
                            label="Instrumentalness"
                            nodeType="instrumentalness"
                            tooltip="Filter tracks by instrumentalness."
                        />
                        <SidenavItem
                            label="Liveness"
                            nodeType="liveness"
                            tooltip="Filter tracks by liveness."
                        />
                        <SidenavItem
                            label="Speechiness"
                            nodeType="speechiness"
                            tooltip="Filter tracks by speechiness."
                        />
                        <SidenavItem
                            label="Valence"
                            nodeType="valence"
                            tooltip="Filter tracks by valence."
                        />
                        <SidenavItem
                            label="Loudness"
                            nodeType="loudness"
                            tooltip="Filter tracks by loudness."
                        />
                        <SidenavItem
                            label="Tempo"
                            nodeType="tempo"
                            tooltip="Filter tracks by tempo."
                        />
                        <SidenavItem
                            label="Mode"
                            nodeType="mode"
                            tooltip="Filter tracks by mode."
                        />
                    </ul>
                </SidenavCollapsible>
            </div>

            <div className="flex flex-col gap-2">
                <SidebarTitle label="Processing" />

                <ul>
                    <SidenavItem
                        label="Deduplicate"
                        nodeType="deduplicate"
                        tooltip="Remove duplicate tracks."
                    />
                    <SidenavItem
                        label="Shuffle"
                        nodeType="shuffle"
                        tooltip="Shuffle the tracks."
                    />
                    <SidenavItem
                        label="Sort"
                        nodeType="sort"
                        tooltip="Sort the tracks."
                    />
                </ul>
            </div>

            <div className="flex flex-col gap-2">
                <SidebarTitle label="Result" />

                <ul>
                    <SidenavItem
                        label="Result"
                        nodeType="result"
                        tooltip="The workflow result."
                    />
                </ul>
            </div>
        </div>
    );
}
