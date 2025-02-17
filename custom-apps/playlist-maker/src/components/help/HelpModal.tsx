import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import React, { type PropsWithChildren } from 'react';
import styles from './HelpModal.module.scss';

function Paragraph(props: Readonly<PropsWithChildren>): JSX.Element {
    return (
        <TextComponent
            elementType="p"
            semanticColor="textSubdued"
            fontSize="medium"
            paddingBottom="1rem"
        >
            {props.children}
        </TextComponent>
    );
}

function Strong(props: Readonly<PropsWithChildren>): JSX.Element {
    return (
        <TextComponent
            elementType="span"
            semanticColor="textBase"
            fontSize="medium"
        >
            {props.children}
        </TextComponent>
    );
}

export function HelpModal(): JSX.Element {
    return (
        <div className={styles['help-modal']}>
            <Paragraph>
                Drag and drop nodes from the side menu to create a workflow.
                <br />
                Move nodes in the editor by dragging them by their header.
            </Paragraph>

            <Paragraph>
                A workflow must have <Strong>at least one source node</Strong>,
                and <Strong>one result node</Strong>
                .
                <br />
                Connect the nodes together to create a workflow. Connections on
                the right of the nodes are <Strong>outputs</Strong>, and
                connections on the left are <Strong>inputs</Strong>
                .
                <br />
                Nodes can accept <Strong>multiple connections</Strong> on their
                input side.
            </Paragraph>

            <Paragraph>
                Select a node by clicking on it. The selected node will be
                highlighted.
                <br />
                To select multiple nodes, hold down the <kbd>Control</kbd> key
                while clicking on the nodes.
                <br />
                Selected nodes can be moved together by dragging any of them.
                <br />
                Selected nodes can be <Strong>deleted</Strong> by selecting it
                and pressing the <kbd>Backspace</kbd> key.
            </Paragraph>

            <Paragraph>
                Hover over the node names in the menu to see a description of
                the node.
            </Paragraph>

            <Paragraph>
                When the workflow is done, click the{' '}
                <Strong>&quot;Execute&quot;</Strong> button to run the workflow.
                <br />
                The results will be displayed in the{' '}
                <Strong>&quot;Result&quot; tab</Strong>
                .
                <br />
                You can then either play the tracks directly or save the result
                to a playlist.
            </Paragraph>

            <Paragraph>
                You can <Strong>save</Strong> and <Strong>load</Strong>{' '}
                workflows using the buttons in the top center of the editor.
            </Paragraph>
        </div>
    );
}
