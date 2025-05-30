import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MapControls from "../MapControls";
import { LocationProvider } from "../../context/LocationContext";

// Мок контекста
const mockLocation = {
    location: null,
    setLocation: jest.fn(),
};

describe("MapControls", () => {
    it("shows warning when location is denied", async () => {
        render(
            <LocationProvider value={{ location: null }}>
                <MapControls showLocation onShowLocation={jest.fn()} />
            </LocationProvider>
        );

        await userEvent.click(screen.getByText("достопримечательности рядом"));
        expect(screen.getByText(/разрешите доступ/i)).toBeInTheDocument();
    });

    it("flashes button when location is denied", async () => {
        render(
            <LocationProvider value={mockLocation}>
                <MapControls showLocation onShowLocation={jest.fn()} />
            </LocationProvider>
        );

        const button = screen.getByText("достопримечательности рядом");
        await userEvent.click(button);
        expect(button).toHaveClass("flash");
    });
});
