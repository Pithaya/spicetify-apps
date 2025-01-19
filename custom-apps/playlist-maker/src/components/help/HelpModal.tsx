import React from 'react';
import styles from './HelpModal.module.scss';

export function HelpModal(): JSX.Element {
    return (
        <div className={styles['help-modal']}>
            <p>Drag and drop nodes from the side menu to create a workflow.</p>
            <p>
                A workflow must have <strong>at least one source node</strong>,
                and <strong>one result node</strong>. <br />
                Connect the nodes together to create a workflow. <br />A node
                can be <strong>deleted</strong> by selecting it and pressing the{' '}
                <kbd>Backspace</kbd> key.
            </p>
            <p>
                Hover over the node names in the menu to see a description of
                the node.
            </p>
            <p>
                When the workflow is done, click the{' '}
                <strong>&quot;Execute&quot;</strong> button to run the workflow.
                <br />
                The results will be displayed in the{' '}
                <strong>&quot;Result&quot; tab</strong>. <br />
                You can then either play the tracks directly or save the result
                to a playlist.
            </p>
            <p>
                You can <strong>save</strong> and <strong>load</strong>{' '}
                workflows using the buttons in the top center of the editor.
            </p>
        </div>
    );
}
