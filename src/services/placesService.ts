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

export class PlacesService {
  private static readonly API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  private static readonly BASE_URL = 'https://maps.googleapis.com/maps/api/place';

  static async searchVenues(location: string, eventType: string, budget: number): Promise<PlaceResult[]> {
    if (!this.API_KEY) {
      console.warn('Google Places API key not configured, using fallback data');
      return this.getFallbackVenues(location, eventType, budget);
    }

    try {
      const query = this.buildVenueQuery(eventType, location);
      const response = await this.textSearch(query, location);
      
      return this.formatResults(response.results || []);
    } catch (error) {
      console.error('Places API Error:', error);
      return this.getFallbackVenues(location, eventType, budget);
    }
  }

  static async searchVendors(category: string, location: string): Promise<PlaceResult[]> {
    if (!this.API_KEY) {
      console.warn('Google Places API key not configured, using fallback data');
      return this.getFallbackVendors(category, location);
    }

    try {
      const query = this.buildVendorQuery(category, location);
      const response = await this.textSearch(query, location);
      
      return this.formatResults(response.results || []);
    } catch (error) {
      console.error('Places API Error:', error);
      return this.getFallbackVendors(category, location);
    }
  }

  static async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.API_KEY) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,website,opening_hours,price_level,photos,reviews,types,geometry,formatted_address&key=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Places API error: ${data.status}`);
      }

      return this.formatPlaceDetails(data.result);
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  }

  private static async textSearch(query: string, location: string): Promise<any> {
    const response = await fetch(
      `${this.BASE_URL}/textsearch/json?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&radius=50000&key=${this.API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API error: ${data.status}`);
    }

    return data;
  }

  private static buildVenueQuery(eventType: string, location: string): string {
    const venueQueries = {
      wedding: 'wedding venues banquet halls event spaces',
      birthday: 'party venues event halls birthday party locations',
      corporate: 'conference centers meeting venues corporate event spaces',
      anniversary: 'elegant venues banquet halls private dining',
      graduation: 'event venues party halls celebration spaces',
      'baby-shower': 'private dining rooms event spaces party venues',
      holiday: 'party venues event halls holiday party locations',
      fundraiser: 'event venues conference centers banquet halls'
    };

    const baseQuery = venueQueries[eventType as keyof typeof venueQueries] || 'event venues';
    return `${baseQuery} in ${location}`;
  }

  private static buildVendorQuery(category: string, location: string): string {
    const vendorQueries = {
      catering: 'catering services event catering wedding catering',
      photography: 'event photographers wedding photographers',
      entertainment: 'event entertainment DJ services live music',
      decor: 'event decorators party decorators wedding decor',
      transportation: 'event transportation limo services',
      flowers: 'florists wedding flowers event flowers',
      music: 'DJ services live music bands event entertainment'
    };

    const baseQuery = vendorQueries[category as keyof typeof vendorQueries] || `${category} services`;
    return `${baseQuery} in ${location}`;
  }

  private static formatResults(results: any[]): PlaceResult[] {
    return results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || 'Address not available',
      rating: place.rating || 0,
      priceLevel: place.price_level || 2,
      photos: this.formatPhotos(place.photos),
      phone: place.formatted_phone_number,
      website: place.website,
      reviews: place.user_ratings_total || 0,
      types: place.types || [],
      location: {
        lat: place.geometry?.location?.lat || 0,
        lng: place.geometry?.location?.lng || 0
      },
      openingHours: place.opening_hours?.weekday_text,
      businessStatus: place.business_status
    }));
  }

  private static formatPlaceDetails(place: any): PlaceDetails {
    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || 'Address not available',
      rating: place.rating || 0,
      priceLevel: place.price_level || 2,
      photos: this.formatPhotos(place.photos),
      phone: place.formatted_phone_number,
      website: place.website,
      reviews: place.user_ratings_total || 0,
      types: place.types || [],
      location: {
        lat: place.geometry?.location?.lat || 0,
        lng: place.geometry?.location?.lng || 0
      },
      openingHours: place.opening_hours?.weekday_text,
      businessStatus: place.business_status,
      description: this.generateDescription(place),
      amenities: this.extractAmenities(place.types),
      capacity: this.estimateCapacity(place.types, place.price_level),
      priceRange: this.formatPriceRange(place.price_level)
    };
  }

  private static formatPhotos(photos: any[]): string[] {
    if (!photos || !this.API_KEY) {
      return ['https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg'];
    }

    return photos.slice(0, 3).map(photo => 
      `${this.BASE_URL}/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${this.API_KEY}`
    );
  }

  private static generateDescription(place: any): string {
    const types = place.types || [];
    const rating = place.rating || 0;
    const reviews = place.user_ratings_total || 0;

    let description = `${place.name} is a ${types.filter(type => 
      !['establishment', 'point_of_interest'].includes(type)
    ).join(', ').replace(/_/g, ' ')}`;

    if (rating > 0) {
      description += ` with a ${rating.toFixed(1)} star rating`;
    }

    if (reviews > 0) {
      description += ` based on ${reviews} reviews`;
    }

    return description + '.';
  }

  private static extractAmenities(types: string[]): string[] {
    const amenityMap: { [key: string]: string } = {
      'parking': 'Parking Available',
      'wheelchair_accessible_entrance': 'Wheelchair Accessible',
      'wifi': 'WiFi Available',
      'air_conditioning': 'Air Conditioning',
      'outdoor_seating': 'Outdoor Space',
      'live_music': 'Live Music Venue',
      'dance_floor': 'Dance Floor',
      'full_bar': 'Full Bar Service'
    };

    return types
      .map(type => amenityMap[type])
      .filter(Boolean)
      .slice(0, 4);
  }

  private static estimateCapacity(types: string[], priceLevel: number): number {
    const baseCapacity = priceLevel * 50;
    
    if (types.includes('banquet_hall')) return baseCapacity + 100;
    if (types.includes('wedding_venue')) return baseCapacity + 75;
    if (types.includes('conference_center')) return baseCapacity + 150;
    if (types.includes('restaurant')) return Math.min(baseCapacity, 100);
    
    return baseCapacity;
  }

  private static formatPriceRange(priceLevel: number): string {
    const ranges = {
      1: '$500 - $2,000',
      2: '$2,000 - $5,000',
      3: '$5,000 - $15,000',
      4: '$15,000+'
    };

    return ranges[priceLevel as keyof typeof ranges] || '$2,000 - $5,000';
  }

  private static getFallbackVenues(location: string, eventType: string, budget: number): PlaceResult[] {
    return [
      {
        id: 'fallback-venue-1',
        name: `${location} Grand Ballroom`,
        address: `123 Main Street, ${location}`,
        rating: 4.5,
        priceLevel: 3,
        photos: ['https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg'],
        phone: '(555) 123-4567',
        website: 'https://grandballroom.com',
        reviews: 150,
        types: ['banquet_hall', 'wedding_venue', 'establishment'],
        location: { lat: 40.7128, lng: -74.0060 },
        openingHours: ['Monday: 9:00 AM – 10:00 PM', 'Tuesday: 9:00 AM – 10:00 PM'],
        businessStatus: 'OPERATIONAL'
      },
      {
        id: 'fallback-venue-2',
        name: `${location} Garden Pavilion`,
        address: `456 Park Avenue, ${location}`,
        rating: 4.3,
        priceLevel: 2,
        photos: ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'],
        phone: '(555) 234-5678',
        website: 'https://gardenpavilion.com',
        reviews: 98,
        types: ['event_venue', 'outdoor_venue', 'establishment'],
        location: { lat: 40.7589, lng: -73.9851 },
        openingHours: ['Monday: 8:00 AM – 11:00 PM', 'Tuesday: 8:00 AM – 11:00 PM'],
        businessStatus: 'OPERATIONAL'
      }
    ];
  }

  private static getFallbackVendors(category: string, location: string): PlaceResult[] {
    const fallbackData: { [key: string]: PlaceResult[] } = {
      catering: [
        {
          id: 'fallback-catering-1',
          name: `${location} Gourmet Catering`,
          address: `789 Culinary Drive, ${location}`,
          rating: 4.7,
          priceLevel: 3,
          photos: ['https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'],
          phone: '(555) 345-6789',
          website: 'https://gourmetcatering.com',
          reviews: 200,
          types: ['meal_delivery', 'restaurant', 'food', 'establishment'],
          location: { lat: 40.7505, lng: -73.9934 }
        }
      ],
      photography: [
        {
          id: 'fallback-photo-1',
          name: `${location} Event Photography`,
          address: `321 Camera Lane, ${location}`,
          rating: 4.8,
          priceLevel: 3,
          photos: ['https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'],
          phone: '(555) 456-7890',
          website: 'https://eventphoto.com',
          reviews: 175,
          types: ['photographer', 'establishment'],
          location: { lat: 40.7282, lng: -74.0776 }
        }
      ],
      entertainment: [
        {
          id: 'fallback-entertainment-1',
          name: `${location} DJ Services`,
          address: `654 Music Street, ${location}`,
          rating: 4.6,
          priceLevel: 2,
          photos: ['https://images.pexels.com/photos/1677710/pexels-photo-1677710.jpeg'],
          phone: '(555) 567-8901',
          website: 'https://djservices.com',
          reviews: 120,
          types: ['night_club', 'establishment'],
          location: { lat: 40.7614, lng: -73.9776 }
        }
      ]
    };

    return fallbackData[category] || [];
  }
}