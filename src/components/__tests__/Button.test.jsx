import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";
import { MemoryRouter } from 'react-router-dom';


describe("Button component", () => {
    it("renders button with children", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click</Button>);
        await userEvent.click(screen.getByText("Click"));
        expect(handleClick).toHaveBeenCalled();
    });

    it("is disabled when disabled prop is true", () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByText("Disabled")).toBeDisabled();
    });

    it('renders as Link when "to" prop is provided', () => {
        render(
            <MemoryRouter>
                <Button to="/some-route">Link</Button>
            </MemoryRouter>
        );
        expect(screen.getByText("Link").closest("a")).toHaveAttribute(
            "href",
            "/some-route"
        );
    });

    it("applies correct CSS class based on variant", () => {
        const { rerender } = render(<Button variant="default">Default</Button>);
        expect(screen.getByText("Default")).toHaveClass("btn default");

        rerender(<Button variant="location">Location</Button>);
        expect(screen.getByText("Location")).toHaveClass("btn location");
    });
});
