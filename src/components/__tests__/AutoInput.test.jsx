import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AutoInput from "../AutoInput";

// Мок для хука useAutocomplete
jest.mock("../../hooks/useAutocomplete", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        value: "",
        setValue: jest.fn(),
        suggestions: [],
        isOpen: false,
        setIsOpen: jest.fn(),
        selectSuggestion: jest.fn(),
    })),
}));

describe("AutoInput component", () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders input with label", () => {
        render(<AutoInput label="Search" fetchSuggestions={mockFetch} />);
        expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });

    it("calls onChange when typing", async () => {
        const handleChange = jest.fn();
        render(
            <AutoInput onChange={handleChange} fetchSuggestions={jest.fn()} />
        );

        await userEvent.type(screen.getByRole("textbox"), "test");

        expect(handleChange).toHaveBeenNthCalledWith(1, "t");
        expect(handleChange).toHaveBeenNthCalledWith(2, "e");
        expect(handleChange).toHaveBeenNthCalledWith(3, "s");
        expect(handleChange).toHaveBeenNthCalledWith(4, "t");
    });

    it("shows remove button when onRemove is provided", () => {
        render(<AutoInput onRemove={jest.fn()} fetchSuggestions={mockFetch} />);
        expect(screen.getByRole("button", { name: /✖/ })).toBeInTheDocument();
    });

    it("closes suggestions when clicking outside", async () => {
        const setIsOpenMock = jest.fn();

        const useAutocomplete = require("../../hooks/useAutocomplete").default;
        useAutocomplete.mockImplementation(() => ({
            value: "",
            setValue: jest.fn(),
            suggestions: [{ displayName: "Test", lat: 0, lon: 0 }],
            isOpen: true,
            setIsOpen: setIsOpenMock,
            selectSuggestion: jest.fn(),
        }));

        render(<AutoInput fetchSuggestions={mockFetch} />);
        await userEvent.click(document.body);

        expect(setIsOpenMock).toHaveBeenCalledWith(false);
    });
});
