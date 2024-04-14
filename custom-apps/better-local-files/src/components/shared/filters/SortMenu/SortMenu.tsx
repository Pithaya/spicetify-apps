import React from 'react';
import {
    displayIcons,
    type DisplayType,
    type SelectedSortOption,
    type SortOption,
} from 'custom-apps/better-local-files/src/models/sort-option';
import { SPOTIFY_MENU_CLASSES } from 'custom-apps/better-local-files/src/constants/constants';
import type { HeaderKey } from 'custom-apps/better-local-files/src/constants/constants';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { getTranslation } from 'custom-apps/better-local-files/src/helpers/translations-helper';
import { SpotifyIcon } from '../../icons/SpotifyIcon';
import { MenuItemHeading } from '../../menus/MenuItemHeading';
import { MenuItemLabel } from '../../menus/MenuItemLabel';

export type Props = {
    sortOptions: SortOption[];
    selectedSortOption: SelectedSortOption;
    setSelectedSortOption: (key: HeaderKey) => void;
    displayTypes: DisplayType[];
    selectedDisplayType: DisplayType;
    setSelectedDisplayType: (type: DisplayType) => void;
};

export function SortMenu(props: Readonly<Props>): JSX.Element {
    const sort = (
        <>
            <MenuItemHeading>
                {getTranslation(['drop_down.sort_by'])}
            </MenuItemHeading>

            {props.sortOptions.map((o) => (
                <Spicetify.ReactComponent.MenuItem
                    key={o.key}
                    onClick={() => {
                        props.setSelectedSortOption(o.key);
                    }}
                    role="menuitemradio"
                    aria-checked={props.selectedSortOption.key === o.key}
                    CheckedIcon={() =>
                        props.selectedSortOption.order === 'ascending' ? (
                            <ArrowUp />
                        ) : (
                            <ArrowDown />
                        )
                    }
                >
                    <MenuItemLabel>{o.label}</MenuItemLabel>
                </Spicetify.ReactComponent.MenuItem>
            ))}
        </>
    );

    const display = (
        <>
            <MenuItemHeading>
                {getTranslation([
                    'web-player.your-library-x.sort-and-view-picker.view-as',
                ])}
            </MenuItemHeading>

            {props.displayTypes.map((displayType) => (
                <Spicetify.ReactComponent.MenuItem
                    key={displayType}
                    onClick={() => {
                        props.setSelectedDisplayType(displayType);
                    }}
                    leadingIcon={
                        <SpotifyIcon
                            icon={displayIcons[displayType]}
                            iconSize={16}
                        />
                    }
                    role="menuitemradio"
                    aria-checked={props.selectedDisplayType === displayType}
                >
                    <MenuItemLabel>
                        {getTranslation([
                            `web-player.your-library-x.sort-and-view-picker.${displayType}`,
                        ])}
                    </MenuItemLabel>
                </Spicetify.ReactComponent.MenuItem>
            ))}
        </>
    );

    const menu = (
        <Spicetify.ReactComponent.Menu className={SPOTIFY_MENU_CLASSES}>
            {props.sortOptions.length > 0 && sort}
            {props.displayTypes.length > 0 && display}
        </Spicetify.ReactComponent.Menu>
    );

    return (
        <Spicetify.ReactComponent.ContextMenu
            trigger="click"
            action="toggle"
            menu={menu}
        >
            <button className="x-sortBox-sortDropdown">
                <span>
                    {props.sortOptions.find(
                        (o) => o.key === props.selectedSortOption.key,
                    )?.label ?? ''}
                </span>
                <SpotifyIcon
                    icon={displayIcons[props.selectedDisplayType]}
                    iconSize={16}
                />
            </button>
        </Spicetify.ReactComponent.ContextMenu>
    );
}
