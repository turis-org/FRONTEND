// src/api/places.js
import { API_BASE_URL } from './config';
import { fetchWithTimeout } from './fetchWithTimeout';

export const fetchNearbyPlaces = async (lat, lon, radius = 5000) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/places/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};


// export async function fetchNearbyPlaces(lat, lon, radius = 5000) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/places/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Ошибка при загрузке мест:', error);
//     throw error;
//   }
// }


// export async function fetchNearbyPlaces(lat, lon) {
//     // Пока вместо настоящего бэка — фиктивный ответ
//     console.log("places are going to be returned")
//     return [
//       {
//         xid: "place123",
//         name: "Oxford Castle",
//         point: { lat: 48.57301234942157, lon: 7.771724410277788 },
//         rate: "3h",
//         otm: "https://opentripmap.com/en/card/place123",
//       },
//       {
//         xid: "place456",
//         name: "Bodleian Library",
//         point: { lat: 48.58, lon: 7.7508 },
//         rate: "2h",
//         otm: "https://opentripmap.com/en/card/place456",
//       },
//     ];
//   }


