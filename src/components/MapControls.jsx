// components/MapControls.jsx
import "./MapControls.css";
import { useLocationContext } from "../context/LocationContext";
import { useState } from "react";

export default function MapControls({
    showLocation = false,
    showRoutes = false,
    onShowLocation,
    onShowRoutes,
    onNextRoute,
    onPrevRoute,
    showRouteControls,
}) {
    const { location } = useLocationContext();
    const [flash, setFlash] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const handleProtectedAction = (action) => {
        if (!location) {
            setFlash(true);
            setShowWarning(true); // Показываем сообщение
            setTimeout(() => setFlash(false), 1000); // Убираем мигание через 1 сек
            setTimeout(() => setShowWarning(false), 3000); // Скрываем через 3 сек
            return;
        }
        action(); // Выполнить переданную функцию
    };

    return (
        <div className="map-controls">
            {showRoutes && (
                <button
                    variant="location"
                    className={flash && !location ? "flash" : ""}
                    onClick={() => handleProtectedAction(onShowRoutes)}
                >
                    Ближайшие маршруты
                </button>
            )}

            {showLocation && (
                <button
                    className={flash && !location ? "flash" : ""}
                    onClick={() => handleProtectedAction(onShowLocation)}
                >
                    достопримечательности рядом
                </button>
            )}

            {showWarning && (
                <div className="location-warning-overlay">
                    <div className="location-warning">
                        ⚠️ Чтобы использовать эту функцию, разрешите доступ к
                        местоположению.
                    </div>
                </div>
            )}

            {showRouteControls && (
                <div className="route-buttons">
                    <button onClick={onPrevRoute}>← Назад</button>
                    <button onClick={onNextRoute}>Вперёд →</button>
                </div>
            )}
        </div>
    );
}
