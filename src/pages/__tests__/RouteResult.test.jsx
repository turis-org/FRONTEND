import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RouteResult from "../RouteResult";

// Мокаем компоненты и localStorage
jest.mock("../../components/Map", () => () => <div>Mock Map</div>);

describe("RouteResult", () => {
    const mockRoute = {
        id: "123",
        points: [
            [54.84, 83.09],
            [54.85, 83.1],
        ],
        places: [{ name: "Test Place" }],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Восстанавливаем оригинальные реализации
    });

    it("loads route from location state", async () => {
        render(
            <MemoryRouter
                initialEntries={[
                    { pathname: "/routes/123", state: { route: mockRoute } },
                ]}
            >
                <Routes>
                    <Route path="/routes/:routeId" element={<RouteResult />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Test Place")).toBeInTheDocument();
        });
    });

    it("loads route from localStorage", async () => {
        localStorage.setItem("route:123", JSON.stringify(mockRoute));

        render(
            <MemoryRouter initialEntries={["/routes/123"]}>
                <Routes>
                    <Route path="/routes/:routeId" element={<RouteResult />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Test Place")).toBeInTheDocument();
        });
    });

    it("shows loading state", () => {
        render(
            <MemoryRouter initialEntries={["/routes/123"]}>
                <Routes>
                    <Route path="/routes/:routeId" element={<RouteResult />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/загрузка маршрута/i)).toBeInTheDocument();
    });

    it("shows error when route not found", async () => {
        localStorage.clear();

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(null), // или {} — что возвращает API при отсутствии маршрута
            })
        );

        render(
            <MemoryRouter initialEntries={[{ pathname: "/routes/123" }]}>
                <Routes>
                    <Route path="/routes/:routeId" element={<RouteResult />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/маршрут не найден/i)).toBeInTheDocument();
        });
    });
});
