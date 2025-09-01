// Proxy service to handle external API calls
// Since we can't make direct API calls from the browser due to CORS,
// we'll create a service that can be extended with backend endpoints

export class ProxyService {
  private static baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

  static async searchPlaces(query: string, location: string): Promise<any> {
    try {
      // This would typically call your backend API
      // For now, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        results: [
          {
            place_id: `place_${Date.now()}`,
            name: `${query} in ${location}`,
            formatted_address: `123 Main St, ${location}`,
            rating: 4.5 + Math.random() * 0.5,
            price_level: Math.floor(Math.random() * 4) + 1,
            photos: [
              { photo_reference: 'mock_photo_ref' }
            ],
            user_ratings_total: Math.floor(Math.random() * 200) + 50,
            types: ['establishment', 'point_of_interest']
          }
        ]
      };
    } catch (error) {
      console.error('Proxy service error:', error);
      throw error;
    }
  }

  static async searchYelp(term: string, location: string, category: string): Promise<any> {
    try {
      // This would typically call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        businesses: [
          {
            id: `yelp_${Date.now()}`,
            name: `${term} Services`,
            location: {
              display_address: [`123 Business Ave`, `${location}`]
            },
            rating: 4.0 + Math.random(),
            price: '$'.repeat(Math.floor(Math.random() * 4) + 1),
            image_url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
            phone: '+15551234567',
            url: 'https://yelp.com/biz/example',
            review_count: Math.floor(Math.random() * 150) + 25,
            categories: [{ title: category }]
          }
        ]
      };
    } catch (error) {
      console.error('Yelp proxy error:', error);
      throw error;
    }
  }
}