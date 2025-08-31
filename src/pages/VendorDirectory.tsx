import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { 
  Search,
  Filter,
  Star,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Plus,
  Heart
} from 'lucide-react';

const categories = [
  'All Categories',
  'Venues',
  'Catering',
  'Photography',
  'Entertainment',
  'Decor',
  'Transportation',
  'Flowers',
  'Music & DJ'
];

const vendors = [
  {
    id: '1',
    name: 'Grand Ballroom',
    category: 'Venues',
    price: 5000,
    rating: 4.8,
    reviews: 127,
    location: 'Downtown',
    image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
    description: 'Elegant ballroom perfect for weddings and formal events with crystal chandeliers',
    contact: { phone: '(555) 123-4567', email: 'info@grandballroom.com', website: 'grandballroom.com' },
    features: ['Parking Available', 'Full Kitchen', 'Sound System', 'Dance Floor']
  },
  {
    id: '2',
    name: 'Garden Pavilion',
    category: 'Venues',
    price: 3500,
    rating: 4.6,
    reviews: 89,
    location: 'Uptown',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    description: 'Beautiful outdoor venue with garden views and natural lighting',
    contact: { phone: '(555) 234-5678', email: 'hello@gardenpavilion.com', website: 'gardenpavilion.com' },
    features: ['Outdoor Space', 'Garden Views', 'Weather Backup', 'Bridal Suite']
  },
  {
    id: '3',
    name: 'Gourmet Delights Catering',
    category: 'Catering',
    price: 75,
    rating: 4.9,
    reviews: 234,
    location: 'Citywide',
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    description: 'Premium catering with international cuisine and exceptional service',
    contact: { phone: '(555) 345-6789', email: 'orders@gourmetdelights.com', website: 'gourmetdelights.com' },
    features: ['International Menu', 'Dietary Options', 'Full Service', 'Custom Menus']
  },
  {
    id: '4',
    name: 'Stellar Photography',
    category: 'Photography',
    price: 2500,
    rating: 4.7,
    reviews: 156,
    location: 'Metro Area',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    description: 'Award-winning photographers specializing in events and weddings',
    contact: { phone: '(555) 456-7890', email: 'book@stellarphoto.com', website: 'stellarphoto.com' },
    features: ['Full Day Coverage', 'Digital Gallery', 'Drone Photography', 'Same Day Previews']
  },
  {
    id: '5',
    name: 'Elite DJ Services',
    category: 'Entertainment',
    price: 1200,
    rating: 4.5,
    reviews: 98,
    location: 'Citywide',
    image: 'https://images.pexels.com/photos/1677710/pexels-photo-1677710.jpeg',
    description: 'Professional DJs with extensive music libraries and premium sound equipment',
    contact: { phone: '(555) 567-8901', email: 'book@elitedj.com', website: 'elitedj.com' },
    features: ['Premium Sound', 'Lighting Package', 'MC Services', 'Custom Playlists']
  },
  {
    id: '6',
    name: 'Bloom & Blossom',
    category: 'Flowers',
    price: 800,
    rating: 4.8,
    reviews: 76,
    location: 'Garden District',
    image: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg',
    description: 'Exquisite floral arrangements for all occasions with fresh, seasonal flowers',
    contact: { phone: '(555) 678-9012', email: 'hello@bloomblossom.com', website: 'bloomblossom.com' },
    features: ['Seasonal Flowers', 'Custom Arrangements', 'Delivery Service', 'Event Setup']
  }
];

export default function VendorDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (vendorId: string) => {
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || vendor.category === selectedCategory;
    const matchesPrice = vendor.price >= priceRange[0] && vendor.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <Layout showSidebar>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Vendor Directory</h1>
          <p className="text-gray-400">Discover and connect with top-rated event professionals</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="grid lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Filter Button */}
            <div>
              <Button variant="secondary" icon={Filter} className="w-full">
                More Filters
              </Button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Price Range: ${priceRange[0]} - ${priceRange[1] === 10000 ? '10,000+' : priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Sort by:</span>
              <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white">
                <option>Rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group">
              {/* Image */}
              <div className="relative">
                <img 
                  src={vendor.image} 
                  alt={vendor.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleFavorite(vendor.id)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200"
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(vendor.id) ? 'text-red-400 fill-current' : 'text-white'}`} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
                    {vendor.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-300 text-sm">{vendor.rating}</span>
                    <span className="text-gray-500 text-sm">({vendor.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {vendor.location}
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{vendor.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {vendor.features.slice(0, 2).map((feature) => (
                    <span key={feature} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                  {vendor.features.length > 2 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      +{vendor.features.length - 2} more
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-orange-400 font-semibold">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {vendor.price.toLocaleString()}
                    {vendor.category === 'Catering' && <span className="text-gray-400 text-sm ml-1">/person</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" icon={Plus}>
                    Add to Plan
                  </Button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Globe className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No vendors found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
            <Button variant="ghost">Clear Filters</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}