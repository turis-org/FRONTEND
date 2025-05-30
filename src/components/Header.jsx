import { useLocationContext } from "../context/LocationContext";
import { useNavigate } from "react-router-dom";

import Button from "./Button";
import logo from "../assets/turis_icon.png";
import { useState } from "react";
import "./Header.css"; // Подключим стили отдельно (ниже)

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { requestLocation } = useLocationContext();
    const navigate = useNavigate();
    // for debugging
    const { clearLocation } = useLocationContext();

    const handleAllowLocation = async () => {
        try {
            await requestLocation(); // Получаем координаты
            navigate("/"); // Переход на главную
        } catch (err) {
            alert("Ошибка при получении местоположения: " + err);
        }
    };

    return (
        <header className="header">
            <img src={logo} alt="Turis" className="logo" />

            <nav className={`nav ${menuOpen ? "open" : ""}`}>
                <Button variant="ready_routes" to="/ready-routes">Готовые маршруты</Button>
                <Button variant="route" to="/my-route">Построить свой маршрут</Button>
                <Button variant="location" onClick={handleAllowLocation}>
                    Разрешить местоположение
                </Button>
                <Button variant="default" onClick={clearLocation}>
                    Очистить местоположение
                </Button>
            </nav>

            <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
                <span />
                <span />
                <span />
            </div>
        </header>
    );
}
