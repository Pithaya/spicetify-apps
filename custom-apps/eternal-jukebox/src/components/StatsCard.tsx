import React from 'react';
import { type DriverState } from '../models/driver-state';
import { millisToMinutesAndSeconds } from '../utils/time-utils';

export type Props = {
    trackName: string;
    driverState: DriverState;
};

export function StatsCard(props: Readonly<Props>): JSX.Element {
    return (
        <div className="flex min-w-96 flex-col gap-1 rounded-lg bg-(--spice-sidebar) p-4">
            <h1 className="text-lg font-bold">{props.trackName}</h1>

            <span>Total beats: {props.driverState.beatsPlayed.toFixed()}</span>
            <span>
                Current branch change:{' '}
                {(props.driverState.currentRandomBranchChance * 100).toFixed(2)}
                %
            </span>
            <span>
                Listen time:{' '}
                {millisToMinutesAndSeconds(props.driverState.listenTime)}
            </span>
        </div>
    );
}
