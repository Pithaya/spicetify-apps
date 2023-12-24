import { getPlatform } from '@shared/utils';
import { useEffect, useState } from 'react';

export function useIsInLibrary(
    uri: string,
): [
    boolean | undefined,
    React.Dispatch<React.SetStateAction<boolean | undefined>>,
] {
    const [trackInLibrary, setTrackInLibrary] = useState<boolean | undefined>(
        getPlatform().LibraryAPI.containsSync(uri),
    );

    useEffect(() => {
        if (trackInLibrary === undefined) {
            getPlatform()
                .LibraryAPI.contains(uri)
                .then((result) => {
                    setTrackInLibrary(result[0]);
                })
                .catch(console.error);
        }
    }, [uri]);

    return [trackInLibrary, setTrackInLibrary];
}
