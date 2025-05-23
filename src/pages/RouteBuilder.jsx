// components/RouteBuilder.jsx
// import { useState } from "react";
import { useState, useEffect, useRef } from "react";
import Map from "../components/Map";
import "./RouteBuilder.css";
import useDebounce from "../hooks/useDebounce";
import { buildRoute } from "../api/routes";
import { useNavigate } from "react-router-dom";

// простой fetch к Nominatim
async function fetchSuggestions(query) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
        )}`
    );
    const data = await res.json();
    return data.map((item) => item.display_name);
}

export default function RouteBuilder() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [stops, setStops] = useState([]); // промежуточные точки
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [stopSuggestions, setStopSuggestions] = useState({}); // ключ: индекс
    const [fromValid, setFromValid] = useState(false);
    const [toValid, setToValid] = useState(false);
    const [validStops, setValidStops] = useState([]);

    const navigate = useNavigate();

    const handleAddStop = () => {
        setStops([...stops, ""]);
        setValidStops([...validStops, false]);
    };

    const handleStopChange = (value, index) => {
        const updated = [...stops];
        updated[index] = value;
        setStops(updated);
        updateStopSuggestions(value, index);
        const updatedValidity = [...validStops];
        updatedValidity[index] = false;
        setValidStops(updatedValidity);
    };

    const handleStopValidChange = (isValid, index) => {
        const updated = [...validStops];
        updated[index] = isValid;
        setValidStops(updated);
    };

    const updateStopSuggestions = async (query, index) => {
        if (query.length < 3) {
            setStopSuggestions((prev) => ({ ...prev, [index]: [] }));
            return;
        }
        const suggestions = await fetchSuggestions(query);
        setStopSuggestions((prev) => ({ ...prev, [index]: suggestions }));
    };

    const handleRemoveStop = (index) => {
        setStops((prev) => prev.filter((_, i) => i !== index));
        setValidStops((prev) => prev.filter((_, i) => i !== index));

        // Также удалим подсказки для этой точки
        setStopSuggestions((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });
    };

    const allValid = fromValid && toValid && validStops.every(Boolean);

    const handleBuildRoute = async () => {
        console.log("i'm in handleBuildRoute");
        console.log("allValid = ", allValid);
        console.log("toValid = ", toValid);
        console.log("fromValid = ", fromValid);
        console.log("validStops.every(Boolean) = ", validStops.every(Boolean));

        if (!allValid) return;
        console.log("Маршрут от:", from);
        console.log("Через:", stops);
        console.log("До:", to);

        try {
            const result = await buildRoute({ from, to, stops });

            if (result.id) {
                // Сохраняем маршрут
                localStorage.setItem(
                    `route:${result.id}`,
                    JSON.stringify({
                        id: result.id,
                        from,
                        to,
                        stops,
                        points: result.points, // или result.geoJson, если структура будет меняться
                        places: result.places,
                    })
                );

                navigate(`/routes/${result.id}`);
            } else {
                alert("Не удалось построить маршрут.");
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка при построении маршрута.");
        }
    };

    return (
        <div className="route-builder">
            <Map />

            <div className="form-container">
                <AutoInput
                    label="Откуда?"
                    value={from}
                    onChange={setFrom}
                    suggestions={fromSuggestions}
                    setSuggestions={setFromSuggestions}
                    onValidChange={setFromValid}
                />

                {stops.map((stop, index) => (
                    <AutoInput
                        key={index}
                        label={`Точка ${index + 1}`}
                        value={stop}
                        onChange={(val) => handleStopChange(val, index)}
                        suggestions={stopSuggestions[index] || []}
                        setSuggestions={(s) =>
                            setStopSuggestions((prev) => ({
                                ...prev,
                                [index]: s,
                            }))
                        }
                        onValidChange={(isValid) =>
                            handleStopValidChange(isValid, index)
                        }
                        onRemove={() => handleRemoveStop(index)}
                    />
                ))}

                <AutoInput
                    label="Куда?"
                    value={to}
                    onChange={setTo}
                    suggestions={toSuggestions}
                    setSuggestions={setToSuggestions}
                    onValidChange={setToValid}
                />

                <button onClick={handleAddStop}>
                    Добавить промежуточную точку
                </button>
                <button onClick={handleBuildRoute}>Построить маршрут</button>
            </div>
        </div>
    );
}

function AutoInput({
    label,
    value,
    onChange,
    suggestions,
    setSuggestions,
    onValidChange,
    onRemove,
}) {
    const [inputValue, setInputValue] = useState(value);
    const debouncedValue = useDebounce(inputValue, 500);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };
        const handleEsc = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    useEffect(() => {
        const fetchAndSet = async () => {
            if (debouncedValue.length >= 3) {
                try {
                    const results = await fetchSuggestions(debouncedValue);
                    setSuggestions(results);
                    setIsOpen(true);
                } catch (err) {
                    console.error("Ошибка запроса:", err);
                    setSuggestions([]);
                    setIsOpen(false);
                }
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        };
        fetchAndSet();
    }, [debouncedValue]);

    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);
        onValidChange?.(false);
    };

    const handleSelect = (val) => {
        setInputValue(val);
        onChange(val);
        onValidChange?.(true);
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div className="auto-input" ref={containerRef}>
            <div className="input-with-remove">
                <input
                    type="text"
                    placeholder={label}
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true);
                    }}
                    autoComplete="off"
                />
                {onRemove && (
                    <button
                        className="remove-button"
                        onClick={onRemove}
                        type="button"
                    >
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
