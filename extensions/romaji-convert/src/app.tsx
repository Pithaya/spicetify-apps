import i18next from 'i18next';
import { ServicesContainer } from './services/services-container.js';
import { waitForSpicetify } from '@shared/utils';
import { MENU_ICON } from './models/constants';

async function main(): Promise<void> {
    await waitForSpicetify();

    // Init services
    ServicesContainer.kuroshiro.init();

    // Init translations
    const locale: typeof Spicetify.Locale = Spicetify.Locale;

    await i18next.init({
        lng: locale.getLocale(),
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: {
                translation: {
                    settings: {
                        title: 'Japanese conversion settings',
                        targetSyllabary: {
                            label: 'Target syllabary',
                            values: {
                                hiragana: 'Hiragana',
                                katakana: 'Katakana',
                                romaji: 'Romaji',
                            },
                        },
                        conversionMode: {
                            label: 'Conversion mode',
                            values: {
                                normal: 'Normal',
                                spaced: 'Spaced',
                                okurigana: 'Okurigana',
                                furigana: 'Furigana',
                            },
                        },
                        romajiSystem: {
                            label: 'Romaji system',
                            values: {
                                nippon: 'Nippon',
                                passport: 'Passport',
                                hepburn: 'Hepburn',
                            },
                        },
                        notificationTimeout: {
                            label: 'Converted text display time, in seconds',
                        },
                        notificationFontSize: {
                            label: 'Font size of the converted text, in pixels',
                        },
                    },
                    contextMenu: {
                        name: 'Convert to {{syllabary, lowercase}}',
                        error: `Couldn't get the selected element's name.`,
                    },
                },
            },
            fr: {
                translation: {
                    settings: {
                        title: 'Paramètres de conversion japonaise',
                        targetSyllabary: {
                            label: 'Syllabaire cible',
                            values: {
                                hiragana: 'Hiragana',
                                katakana: 'Katakana',
                                romaji: 'Romaji',
                            },
                        },
                        conversionMode: {
                            label: 'Mode de conversion',
                            values: {
                                normal: 'Normal',
                                spaced: 'Espacé',
                                okurigana: 'Okurigana',
                                furigana: 'Furigana',
                            },
                        },
                        romajiSystem: {
                            label: 'Système romaji',
                            values: {
                                nippon: 'Nippon',
                                passport: 'Passport',
                                hepburn: 'Hepburn',
                            },
                        },
                        notificationTimeout: {
                            label: "Temps d'affichage du texte converti, en secondes",
                        },
                        notificationFontSize: {
                            label: "Taille d'affichage du texte converti, en pixels",
                        },
                    },
                    contextMenu: {
                        name: 'Convertir en {{syllabary, lowercase}}',
                        error: `Impossible de récupérer le nom de l'élément sélectionné.`,
                    },
                },
            },
        },
    });

    i18next.services.formatter?.add('lowercase', (value, lng, options) => {
        return value.toLowerCase();
    });

    const reactHelper = await import('./helpers/react-helper');

    // Add settings menu
    new Spicetify.Menu.Item(
        i18next.t('settings.title'),
        false,
        () =>
            Spicetify.PopupModal.display({
                title: i18next.t('settings.title'),
                content: reactHelper.ReactHelper.createSettingsModal(),
                isLarge: true,
            }),
        MENU_ICON
    ).register();

    // Add context menu
    ServicesContainer.contextMenu.registerOrUpdate();
}

export default main;
