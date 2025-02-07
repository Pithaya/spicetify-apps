import { findByRole, findByText, fireEvent } from '@testing-library/dom';
import type { Test } from 'custom-apps/test-runner/src/models/test';

export const tests: Test[] = [
    {
        name: 'Offset field with negative value should show error message',
        test: async () => {
            const container = document.body;

            const button = await findByRole(container, 'button', {
                name: /Library playlist/i,
            });
            fireEvent.keyDown(button, { key: 'Enter' });

            const offsetField = await findByRole(container, 'spinbutton ', {
                name: /Offset/i,
            });
            fireEvent.change(offsetField, { target: { value: '-1' } });

            await findByText(
                container,
                'Number must be greater than or equal to 0',
            );
        },
    },
];
