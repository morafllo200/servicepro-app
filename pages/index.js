import React, { useState, useEffect } from 'react';
import { Search, Star, Building2, MapPin, Phone } from 'lucide-react';

const businesses = [
  {
    id: 1,
    name: "המסעדה הטובה",
    description: "מסעדה איטלקית מעולה במרכז העיר",
    category: "restaurants",
    address: "רחוב הרצל 123, תל אביב",
    phone: "03-1234567",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "שירותי שיפוצים מהירים", 
    description: "שירותי שיפוצים ותחזוקה 24/7",
    category: "home_services",
    address: "רחוב הנביאים 456, ירושלים",
    phone: "02-9876543",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "סלון יופי דליה",
    description: "טיפולי יופי מקצועיים וחדשניים",
    category: "beauty",
    address: "רחוב דיזנגוף 789, תל אביב", 
    phone: "03-9876543",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="max-w-4xl mx-auto mb-12 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">ServicePro</h1>
        <p className="text-xl text-gray-600">מצא את השירות המושלם עבורך</p>
        
        <div className="relative mt-6">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חפש עסקים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBusinesses.map(business => (
            <div key={business.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <img src={business.image} alt={business.name} className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{business.name}</h2>
                <div className="flex items-center text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(business.rating) ? 'fill-current' : ''}`} />
                  ))}
                  <span className="ml-2 text-gray-600 font-semibold">{business.rating}</span>
                </div>
                <p className="text-gray-700 mb-6">{business.description}</p>
                <div className="border-t pt-4 flex justify-end">
                  <a href__={`tel:${business.phone}`} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors">
                    התקשר
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
