/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { waitForSpicetify } from '@shared/utils/spicetify-utils';
import { addUpdateChecker } from '@shared/utils/version-utils';
import { version } from '../../package.json';

void (async () => {
    await waitForSpicetify();
    await addUpdateChecker(version, 'playlist-maker');

    // TODO: remove this when the ConfirmDialog component is fixed

    // @ts-expect-error temporary fix for Spicetify.ReactComponent.ConfirmDialog opening the "Want to listen?" modal
    const require = webpackChunkclient_web.push([[Symbol()], {}, (re) => re]);
    const chunks = Object.entries(require.m);

    const foundModules = chunks.filter(
        ([_, definition]) =>
            typeof definition === 'function' &&
            definition.toString().includes('main-confirmDialog-container'),
    );

    const component = foundModules.flatMap(([id]) =>
        Object.values(require(id)),
    )[0];

    // @ts-expect-error assign the fixed component
    Spicetify.ReactComponent.ConfirmDialog = component;
})();
