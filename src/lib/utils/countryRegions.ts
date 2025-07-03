// Country to Region mapping based on client requirements
export const countryRegions: Record<string, string> = {
  // Africa & Middle East
  'Cameroon': 'Africa & Middle East',
  'Chad': 'Africa & Middle East',
  'Congo': 'Africa & Middle East',
  'Côte d\'Ivoire': 'Africa & Middle East',
  'Egypt': 'Africa & Middle East',
  'Ghana': 'Africa & Middle East',
  'Mozambique': 'Africa & Middle East',
  'Nigeria': 'Africa & Middle East',
  'Republic of the Congo': 'Africa & Middle East',
  'Saudi Arabia': 'Africa & Middle East',
  'Senegal': 'Africa & Middle East',
  'South Africa': 'Africa & Middle East',
  'Sudan': 'Africa & Middle East',
  'Togo': 'Africa & Middle East',
  'United Arab Emirates': 'Africa & Middle East',
  'Zimbabwe': 'Africa & Middle East',
  'Kenya': 'Africa & Middle East',
  'Burkina Faso': 'Africa & Middle East',
  
  // Americas
  'Brazil': 'Americas',
  'Mexico': 'Americas',
  'Peru': 'Americas',
  'United States': 'Americas',
  
  // Asia Pacific
  'Australia': 'Asia Pacific',
  'China': 'Asia Pacific',
  'India': 'Asia Pacific',
  'Indonesia': 'Asia Pacific',
  'Japan': 'Asia Pacific',
  'Malaysia': 'Asia Pacific',
  'New Zealand': 'Asia Pacific',
  'Singapore': 'Asia Pacific',
  'Vietnam': 'Asia Pacific',
  'Thailand': 'Asia Pacific',
  
  // Europe
  'Germany': 'Europe',
  'Italy': 'Europe',
  'Netherlands': 'Europe',
  'Russia': 'Europe',
  'Spain': 'Europe',
  'Switzerland': 'Europe',
  'Turkey': 'Europe',
  'Ukraine': 'Europe',
  'United Kingdom': 'Europe',
  'France': 'Europe',
  'Poland': 'Europe'
};

// Get region for a country
export function getRegionForCountry(country: string): string | null {
  return countryRegions[country] || null;
}

// Get all available countries (excluding Gabon as requested)
export function getAvailableCountries(): string[] {
  return Object.keys(countryRegions).sort();
}

// Get all regions
export function getRegions(): string[] {
  return [...new Set(Object.values(countryRegions))].sort();
} 