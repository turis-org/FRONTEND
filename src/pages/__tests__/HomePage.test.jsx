import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../HomePage";
import { LocationProvider } from "../../context/LocationContext";

jest.mock("../../api/places");
jest.mock("../../api/routes");
jest.mock("../../components/Map", () => () => <div>Mock Map</div>);
jest.mock("../../components/MapControls", () => ({ 
    onShowLocation, 
    onShowRoutes 
}) => (
    <div>
        <button onClick={onShowLocation}>Достопримечательности рядом</button>
        <button onClick={onShowRoutes}>Маршруты рядом</button>
        Mock MapControls
    </div>
));
jest.mock("../../api/config", () => ({
    API_BASE_URL: "http://localhost:1234",
}));

describe("HomePage", () => {
    const mockLocation = {
        lat: 54.84,
        lng: 83.09,
    };

    beforeAll(() => {
        window.alert = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        render(
            <LocationProvider value={{ location: mockLocation }}>
                <HomePage />
            </LocationProvider>
        );
        expect(screen.getByText("Mock Map")).toBeInTheDocument();
    });
    
});