import styles from '../../css/app.module.scss';
import React, { useEffect, useState } from 'react';
import {
    JukeboxSettings,
    JukeboxStoredSettings,
} from '../../models/jukebox-settings';
import { SettingsService } from '../../services/settings-service';
import { MultiRangeSlider } from '../shared/multi-range-slider';

export function SettingsModal() {
    const [settings, setSettings] = useState<JukeboxStoredSettings>(
        SettingsService.settings.toPartial()
    );

    useEffect(() => {
        let observer = new MutationObserver((records) => {
            let isPopupRemoved = false;

            for (const record of records) {
                record.removedNodes.forEach((x) => {
                    if (x.nodeName === 'GENERIC-MODAL') {
                        isPopupRemoved = true;
                    }
                });
            }

            if (isPopupRemoved) {
                saveSettings();
                observer.disconnect();
            }
        });

        observer.observe(document.getElementsByTagName('body')[0], {
            childList: true,
        });
    }, []);

    function saveSettings() {
        console.log('Saving settings...');
    }

    function updateSettingsField(
        field: keyof JukeboxStoredSettings,
        value: any
    ) {
        if (typeof value !== typeof settings[field]) {
            throw new Error('Value type does not match field type');
        }

        if (settings[field] === value) {
            return;
        }

        setSettings((previousValue) => ({ ...previousValue, [field]: value }));
    }

    const labelStyle: React.CSSProperties = {
        marginBottom: '0.5rem',
        marginTop: '0.5rem',
        display: 'block',
    };

    return (
        <div className={styles['settings-modal']}>
            <>
                <label
                    htmlFor="jukebox.settings.maxBranchDistance"
                    style={labelStyle}
                >
                    <b>Branch Similarity Threshold</b>:
                    {settings.maxBranchDistance}
                </label>

                <div className={styles['input-range-container']}>
                    <input
                        id="jukebox.settings.maxBranchDistance"
                        className={styles['w-100']}
                        type={'range'}
                        min={JukeboxSettings.rangeMinBranchDistance}
                        max={JukeboxSettings.rangeMaxBranchDistance}
                        value={settings.maxBranchDistance}
                        step={1}
                        onChange={(e) =>
                            updateSettingsField(
                                'maxBranchDistance',
                                e.target.valueAsNumber
                            )
                        }
                    />

                    <div className={styles['range-subtext']}>
                        <span className={styles['small-text']}>
                            Higher quality
                        </span>
                        <span className={styles['small-text']}>
                            More branches
                        </span>
                    </div>
                </div>
            </>

            <label
                htmlFor="jukebox.settings.randomBranchChance"
                style={labelStyle}
            >
                <b>Branch Probability Range</b>:
                {` ${Math.round(settings.minRandomBranchChance * 100)}% to 
                ${Math.round(settings.maxRandomBranchChance * 100)}%`}
            </label>

            <div className={styles['input-range-container']}>
                <MultiRangeSlider
                    min={0}
                    max={100}
                    minDefaultValue={settings.minRandomBranchChance * 100}
                    maxDefaultValue={settings.maxRandomBranchChance * 100}
                    onChange={({ min, max }) => {
                        updateSettingsField('minRandomBranchChance', min / 100);
                        updateSettingsField('maxRandomBranchChance', max / 100);
                    }}
                />

                <div className={styles['range-subtext']}>
                    <span className={styles['small-text']}>Low</span>
                    <span className={styles['small-text']}>High</span>
                </div>
            </div>
        </div>
    );
}
