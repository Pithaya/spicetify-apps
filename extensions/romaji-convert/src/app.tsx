import { waitForSpicetify } from '@shared/utils/spicetify-utils';
import i18next from 'i18next';
import { Languages } from 'lucide-react';
import React from 'react';
import { SettingsModal } from './components/settings-modal.component';
import { contextMenuService } from './services/context-menu.service';
import { kuroshiroService } from './services/kuroshiro.service';

async function main(): Promise<void> {
    await waitForSpicetify();

    // Init services
    await kuroshiroService.init();

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

    // Add settings menu
    const MENU_ICON: string = Spicetify.ReactDOMServer.renderToString(
        <Languages size={16} strokeWidth={1.5} />,
    );
    new Spicetify.Menu.Item(
        i18next.t('settings.title'),
        false,
        () => {
            Spicetify.PopupModal.display({
                title: i18next.t('settings.title'),
                content: React.createElement(SettingsModal) as any,
                isLarge: true,
            });
        },
        MENU_ICON,
    ).register();

    // Add context menu
    contextMenuService.registerOrUpdate();
}

export default main;
