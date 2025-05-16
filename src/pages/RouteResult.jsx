import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Map from "../components/Map";
import "./RouteResult.css"

export default function RouteResult() {
    const { routeId } = useParams();
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRoute() {
            // 🔍 Пытаемся найти в localStorage
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
            {/* <Map data={routeData.geoJson} /> */}
            <h2>
                Маршрут {routeData.name}
            </h2>
            
            <Map routes={[routeData]} places={routeData.places}/>
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
