const LATITUDE_RANGE = { min: -90, max: 90 };
const LONGITUDE_RANGE = { min: -180, max: 180 };

export function validateCoordinates(
  latitude: number,
  longitude: number,
): boolean {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return false;
  }
  return (
    latitude >= LATITUDE_RANGE.min &&
    latitude <= LATITUDE_RANGE.max &&
    longitude >= LONGITUDE_RANGE.min &&
    longitude <= LONGITUDE_RANGE.max
  );
}
