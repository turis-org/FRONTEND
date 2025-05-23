import { useEffect, useState } from "react";
import { useLocationContext } from "../context/LocationContext";
import { fetchNearbyRoutes } from "../api/routes";
import ReadyRoute from "../components/ReadyRoute";
import "./ReadyRoutesPage.css";

export default function ReadyRoutesPage() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { location } = useLocationContext();

    useEffect(() => {
        const loadRoutes = async () => {
            try {
                console.log(location);
                setLoading(true);

                // Определяем координаты для запроса
                const lat = location?.lat ?? 54.84338398730221;
                const lng = location?.lng ?? 83.09085604838762;
                const nearbyRoutes = await fetchNearbyRoutes(
                    lat,
                    lng,
                    1000 // радиус в метрах
                    // 5     // количество маршрутов
                );
                setRoutes(nearbyRoutes);
            } catch (err) {
                setError(err.message);
                console.error("Ошибка при загрузке маршрутов:", err);
            } finally {
                setLoading(false);
            }
        };

        loadRoutes();
    }, [location]);

    if (loading) {
        return <div className="loading">Загрузка маршрутов...</div>;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    if (routes.length === 0) {
        return <div className="no-routes">Поблизости не найдено маршрутов</div>;
    }

    return (
        <div className="ready-routes-page">
            <h2>Готовые маршруты поблизости</h2>
            <div className="routes-list">
                {routes.map((route) => (
                    <ReadyRoute key={route.id} route={route} />
                ))}
            </div>
        </div>
    );
}
