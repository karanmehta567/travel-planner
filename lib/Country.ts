interface GeoCodeResult {
  country: string;
  formattedAddress: string;
}

export async function getCountrythroughLatandLng(lat: number,lng: number): Promise<GeoCodeResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return {
      country: 'Unknown',
      formattedAddress: 'Unknown'
    };
  }

  const result = data.results[0];
  const country = result.address_components.find((component: any) =>
    component.types.includes('country')
  );

  return {
    country: country?.long_name || 'Unknown',
    formattedAddress: result.formatted_address
  };
}
