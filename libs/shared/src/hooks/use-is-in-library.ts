import { useEffect, useState } from 'react';
import type { LibraryAPI } from '@shared/platform/library';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';

export function useIsInLibrary(
    uri: string,
): [
    boolean | undefined,
    React.Dispatch<React.SetStateAction<boolean | undefined>>,
] {
    const [trackInLibrary, setTrackInLibrary] = useState<boolean | undefined>(
        getPlatformApiOrThrow<LibraryAPI>('LibraryAPI').containsSync(uri),
    );

    useEffect(() => {
        const libraryApi = getPlatformApiOrThrow<LibraryAPI>('LibraryAPI');
        libraryApi
            .contains(uri)
            .then((result) => {
                setTrackInLibrary(result[0]);
            })
            .catch(console.error);
    }, [uri]);

    return [trackInLibrary, setTrackInLibrary];
}
