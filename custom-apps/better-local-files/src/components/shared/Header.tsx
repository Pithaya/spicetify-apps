import styles from '../../css/app.module.scss';
import React from 'react';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import useFitText from 'use-fit-text';

export type Props = {
    image: JSX.Element;
    title: string | JSX.Element;
    subtitle?: string | JSX.Element;
    metadata?: JSX.Element;
    additionalText?: JSX.Element;
    titleFontSize?: string;
};

export function HeaderImage(
    props: Readonly<{ imageSrc: string }>,
): JSX.Element {
    const headerImageFallback = (
        <div
            className={`main-image-image main-entityHeader-image main-entityHeader-shadow main-image-loaded ${styles['center-container']}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
            </svg>
        </div>
    );

    return (
        <>
            {props.imageSrc !== '' ? (
                <img
                    src={props.imageSrc}
                    className="main-image-image main-entityHeader-image main-entityHeader-shadow main-entityHeader-newEntityHeaders main-image-loaded"
                    onError={(e) =>
                        (e.currentTarget.outerHTML =
                            Spicetify.ReactDOMServer.renderToString(
                                headerImageFallback,
                            ))
                    }
                />
            ) : (
                headerImageFallback
            )}
        </>
    );
}

export function Header(props: Readonly<Props>): JSX.Element {
    const baseFontSize = '6rem';

    // Max height to prevent overflow on long titles / multiple artists
    const titleMaxHeight = '135px';
    const metadataMaxHeight = '66px';

    const { fontSize, ref } = useFitText();

    return (
        <div
            className={`contentSpacing main-entityHeader-container main-entityHeader-nonWrapped main-entityHeader-newEntityHeaders ${styles['pad-top']}`}
        >
            <div className="main-entityHeader-backgroundColor"></div>
            <div className="main-entityHeader-backgroundColor main-entityHeader-overlay"></div>

            <div></div>

            <div className="main-entityHeader-imageContainer main-entityHeader-imageContainerNew">
                <div className="main-entityHeader-image">{props.image}</div>
            </div>

            <div className="main-entityHeader-headerText">
                {props.subtitle && (
                    <TextComponent
                        variant="mesto"
                        className="main-entityHeader-pretitle"
                    >
                        {props.subtitle}
                    </TextComponent>
                )}
                <div
                    dir="auto"
                    className="main-entityHeader-title"
                    style={{
                        maxHeight: titleMaxHeight,
                        fontSize: baseFontSize,
                    }}
                    ref={ref}
                >
                    <TextComponent
                        variant="bass"
                        semanticColor="textBase"
                        elementType="h1"
                        style={{
                            fontSize,
                        }}
                    >
                        {props.title}
                    </TextComponent>
                </div>

                {props.metadata && (
                    <div
                        className="main-entityHeader-metaData"
                        style={{ maxHeight: metadataMaxHeight }}
                    >
                        {props.metadata}
                    </div>
                )}
            </div>
        </div>
    );
}
