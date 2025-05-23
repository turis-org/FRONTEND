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
        return data.map((item) => item.display_name);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
}

export default function RouteBuilder() {
    const [routePoints, setRoutePoints] = useState({
        from: { value: "", isValid: false },
        to: { value: "", isValid: false },
        stops: [],
    });

    const navigate = useNavigate();

    const handlePointChange = (type, index) => (value, isValid) => {
        setRoutePoints((prev) => {
            if (type === "from") return { ...prev, from: { value, isValid } };
            if (type === "to") return { ...prev, to: { value, isValid } };

            const stops = [...prev.stops];
            stops[index] = { value, isValid };
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
            const result = await buildRoute({
                from: routePoints.from.value,
                to: routePoints.to.value,
                stops: routePoints.stops.map((stop) => stop.value),
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
                    onValidChange={(isValid) =>
                        handlePointChange("from")(
                            routePoints.from.value,
                            isValid
                        )
                    }
                    fetchSuggestions={fetchSuggestions}
                />

                {routePoints.stops.map((stop, index) => (
                    <AutoInput
                        key={index}
                        label={`Точка ${index + 1}`}
                        value={stop.value}
                        onChange={handlePointChange("stop", index)}
                        onValidChange={(isValid) =>
                            handlePointChange("stop", index)(
                                stop.value,
                                isValid
                            )
                        }
                        onRemove={() => handleRemoveStop(index)}
                        fetchSuggestions={fetchSuggestions}
                    />
                ))}

                <AutoInput
                    label="Куда?"
                    value={routePoints.to.value}
                    onChange={handlePointChange("to")}
                    onValidChange={(isValid) =>
                        handlePointChange("to")(routePoints.to.value, isValid)
                    }
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
