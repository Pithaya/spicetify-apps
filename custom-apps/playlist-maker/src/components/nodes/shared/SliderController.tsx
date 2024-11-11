import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { getTrackBackground, Range } from 'react-range';

// TODO: Handle RTL

type Props = {
    control: Control<{ range: { min: number; max: number } }>;
};

export function SliderController(props: Readonly<Props>): JSX.Element {
    return (
        <div className="nodrag">
            <Controller
                name="range"
                control={props.control}
                render={({ field: { onChange, value } }) => (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Range
                            values={[value.min, value.max]}
                            step={0.01}
                            min={0}
                            max={1}
                            rtl={false}
                            onChange={(values) => {
                                onChange({
                                    min: values[0],
                                    max: values[1],
                                });
                            }}
                            renderTrack={({ props, children }) => (
                                <div
                                    onMouseDown={props.onMouseDown}
                                    onTouchStart={props.onTouchStart}
                                    style={{
                                        ...props.style,
                                        height: '36px',
                                        display: 'flex',
                                        width: '200px',
                                    }}
                                >
                                    <div
                                        ref={props.ref}
                                        style={{
                                            height: '5px',
                                            width: '100%',
                                            borderRadius: '4px',
                                            background: getTrackBackground({
                                                values: [value.min, value.max],
                                                colors: [
                                                    '#ccc',
                                                    'var(--spice-button)',
                                                    '#ccc',
                                                ],
                                                min: 0,
                                                max: 1,
                                                rtl: false,
                                            }),
                                            alignSelf: 'center',
                                        }}
                                    >
                                        {children}
                                    </div>
                                </div>
                            )}
                            renderThumb={({ index, props }) => (
                                <div
                                    {...props}
                                    key={props.key}
                                    style={{
                                        ...props.style,
                                        height: '14px',
                                        width: '14px',
                                        borderRadius: '7px',
                                        backgroundColor: 'var(--spice-text)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '-28px',
                                            color: 'var(--spice-text)',
                                            fontSize: 'small',
                                            fontWeight: 'bold',
                                            padding: '4px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        {[value.min, value.max][index]}
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                )}
            />
        </div>
    );
}
