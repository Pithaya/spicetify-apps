import { SpotifyIcon } from '@shared/components/ui/SpotifyIcon/SpotifyIcon';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useOutsideClick } from '@shared/hooks/use-outside-click';
import { ChevronDown, ChevronUp, CircleHelp } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

export type TagsInputProps = {
    values: string[];
    onValuesChange: (values: string[]) => void;
    suggestions: string[];
    label: string;
    placeholder: string;
    tooltip?: string;
    disabled?: boolean;
};

export function TagsInput(props: Readonly<TagsInputProps>): JSX.Element {
    const {
        values,
        onValuesChange,
        suggestions,
        label,
        placeholder,
        tooltip,
        disabled,
    } = props;

    const [inputValue, setInputValue] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const filteredSuggestions = useMemo(() => {
        const selected = new Set(values.map((v) => v.toLowerCase()));
        const query = inputValue.trim().toLowerCase();
        return suggestions.filter(
            (s) =>
                !selected.has(s.toLowerCase()) &&
                (query.length === 0 || s.toLowerCase().includes(query)),
        );
    }, [suggestions, values, inputValue]);

    const addValue = useCallback(
        (raw: string): void => {
            const normalized = raw.trim();
            if (
                normalized.length === 0 ||
                values.some((v) => v.toLowerCase() === normalized.toLowerCase())
            ) {
                return;
            }
            onValuesChange([...values, normalized]);
        },
        [values, onValuesChange],
    );

    const removeValue = useCallback(
        (index: number): void => {
            onValuesChange(values.filter((_, i) => i !== index));
        },
        [values, onValuesChange],
    );

    const containerRef = useOutsideClick<HTMLDivElement>(() => {
        setIsOpen(false);
        setHighlightedIndex(-1);
    });

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (filteredSuggestions.length === 0) {
                    return;
                }
                setIsOpen(true);
                setHighlightedIndex((i) =>
                    Math.min(i + 1, filteredSuggestions.length - 1),
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((i) => Math.max(i - 1, -1));
                break;
            case 'Enter': {
                e.preventDefault();
                const picked =
                    highlightedIndex >= 0 &&
                    highlightedIndex < filteredSuggestions.length
                        ? filteredSuggestions[highlightedIndex]
                        : inputValue;
                addValue(picked);
                setInputValue('');
                setHighlightedIndex(-1);
                setIsOpen(false);
                break;
            }
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
            case 'Backspace':
                if (inputValue.length === 0 && values.length > 0) {
                    e.preventDefault();
                    removeValue(values.length - 1);
                }
                break;
            default:
                break;
        }
    };

    return (
        <div className="tw:flex tw:flex-col tw:gap-1">
            <div className="tw:flex tw:items-center tw:gap-1">
                <TextComponent elementType="small">{label}</TextComponent>
                {tooltip !== undefined && (
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={tooltip}
                        showDelay={100}
                    >
                        <CircleHelp
                            size={12}
                            strokeWidth={1.5}
                            className="tw:cursor-help"
                        />
                    </Spicetify.ReactComponent.TooltipWrapper>
                )}
            </div>
            <div className="tw:relative" ref={containerRef}>
                <div className="tw:bg-spice-tab-active tw:flex tw:gap-0.5 tw:rounded-sm tw:pe-1">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setIsOpen(true);
                            setHighlightedIndex(-1);
                        }}
                        onFocus={() => {
                            setIsOpen(true);
                        }}
                        onKeyDown={onInputKeyDown}
                        disabled={disabled}
                        className="tw:w-full tw:truncate tw:p-1.5 tw:bg-transparent tw:border-none tw:text-spice-text"
                    />
                    <button
                        aria-label="toggle menu"
                        className="tw:px-2 tw:bg-transparent tw:border-none"
                        type="button"
                        onClick={() => {
                            setIsOpen((open) => !open);
                        }}
                        disabled={disabled}
                    >
                        {isOpen ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>
                </div>
                <ul
                    className={`tw:bg-spice-highlight-elevated tw:absolute tw:z-10 tw:mt-1 tw:max-h-80 tw:w-full tw:overflow-scroll tw:rounded-sm tw:p-0 ${
                        !isOpen ? 'tw:hidden' : ''
                    }`}
                >
                    {isOpen && filteredSuggestions.length > 0
                        ? filteredSuggestions.map((suggestion, index) => (
                              <li
                                  key={suggestion}
                                  className={Spicetify.classnames(
                                      highlightedIndex === index
                                          ? 'tw:bg-spice-highlight-elevated-hover'
                                          : '',
                                      'tw:flex tw:cursor-pointer tw:px-2 tw:py-1',
                                  )}
                                  onMouseEnter={() => {
                                      setHighlightedIndex(index);
                                  }}
                                  onMouseDown={(e) => {
                                      e.preventDefault();
                                      addValue(suggestion);
                                      setInputValue('');
                                      setHighlightedIndex(-1);
                                      setIsOpen(false);
                                  }}
                              >
                                  <span className="tw:truncate">
                                      {suggestion}
                                  </span>
                              </li>
                          ))
                        : isOpen && (
                              <div className="tw:flex tw:items-center tw:justify-center tw:p-2">
                                  <TextComponent
                                      elementType="span"
                                      fontSize="small"
                                  >
                                      {inputValue.trim().length > 0
                                          ? 'Press Enter to add'
                                          : 'No suggestions'}
                                  </TextComponent>
                              </div>
                          )}
                </ul>
            </div>
            {values.length > 0 && (
                <div className="tw:flex tw:max-h-48 tw:flex-wrap tw:gap-1">
                    {values.map((value, index) => (
                        <span
                            className="tw:hover:bg-spice-tab-active tw:bg-spice-highlight-elevated tw:flex tw:max-w-72 tw:items-center tw:gap-2 tw:rounded-full tw:px-2.5"
                            key={`tag-${index.toFixed()}`}
                        >
                            <span className="tw:truncate">{value}</span>
                            <button
                                className="tw:bg-transparent tw:border-none"
                                aria-label="Remove tag"
                                onClick={() => {
                                    removeValue(index);
                                }}
                            >
                                <SpotifyIcon icon="x" iconSize={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
