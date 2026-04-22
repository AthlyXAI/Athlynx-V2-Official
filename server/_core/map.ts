// Google Maps — use GOOGLE_MAPS_API_KEY directly
export async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json() as { results: { geometry: { location: { lat: number; lng: number } } }[] };
  return data.results[0]?.geometry?.location ?? null;
}
