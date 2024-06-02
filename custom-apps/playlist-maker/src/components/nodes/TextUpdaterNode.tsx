import React, { useCallback } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import styles from '../../css/app.module.scss';

const handleStyle = { left: 10 };

type Props = {
    label: string;
};

export function TextUpdaterNode(
    props: Readonly<NodeProps<Props>>,
): JSX.Element {
    const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        console.log(evt.target.value);
    }, []);

    return (
        <div className={styles['node']}>
            <Handle type="target" position={Position.Top} />
            <div>
                <label htmlFor="text">{props.data.label}</label>
                <input
                    id="text"
                    name="text"
                    onChange={onChange}
                    className="nodrag"
                />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />
        </div>
    );
}
