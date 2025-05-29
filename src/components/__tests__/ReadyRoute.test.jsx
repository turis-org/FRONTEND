const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
    const original = jest.requireActual("react-router-dom");
    return {
        ...original,
        useNavigate: () => mockNavigate,
    };
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ReadyRoute from "../ReadyRoute";
import { LocationProvider } from "../../context/LocationContext";

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

const mockRoute = {
    id: "1",
    name: "Test Route",
    points: [[54.84, 83.09]],
};

describe("ReadyRoute", () => {
    it("renders route info", () => {
        render(
            <MemoryRouter>
                <LocationProvider value={{ location: null }}>
                    <ReadyRoute route={mockRoute} />
                </LocationProvider>
            </MemoryRouter>
        );

        expect(screen.getByText("Test Route")).toBeInTheDocument();
    });

    it("navigates on click", async () => {
        render(
            <MemoryRouter>
                <LocationProvider value={{ location: null }}>
                    <ReadyRoute route={mockRoute} />
                </LocationProvider>
            </MemoryRouter>
        );

        await userEvent.click(screen.getByText("Test Route"));
        expect(mockNavigate).toHaveBeenCalledWith(`/routes/${mockRoute.id}`, {
            state: { route: mockRoute },
        });
    });
});
