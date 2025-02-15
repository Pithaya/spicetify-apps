import type { ExternalUrls } from './external-urls';
import type { Image } from './image';
import type { Market } from './market';
import type { Restrictions } from './restrictions';
import type { ResumePoint } from './resume-point';

export type SimplifiedChapter = {
    id: string;
    description: string;
    chapter_number: number;
    duration_ms: number;
    explicit: boolean;
    images: Image[];
    languages: string[];
    name: string;
    audio_preview_url: string;
    release_date: string;
    release_date_precision: string;
    resume_point: ResumePoint;
    html_description: string;
    available_markets: Market[];
    type: string;
    uri: string;
    external_urls: ExternalUrls;
    href: string;
    is_playable: boolean;
    restrictions?: Restrictions;
};
