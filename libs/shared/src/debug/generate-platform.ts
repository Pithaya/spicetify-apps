export function generatePlatformClass(): string {
    let result = '';

    for (const key of Object.keys(Spicetify.Platform)) {
        result += `
        static get ${key}(): ${key} {
            return Spicetify.Platform.${key};
        }
        `;
    }

    return result;
}
