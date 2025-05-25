import { useState, useEffect, useRef } from 'react';
import useDebounce from './useDebounce';

export default function useAutocomplete(fetchFn, initialValue = '') {
    const [value, setValue] = useState(initialValue);
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const isSelectedRef = useRef(false); // Используем ref вместо state
    const debouncedValue = useDebounce(value, 1000);

    useEffect(() => {
        // Если значение было выбрано из списка - игнорируем
        if (isSelectedRef.current) {
            isSelectedRef.current = false;
            return;
        }

        const fetchSuggestions = async () => {
            if (debouncedValue.length >= 3) {
                try {
                    const results = await fetchFn(debouncedValue);
                    setSuggestions(results);
                    setIsOpen(true);
                } catch (err) {
                    console.error("Fetch error:", err);
                    setSuggestions([]);
                    setIsOpen(false);
                }
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        };

        fetchSuggestions();
    }, [debouncedValue, fetchFn]);

    const selectSuggestion = (selectedValue) => {
        isSelectedRef.current = true; // Устанавливаем флаг выбора
        setValue(selectedValue);
        setSuggestions([]);
        setIsOpen(false);
    };

    return {
        value,
        setValue,
        suggestions,
        isOpen,
        setIsOpen,
        selectSuggestion
    };
}
