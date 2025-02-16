import { Infinity as InfinityIcon } from 'lucide-react';
import { useSubscription } from 'observable-hooks';
import React, { type MouseEvent, useState } from 'react';

type Props = {
    className: string;
};

export function PlaybarButton(props: Readonly<Props>): JSX.Element {
    const [isActive, setIsActive] = useState(false);

    useSubscription(window.jukebox.stateChanged$, setIsActive);

    async function toggleJukebox(): Promise<void> {
        await window.jukebox.setEnabled(!window.jukebox.isEnabled);
    }

    const label = isActive ? 'Disable jukebox' : 'Enable jukebox';

    return (
        <Spicetify.ReactComponent.TooltipWrapper
            label={label}
            showDelay={100}
            renderInline={false}
        >
            <Spicetify.ReactComponent.ButtonTertiary
                aria-label={label}
                buttonSize={'sm'}
                onClick={async (e: MouseEvent) => {
                    e.stopPropagation();
                    await toggleJukebox();
                }}
                iconOnly={<InfinityIcon size={24} />}
                className={Spicetify.classnames(props.className, {
                    active: isActive,
                })}
            ></Spicetify.ReactComponent.ButtonTertiary>
        </Spicetify.ReactComponent.TooltipWrapper>
    );
}
