// Simple mapping of common city names to approx lat/lon and equirectangular projection
export type MapPoint = {
  lat: number;
  lon: number;
};

const CITY_COORDS: Record<string, MapPoint> = {
  "new york": { lat: 40.7128, lon: -74.006 },
  "san francisco": { lat: 37.7749, lon: -122.4194 },
  "los angeles": { lat: 34.0522, lon: -118.2437 },
  "chicago": { lat: 41.8781, lon: -87.6298 },
  london: { lat: 51.5074, lon: -0.1278 },
  paris: { lat: 48.8566, lon: 2.3522 },
  berlin: { lat: 52.52, lon: 13.405 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  seoul: { lat: 37.5665, lon: 126.978 },
  beijing: { lat: 39.9042, lon: 116.4074 },
  "hong kong": { lat: 22.3193, lon: 114.1694 },
  singapore: { lat: 1.3521, lon: 103.8198 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  "australia/sydney": { lat: -33.8688, lon: 151.2093 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  "mexico city": { lat: 19.4326, lon: -99.1332 },
  "sao paulo": { lat: -23.55, lon: -46.6333 },
  "buenos aires": { lat: -34.6037, lon: -58.3816 },
  rio: { lat: -22.9068, lon: -43.1729 },
  moscow: { lat: 55.7558, lon: 37.6173 },
  istanbul: { lat: 41.0082, lon: 28.9784 },
  dubai: { lat: 25.2048, lon: 55.2708 },
  johannesburg: { lat: -26.2041, lon: 28.0473 },
  nairobi: { lat: -1.2921, lon: 36.8219 },
  toronto: { lat: 43.6532, lon: -79.3832 },
  vancouver: { lat: 49.2827, lon: -123.1207 },
  santiago: { lat: -33.4489, lon: -70.6693 },
  "new delhi": { lat: 28.6139, lon: 77.209 },
};

// Equirectangular projection: convert lon/lat to 0-100% x/y on a world map image
export function projectLonLatToPercent(lon: number, lat: number) {
  // x: map lon (-180..180) -> 0..100
  const x = ((lon + 180) / 360) * 100;
  // y: map lat (90..-90) -> 0..100 (top to bottom)
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

export function getCoordsForLocation(location?: string) {
  if (!location) return undefined;
  const key = location.trim().toLowerCase();
  if (CITY_COORDS[key]) return projectLonLatToPercent(CITY_COORDS[key].lon, CITY_COORDS[key].lat);

  // try simple includes (e.g., 'New York, NY' -> 'new york')
  for (const k of Object.keys(CITY_COORDS)) {
    if (key.includes(k)) {
      const p = CITY_COORDS[k];
      return projectLonLatToPercent(p.lon, p.lat);
    }
  }
  return undefined;
}
