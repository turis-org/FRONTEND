import { createContext, useContext, useEffect, useState } from "react";


// создание нового контекста, 
// который можно будет использовать для передачи данных
// без пробрасывания пропрос через каждый уровень компонентов
const LocationContext = createContext();

export function LocationProvider({ children }) {
    const [location, setLocation] = useState(null);


    // Загружаем координаты из localStorage при запуске
    useEffect(() => {
        const saved = localStorage.getItem("userLocation");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.lat && parsed.lng) {
                    setLocation(parsed);
                }
            } catch (e) {
                console.error("Ошибка при чтении координат из localStorage", e);
            }
        }
    }, []);

    const requestLocation = () => {
        return new Promise((resolve, reject) => {
            // проверяет, поддерживает ли браузер navigation.geolocation
            if (!navigator.geolocation) {
                reject("Geolocation not supported");
                return;
            }

            // получает координаты пользователя
            // Возвращает Promise, который можно использовать 
            // для обработки успешного или неуспешного получения данных - ???
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    // сохраняет координаты в setLocation
                    setLocation(coords);
                    localStorage.setItem("userLocation", JSON.stringify(coords)); // ⬅️ Сохраняем
                    resolve(coords);
                },
                (error) => reject(error.message)
            );
        });
    };

    const clearLocation = () => {
        // console.log("👉 Местоположение очищено");
        setLocation(null);
        localStorage.removeItem("userLocation");
    };


    // в контекст передается 2 значения - 
    // location - текущие координаты или null
    // requestLocation - функция, которую можно будет вызвать 
    // в любом компоненте для получения координат
    return (
        <LocationContext.Provider value={{ location, requestLocation, clearLocation  }}>
            {children}
        </LocationContext.Provider>
    );
}


// Это кастомный хук, чтобы было удобно использовать данный контекст
// Теперь в любом компоненте можно написать:
// const { location, requestLocation } = useLocationContext();

export function useLocationContext() {
    return useContext(LocationContext);
}
