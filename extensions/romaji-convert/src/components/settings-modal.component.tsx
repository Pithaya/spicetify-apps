import { ConversionMode } from '../models/conversion-mode.enum';
import { RomajiSystem } from '../models/romaji-system.enum';
import { TargetSyllabary } from '../models/target-syllabary.enum';
import { settingsService } from '../services/kuroshiro-settings.service';
import { contextMenuService } from '../services/context-menu.service';
import React, { useState } from 'react';
import i18next from 'i18next';

export function SettingsModal(): JSX.Element {
    const [targetSyllabary, setTargetSyllabary] = useState(
        settingsService.targetSyllabary,
    );
    const [conversionMode, setConversionMode] = useState(
        settingsService.conversionMode,
    );
    const [romajiSystem, setRomajiSystem] = useState(
        settingsService.romajiSystem,
    );
    const [notificationTimeout, setNotificationTimeout] = useState(
        settingsService.notificationTimeout,
    );
    const [notificationFontSize, setNotificationFontSize] = useState(
        settingsService.notificationFontSize,
    );

    const labelStyle: React.CSSProperties = {
        marginBottom: '0.5rem',
        marginTop: '0.5rem',
        display: 'block',
    };

    function onTargetSyllabaryChange(value: TargetSyllabary): void {
        settingsService.targetSyllabary = value;
        contextMenuService.registerOrUpdate();
        setTargetSyllabary(settingsService.targetSyllabary);
    }

    function onConversionModeChange(value: ConversionMode): void {
        settingsService.conversionMode = value;
        setConversionMode(settingsService.conversionMode);
    }

    function onRomajiSystemChange(value: RomajiSystem): void {
        settingsService.romajiSystem = value;
        setRomajiSystem(settingsService.romajiSystem);
    }

    function onNotificationTimeoutChange(value: number): void {
        settingsService.notificationTimeout = value;
        setNotificationTimeout(settingsService.notificationTimeout);
    }

    function onNotificationFontSizeChange(value: number): void {
        settingsService.notificationFontSize = value;
        setNotificationFontSize(settingsService.notificationFontSize);
    }

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
                value={targetSyllabary}
                onChange={(e) => {
                    onTargetSyllabaryChange(e.target.value as TargetSyllabary);
                }}
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
                value={conversionMode}
                onChange={(e) => {
                    onConversionModeChange(e.target.value as ConversionMode);
                }}
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

            {targetSyllabary === TargetSyllabary.Romaji && (
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
                        value={romajiSystem}
                        onChange={(e) => {
                            onRomajiSystemChange(
                                e.target.value as RomajiSystem,
                            );
                        }}
                    >
                        <option value={RomajiSystem.Nippon}>
                            {i18next.t('settings.romajiSystem.values.nippon')}
                        </option>
                        <option value={RomajiSystem.Passport}>
                            {i18next.t('settings.romajiSystem.values.passport')}
                        </option>
                        <option value={RomajiSystem.Hepburn}>
                            {i18next.t('settings.romajiSystem.values.hepburn')}
                        </option>
                    </select>
                </div>
            )}

            <label
                htmlFor="kuroshiro.settings.notification-timeout"
                style={labelStyle}
            >
                {i18next.t('settings.notificationTimeout.label')}
            </label>
            <input
                type={'number'}
                className="x-settings-input"
                id="kuroshiro.settings.notification-timeout"
                value={notificationTimeout / 1000}
                onChange={(e) => {
                    onNotificationTimeoutChange(e.target.valueAsNumber * 1000);
                }}
            />

            <label
                htmlFor="kuroshiro.settings.notification-font-size"
                style={labelStyle}
            >
                {i18next.t('settings.notificationFontSize.label')}
            </label>
            <input
                type={'number'}
                className="x-settings-input"
                id="kuroshiro.settings.notification-font-size"
                value={notificationFontSize}
                onChange={(e) => {
                    onNotificationFontSizeChange(e.target.valueAsNumber);
                }}
            />
        </div>
    );
}
