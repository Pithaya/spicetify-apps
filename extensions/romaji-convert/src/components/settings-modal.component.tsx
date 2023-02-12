import { ConversionMode } from '../models/conversion-mode.enum';
import { RomajiSystem } from '../models/romaji-system.enum';
import { TargetSyllabary } from '../models/target-syllabary.enum';
import { KuroshiroSettingsService } from '../services/kuroshiro-settings.service';
import { ServicesContainer } from '../services/services-container';
import { ContextMenuService } from '../services/context-menu.service';
import React from 'react';
import i18next from 'i18next';

interface IProps {}

interface IState {
    targetSyllabary: TargetSyllabary;
    conversionMode: ConversionMode;
    romajiSystem: RomajiSystem;
}

export class SettingsModal extends React.Component<IProps, IState> {
    private readonly settingsService: KuroshiroSettingsService;
    private readonly contextMenuService: ContextMenuService;

    constructor(props: any) {
        super(props);

        this.settingsService = ServicesContainer.settings;
        this.contextMenuService = ServicesContainer.contextMenu;

        this.state = {
            targetSyllabary: this.settingsService.targetSyllabary,
            conversionMode: this.settingsService.conversionMode,
            romajiSystem: this.settingsService.romajiSystem,
        };
    }

    render() {
        const labelStyle: React.CSSProperties = {
            marginBottom: '0.5rem',
            marginTop: '0.5rem',
            display: 'block',
        };

        return (
            <div>
                <label
                    htmlFor="kuroshiro.settings.target-syllabary"
                    style={labelStyle}
                >
                    {i18next.t('settings.targetSyllabary.label')}
                </label>
                <select
                    className="main-dropDown-dropDown"
                    id="kuroshiro.settings.target-syllabary"
                    dir="auto"
                    value={this.state.targetSyllabary}
                    onChange={(e) =>
                        this.onTargetSyllabaryChange(
                            e.target.value as TargetSyllabary
                        )
                    }
                >
                    <option value={TargetSyllabary.Hiragana}>
                        {i18next.t('settings.targetSyllabary.values.hiragana')}
                    </option>
                    <option value={TargetSyllabary.Katakana}>
                        {i18next.t('settings.targetSyllabary.values.katakana')}
                    </option>
                    <option value={TargetSyllabary.Romaji}>
                        {i18next.t('settings.targetSyllabary.values.romaji')}
                    </option>
                </select>

                <label
                    htmlFor="kuroshiro.settings.conversion-mode"
                    style={labelStyle}
                >
                    {i18next.t('settings.conversionMode.label')}
                </label>
                <select
                    className="main-dropDown-dropDown"
                    id="kuroshiro.settings.conversion-mode"
                    dir="auto"
                    value={this.state.conversionMode}
                    onChange={(e) =>
                        this.onConversionModeChange(
                            e.target.value as ConversionMode
                        )
                    }
                >
                    <option value={ConversionMode.Normal}>
                        {i18next.t('settings.conversionMode.values.normal')}
                    </option>
                    <option value={ConversionMode.Spaced}>
                        {i18next.t('settings.conversionMode.values.spaced')}
                    </option>
                    <option value={ConversionMode.Okurigana}>
                        {i18next.t('settings.conversionMode.values.okurigana')}
                    </option>
                    <option value={ConversionMode.Furigana}>
                        {i18next.t('settings.conversionMode.values.furigana')}
                    </option>
                </select>

                {this.state.targetSyllabary === TargetSyllabary.Romaji && (
                    <div>
                        <label
                            htmlFor="kuroshiro.settings.romaji-system"
                            style={labelStyle}
                        >
                            {i18next.t('settings.romajiSystem.label')}
                        </label>
                        <select
                            className="main-dropDown-dropDown"
                            id="kuroshiro.settings.romaji-system"
                            dir="auto"
                            value={this.state.romajiSystem}
                            onChange={(e) =>
                                this.onRomajiSystemChange(
                                    e.target.value as RomajiSystem
                                )
                            }
                        >
                            <option value={RomajiSystem.Nippon}>
                                {i18next.t(
                                    'settings.romajiSystem.values.nippon'
                                )}
                            </option>
                            <option value={RomajiSystem.Passport}>
                                {i18next.t(
                                    'settings.romajiSystem.values.passport'
                                )}
                            </option>
                            <option value={RomajiSystem.Hepburn}>
                                {i18next.t(
                                    'settings.romajiSystem.values.hepburn'
                                )}
                            </option>
                        </select>
                    </div>
                )}
            </div>
        );
    }

    private onTargetSyllabaryChange(value: TargetSyllabary): void {
        this.settingsService.targetSyllabary = value;
        this.contextMenuService.registerOrUpdate();
        this.setState({
            targetSyllabary: this.settingsService.targetSyllabary,
        });
    }

    private onConversionModeChange(value: ConversionMode): void {
        this.settingsService.conversionMode = value;
        this.setState({
            conversionMode: this.settingsService.conversionMode,
        });
    }

    private onRomajiSystemChange(value: RomajiSystem): void {
        this.settingsService.romajiSystem = value;
        this.setState({
            romajiSystem: this.settingsService.romajiSystem,
        });
    }
}
