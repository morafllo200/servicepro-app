import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Business } from "@/entities/Business";
import { Promotion } from "@/entities/Promotion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight, Star, Building2, Sparkles, Search, MapPin, Phone, Clock,
  Shield, ChevronRight, TrendingUp, Users, Award, Utensils, Wrench,
  Scissors, Car, ShoppingBag, Dumbbell, Heart, ExternalLink, Rocket
} from "lucide-react";

// Hero Section Component
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Los Angeles, CA");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = createPageUrl(`Directory?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div data-filename="pages/ExportFiles" data-linenumber="600" data-visual-selector-id="pages/ExportFiles600" className="relative bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div data-filename="pages/ExportFiles" data-linenumber="601" data-visual-selector-id="pages/ExportFiles601" className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] opacity-5 bg-cover bg-center bg-fixed"></div>
      <div data-filename="pages/ExportFiles" data-linenumber="602" data-visual-selector-id="pages/ExportFiles602" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div data-filename="pages/ExportFiles" data-linenumber="603" data-visual-selector-id="pages/ExportFiles603" className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Find the <span data-filename="pages/ExportFiles" data-linenumber="605" data-visual-selector-id="pages/ExportFiles605" className="text-red-600">Best Local Services</span>
            <br data-filename="pages/ExportFiles" data-linenumber="606" data-visual-selector-id="pages/ExportFiles606" className="hidden sm:block" />Near You
          </h1>
          <p data-filename="pages/ExportFiles" data-linenumber="608" data-visual-selector-id="pages/ExportFiles608" className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover top-rated professionals for all your needs. From emergency repairs to beauty treatments, we connect you with trusted local experts.
          </p>

          {/* Enhanced Search Bar */}
          <div data-filename="pages/ExportFiles" data-linenumber="613" data-visual-selector-id="pages/ExportFiles613" className="max-w-3xl mx-auto mb-8 sm:mb-12">
            <div data-filename="pages/ExportFiles" data-linenumber="614" data-visual-selector-id="pages/ExportFiles614" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
              <div data-filename="pages/ExportFiles" data-linenumber="615" data-visual-selector-id="pages/ExportFiles615" className="flex flex-col sm:flex-row gap-2">
                <div data-filename="pages/ExportFiles" data-linenumber="616" data-visual-selector-id="pages/ExportFiles616" className="flex-1 relative">
                  <Search data-filename="pages/ExportFiles" data-linenumber="617" data-visual-selector-id="pages/ExportFiles617" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 sm:h-14 text-base sm:text-lg border-0 focus:ring-0 bg-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div data-filename="pages/ExportFiles" data-linenumber="627" data-visual-selector-id="pages/ExportFiles627" className="flex-1 relative">
                  <MapPin data-filename="pages/ExportFiles" data-linenumber="628" data-visual-selector-id="pages/ExportFiles628" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-12 h-12 sm:h-14 text-base sm:text-lg border-0 border-l border-gray-200 focus:ring-0 bg-transparent rounded-l-none"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 sm:h-14 px-6 sm:px-8 bg-red-500 hover:bg-red-600 text-white text-base sm:text-lg font-semibold rounded-xl"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div data-filename="pages/ExportFiles" data-linenumber="647" data-visual-selector-id="pages/ExportFiles647" className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            {[
              { text: "Emergency Plumber", icon: "🚨", category: "home_services" },
              { text: "Hair Salon", icon: "💇‍♀️", category: "beauty_wellness" },
              { text: "Auto Repair", icon: "🔧", category: "automotive" },
              { text: "Restaurant", icon: "🍕", category: "restaurants" }
            ].map((item, index) => (
              <Link
                key={index}
                to={createPageUrl(`Directory?category=${item.category}`)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 text-sm sm:text-base hover:scale-105"
              >
                <span data-filename="pages/ExportFiles" data-linenumber="659" data-visual-selector-id="pages/ExportFiles659" className="text-base sm:text-lg">{item.icon}</span>
                <span data-filename="pages/ExportFiles" data-linenumber="660" data-visual-selector-id="pages/ExportFiles660" className="font-medium text-gray-700 whitespace-nowrap">{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Categories Section
function CategoriesSection() {
  const categories = [
    { name: "Restaurants", icon: Utensils, count: "2,847", color: "from-red-500 to-red-600", link: "restaurants" },
    { name: "Home Services", icon: Wrench, count: "1,923", color: "from-blue-500 to-blue-600", link: "home_services" },
    { name: "Beauty & Spa", icon: Scissors, count: "1,456", color: "from-pink-500 to-pink-600", link: "beauty_wellness" },
    { name: "Auto Services", icon: Car, count: "892", color: "from-gray-500 to-gray-600", link: "automotive" },
    { name: "Shopping", icon: ShoppingBag, count: "1,234", color: "from-purple-500 to-purple-600", link: "retail_shopping" },
    { name: "Fitness", icon: Dumbbell, count: "567", color: "from-green-500 to-green-600", link: "fitness" },
  ];

  return (
    <section data-filename="pages/ExportFiles" data-linenumber="682" data-visual-selector-id="pages/ExportFiles682" className="py-12 sm:py-16 bg-white">
      <div data-filename="pages/ExportFiles" data-linenumber="683" data-visual-selector-id="pages/ExportFiles683" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-filename="pages/ExportFiles" data-linenumber="684" data-visual-selector-id="pages/ExportFiles684" className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p data-filename="pages/ExportFiles" data-linenumber="686" data-visual-selector-id="pages/ExportFiles686" className="text-base sm:text-lg text-gray-600">Find exactly what you're looking for</p>
        </div>

        <div data-filename="pages/ExportFiles" data-linenumber="689" data-visual-selector-id="pages/ExportFiles689" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={createPageUrl(`Directory?category=${category.link}`)}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div data-filename="pages/ExportFiles" data-linenumber="696" data-visual-selector-id="pages/ExportFiles696" className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div data-filename="pages/ExportFiles" data-linenumber="697" data-visual-selector-id="pages/ExportFiles697" className="relative p-4 sm:p-6 lg:p-8 text-center">
                <div data-filename="pages/ExportFiles" data-linenumber="698" data-visual-selector-id="pages/ExportFiles698" className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                  <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{category.name}</h3>
                <p data-filename="pages/ExportFiles" data-linenumber="702" data-visual-selector-id="pages/ExportFiles702" className="text-xs sm:text-sm text-gray-600">{category.count} businesses</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Businesses Component
function FeaturedBusinesses({ businesses }) {
  if (!businesses || businesses.length === 0) return null;

  return (
    <section data-filename="pages/ExportFiles" data-linenumber="717" data-visual-selector-id="pages/ExportFiles717" className="py-12 sm:py-16 bg-gray-50">
      <div data-filename="pages/ExportFiles" data-linenumber="718" data-visual-selector-id="pages/ExportFiles718" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-filename="pages/ExportFiles" data-linenumber="719" data-visual-selector-id="pages/ExportFiles719" className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12">
          <div data-filename="pages/ExportFiles" data-linenumber="720" data-visual-selector-id="pages/ExportFiles720">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Featured & Promoted Businesses</h2>
            <p data-filename="pages/ExportFiles" data-linenumber="722" data-visual-selector-id="pages/ExportFiles722" className="text-base sm:text-lg text-gray-600">Top-rated and promoted services in your area</p>
          </div>
          <Link data-filename="pages/ExportFiles" data-linenumber="724" data-visual-selector-id="pages/ExportFiles724" to={createPageUrl("Directory")} className="flex items-center text-red-600 hover:text-red-700 font-semibold mt-4 sm:mt-0 transition-colors">
            See all <ChevronRight data-filename="pages/ExportFiles" data-linenumber="725" data-visual-selector-id="pages/ExportFiles725" className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div data-filename="pages/ExportFiles" data-linenumber="729" data-visual-selector-id="pages/ExportFiles729" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {businesses.map((business, index) => (
            <Link
              key={business.id}
              to={createPageUrl(`Business?id=${business.id}`)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div data-filename="pages/ExportFiles" data-linenumber="736" data-visual-selector-id="pages/ExportFiles736" className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={business.image_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"}
                  alt={business.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div data-filename="pages/ExportFiles" data-linenumber="743" data-visual-selector-id="pages/ExportFiles743" className="absolute top-4 left-4 flex flex-col gap-2">
                  {business.is_promoted && (
                    <Badge data-filename="pages/ExportFiles" data-linenumber="745" data-visual-selector-id="pages/ExportFiles745" className="bg-teal-500 text-white font-semibold flex items-center gap-1 shadow-md">
                      <Rocket data-filename="pages/ExportFiles" data-linenumber="746" data-visual-selector-id="pages/ExportFiles746" className="w-3 h-3" />Promoted
                    </Badge>
                  )}
                  {business.featured && (
                    <Badge data-filename="pages/ExportFiles" data-linenumber="750" data-visual-selector-id="pages/ExportFiles750" className="bg-red-500 text-white font-semibold shadow-md">Featured</Badge>
                  )}
                </div>
                <div data-filename="pages/ExportFiles" data-linenumber="753" data-visual-selector-id="pages/ExportFiles753" className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <Heart data-filename="pages/ExportFiles" data-linenumber="754" data-visual-selector-id="pages/ExportFiles754" className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                </div>
              </div>

              <div data-filename="pages/ExportFiles" data-linenumber="758" data-visual-selector-id="pages/ExportFiles758" className="p-4 sm:p-6">
                <div data-filename="pages/ExportFiles" data-linenumber="759" data-visual-selector-id="pages/ExportFiles759" className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-red-600 transition-colors truncate">
                    {business.name}
                  </h3>
                  <div data-filename="pages/ExportFiles" data-linenumber="763" data-visual-selector-id="pages/ExportFiles763" className="flex items-center space-x-1 flex-shrink-0">
                    <Star data-filename="pages/ExportFiles" data-linenumber="764" data-visual-selector-id="pages/ExportFiles764" className="w-4 h-4 text-yellow-400 fill-current" />
                    <span data-filename="pages/ExportFiles" data-linenumber="765" data-visual-selector-id="pages/ExportFiles765" className="text-sm font-semibold text-gray-900">{business.rating || '5.0'}</span>
                  </div>
                </div>

                <p data-filename="pages/ExportFiles" data-linenumber="769" data-visual-selector-id="pages/ExportFiles769" className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                  {business.description || "Professional service provider"}
                </p>

                <div data-filename="pages/ExportFiles" data-linenumber="773" data-visual-selector-id="pages/ExportFiles773" className="flex items-center justify-between">
                  <Badge data-filename="pages/ExportFiles" data-linenumber="774" data-visual-selector-id="pages/ExportFiles774" variant="outline" className="text-xs">
                    {business.category?.replace(/_/g, ' ')}
                  </Badge>
                  <span data-filename="pages/ExportFiles" data-linenumber="777" data-visual-selector-id="pages/ExportFiles777" className="text-sm text-gray-500">{business.price_range || '$$'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { number: "50,000+", label: "Verified Businesses", icon: Building2 },
    { number: "2M+", label: "Happy Customers", icon: Users },
    { number: "4.8/5", label: "Average Rating", icon: Star },
    { number: "24/7", label: "Customer Support", icon: Shield },
  ];

  return (
    <section data-filename="pages/ExportFiles" data-linenumber="798" data-visual-selector-id="pages/ExportFiles798" className="py-12 sm:py-16 bg-red-600">
      <div data-filename="pages/ExportFiles" data-linenumber="799" data-visual-selector-id="pages/ExportFiles799" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-filename="pages/ExportFiles" data-linenumber="800" data-visual-selector-id="pages/ExportFiles800" className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Trusted by Thousands</h2>
          <p data-filename="pages/ExportFiles" data-linenumber="802" data-visual-selector-id="pages/ExportFiles802" className="text-red-100 text-base sm:text-lg">Join the community that's revolutionizing local services</p>
        </div>

        <div data-filename="pages/ExportFiles" data-linenumber="805" data-visual-selector-id="pages/ExportFiles805" className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div data-filename="pages/ExportFiles" data-linenumber="807" data-visual-selector-id="pages/ExportFiles807" key={index} className="text-center">
              <div data-filename="pages/ExportFiles" data-linenumber="808" data-visual-selector-id="pages/ExportFiles808" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div data-filename="pages/ExportFiles" data-linenumber="811" data-visual-selector-id="pages/ExportFiles811" className="text-2xl sm:text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div data-filename="pages/ExportFiles" data-linenumber="812" data-visual-selector-id="pages/ExportFiles812" className="text-red-100 text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Home Component
export default function Home() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadData = async () => {
      try {
        // Get all verified businesses
        const allBusinesses = await Business.filter({ verified: true }, '-rating');
        
        // Filter for featured OR promoted businesses
        const specialBusinesses = allBusinesses.filter(business => 
          business.featured === true || business.is_promoted === true
        );
        
        // Sort them: promoted first, then featured, then by rating
        specialBusinesses.sort((a, b) => {
          // Promoted businesses first
          if (a.is_promoted && !b.is_promoted) return -1;
          if (!a.is_promoted && b.is_promoted) return 1;
          
          // Then featured businesses
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          // Finally by rating
          return (b.rating || 0) - (a.rating || 0);
        });
        
        // Take first 8 businesses
        setFeaturedBusinesses(specialBusinesses.slice(0, 8));
      } catch (error) {
        console.error("Error loading homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div data-filename="pages/ExportFiles" data-linenumber="867" data-visual-selector-id="pages/ExportFiles867" className="min-h-screen">
      <HeroSection data-filename="pages/ExportFiles" data-linenumber="868" data-visual-selector-id="pages/ExportFiles868" />
      <CategoriesSection data-filename="pages/ExportFiles" data-linenumber="869" data-visual-selector-id="pages/ExportFiles869" />
      <FeaturedBusinesses data-filename="pages/ExportFiles" data-linenumber="870" data-visual-selector-id="pages/ExportFiles870" businesses={featuredBusinesses} />
      <StatsSection data-filename="pages/ExportFiles" data-linenumber="871" data-visual-selector-id="pages/ExportFiles871" />
    </div>
  );
}
