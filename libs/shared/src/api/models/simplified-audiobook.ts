import type { Copyright } from './copyright';
import type { ExternalUrls } from './external-urls';
import type { Image } from './image';

export type Author = {
    name: string;
};

export type Narrator = {
    name: string;
};

export type SimplifiedAudiobook = {
    authors: Author[];
    available_markets: string[];
    copyrights: Copyright[];
    description: string;
    edition: string;
    explicit: boolean;
    external_urls: ExternalUrls;
    href: string;
    html_description: string;
    id: string;
    images: Image[];
    languages: string[];
    media_type: string;
    name: string;
    narrators: Narrator[];
    publisher: string;
    total_chapters: number;
    type: string;
    uri: string;
};
