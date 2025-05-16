// src/api/places.js
export async function fetchNearbyPlaces(lat, lon) {
    // Пока вместо настоящего бэка — фиктивный ответ
    console.log("places are going to be returned")
    return [
      {
        xid: "place123",
        name: "Oxford Castle",
        point: { lat: 48.57301234942157, lon: 7.771724410277788 },
        rate: "3h",
        otm: "https://opentripmap.com/en/card/place123",
      },
      {
        xid: "place456",
        name: "Bodleian Library",
        point: { lat: 48.58, lon: 7.7508 },
        rate: "2h",
        otm: "https://opentripmap.com/en/card/place456",
      },
    ];
  }


