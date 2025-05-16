import { useEffect, useRef } from "react";
import { useLocationContext } from "../context/LocationContext"; // импортируем контекст

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

    // Обновляем центр карты, если появилось местоположение
    useEffect(() => {
        if (leafletMapRef.current && location) {
            leafletMapRef.current.setView([location.lat, location.lng], 13);
        }
    }, [location]); // Срабатывает при изменении location

    // useEffect(() => {
    //     console.log("places received:", places);
    //     const map = leafletMapRef.current;
    //     if (!map) return;
    //     // Удаляем старые маркеры
    //     markersRef.current.forEach((marker) => marker.remove());
    //     markersRef.current = [];
    //     // Добавляем новые маркеры
    //     places.forEach((place) => {
    //         const marker = L.marker([place.point.lat, place.point.lon])
    //             .addTo(map)
    //             // popups
    //             // .bindPopup(
    //             //     `<strong>${place.name}</strong><br><a href="${place.otm}" target="_blank">Подробнее</a>`
    //             // );
    //             .bindTooltip(
    //                 place.name,
    //                 {
    //                   permanent: true, // <- делаем подпись постоянной
    //                   direction: "top", // или "right", "left", "bottom"
    //                   offset: [0, -10], // чуть смещаем вверх, чтобы не перекрывалось маркером
    //                   className: "custom-label" // можешь стилизовать как хочешь
    //                 }
    //               );
    //         markersRef.current.push(marker);
    //     });
    // }, [places]);

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
                // Только первая и последняя точки (если нужно)
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

        // Добавляем маркер для текущего местоположения
        if (location) {
            L.marker([location.lat, location.lng])
                .addTo(map)
                .bindPopup("Ваше местоположение");
        }
    }, [places, routes, location]); // Перезапускаем, если places или routes изменились

    
    return (
        <div
            ref={mapRef}
            className={className}
            style={{
                // width: '100%',
                width: "100%",
                height: "100%",
                border: "1px solid red", // Для отладки — добавь границу, чтобы увидеть, что контейнер есть
                ...style,
            }}
        />
    );
};

export default Map;
