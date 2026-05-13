import React from 'react';

export function TextPage(): JSX.Element {
    return (
        <div className="tw:flex tw:flex-col tw:gap-4">
            <div>
                <h1>Heading 1</h1>
                <h2>Heading 2</h2>
                <h3>Heading 3</h3>
                <h4>Heading 4</h4>
                <h5>Heading 5</h5>
                <h6>Heading 6</h6>
            </div>

            <div>
                <p>
                    This is a paragraph with a <span>span</span>.
                </p>
            </div>

            <div>
                <ul>
                    <li>This is a list item.</li>
                    <li>This is a list item.</li>
                </ul>

                <ol>
                    <li>This is a list item.</li>
                    <li>This is a list item.</li>
                </ol>
            </div>
        </div>
    );
}
