import { renderHook, act } from '@testing-library/react';
import { LocationProvider, useLocationContext } from './LocationContext';

// Мокаем console.error для теста с невалидными данными
const originalConsoleError = console.error;
const mockConsoleError = jest.fn();

beforeAll(() => {
  console.error = mockConsoleError;
});

afterAll(() => {
  console.error = originalConsoleError;
});

beforeEach(() => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
  };
  
  localStorage.clear();
  jest.clearAllMocks();
  mockConsoleError.mockClear();
});

describe('LocationProvider', () => {
  it('should provide initial null location', () => {
    const { result } = renderHook(() => useLocationContext(), {
      wrapper: LocationProvider,
    });
    
    expect(result.current.location).toBeNull();
  });

  it('should load location from localStorage on mount', () => {
    const mockLocation = { lat: 10, lng: 20 };
    localStorage.setItem('userLocation', JSON.stringify(mockLocation));
    
    const { result } = renderHook(() => useLocationContext(), {
      wrapper: LocationProvider,
    });
    
    expect(result.current.location).toEqual(mockLocation);
  });

  it('should handle invalid localStorage data', () => {
    localStorage.setItem('userLocation', 'invalid-json');
    
    const { result } = renderHook(() => useLocationContext(), {
      wrapper: LocationProvider,
    });
    
    expect(result.current.location).toBeNull();
    expect(mockConsoleError).toHaveBeenCalledWith(
      "Ошибка при чтении координат из localStorage",
      expect.any(Error)
    );
  });

  describe('requestLocation', () => {
    it('should reject when geolocation is not supported', async () => {
      delete global.navigator.geolocation;
      
      const { result } = renderHook(() => useLocationContext(), {
        wrapper: LocationProvider,
      });
      
      await expect(result.current.requestLocation()).rejects.toBe('Geolocation not supported');
    });

    it('should resolve with coordinates when permission granted', async () => {
      const mockPosition = {
        coords: {
          latitude: 10,
          longitude: 20,
        },
      };
      
      // Мокаем успешный вызов getCurrentPosition
      navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });
      
      const { result } = renderHook(() => useLocationContext(), {
        wrapper: LocationProvider,
      });
      
      let coords;
      await act(async () => {
        coords = await result.current.requestLocation();
      });
      
      expect(coords).toEqual({ lat: 10, lng: 20 });
      expect(result.current.location).toEqual({ lat: 10, lng: 20 });
      expect(localStorage.getItem('userLocation')).toBe(JSON.stringify({ lat: 10, lng: 20 }));
    });

    it('should reject with error message when permission denied', async () => {
      navigator.geolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({ message: 'Permission denied' });
      });
      
      const { result } = renderHook(() => useLocationContext(), {
        wrapper: LocationProvider,
      });
      
      await expect(result.current.requestLocation()).rejects.toBe('Permission denied');
      expect(result.current.location).toBeNull();
      expect(localStorage.getItem('userLocation')).toBeNull();
    });
  });

  
});