import { LatLngTuple } from 'leaflet';

export interface MapLocation {
  id: string;
  name: string;
  address: string;
  coordinates: LatLngTuple;
  rating: number;
  priceLevel: number;
  photos: string[];
  phone?: string;
  website?: string;
  reviews: number;
  types: string[];
  openingHours?: string[];
  businessStatus?: string;
}

export interface VenueSearchResult extends MapLocation {
  capacity?: number;
  priceRange?: string;
  amenities?: string[];
  description?: string;
}

export class OpenStreetMapService {
  private static readonly NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
  private static readonly OVERPASS_BASE = 'https://overpass-api.de/api/interpreter';

  static async geocodeLocation(location: string): Promise<LatLngTuple | null> {
    try {
      const response = await fetch(
        `${this.NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0) {
        return null;
      }

      const result = data[0];
      return [parseFloat(result.lat), parseFloat(result.lon)];
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  static async searchVenues(location: string, eventType: string, budget: number): Promise<VenueSearchResult[]> {
    try {
      const coordinates = await this.geocodeLocation(location);
      if (!coordinates) {
        return this.getFallbackVenues(location, eventType, budget);
      }

      const [lat, lon] = coordinates;
      const radius = 10000; // 10km radius

      // Build Overpass query for venues
      const venueQuery = this.buildVenueOverpassQuery(lat, lon, radius, eventType);
      
      const response = await fetch(this.OVERPASS_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(venueQuery)}`
      });

      if (!response.ok) {
        throw new Error(`Overpass API failed: ${response.status}`);
      }

      const data = await response.json();
      return this.formatOverpassResults(data.elements, eventType, budget);
    } catch (error) {
      console.error('Venue search error:', error);
      return this.getFallbackVenues(location, eventType, budget);
    }
  }

  static async searchVendors(category: string, location: string): Promise<VenueSearchResult[]> {
    try {
      const coordinates = await this.geocodeLocation(location);
      if (!coordinates) {
        return this.getFallbackVendors(category, location);
      }

      const [lat, lon] = coordinates;
      const radius = 15000; // 15km radius for vendors

      const vendorQuery = this.buildVendorOverpassQuery(lat, lon, radius, category);
      
      const response = await fetch(this.OVERPASS_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(vendorQuery)}`
      });

      if (!response.ok) {
        throw new Error(`Overpass API failed: ${response.status}`);
      }

      const data = await response.json();
      return this.formatOverpassResults(data.elements, category);
    } catch (error) {
      console.error('Vendor search error:', error);
      return this.getFallbackVendors(category, location);
    }
  }

  private static buildVenueOverpassQuery(lat: number, lon: number, radius: number, eventType: string): string {
    const venueTypes = {
      wedding: ['amenity=restaurant', 'amenity=cafe', 'tourism=hotel', 'leisure=garden'],
      birthday: ['amenity=restaurant', 'amenity=cafe', 'leisure=park', 'amenity=community_centre'],
      corporate: ['amenity=conference_centre', 'tourism=hotel', 'amenity=restaurant'],
      anniversary: ['amenity=restaurant', 'tourism=hotel', 'leisure=garden'],
      graduation: ['amenity=restaurant', 'amenity=community_centre', 'leisure=park'],
      'baby-shower': ['amenity=restaurant', 'amenity=cafe', 'amenity=community_centre'],
      holiday: ['amenity=restaurant', 'amenity=community_centre', 'tourism=hotel'],
      fundraiser: ['amenity=conference_centre', 'amenity=community_centre', 'amenity=restaurant']
    };

    const types = venueTypes[eventType as keyof typeof venueTypes] || ['amenity=restaurant'];
    const typeQueries = types.map(type => `node[${type}](around:${radius},${lat},${lon});`).join('\n  ');

    return `
[out:json][timeout:25];
(
  ${typeQueries}
);
out geom;
    `.trim();
  }

  private static buildVendorOverpassQuery(lat: number, lon: number, radius: number, category: string): string {
    const vendorTypes = {
      catering: ['amenity=restaurant', 'shop=bakery', 'amenity=cafe'],
      photography: ['shop=photo', 'craft=photographer'],
      entertainment: ['amenity=nightclub', 'shop=music'],
      decor: ['shop=florist', 'shop=gift'],
      transportation: ['amenity=car_rental', 'shop=car'],
      flowers: ['shop=florist', 'shop=garden_centre'],
      music: ['amenity=nightclub', 'shop=music', 'amenity=bar']
    };

    const types = vendorTypes[category as keyof typeof vendorTypes] || ['amenity=restaurant'];
    const typeQueries = types.map(type => `node[${type}](around:${radius},${lat},${lon});`).join('\n  ');

    return `
[out:json][timeout:25];
(
  ${typeQueries}
);
out geom;
    `.trim();
  }

  private static formatOverpassResults(elements: any[], category?: string, budget?: number): VenueSearchResult[] {
    return elements
      .filter(element => element.tags && element.tags.name)
      .slice(0, 10)
      .map((element, index) => {
        const tags = element.tags;
        const name = tags.name;
        const address = this.buildAddress(tags);
        
        return {
          id: element.id?.toString() || `osm_${index}`,
          name,
          address,
          coordinates: [element.lat, element.lon] as LatLngTuple,
          rating: 4.0 + Math.random() * 1.0, // Simulate rating
          priceLevel: Math.floor(Math.random() * 4) + 1,
          photos: this.getDefaultPhotos(category || 'venue'),
          phone: tags.phone || tags['contact:phone'] || '(555) 000-0000',
          website: tags.website || tags['contact:website'] || `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
          reviews: Math.floor(Math.random() * 200) + 25,
          types: this.extractTypes(tags),
          openingHours: tags.opening_hours ? [tags.opening_hours] : undefined,
          businessStatus: 'OPERATIONAL',
          capacity: this.estimateCapacity(tags, budget),
          priceRange: this.estimatePriceRange(budget),
          amenities: this.extractAmenities(tags),
          description: this.generateDescription(name, tags)
        };
      });
  }

  private static buildAddress(tags: any): string {
    const parts = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:city'],
      tags['addr:state'],
      tags['addr:postcode']
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(' ') : 'Address not available';
  }

  private static extractTypes(tags: any): string[] {
    const types = [];
    
    if (tags.amenity) types.push(tags.amenity);
    if (tags.shop) types.push(tags.shop);
    if (tags.tourism) types.push(tags.tourism);
    if (tags.leisure) types.push(tags.leisure);
    if (tags.craft) types.push(tags.craft);
    
    return types.length > 0 ? types : ['establishment'];
  }

  private static extractAmenities(tags: any): string[] {
    const amenities = [];
    
    if (tags.wheelchair === 'yes') amenities.push('Wheelchair Accessible');
    if (tags.wifi === 'yes' || tags.internet_access === 'wlan') amenities.push('WiFi Available');
    if (tags.parking) amenities.push('Parking Available');
    if (tags.outdoor_seating === 'yes') amenities.push('Outdoor Seating');
    if (tags.air_conditioning === 'yes') amenities.push('Air Conditioning');
    
    return amenities.slice(0, 4);
  }

  private static estimateCapacity(tags: any, budget?: number): number {
    if (tags.capacity) return parseInt(tags.capacity);
    
    const baseCapacity = budget ? Math.floor(budget / 100) : 100;
    
    if (tags.amenity === 'restaurant') return Math.min(baseCapacity, 150);
    if (tags.amenity === 'conference_centre') return baseCapacity + 100;
    if (tags.tourism === 'hotel') return baseCapacity + 200;
    if (tags.leisure === 'park') return baseCapacity + 300;
    
    return baseCapacity;
  }

  private static estimatePriceRange(budget?: number): string {
    if (!budget) return '$2,000 - $5,000';
    
    if (budget < 3000) return '$500 - $2,000';
    if (budget < 8000) return '$2,000 - $5,000';
    if (budget < 20000) return '$5,000 - $15,000';
    return '$15,000+';
  }

  private static generateDescription(name: string, tags: any): string {
    const type = tags.amenity || tags.shop || tags.tourism || tags.leisure || 'establishment';
    return `${name} is a ${type.replace(/_/g, ' ')} offering professional services for events and special occasions.`;
  }

  private static getDefaultPhotos(category: string): string[] {
    const photoMap: { [key: string]: string[] } = {
      venue: ['https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg'],
      catering: ['https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'],
      photography: ['https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'],
      entertainment: ['https://images.pexels.com/photos/1677710/pexels-photo-1677710.jpeg'],
      flowers: ['https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg'],
      decor: ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg']
    };

    return photoMap[category] || photoMap.venue;
  }

  private static getFallbackVenues(location: string, eventType: string, budget: number): VenueSearchResult[] {
    return [
      {
        id: 'osm-venue-1',
        name: `${location} Event Center`,
        address: `123 Main Street, ${location}`,
        coordinates: [40.7128, -74.0060] as LatLngTuple,
        rating: 4.5,
        priceLevel: 3,
        photos: ['https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg'],
        phone: '(555) 123-4567',
        website: 'https://eventcenter.com',
        reviews: 150,
        types: ['venue', 'event_space'],
        capacity: Math.floor(budget / 50),
        priceRange: this.estimatePriceRange(budget),
        amenities: ['Parking Available', 'WiFi', 'Sound System', 'Catering Kitchen'],
        description: `Professional event venue in ${location} perfect for ${eventType} celebrations.`
      },
      {
        id: 'osm-venue-2',
        name: `${location} Garden Hall`,
        address: `456 Park Avenue, ${location}`,
        coordinates: [40.7589, -73.9851] as LatLngTuple,
        rating: 4.3,
        priceLevel: 2,
        photos: ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'],
        phone: '(555) 234-5678',
        website: 'https://gardenhall.com',
        reviews: 98,
        types: ['venue', 'garden'],
        capacity: Math.floor(budget / 60),
        priceRange: this.estimatePriceRange(budget * 0.8),
        amenities: ['Garden Views', 'Outdoor Space', 'Natural Lighting', 'Bridal Suite'],
        description: `Beautiful garden venue with natural lighting and outdoor spaces.`
      }
    ];
  }

  private static getFallbackVendors(category: string, location: string): VenueSearchResult[] {
    const fallbackData: { [key: string]: VenueSearchResult[] } = {
      catering: [
        {
          id: 'osm-catering-1',
          name: `${location} Gourmet Catering`,
          address: `789 Culinary Drive, ${location}`,
          coordinates: [40.7505, -73.9934] as LatLngTuple,
          rating: 4.7,
          priceLevel: 3,
          photos: ['https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'],
          phone: '(555) 345-6789',
          website: 'https://gourmetcatering.com',
          reviews: 200,
          types: ['catering', 'restaurant'],
          amenities: ['Custom Menus', 'Dietary Options', 'Full Service', 'Professional Staff'],
          description: 'Premium catering services with international cuisine options.'
        }
      ],
      photography: [
        {
          id: 'osm-photo-1',
          name: `${location} Event Photography`,
          address: `321 Camera Lane, ${location}`,
          coordinates: [40.7282, -74.0776] as LatLngTuple,
          rating: 4.8,
          priceLevel: 3,
          photos: ['https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'],
          phone: '(555) 456-7890',
          website: 'https://eventphoto.com',
          reviews: 175,
          types: ['photography', 'service'],
          amenities: ['Digital Gallery', 'Same Day Previews', 'Drone Photography', 'Full Day Coverage'],
          description: 'Professional event photography with award-winning photographers.'
        }
      ],
      entertainment: [
        {
          id: 'osm-entertainment-1',
          name: `${location} DJ Services`,
          address: `654 Music Street, ${location}`,
          coordinates: [40.7614, -73.9776] as LatLngTuple,
          rating: 4.6,
          priceLevel: 2,
          photos: ['https://images.pexels.com/photos/1677710/pexels-photo-1677710.jpeg'],
          phone: '(555) 567-8901',
          website: 'https://djservices.com',
          reviews: 120,
          types: ['entertainment', 'music'],
          amenities: ['Premium Sound', 'Lighting Package', 'MC Services', 'Custom Playlists'],
          description: 'Professional DJ services with premium sound equipment and lighting.'
        }
      ]
    };

    return fallbackData[category] || [];
  }

  private static buildVenueOverpassQuery(lat: number, lon: number, radius: number, eventType: string): string {
    const venueAmenities = {
      wedding: ['restaurant', 'cafe', 'community_centre'],
      birthday: ['restaurant', 'cafe', 'community_centre'],
      corporate: ['conference_centre', 'restaurant'],
      anniversary: ['restaurant', 'cafe'],
      graduation: ['restaurant', 'community_centre'],
      'baby-shower': ['restaurant', 'cafe', 'community_centre'],
      holiday: ['restaurant', 'community_centre'],
      fundraiser: ['conference_centre', 'community_centre', 'restaurant']
    };

    const amenities = venueAmenities[eventType as keyof typeof venueAmenities] || ['restaurant'];
    const amenityQueries = amenities.map(amenity => 
      `node["amenity"="${amenity}"](around:${radius},${lat},${lon});`
    ).join('\n  ');

    return `
[out:json][timeout:25];
(
  ${amenityQueries}
);
out geom;
    `.trim();
  }

  private static buildVendorOverpassQuery(lat: number, lon: number, radius: number, category: string): string {
    const vendorQueries = {
      catering: ['node["amenity"="restaurant"](around:RADIUS,LAT,LON);', 'node["shop"="bakery"](around:RADIUS,LAT,LON);'],
      photography: ['node["shop"="photo"](around:RADIUS,LAT,LON);', 'node["craft"="photographer"](around:RADIUS,LAT,LON);'],
      entertainment: ['node["amenity"="nightclub"](around:RADIUS,LAT,LON);', 'node["shop"="music"](around:RADIUS,LAT,LON);'],
      decor: ['node["shop"="florist"](around:RADIUS,LAT,LON);', 'node["shop"="gift"](around:RADIUS,LAT,LON);'],
      transportation: ['node["amenity"="car_rental"](around:RADIUS,LAT,LON);'],
      flowers: ['node["shop"="florist"](around:RADIUS,LAT,LON);', 'node["shop"="garden_centre"](around:RADIUS,LAT,LON);'],
      music: ['node["shop"="music"](around:RADIUS,LAT,LON);', 'node["amenity"="bar"](around:RADIUS,LAT,LON);']
    };

    const queries = vendorQueries[category as keyof typeof vendorQueries] || vendorQueries.catering;
    const formattedQueries = queries.map(query => 
      query.replace('RADIUS', radius.toString()).replace('LAT', lat.toString()).replace('LON', lon.toString())
    ).join('\n  ');

    return `
[out:json][timeout:25];
(
  ${formattedQueries}
);
out geom;
    `.trim();
  }

  private static formatOverpassResults(elements: any[], category?: string, budget?: number): VenueSearchResult[] {
    return elements
      .filter(element => element.tags && element.tags.name)
      .slice(0, 8)
      .map((element, index) => {
        const tags = element.tags;
        const name = tags.name;
        
        return {
          id: element.id?.toString() || `osm_${category}_${index}`,
          name,
          address: this.buildAddress(tags),
          coordinates: [element.lat, element.lon] as LatLngTuple,
          rating: 4.0 + Math.random() * 1.0,
          priceLevel: Math.floor(Math.random() * 4) + 1,
          photos: this.getDefaultPhotos(category || 'venue'),
          phone: tags.phone || tags['contact:phone'] || '(555) 000-0000',
          website: tags.website || tags['contact:website'] || `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
          reviews: Math.floor(Math.random() * 200) + 25,
          types: this.extractTypes(tags),
          openingHours: tags.opening_hours ? [tags.opening_hours] : undefined,
          businessStatus: 'OPERATIONAL',
          capacity: this.estimateCapacity(tags, budget),
          priceRange: this.estimatePriceRange(budget),
          amenities: this.extractAmenities(tags),
          description: this.generateDescription(name, tags)
        };
      });
  }
}