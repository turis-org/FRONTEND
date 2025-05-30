import { render, screen, waitFor, act } from '@testing-library/react';
import ReadyRoutesPage from '../ReadyRoutesPage';
import { LocationProvider } from '../../context/LocationContext';
import { MemoryRouter } from 'react-router-dom';

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Мокаем API
jest.mock('../../api/routes', () => ({
  fetchNearbyRoutes: jest.fn(() =>
    Promise.resolve([
      {
        name: "Маршрут x",
        id: 1,
        start: { lat: 54.85, lon: 83.10 }, // Adjusted to be near mockLocation
        url: "https://example.com/route1",
        points: [
          [52.51647509908763, 13.382941499999998],
          [52.516482999087614, 13.383070399999998],
          [52.516505699087624, 13.383442499999997],
          [52.51651569908762, 13.383589699999998],
        ],
      },
      {
        name: "Маршрут x",
        id: 5,
        start: { lat: 54.85, lon: 83.10 }, // Adjusted to be near mockLocation
        url: "https://example.com/route1",
        points: [
          [52.51647509908763, 13.382941499999998],
          [52.516482999087614, 13.383070399999998],
          [52.516505699087624, 13.383442499999997],
          [52.51651569908762, 13.383589699999998],
          [52.51652279908761, 13.383692399999997],
          [52.516536799087625, 13.3838947],
        ],
      },
    ])
  ),
}));

jest.mock("../../api/config", () => ({
  API_BASE_URL: "http://localhost:1234",
}));

describe('ReadyRoutesPage', () => {
  const mockLocation = {
    lat: 54.84,
    lng: 83.09,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <MemoryRouter>
        <LocationProvider value={{ location: mockLocation }}>
          <ReadyRoutesPage />
        </LocationProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/загрузка маршрутов/i)).toBeInTheDocument();
  });

  it('shows error message when loading fails', async () => {
    const { fetchNearbyRoutes } = require('../../api/routes');
    fetchNearbyRoutes.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(
        <MemoryRouter>
          <LocationProvider value={{ location: mockLocation }}>
            <ReadyRoutesPage />
          </LocationProvider>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
    });
  });

  it('uses default location when no location provided', async () => {
    const { fetchNearbyRoutes } = require('../../api/routes');
    fetchNearbyRoutes.mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <LocationProvider value={{ location: null }}>
            <ReadyRoutesPage />
          </LocationProvider>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(fetchNearbyRoutes).toHaveBeenCalledWith(
        54.84338398730221,
        83.09085604838762,
        1000
      );
    });
  });
});