import { OpenStreetMapService, VenueSearchResult } from './mapService';

// Legacy interface for backward compatibility
export interface PlaceResult {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel: number;
  photos: string[];
  phone?: string;
  website?: string;
  reviews: number;
  types: string[];
  location: {
    lat: number;
    lng: number;
  };
  openingHours?: string[];
  businessStatus?: string;
}

export interface PlaceDetails extends PlaceResult {
  description?: string;
  amenities?: string[];
  capacity?: number;
  priceRange?: string;
}

// Adapter class to maintain compatibility with existing code
export class PlacesService {
  static async searchVenues(location: string, eventType: string, budget: number): Promise<PlaceResult[]> {
    const results = await OpenStreetMapService.searchVenues(location, eventType, budget);
    return this.convertToLegacyFormat(results);
  }

  static async searchVendors(category: string, location: string): Promise<PlaceResult[]> {
    const results = await OpenStreetMapService.searchVendors(category, location);
    return this.convertToLegacyFormat(results);
  }

  private static convertToLegacyFormat(results: VenueSearchResult[]): PlaceResult[] {
    return results.map(result => ({
      id: result.id,
      name: result.name,
      address: result.address,
      rating: result.rating,
      priceLevel: result.priceLevel,
      photos: result.photos,
      phone: result.phone,
      website: result.website,
      reviews: result.reviews,
      types: result.types,
      location: {
        lat: result.coordinates[0],
        lng: result.coordinates[1]
      },
      openingHours: result.openingHours,
      businessStatus: result.businessStatus
    }));
  }
}