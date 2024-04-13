import styles from './SettingsModal.module.scss';
import React, { useEffect, useState } from 'react';
import type { JukeboxStoredSettings } from '../../models/jukebox-settings';
import { JukeboxSettings } from '../../models/jukebox-settings';
import { SettingsService } from '../../services/settings-service';
import { MultiRangeSlider } from '@shared/components/inputs/MultiRangeSlider/MultiRangeSlider';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { CheckboxContainer } from '@shared/components/settings/CheckboxContainer/CheckboxContainer';
import { SliderContainer } from '@shared/components/settings/SliderContainer/SliderContainer';

export function SettingsModal(): JSX.Element {
    const [settings, setSettings] = useState<JukeboxStoredSettings>(
        SettingsService.storedSettings,
    );

    useEffect(() => {
        const observer = new MutationObserver((records) => {
            let isPopupRemoved = false;

            for (const record of records) {
                record.removedNodes.forEach((x) => {
                    if (x.nodeName === 'GENERIC-MODAL') {
                        isPopupRemoved = true;
                    }
                });
            }

            if (isPopupRemoved) {
                window.jukebox.reloadSettings().catch(console.error);
                observer.disconnect();
            }
        });

        observer.observe(document.getElementsByTagName('body')[0], {
            childList: true,
        });
    }, []);

    useEffect(() => {
        SettingsService.storedSettings = settings;
    }, [settings]);

    function updateSettingsField(
        field: keyof JukeboxStoredSettings,
        value: any,
    ): void {
        if (typeof value !== typeof settings[field]) {
            throw new Error('Value type does not match field type');
        }

        if (settings[field] === value) {
            return;
        }

        setSettings((previousValue) => ({ ...previousValue, [field]: value }));
    }

    function reset(): void {
        setSettings(new JukeboxSettings().toPartial());
    }

    return (
        <div className={styles['settings-modal']}>
            <SliderContainer
                label={
                    'Branch Similarity Threshold: ' + settings.maxBranchDistance
                }
                subLabel="The maximum similarity distance allowed between two beats in order to create a branch."
                slider={
                    <input
                        id="jukebox.settings.maxBranchDistance"
                        type={'range'}
                        min={JukeboxSettings.rangeMinBranchDistance}
                        max={JukeboxSettings.rangeMaxBranchDistance}
                        value={settings.maxBranchDistance}
                        step={1}
                        onChange={(e) => {
                            updateSettingsField(
                                'maxBranchDistance',
                                e.target.valueAsNumber,
                            );
                        }}
                        disabled={settings.useDynamicBranchDistance}
                    />
                }
                minLabel="Higher quality"
                maxLabel="More branches"
                style={{ opacity: settings.useDynamicBranchDistance ? 0.5 : 1 }}
            />

            <CheckboxContainer
                inputId="jukebox.settings.useDynamicBranchDistance"
                label="Use dynamic branch distance"
                subLabel="If checked, will calculate the branch similarity threshold automatically to try to get as many quality branch as possible."
                value={settings.useDynamicBranchDistance}
                onChange={(newValue) => {
                    updateSettingsField('useDynamicBranchDistance', newValue);
                }}
            />

            <SliderContainer
                label={`Branch Probability Range: ${Math.round(
                    settings.minRandomBranchChance * 100,
                )}% to 
                ${Math.round(settings.maxRandomBranchChance * 100)}%`}
                subLabel="The minimum and maximum chance for a branch to be selected each beat."
                slider={
                    <MultiRangeSlider
                        min={0}
                        max={100}
                        minDefaultValue={settings.minRandomBranchChance * 100}
                        maxDefaultValue={settings.maxRandomBranchChance * 100}
                        onChange={({ min, max }) => {
                            updateSettingsField(
                                'minRandomBranchChance',
                                min / 100,
                            );
                            updateSettingsField(
                                'maxRandomBranchChance',
                                max / 100,
                            );
                        }}
                    />
                }
                minLabel="Low"
                maxLabel="High"
            />

            <SliderContainer
                label={`Branch Probability Ramp-up Speed: ${Math.round(
                    settings.randomBranchChanceDelta * 100,
                )}%`}
                subLabel="Controls how fast the chance to select a branch will increase."
                slider={
                    <input
                        id="jukebox.settings.randomBranchChanceDelta"
                        type={'range'}
                        min={0}
                        max={100}
                        value={settings.randomBranchChanceDelta * 100}
                        step={2}
                        onChange={(e) => {
                            updateSettingsField(
                                'randomBranchChanceDelta',
                                e.target.valueAsNumber / 100,
                            );
                        }}
                    />
                }
                minLabel="Slow"
                maxLabel="Fast"
            />

            <CheckboxContainer
                inputId="jukebox.settings.addLastEdge"
                label="Loop extension optimization"
                subLabel="If checked, optimize by adding a good last edge."
                value={settings.addLastEdge}
                onChange={(newValue) => {
                    updateSettingsField('addLastEdge', newValue);
                }}
            />

            <CheckboxContainer
                inputId="jukebox.settings.justBackwards"
                label="Allow only backward branches"
                subLabel="If checked, only add backward branches."
                value={settings.justBackwards}
                onChange={(newValue) => {
                    updateSettingsField('justBackwards', newValue);
                }}
            />

            <CheckboxContainer
                inputId="jukebox.settings.justLongBranches"
                label="Allow only long branches"
                subLabel="If checked, only add long branches."
                value={settings.justLongBranches}
                onChange={(newValue) => {
                    updateSettingsField('justLongBranches', newValue);
                }}
            />

            <CheckboxContainer
                inputId="jukebox.settings.removeSequentialBranches"
                label="Remove sequential branches"
                subLabel="If checked, remove consecutive branches of the same distance."
                value={settings.removeSequentialBranches}
                onChange={(newValue) => {
                    updateSettingsField('removeSequentialBranches', newValue);
                }}
            />

            <CheckboxContainer
                inputId="jukebox.settings.alwaysFollowLastBranch"
                label="Always follow the last branch"
                subLabel="If checked, always follow the last possible branch. Note that setting this to false will result in songs not looping indefinitely."
                value={settings.alwaysFollowLastBranch}
                onChange={(newValue) => {
                    updateSettingsField('alwaysFollowLastBranch', newValue);
                }}
            />

            <div>
                <TextComponent elementType="h3" variant="violaBold">
                    Maximum play time for a song, in seconds
                </TextComponent>
                <TextComponent elementType="p" semanticColor="textSubdued">
                    After the listen time reaches this value, the jukebox will
                    stop branching and continue to the next song where it will
                    activate again. Set this to 0 for no limit.
                </TextComponent>
                <input
                    type={'number'}
                    className="x-settings-input"
                    style={{ marginTop: '1rem' }}
                    id="jukebox.settings.maxJukeboxPlayTime"
                    value={settings.maxJukeboxPlayTime / 1000}
                    onChange={(e) => {
                        updateSettingsField(
                            'maxJukeboxPlayTime',
                            e.target.valueAsNumber * 1000,
                        );
                    }}
                />
            </div>

            <div className={styles['reset-button-container']}>
                <Spicetify.ReactComponent.ButtonPrimary
                    buttonSize={'sm'}
                    onClick={reset}
                >
                    Reset
                </Spicetify.ReactComponent.ButtonPrimary>
            </div>
        </div>
    );
}
