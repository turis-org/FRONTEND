import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RouteBuilder from "../RouteBuilder";
import { MemoryRouter } from "react-router-dom";

// Мокаем API и компоненты
jest.mock("../../api/routes");
jest.mock("../../components/Map", () => () => <div>Mock Map</div>);
jest.mock('../../components/AutoInput', () => ({ label, onChange, onRemove }) => (
  <div>
    <input aria-label={label} onChange={(e) => onChange(e.target.value)} />
    <button onClick={() => onChange({ 
      address: `${label} тестовое значение`, 
      isValid: true, 
      coords: { lat: 0, lon: 0 } 
    })}>
      Выбрать тестовое значение
    </button>
    {onRemove && (
      <button 
        aria-label={`Удалить ${label}`}
        data-testid={`remove-${label}`}
        onClick={onRemove}
      >
        Удалить
      </button>
    )}
  </div>
));
jest.mock("../../api/config", () => ({
    API_BASE_URL: "http://localhost:1234",
}));
jest.mock("../../components/AutoInput", () => ({ label, onChange }) => {
    // Добавляем кнопку для тестового вызова onChange
    return (
        <div>
            <input
                aria-label={label}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                onClick={() =>
                    onChange({
                        address: `${label} тестовое значение`,
                        isValid: true,
                        coords: { lat: 0, lon: 0 },
                    })
                }
            >
                Выбрать тестовое значение
            </button>
        </div>
    );
});

describe("RouteBuilder", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders form inputs", () => {
        render(
            <MemoryRouter>
                <RouteBuilder />
            </MemoryRouter>
        );

        expect(screen.getByLabelText("Откуда?")).toBeInTheDocument();
        expect(screen.getByLabelText("Куда?")).toBeInTheDocument();
    });

    it("builds route when form is valid", async () => {
        const mockBuildRoute = require("../../api/routes").buildRoute;
        mockBuildRoute.mockResolvedValue({ id: "123", points: [] });

        render(
            <MemoryRouter>
                <RouteBuilder />
            </MemoryRouter>
        );

        // 1. Нажимаем кнопки "Выбрать тестовое значение" для обоих полей
        const fromSelectButton = screen.getAllByText(
            "Выбрать тестовое значение"
        )[0];
        const toSelectButton = screen.getAllByText(
            "Выбрать тестовое значение"
        )[1];

        await userEvent.click(fromSelectButton);
        await userEvent.click(toSelectButton);

        // 2. Проверяем, что кнопка построения маршрута разблокирована
        const buildButton = screen.getByText(/построить маршрут/i);
        await waitFor(
            () => {
                expect(buildButton).not.toBeDisabled();
            },
            { timeout: 3000 }
        );

        // 3. Нажимаем кнопку построения маршрута
        await userEvent.click(buildButton);

        // 4. Проверяем, что маршрут был построен
        await waitFor(() => {
            expect(mockBuildRoute).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: expect.objectContaining({
                        address: "Откуда? тестовое значение",
                    }),
                    to: expect.objectContaining({
                        address: "Куда? тестовое значение",
                    }),
                    stops: [],
                })
            );
        });
    });
});
