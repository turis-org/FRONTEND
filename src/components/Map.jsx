import { useEffect, useRef } from "react";
// импортируем контекст
import { useLocationContext } from "../context/LocationContext"; 

import L from "../libs/leaflet-custom/dist/leaflet";
import "../libs/leaflet-custom/dist/leaflet.css";
import "./Map.css";

const Map = ({
    className,
    style,
    center = [54.842843215591806, 83.09119716815792],
    zoom = 13,
    places = [],
    routes = [],
    shouldCenterOnRoute = false,
    shouldCenterOnLocation = true,
}) => {
    const mapRef = useRef(null); // Ссылка на контейнер для карты
    const leafletMapRef = useRef(null); // Ссылка на саму карту
    // Достаём местоположение из контекста
    const markersRef = useRef([]);
    const polylinesRef = useRef([]);

    const { location } = useLocationContext();

    useEffect(() => {
        // Если карты нет, создаем ее
        if (!leafletMapRef.current && mapRef.current) {
            console.log("map creating");
            leafletMapRef.current = L.map(mapRef.current, {
                // Отключаем стандартный контрол
                zoomControl: false,
            }).setView(center, zoom);

            // Добавляем контрол ПОСЛЕ полной инициализации карты
            const zoomControl = L.control.zoom({
                position: "topright",
            });
            zoomControl.addTo(leafletMapRef.current);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(leafletMapRef.current);
        }

        // Функция очистки при размонтировании компонента
        return () => {
            console.log("map deleting");
            if (leafletMapRef.current) {
                leafletMapRef.current.remove(); // Удаляем карту
                leafletMapRef.current = null; // Сбрасываем ссылку на карту
            }
        };
    }, []); // Запускаем ОДИН раз при монтировании

    // Обновленный эффект для центрирования
    useEffect(() => {
        if (!leafletMapRef.current) return;

        // Приоритеты центрирования:
        // 1. Если shouldCenterOnRoute=true и есть маршруты - центрируем на первом маршруте
        // 2. Если shouldCenterOnLocation=true и есть location - центрируем на location
        // 3. Иначе используем переданный center или дефолтные координаты

        if (shouldCenterOnRoute && routes.length > 0) {
            const firstPoint = routes[0].points[0];
            leafletMapRef.current.setView(firstPoint, zoom);
        } else if (shouldCenterOnLocation && location) {
            leafletMapRef.current.setView([location.lat, location.lng], zoom);
        } else {
            leafletMapRef.current.setView(center, zoom);
        }
    }, [routes, location, zoom, center, shouldCenterOnRoute, shouldCenterOnLocation]);


    // Обновляем маркеры для places или routes
    useEffect(() => {
        const map = leafletMapRef.current;
        if (!map) return;
        // Удаляем старые маркеры
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Очистка старых маркеров и линий перед отрисовкой новых
        markersRef.current.forEach((marker) => map.removeLayer(marker));
        markersRef.current = [];

        console.log(places)

        // Добавляем маркеры для places
        places.forEach((place) => {
            const marker = L.marker([place.point.lat, place.point.lon])
                .addTo(map)
                .bindPopup(
                    `<strong>${place.name}</strong><br><a href="${place.otm}" target="_blank">Подробнее</a>`
                );
            markersRef.current.push(marker);
        });

        

        polylinesRef.current?.forEach((line) => map.removeLayer(line));
        polylinesRef.current = [];

        // Отрисовка маршрутов
        routes.forEach((route) => {
            if (route.points && route.points.length > 1) {
                // Только первая и последняя точки
                const first = route.points[0];
                const last = route.points[route.points.length - 1];

                [first, last].forEach((point, index) => {
                    if (
                        Array.isArray(point) &&
                        point.length === 2 &&
                        typeof point[0] === "number" &&
                        typeof point[1] === "number"
                    ) {
                        const marker = L.marker([point[0], point[1]])
                            .addTo(map)
                            .bindPopup(
                                index === 0
                                    ? "Начало маршрута"
                                    : "Конец маршрута"
                            );

                        markersRef.current.push(marker);
                    }
                });

                // Линия маршрута
                const routeCoords = route.points.map((point) => [
                    point[0],
                    point[1],
                ]);
                const polyline = L.polyline(routeCoords, {
                    color: "blue",
                }).addTo(map);
                polylinesRef.current.push(polyline);
            }
        });

        
    }, [places, routes]); // Перезапускаем, если places или routes изменились



    useEffect(() => {
        const map = leafletMapRef.current;
        // Добавляем маркер для текущего местоположения
        if (location) {
            L.marker([location.lat, location.lng])
                .addTo(map)
                .bindPopup("Ваше местоположение");
        }
    }, [location]);
    
    return (
        <div
            ref={mapRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                // Для отладки
                border: "1px solid red", 
                ...style,
            }}
        />
    );
};

export default Map;
