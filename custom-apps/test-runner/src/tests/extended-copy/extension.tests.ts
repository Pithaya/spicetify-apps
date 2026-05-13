import { waitForElement } from '@shared/utils/dom-utils';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { findByText, fireEvent } from '@testing-library/dom';
import type { Test } from 'custom-apps/test-runner/src/models/test';
import { stub } from 'custom-apps/test-runner/src/utils/stub';
import { expectArray } from '../../utils/expect';

const EXPECTED_TRACK_URI = 'spotify:track:3j1lvwbdfj3xflDnQazc8n';
const EXPECTED_TRACK_ID = '3j1lvwbdfj3xflDnQazc8n';
const EXPECTED_TRACK_NAME = 'Alicia';

const PLAYLIST_PATH = '/playlist/2IFbcSOwvrNug5ssK8fC8c';
const FIRST_TRACK_ROW_SELECTOR = 'main [role="row"][aria-rowindex="2"]';
const INNER_ROW_SELECTOR = 'div.main-trackList-trackListRow';
const OPENED_MENU_SENTINEL =
    'div.main-trackList-trackListRow[data-context-menu-open="true"]';

const COPY_TRACK_LABEL_REGEX = /^(Copy track|Copier la piste)$/;
const NAME_LABEL_REGEX = /^(Name|Nom)$/;
const DATA_LABEL_REGEX = /^(Data|Données)$/;

const POST_MENU_TIMEOUT = 5000;
const COPY_RACE_TIMEOUT = 10_000;

type CopyValue = string | object[];

function describe(value: CopyValue): string {
    return typeof value === 'string' ? value : JSON.stringify(value);
}

function spyClipboard(): {
    copied: Promise<CopyValue>;
    restore: () => void;
} {
    const api = getPlatform().ClipboardAPI;

    // Resolve of the copied promise, to be used from the spy
    let resolveCopy: (value: CopyValue) => void;

    const copied = new Promise<CopyValue>((resolve) => {
        resolveCopy = resolve;
    });

    const spy: typeof api.copy = (value) => {
        console.log('ClipboardAPI.copy called with', value);
        resolveCopy(value as CopyValue);
        return Promise.resolve();
    };

    const restore = stub(api, 'copy', spy);
    return { copied, restore };
}

async function rightClickFirstTrackAndOpenCopyTrack(): Promise<void> {
    getPlatform().History.push(PLAYLIST_PATH);

    const row = (await waitForElement(
        FIRST_TRACK_ROW_SELECTOR,
        10_000,
    )) as HTMLElement;

    console.log('Found track row', row);

    const inner = row.querySelector<HTMLElement>(INNER_ROW_SELECTOR);
    if (inner === null) {
        throw new Error('inner trackListRow not found');
    }

    fireEvent.contextMenu(inner);

    await waitForElement(OPENED_MENU_SENTINEL);
    console.log('Menu opened');

    const parentLabel = await findByText(
        document.body,
        COPY_TRACK_LABEL_REGEX,
        undefined,
        { timeout: POST_MENU_TIMEOUT },
    );

    console.log('Found parent label', parentLabel);

    const parentItem = parentLabel.closest<HTMLElement>('[role="menuitem"]');
    if (parentItem === null) {
        throw new Error('Copy track menuitem ancestor not found');
    }

    console.log('Found parent item', parentItem);

    // React's onMouseEnter / onPointerEnter handlers delegate to the bubbling
    // `mouseover` / `pointerover` events at the root. The non-bubbling
    // `*enter` variants never reach the delegated listener, so firing them
    // is a no-op against a React tree.
    fireEvent.pointerOver(parentItem);
    fireEvent.mouseOver(parentItem);
}

async function awaitCopiedValue(
    copied: Promise<CopyValue>,
): Promise<CopyValue> {
    return await Promise.race([
        copied,
        new Promise<CopyValue>((_, reject) => {
            setTimeout(() => {
                reject(new Error('ClipboardAPI.copy was never called'));
            }, COPY_RACE_TIMEOUT);
        }),
    ]);
}

async function clickSubItem(label: string | RegExp): Promise<void> {
    const item = await findByText(document.body, label, undefined, {
        timeout: POST_MENU_TIMEOUT,
    });
    fireEvent.click(item);
}

function teardown(restore: () => void): void {
    fireEvent.keyDown(document.body, { key: 'Escape' });
    restore();
}

export const tests: Test[] = [
    {
        name: 'Copy track > URI copies the expected URI to the clipboard',
        test: async () => {
            const { copied, restore } = spyClipboard();
            try {
                await rightClickFirstTrackAndOpenCopyTrack();
                await clickSubItem('URI');
                const value = await awaitCopiedValue(copied);
                if (value !== EXPECTED_TRACK_URI) {
                    throw new Error(
                        `Expected "${EXPECTED_TRACK_URI}", got "${describe(value)}"`,
                    );
                }
            } finally {
                teardown(restore);
            }
        },
    },
    {
        name: 'Copy track > ID copies the expected track id to the clipboard',
        test: async () => {
            const { copied, restore } = spyClipboard();
            try {
                await rightClickFirstTrackAndOpenCopyTrack();
                await clickSubItem('ID');
                const value = await awaitCopiedValue(copied);
                if (value !== EXPECTED_TRACK_ID) {
                    throw new Error(
                        `Expected "${EXPECTED_TRACK_ID}", got "${describe(value)}"`,
                    );
                }
            } finally {
                teardown(restore);
            }
        },
    },
    {
        name: 'Copy track > Name copies the track name fetched from GraphQL',
        test: async () => {
            const { copied, restore } = spyClipboard();
            try {
                await rightClickFirstTrackAndOpenCopyTrack();
                await clickSubItem(NAME_LABEL_REGEX);
                const value = await awaitCopiedValue(copied);
                if (value !== EXPECTED_TRACK_NAME) {
                    throw new Error(
                        `Expected "${EXPECTED_TRACK_NAME}", got "${describe(value)}"`,
                    );
                }
            } finally {
                teardown(restore);
            }
        },
    },
    {
        name: 'Copy track > Data copies a Track object fetched from GraphQL',
        test: async () => {
            const { copied, restore } = spyClipboard();
            try {
                await rightClickFirstTrackAndOpenCopyTrack();
                await clickSubItem(DATA_LABEL_REGEX);
                const value = await awaitCopiedValue(copied);

                if (!Array.isArray(value)) {
                    throw new TypeError(
                        `Expected an array, got ${typeof value}`,
                    );
                }

                expectArray(value).toHaveLength(1);

                const track = value[0] as {
                    __typename?: string;
                    name?: string;
                    uri?: string;
                    id?: string;
                };

                if (track.__typename !== 'Track') {
                    throw new Error(
                        `Expected __typename "Track", got "${track.__typename ?? '<undefined>'}"`,
                    );
                }
                if (track.name !== EXPECTED_TRACK_NAME) {
                    throw new Error(
                        `Expected name "${EXPECTED_TRACK_NAME}", got "${track.name ?? '<undefined>'}"`,
                    );
                }
                if (track.uri !== EXPECTED_TRACK_URI) {
                    throw new Error(
                        `Expected uri "${EXPECTED_TRACK_URI}", got "${track.uri ?? '<undefined>'}"`,
                    );
                }
                if (track.id !== EXPECTED_TRACK_ID) {
                    throw new Error(
                        `Expected id "${EXPECTED_TRACK_ID}", got "${track.id ?? '<undefined>'}"`,
                    );
                }
            } finally {
                teardown(restore);
            }
        },
    },
];
