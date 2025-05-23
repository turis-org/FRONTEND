import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
// import MyRoutePage from "./pages/MyRoutePage";
import RouteBuilder from "./pages/RouteBuilder";
import RouteResult from "./pages/RouteResult";
import MainLayout from "./layout/MainLayout";
import { LocationProvider } from "./context/LocationContext";
import ReadyRoutesPage from "./pages/ReadyRoutesPage";

export default function App() {
    return (
        <LocationProvider>
            <Router>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        {/* <Route path="/about" element={<About />} /> */}
                        <Route
                            path="/my-route"
                            element={<RouteBuilder />}
                        />{" "}
                        {/* Новый путь */}
                        <Route
                            path="/routes/:routeId"
                            element={<RouteResult />}
                        />
                        <Route path="/ready-routes" element={<ReadyRoutesPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Router>
        </LocationProvider>
    );
}
