import React, { useState } from 'react';
import { Infinity } from 'lucide-react';
import { useSubscription } from 'observable-hooks';

export function PlaybarButton(): JSX.Element {
    const [isActive, setIsActive] = useState(false);

    useSubscription(window.jukebox.stateChanged$, setIsActive);

    async function toggleJukebox(): Promise<void> {
        await window.jukebox.setEnabled(!window.jukebox.isEnabled);
    }

    const label = isActive ? 'Disable jukebox' : 'Enable jukebox';
    const style: React.CSSProperties = {
        color: isActive ? 'var(--spice-button-active)' : 'inherit',
    };
    const beforeStyle: React.CSSProperties = {
        backgroundColor: 'currentcolor',
        borderRadius: '50%',
        bottom: '0',
        display: 'block',
        left: '50%',
        position: 'absolute',
        width: '4px',
        inlineSize: '4px',
        height: '4px',
        transform: 'translateX(-50%)',
    };

    return (
        <Spicetify.ReactComponent.TooltipWrapper
            label={label}
            showDelay={100}
            renderInline={false}
        >
            <Spicetify.ReactComponent.ButtonTertiary
                aria-label={label}
                buttonSize={'sm'}
                onClick={async (e: any) => {
                    e.stopPropagation();
                    await toggleJukebox();
                }}
                iconOnly={() => (
                    <>
                        <Infinity size={24} />
                        {isActive && <div style={beforeStyle}></div>}
                    </>
                )}
                style={style}
            ></Spicetify.ReactComponent.ButtonTertiary>
        </Spicetify.ReactComponent.TooltipWrapper>
    );
}
