export interface AlbumItem {
    name: string;
    uri: string;
    image: string;
    artists: {
        name: string;
        uri: string;
    }[];
}
