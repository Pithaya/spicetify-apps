export type Track = {
    artists: {
        name: string;
        uri: string;
    }[];
    duration: number;
    explicit: boolean;
    name: string;
    number: number;
    playable: boolean;
    playcount: number;
    popularity: number;
    uri: string;
};
