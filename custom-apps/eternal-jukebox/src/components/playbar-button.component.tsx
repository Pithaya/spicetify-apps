import React, { useEffect, useState } from 'react';
import { Infinity } from 'lucide-react';

export function PlaybarButton() {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const subscription = window.jukebox.stateChanged$.subscribe((state) => {
            setIsActive(state);
        });
        return () => subscription.unsubscribe();
    }, []);

    function toggleJukebox(): void {
        window.jukebox.isEnabled = !window.jukebox.isEnabled;
    }

    return (
        <Spicetify.ReactComponent.TooltipWrapper
            label={'Enable jukebox'}
            showDelay={100}
            renderInline={false}
        >
            <button
                className={`main-repeatButton-button ${
                    isActive ? 'main-repeatButton-active' : ''
                }`}
                role="checkbox"
                aria-checked="false"
                aria-label="Activer jukebox"
                onClick={toggleJukebox}
            >
                <Infinity size={24} />
            </button>
        </Spicetify.ReactComponent.TooltipWrapper>
    );
}
