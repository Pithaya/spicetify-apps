import fs from 'fs';
import { JSDOM } from 'jsdom';

const dom = await JSDOM.fromURL('https://www.chosic.com/list-of-music-genres/');
const document = dom.window.document;

if (document === null) {
    throw new Error('Failed to parse document');
}

const genreList = document.getElementById('genres-list');
const genreContainer = genreList?.children[0];
const genres: Record<string, string[]> = {};
let currentGenre = '';

for (const genre of Array.from(genreContainer?.children ?? [])) {
    if (genre.tagName === 'LI') {
        currentGenre = genre.textContent ?? '';
        genres[currentGenre] = [];
    } else if (genre.tagName === 'UL') {
        for (const subGenre of Array.from(genre.children).slice(0, -1)) {
            genres[currentGenre].push(subGenre.textContent?.trim() ?? '');
        }
    }
}

fs.writeFile('./src/assets/genres.json', JSON.stringify(genres), (err) => {
    if (err) {
        console.error(err);
    }
});
