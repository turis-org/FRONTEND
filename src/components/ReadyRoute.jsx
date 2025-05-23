import { useNavigate } from "react-router-dom";
import Map from "./Map";
import "./ReadyRoute.css";

export default function ReadyRoute({ route }) {
    const navigate = useNavigate();

    const handleClick = () => {
        // Переход на страницу с деталями маршрута
        console.log("Navigating with ID:", route.id);
        navigate(`/routes/${route.id}`, {
            state: {
                route: route,
            },
        });
    };

    return (
        <div className="ready-route" onClick={handleClick}>
            <h3 className="route-title">{route.name}</h3>
            <div className="route-map-container">
                <Map
                    routes={[route]}
                    places={route.places || []}
                    style={{ height: "200px", borderRadius: "8px" }}
                    zoom={12}
                    // Центрируем на начальной точке
                    center={route.points[0]} 
                    shouldCenterOnRoute={true}
                    shouldCenterOnLocation={false}
                />
            </div>
            <div className="route-info">
                <p className="route-description">
                    {route.description || "Интересный маршрут для прогулки"}
                </p>
                <div className="route-points">
                    <span>Начало: {route.startPoint || "Не указано"}</span>
                    <span>Конец: {route.endPoint || "Не указано"}</span>
                </div>
            </div>
        </div>
    );
}
