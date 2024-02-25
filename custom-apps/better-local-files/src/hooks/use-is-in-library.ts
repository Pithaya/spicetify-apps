import type { LibraryAPI } from '@shared/platform/library';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import { useEffect, useState } from 'react';

export function useIsInLibrary(
    uri: string,
): [
    boolean | undefined,
    React.Dispatch<React.SetStateAction<boolean | undefined>>,
] {
    const libraryApi = getPlatformApiOrThrow<LibraryAPI>('LibraryAPI');
    const [trackInLibrary, setTrackInLibrary] = useState<boolean | undefined>(
        libraryApi.containsSync(uri),
    );

    useEffect(() => {
        if (trackInLibrary === undefined) {
            libraryApi
                .contains(uri)
                .then((result) => {
                    setTrackInLibrary(result[0]);
                })
                .catch(console.error);
        }
    }, [uri]);

    return [trackInLibrary, setTrackInLibrary];
}
