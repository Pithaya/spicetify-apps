import React from 'react';
import { Panel } from 'reactflow';
import { HelpButton } from '../../help/HelpButton';
import { SettingsButton } from '../../settings/SettingsButton';

export function TopLeftPanel(): JSX.Element {
    return (
        <Panel className="tw:rounded-lg" position="top-left">
            <HelpButton />
            <div className="tw:border-b tw:border-solid tw:border-[#eee]" />
            <SettingsButton />
        </Panel>
    );
}
