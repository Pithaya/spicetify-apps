import { PageParameters } from './page-parameters';

export type AlbumGroup = 'album' | 'single' | 'appears_on' | 'compilation';

export class AlbumPageParameters extends PageParameters {
    public readonly includeGroups: AlbumGroup[];

    constructor(
        limit: number = 20,
        offset: number = 0,
        market?: string,
        includeGroups: AlbumGroup[] = [
            'album',
            'single',
            'appears_on',
            'compilation',
        ],
    ) {
        super(limit, offset, market);

        this.includeGroups = [...new Set(includeGroups)];
    }

    public override toQueryString(): string {
        return `${super.toQueryString()}&include_groups=${this.includeGroups.join(
            ',',
        )}`;
    }
}
