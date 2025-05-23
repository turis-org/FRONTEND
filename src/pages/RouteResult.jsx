import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Map from "../components/Map";
import "./RouteResult.css";

export default function RouteResult({}) {
    const { routeId } = useParams();
    const location = useLocation(); // Получаем location
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log("routeId from URL:", routeId); // Добавьте эту строку
    console.log("Location state:", location.state); // Добавим логирование state
    useEffect(() => {
        // if we got route from state
        if (location.state?.route) {
            console.log("Using route from navigation state");
            setRouteData(location.state.route);
            setLoading(false);
            
            // need to think about it
            // // add data to local storage
            // localStorage.setItem(`route:${routeId}`, JSON.stringify(location.state.route));
            return;
        }

        async function loadRoute() {
            // Пытаемся найти в localStorage
            const stored = localStorage.getItem(`route:${routeId}`);
            if (stored) {
                setRouteData(JSON.parse(stored));
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/routes/${routeId}`);
                const data = await res.json();

                // Сохраняем для будущего
                localStorage.setItem(`route:${routeId}`, JSON.stringify(data));
                setRouteData(data);
            } catch (err) {
                console.error("Ошибка загрузки маршрута:", err);
            } finally {
                setLoading(false);
            }
        }

        loadRoute();
    }, [routeId]);

    if (loading) return <p>Загрузка маршрута...</p>;
    if (!routeData) return <p>Маршрут не найден</p>;

    console.log("routeData", routeData);

    return (
        <div className="route-result">
            <h2>Маршрут {routeData.name}</h2>

            <Map
                routes={[routeData]}
                places={routeData.places}
                center={routeData.points[0]} // Центрируем на начальной точке
                shouldCenterOnRoute={true} // Явно указываем центрировать на маршруте
            />
            {/* <ul>
                {routeData.places?.map((place, i) => (
                    <li key={i}>
                        {place.name} — {place.description}
                    </li>
                ))}
            </ul> */}
        </div>
    );
}
