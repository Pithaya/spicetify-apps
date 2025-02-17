import React from 'react';
import {
    Controller,
    type Control,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form';
import { getTrackBackground, Range } from 'react-range';

// TODO: Handle RTL

type RangeForm = { range: { min: number; max: number } } & FieldValues;

type Props<T extends RangeForm> = {
    control: Control<T>;
    min: number;
    max: number;
    step: number;
    onChange: (value: { min: number; max: number }) => void;
};

export function SliderController<T extends RangeForm>(
    props: Readonly<Props<T>>,
): JSX.Element {
    const { min, max, step } = props;

    return (
        <div>
            <Controller
                name={'range' as FieldPath<T>}
                control={props.control}
                render={({
                    field: { onChange, value, ref },
                    formState: { disabled },
                }) => (
                    <div className="flex flex-wrap justify-center">
                        <Range
                            values={[value.min, value.max]}
                            step={step}
                            min={min}
                            max={max}
                            rtl={false}
                            onChange={(values) => {
                                const value = {
                                    min: values[0],
                                    max: values[1],
                                };
                                onChange(value);
                                props.onChange(value);
                            }}
                            disabled={disabled}
                            ref={ref}
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
                                                colors: disabled
                                                    ? [
                                                          'var(--spice-tab-active)',
                                                          'var(--spice-button-disabled)',
                                                          'var(--spice-tab-active)',
                                                      ]
                                                    : [
                                                          'var(--spice-tab-active)',
                                                          'var(--spice-button)',
                                                          'var(--spice-tab-active)',
                                                      ],
                                                min: min,
                                                max: max,
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
                                        backgroundColor: disabled
                                            ? 'var(--spice-subtext)'
                                            : 'var(--spice-text)',
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
