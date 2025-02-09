import { Menu } from '@shared/components/menus/Menu';
import { MenuItemHeading } from '@shared/components/menus/MenuItemHeading';
import { MenuItemLabel } from '@shared/components/menus/MenuItemLabel';
import {
    displayIcons,
    type DisplayType,
    type HeaderKey,
    type LibraryHeaders,
    type SelectedSortOption,
    type SortOption,
} from '@shared/components/track-list/models/sort-option';
import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { getTranslation } from '@shared/utils/translations.utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

export type Props = {
    sortOptions: SortOption<LibraryHeaders>[];
    selectedSortOption: SelectedSortOption<LibraryHeaders>;
    setSelectedSortOption: (key: HeaderKey<LibraryHeaders>) => void;
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
        <Menu>
            {props.sortOptions.length > 0 && sort}
            {props.displayTypes.length > 0 && display}
        </Menu>
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
