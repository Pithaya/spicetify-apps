export type VisualIdentity = {
    squareCoverImage: VisualIdentityImage;
};

type VisualIdentityImage = {
    __typename: 'VisualIdentityImage';
    extractedColorSet: ExtractedColorSet;
};

type ExtractedColorSet = {
    encoreBaseSetTextColor: Color;
    highContrast: ColorSet;
    higherContrast: ColorSet;
    minContrast: ColorSet;
};

type ColorSet = {
    backgroundBase: Color;
    backgroundTintedBase: Color;
    textBase: Color;
    textBrightAccent: Color;
    textSubdued: Color;
};

type Color = {
    alpha: number;
    blue: number;
    green: number;
    red: number;
};
