import { ConversionMode } from '../models/conversion-mode.enum';
import { RomajiSystem } from '../models/romaji-system.enum';
import { TargetSyllabary } from '../models/target-syllabary.enum';
import { KuroshiroSettingsService } from '../services/kuroshiro-settings.service';
import { ServicesContainer } from '../services/services-container';
import { ContextMenuService } from '../services/context-menu.service';
import React from 'react';

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
                    Target syllabary
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
                    <option value={TargetSyllabary.Hiragana}>Hiragana</option>
                    <option value={TargetSyllabary.Katakana}>Katakana</option>
                    <option value={TargetSyllabary.Romaji}>Romaji</option>
                </select>

                <label
                    htmlFor="kuroshiro.settings.conversion-mode"
                    style={labelStyle}
                >
                    Conversion mode
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
                    <option value={ConversionMode.Normal}>Normal</option>
                    <option value={ConversionMode.Spaced}>Spaced</option>
                    <option value={ConversionMode.Okurigana}>Okurigana</option>
                    <option value={ConversionMode.Furigana}>Furigana</option>
                </select>

                <label
                    htmlFor="kuroshiro.settings.romaji-system"
                    style={labelStyle}
                >
                    Romaji system
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
                    <option value={RomajiSystem.Nippon}>Nippon</option>
                    <option value={RomajiSystem.Passport}>Passport</option>
                    <option value={RomajiSystem.Hepburn}>Hepburn</option>
                </select>
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
