export type CoverArt = {
    extractedColors: ExtractedColors;
    sources: Source[];
};

type ExtractedColors = {
    colorDark: ColorDark;
};

type ColorDark = {
    hex: string;
    isFallback: boolean;
};

type Source = {
    height: number;
    url: string;
    width: number;
};
