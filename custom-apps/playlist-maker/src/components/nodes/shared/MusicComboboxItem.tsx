import { Music } from 'lucide-react';
import React from 'react';

type Props = {
    image: string | null;
    name: string;
    subtitle?: string;
    isSelected: boolean;
    imageShape: 'circle' | 'square';
    imageAlt: string;
};

export function MusicComboboxItem(props: Readonly<Props>): JSX.Element {
    return (
        <div className="tw:flex tw:max-h-[80px] tw:items-stretch tw:gap-2 tw:p-2">
            <div className="tw:flex tw:h-[60px] tw:w-[60px] tw:shrink-0 tw:items-center tw:justify-center">
                {props.image ? (
                    <img
                        src={props.image}
                        className={Spicetify.classnames(
                            'tw:max-h-full tw:max-w-full tw:object-contain',
                            props.imageShape === 'circle'
                                ? 'tw:rounded-full'
                                : 'tw:rounded-md',
                        )}
                        alt={props.imageAlt}
                    />
                ) : (
                    <Music size={60} strokeWidth={1} />
                )}
            </div>

            <div className="tw:flex tw:min-w-0 tw:flex-col tw:items-stretch tw:justify-center">
                <span
                    className={Spicetify.classnames(
                        'tw:truncate',
                        props.isSelected ? 'tw:font-bold' : '',
                    )}
                >
                    {props.name}
                </span>
                {props.subtitle === undefined ? null : (
                    <span className="tw:truncate tw:text-sm">
                        {props.subtitle}
                    </span>
                )}
            </div>
        </div>
    );
}
