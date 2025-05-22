import Map from "../components/Map";
import MapControls from "../components/MapControls";
import "./HomePage.css";
import { useState } from "react";
import { useLocationContext } from "../context/LocationContext";
import { fetchNearbyPlaces } from "../api/places";
import { fetchNearbyRoutes } from "../api/routes"; // Пусть это будет фейковая функция, пока не внедрены маршруты

export default function HomePage() {
    const { location } = useLocationContext();
    const [places, setPlaces] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [displayedContent, setDisplayedContent] = useState(null); // Начнем с того, что показываем достопримечательности
    const [currentRouteIndex, setCurrentRouteIndex] = useState(0); // индекс отображаемого


    const handleNextRoute = () => {
        setCurrentRouteIndex((prev) => Math.min(prev + 1, routes.length - 1));
      };
      
      const handlePrevRoute = () => {
        setCurrentRouteIndex((prev) => Math.max(prev - 1, 0));
      };


    const handleShowPlaces = async () => {
        if (!location) return;
        try {
          const data = await fetchNearbyPlaces(location.lat, location.lng);
          setPlaces(data);
          setDisplayedContent("places");
          setRoutes([]);
        } catch (err) {
          alert("Не удалось загрузить достопримечательности");
        }
      };
      

    const handleShowRoutes = async () => {
        console.log("Маршруты");
        if (!location) return;
        try {
            const data = await fetchNearbyRoutes(location.lat, location.lng); // Фейковая функция для маршрутов
            setRoutes(data);
            setCurrentRouteIndex(0); // показываем первый
            setDisplayedContent("routes"); // При нажатии показываем маршруты
        } catch (err) {
            alert("Не удалось загрузить маршруты");
        }
    };

    return (
        <div className="home-page">
            <Map
                places={displayedContent === "places" ? places : []} // Отображаем только места, если выбраны достопримечательности
                // routes={displayedContent === "routes" ? routes : []} // Отображаем маршруты, если выбраны маршруты
                routes={displayedContent === "routes" && routes.length > 0 ? [routes[currentRouteIndex]] : []}

            />
            <MapControls
                showLocation
                showRoutes
                onShowLocation={handleShowPlaces}
                onShowRoutes={handleShowRoutes}
                onNextRoute={handleNextRoute}
                onPrevRoute={handlePrevRoute}
                showRouteControls={displayedContent === "routes" && routes.length > 1}
            />
        </div>
    );
}
