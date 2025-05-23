import useAutocomplete from "../hooks/useAutocomplete";
import { useEffect, useRef } from "react";


export default function AutoInput({
    label,
    value,
    onChange,
    onValidChange,
    onRemove,
    fetchSuggestions
}) {
    const {
        value: inputValue,
        setValue: setInputValue,
        suggestions,
        isOpen,
        setIsOpen,
        selectSuggestion
    } = useAutocomplete(fetchSuggestions, value);

    const containerRef = useRef(null);

    

    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);
        onValidChange?.(false);
    };

    const handleSelect = (val) => {
        selectSuggestion(val);
        onChange(val);
        onValidChange?.(true);
    };


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="auto-input" ref={containerRef}>
            <div className="input-with-remove">
                <input
                    type="text"
                    placeholder={label}
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(suggestions.length > 0)}
                />
                {onRemove && (
                    <button className="remove-button" onClick={onRemove}>
                        ✖
                    </button>
                )}
            </div>
            {isOpen && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((s, i) => (
                        <li key={i} onClick={() => handleSelect(s)}>
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
