import { geoMercator, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { getName } from 'i18n-iso-countries';
import React from 'react';
import { feature } from 'topojson-client';
import { topology } from './topology';
import styles from './WorldMap.module.scss';

export type Props = {
    locale: string;
    trackMarkets: string[];
};

type CountryProperties = {
    name: string;
    code: string;
};

const svgWidth = 700;
const svgHeight = 450;

const featureCollection: FeatureCollection = feature(
    topology,
    topology.objects.countries,
) as unknown as FeatureCollection;

const projection = geoMercator()
    .rotate([-11, 0])
    .fitSize([svgWidth, svgHeight], featureCollection);

export function WorldMap(props: Readonly<Props>): JSX.Element {
    const geographies: Feature<Geometry, CountryProperties>[] =
        featureCollection.features.map((feature) => ({
            ...feature,
            properties: {
                name:
                    typeof feature.properties?.name === 'string'
                        ? feature.properties.name
                        : '',
                code:
                    typeof feature.properties?.code === 'string'
                        ? feature.properties.code
                        : '',
            },
        }));

    const getClass = (properties: CountryProperties): string => {
        if (props.trackMarkets.includes(properties.code)) {
            return 'country-active';
        }

        return 'country';
    };

    return (
        <svg preserveAspectRatio="xMidYMid" viewBox="0 0 700 450">
            <g className="countries">
                {geographies.map((d) => (
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={getName(d.properties.code, props.locale)}
                        showDelay={100}
                        key={`${d.properties.name}-${d.properties.code}`}
                    >
                        <path
                            d={geoPath().projection(projection)(d) ?? undefined}
                            className={`${d.properties.name}-${
                                d.properties.code
                            } ${styles[getClass(d.properties)]}`}
                            fill="transparent"
                            strokeWidth={0.5}
                        />
                    </Spicetify.ReactComponent.TooltipWrapper>
                ))}
            </g>
        </svg>
    );
}
