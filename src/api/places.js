// src/api/places.js
import { API_BASE_URL } from "./config";
import { fetchWithTimeout } from "./fetchWithTimeout";

export const fetchNearbyPlaces = async (lat, lon, radius = 5000) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/places/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// export async function fetchNearbyPlaces(lat, lon) {
//     // Пока вместо настоящего бэка — фиктивный ответ
//     console.log("places are going to be returned");
//     return {
//         type: "FeatureCollection",
//         features: [
//             {
//                 type: "Feature",
//                 id: "7190198",
//                 geometry: {
//                     type: "Point",
//                     coordinates: [83.0917053, 54.8427353],
//                 },
//                 properties: {
//                     xid: "W723214287",
//                     name: "",
//                     dist: 79.21764977,
//                     rate: 0,
//                     osm: "way/723214287",
//                     kinds: "fountains,cultural,urban_environment,interesting_places",
//                 },
//             },
//             {
//                 type: "Feature",
//                 id: "4172180",
//                 geometry: {
//                     type: "Point",
//                     coordinates: [83.0930634, 54.8430023],
//                 },
//                 properties: {
//                     xid: "N697224276",
//                     name: "Скамейка-шпаргалка",
//                     dist: 107.19481367,
//                     rate: 1,
//                     osm: "node/697224276",
//                     kinds: "other,unclassified_objects,interesting_places,tourist_object",
//                 },
//             },        
//         ],
//     };

//     // [
//     //   {
//     //     xid: "place123",
//     //     name: "Oxford Castle",
//     //     point: { lat: 48.57301234942157, lon: 7.771724410277788 },
//     //     rate: "3h",
//     //     otm: "https://opentripmap.com/en/card/place123",
//     //   },
//     //   {
//     //     xid: "place456",
//     //     name: "Bodleian Library",
//     //     point: { lat: 48.58, lon: 7.7508 },
//     //     rate: "2h",
//     //     otm: "https://opentripmap.com/en/card/place456",
//     //   },
//     // ];
// }
