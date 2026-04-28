import React from 'react';

export function ColorsPage(): JSX.Element {
    return (
        <>
            <div>
                <h1>Spicetify colors</h1>

                <p className="tw:text-(--spice-tab-active)">spice-tab-active</p>
                <p className="tw:text-(--spice-player)">spice-player</p>
                <p className="tw:text-(--spice-button-active)">
                    spice-button-active
                </p>
                <p className="tw:text-(--spice-button-disabled)">
                    spice-button-disabled
                </p>
                <p className="tw:text-(--spice-button)">spice-button</p>
                <p className="tw:text-(--spice-notification)">
                    spice-notification
                </p>
                <p className="tw:text-(--spice-shadow)">spice-shadow</p>
                <p className="tw:text-(--spice-highlight)">spice-highlight</p>
                <p className="tw:text-(--spice-sidebar)">spice-sidebar</p>
                <p className="tw:text-(--spice-card)">spice-card</p>
                <p className="tw:text-(--spice-text)">spice-text</p>
                <p className="tw:text-(--spice-notification-error)">
                    spice-notification-error
                </p>
                <p className="tw:text-(--spice-selected-row)">
                    spice-selected-row
                </p>
                <p className="tw:text-(--spice-subtext)">spice-subtext</p>
                <p className="tw:text-(--spice-highlight-elevated)">
                    spice-highlight-elevated
                </p>
                <p className="tw:text-(--spice-main)">spice-main</p>
                <p className="tw:text-(--spice-misc)">spice-misc</p>
                <p className="tw:text-(--spice-main-elevated)">
                    spice-main-elevated
                </p>
            </div>

            <div>
                <h1>Encore colors</h1>

                <p className="tw:text-(--background-base)">
                    background-base (--spice-main)
                </p>
                <p className="tw:text-(--background-highlight)">
                    background-highlight (--spice-main-elevated)
                </p>
                <p className="tw:text-(--background-press)">
                    background-press (--spice-sidebar);
                </p>
                <p className="tw:text-(--background-elevated-base)">
                    background-elevated-base (--spice-main-elevated);
                </p>
                <p className="tw:text-(--background-elevated-highlight)">
                    background-elevated-highlight (--spice-highlight-elevated);
                </p>
                <p className="tw:text-(--background-elevated-press)">
                    background-elevated-press
                </p>
                <p className="tw:text-(--background-tinted-base)">
                    background-tinted-base
                </p>
                <p className="tw:text-(--background-tinted-highlight)">
                    background-tinted-highlight
                </p>
                <p className="tw:text-(--background-tinted-press)">
                    background-tinted-press
                </p>
                <p className="tw:text-(--text-base)">
                    text-base (--spice-text);
                </p>
                <p className="tw:text-(--text-subdued)">
                    text-subdued (--spice-subtext);
                </p>
                <p className="tw:text-(--text-bright-accent)">
                    text-bright-accent (--spice-button-active);
                </p>
                <p className="tw:text-(--text-negative)">text-negative</p>
                <p className="tw:text-(--text-warning)"> text-warning</p>
                <p className="tw:text-(--text-positive)">
                    text-positive (--spice-button-active);
                </p>
                <p className="tw:text-(--text-announcement)">
                    text-announcement
                </p>
                <p className="tw:text-(--essential-base)">
                    essential-base (--spice-text);
                </p>
                <p className="tw:text-(--essential-subdued)">
                    essential-subdued
                </p>
                <p className="tw:text-(--essential-bright-accent)">
                    essential-bright-accent (--spice-button-active);
                </p>
                <p className="tw:text-(--essential-negative)">
                    essential-negative
                </p>
                <p className="tw:text-(--essential-warning)">
                    essential-warning
                </p>
                <p className="tw:text-(--essential-positive)">
                    essential-positive (--spice-button-active);
                </p>
                <p className="tw:text-(--essential-announcement)">
                    essential-announcement
                </p>
                <p className="tw:text-(--decorative-base)">
                    decorative-base (--spice-text);
                </p>
                <p className="tw:text-(--decorative-subdued)">
                    decorative-subdued
                </p>
            </div>
        </>
    );
}
