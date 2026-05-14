import pixelmatch from 'pixelmatch';

/**
 * Load an image from an url.
 * @param imageUrl The image url.
 * @returns The image element.
 */
export const getImage = async (imageUrl: string): Promise<HTMLImageElement> => {
    return await new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
            resolve(image);
        };

        image.onerror = () => {
            reject(new Error(`Couldn't load image "${imageUrl}"`));
        };

        image.src = imageUrl;
    });
};

/**
 * Get image data for an image element by using a canvas.
 * @param img The image element.
 * @returns The image data.
 */
export const getImageDataFromCanvas = (img: HTMLImageElement): ImageData => {
    const canvas = document.createElement('canvas');

    // Set a small size for the canvas to make the image comparison faster
    canvas.width = 50;
    canvas.height = 50;
    canvas.style.width = '50px';
    canvas.style.height = '50px';

    const ctx = canvas.getContext('2d');

    ctx!.drawImage(img, 0, 0, img.width, img.height, 0, 0, 50, 50);

    return ctx!.getImageData(0, 0, 50, 50);
};

/**
 * Get the difference between two images, using pixelmatch.
 * @param imgA The first image.
 * @param imgB The second image.
 * @returns The number of mismatched pixels. If 0, the images are the same.
 */
export const getImageDifferenceWithPixelMatch = (
    imgA: ImageData,
    imgB: ImageData,
): number => {
    const mismatchedPixels = pixelmatch(
        imgA.data,
        imgB.data,
        null,
        imgA.width,
        imgA.height,
        { threshold: 0.1 },
    );

    return mismatchedPixels;
};
