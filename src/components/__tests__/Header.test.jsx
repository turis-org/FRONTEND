import { render, screen, container } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Header from "../Header";

const mockRequestLocation = jest.fn();

// Мокаем хук useLocationContext
jest.mock("../../context/LocationContext", () => ({
    useLocationContext: () => ({
        requestLocation: mockRequestLocation,
        clearLocation: jest.fn(),
    }),
}));

// Мокаем изображение
jest.mock("../assets/turis_icon.png", () => "test-image-stub");

describe("Header", () => {
    beforeEach(() => {
        // Очищаем все моки перед каждым тестом
        jest.clearAllMocks();
    });

    it("renders navigation buttons", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        expect(screen.getByText("Готовые маршруты")).toBeInTheDocument();
        expect(screen.getByText("Построить свой маршрут")).toBeInTheDocument();
    });

    it("calls requestLocation on button click", async () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        await userEvent.click(screen.getByText("Разрешить местоположение"));
        expect(mockRequestLocation).toHaveBeenCalled(); // <-- Теперь должен пройти
    });

    it("toggles mobile menu", async () => {
        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        const menu = screen.getByRole("navigation");
        // const burgerButton = screen.getByRole('button', { name: /menu/i });
        const burgerButton = container.querySelector(".burger");

        // Проверяем начальное состояние
        expect(menu).not.toHaveClass("open");

        // Кликаем и проверяем
        await userEvent.click(burgerButton);
        expect(menu).toHaveClass("open");

        // Кликаем ещё раз
        await userEvent.click(burgerButton);
        expect(menu).not.toHaveClass("open");
    });
});
