// components/RouteBuilder.jsx
// import { useState } from "react";
import { useState } from "react";
import Map from "../components/Map";
import "./RouteBuilder.css";
import { buildRoute } from "../api/routes";
import { useNavigate } from "react-router-dom";
import AutoInput from "../components/AutoInput";

// простой fetch к Nominatim
async function fetchSuggestions(query) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
            )}`
        );
        if (!res.ok) throw new Error("API request failed");
        const data = await res.json();
        console.log(data);
        return data.map((item) => ({
            displayName: item.display_name,
            lat: parseFloat(item.lat), // Конвертируем строку в число
            lon: parseFloat(item.lon),
        }));
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
}

export default function RouteBuilder() {
    const [routePoints, setRoutePoints] = useState({
        from: { value: "", isValid: false, coords: null },
        to: { value: "", isValid: false, coords: null },
        stops: [],
    });

    const navigate = useNavigate();

    const handlePointChange = (type, index) => (data) => {
        // data может быть строкой (при ручном вводе) или объектом (при выборе из подсказок)
        const isObjectData = typeof data === "object" && data.address;

        setRoutePoints((prev) => {
            const newPoint = {
                value: isObjectData ? data.address : data,
                isValid: isObjectData ? data.isValid : false,
                coords: isObjectData ? data.coords : null,
            };

            if (type === "from") return { ...prev, from: newPoint };
            if (type === "to") return { ...prev, to: newPoint };

            const stops = [...prev.stops];
            stops[index] = newPoint;
            return { ...prev, stops };
        });
    };

    const handleAddStop = () => {
        setRoutePoints((prev) => ({
            ...prev,
            stops: [...prev.stops, { value: "", isValid: false }],
        }));
    };

    const handleRemoveStop = (index) => {
        setRoutePoints((prev) => ({
            ...prev,
            stops: prev.stops.filter((_, i) => i !== index),
        }));
    };

    const isRouteValid =
        routePoints.from.isValid &&
        routePoints.to.isValid &&
        routePoints.stops.every((stop) => stop.isValid);

    const handleBuildRoute = async () => {
        if (!isRouteValid) return;

        try {
            console.log(routePoints);
            const result = await buildRoute({
                from: {
                    address: routePoints.from.value,
                    coords: routePoints.from.coords,
                },
                to: {
                    address: routePoints.to.value,
                    coords: routePoints.to.coords,
                },
                stops: routePoints.stops.map((stop) => ({
                    address: stop.value,
                    coords: stop.coords,
                })),
            });

            if (result.id) {
                localStorage.setItem(
                    `route:${result.id}`,
                    JSON.stringify({
                        id: result.id,
                        points: result.points,
                        places: result.places,
                    })
                );
                navigate(`/routes/${result.id}`);
            }
        } catch (err) {
            console.error("Route building error:", err);
            alert("Ошибка при построении маршрута");
        }
    };

    return (
        <div className="route-builder">
            <Map />

            <div className="form-container">
                <AutoInput
                    label="Откуда?"
                    value={routePoints.from.value}
                    onChange={handlePointChange("from")}
                    fetchSuggestions={fetchSuggestions}
                />

                {routePoints.stops.map((stop, index) => (
                    <AutoInput
                        key={index}
                        label={`Точка ${index + 1}`}
                        value={stop.value}
                        onChange={handlePointChange("stop", index)}
                        onRemove={() => handleRemoveStop(index)}
                        fetchSuggestions={fetchSuggestions}
                    />
                ))}

                <AutoInput
                    label="Куда?"
                    value={routePoints.to.value}
                    onChange={handlePointChange("to")}
                    fetchSuggestions={fetchSuggestions}
                />

                <button onClick={handleAddStop}>
                    Добавить промежуточную точку
                </button>
                <button onClick={handleBuildRoute} disabled={!isRouteValid}>
                    Построить маршрут
                </button>
            </div>
        </div>
    );
}
