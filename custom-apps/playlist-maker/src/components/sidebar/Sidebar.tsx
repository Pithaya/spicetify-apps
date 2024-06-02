import React from 'react';

export function Sidenav(): JSX.Element {
    return (
        <>
            <h1>Sources</h1>
            <ul>
                <li>Liked songs</li>
                <li>Local files</li>
                <li>Playlist</li>
            </ul>

            <h1>Filters</h1>
            <ul>
                <li>Genre</li>
            </ul>

            <h1>Processing</h1>
            <ul>
                <li>Merge</li>
                <li>Dedup</li>
            </ul>

            <h1>Result</h1>
            <ul>
                <li>Result</li>
            </ul>
        </>
    );
}
