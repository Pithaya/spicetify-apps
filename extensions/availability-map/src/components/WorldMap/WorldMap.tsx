import React from 'react';
import styles from './WorldMap.module.scss';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, GeoJsonProperties } from 'geojson';
import { topology } from './topology';

export type Props = {
    allMarkets: string[];
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
) as any as FeatureCollection;
const projection = geoMercator().fitSize(
    [svgWidth, svgHeight],
    featureCollection,
);

export function WorldMap(props: Readonly<Props>): JSX.Element {
    const geographies: Feature[] = featureCollection.features;

    const getClass = (properties?: GeoJsonProperties): string => {
        const countryProperies: CountryProperties = {
            name: properties?.name as string,
            code: properties?.code as string,
        };

        if (props.trackMarkets.includes(countryProperies.code)) {
            return 'country-active';
        }

        return 'country';
    };

    return (
        <svg preserveAspectRatio="xMidYMid" viewBox="0 0 700 450">
            <g className="countries">
                {geographies.map((d, i) => (
                    <path
                        key={d.properties?.name + '-' + d.properties?.code}
                        d={geoPath().projection(projection)(d) ?? undefined}
                        className={`${d.properties?.name}-${d.properties
                            ?.code} ${styles[getClass(d.properties)]}`}
                        fill="transparent"
                        strokeWidth={0.5}
                    />
                ))}
            </g>
        </svg>
    );
}
