import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from '@/entities/User';
import { Business } from '@/entities/Business';
import { Notification } from '@/entities/Notification';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, MapPin, User as UserIcon, LogOut, Bell,
  Menu, X, ChevronDown, Star, Utensils, Wrench,
  Scissors, Car, Briefcase, ShoppingBag, Dumbbell,
  Coffee, Camera, Heart, Home, Info, Tag, Building2, Rocket, Folder
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import PWAInstaller from './components/PWAInstaller';
import PWAConfig from './components/PWAConfig';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userHasBusiness, setUserHasBusiness] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkUserAndBusiness = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);
        if (user) {
          const userBusinesses = await Business.filter({ owner_id: user.id });
          setUserHasBusiness(userBusinesses.length > 0);

          // Load notifications
          const userNotifications = await Notification.filter({ user_id: user.id });
          const globalNotifications = await Notification.filter({ user_id: null });
          
          const allNotifications = [...userNotifications, ...globalNotifications]
            .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
            .slice(0, 5); // Show only latest 5 notifications
          
          setNotifications(allNotifications);
          
          const unreadNotifications = userNotifications.filter(n => !n.is_read);
          setUnreadCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error("Error checking user or business:", error);
        setCurrentUser(null);
        setUserHasBusiness(false);
        setUnreadCount(0);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserAndBusiness();
  }, [location.pathname]);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Add manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Add meta tags for PWA
    const metaTags = [
      { name: 'theme-color', content: '#ef4444' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'ServicePro' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Cleanup function
    return () => {
      if (document.head.contains(manifestLink)) {
        document.head.removeChild(manifestLink);
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(createPageUrl(`Directory?search=${encodeURIComponent(searchQuery)}`));
    }
  };

  const handleLogin = async () => {
    try {
      await User.login();
      const user = await User.me();
      setCurrentUser(user);
      if (user) {
        const userBusinesses = await Business.filter({ owner_id: user.id });
        setUserHasBusiness(userBusinesses.length > 0);
        const unreadNotifications = await Notification.filter({ user_id: user.id, is_read: false });
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await User.logout();
    setCurrentUser(null);
    setUserHasBusiness(false);
    setUnreadCount(0);
    setNotifications([]);
    navigate(createPageUrl('Home'));
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read && notification.user_id) {
      try {
        await Notification.update(notification.id, { is_read: true });
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
    if (notification.link) {
      navigate(createPageUrl(notification.link));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'system_message': return <Info data-filename="pages/ExportFiles" data-linenumber="218" data-visual-selector-id="pages/ExportFiles218" className="w-4 h-4 text-blue-500" />;
      case 'promotion': return <Tag data-filename="pages/ExportFiles" data-linenumber="219" data-visual-selector-id="pages/ExportFiles219" className="w-4 h-4 text-purple-500" />;
      case 'business_approved': return <Building2 className="w-4 h-4 text-green-500" />;
      case 'review': return <Star data-filename="pages/ExportFiles" data-linenumber="221" data-visual-selector-id="pages/ExportFiles221" className="w-4 h-4 text-yellow-500" />;
      default: return <Bell data-filename="pages/ExportFiles" data-linenumber="222" data-visual-selector-id="pages/ExportFiles222" className="w-4 h-4 text-gray-500" />;
    }
  };

  const categories = [
    { name: "Restaurants", icon: Utensils, link: "Directory?category=restaurants", color: "text-red-600" },
    { name: "Home Services", icon: Wrench, link: "Directory?category=home_services", color: "text-blue-600" },
    { name: "Beauty & Spa", icon: Scissors, link: "Directory?category=beauty_wellness", color: "text-pink-600" },
    { name: "Auto Services", icon: Car, link: "Directory?category=automotive", color: "text-gray-600" },
    { name: "Shopping", icon: ShoppingBag, link: "Directory?category=retail_shopping", color: "text-purple-600" },
    { name: "Fitness", icon: Dumbbell, link: "Directory?category=fitness", color: "text-green-600" },
  ];

  return (
    <div data-filename="pages/ExportFiles" data-linenumber="236" data-visual-selector-id="pages/ExportFiles236" className="min-h-screen bg-white">
      {/* PWA Configuration */}
      <PWAConfig data-filename="pages/ExportFiles" data-linenumber="238" data-visual-selector-id="pages/ExportFiles238" />

      <header data-filename="pages/ExportFiles" data-linenumber="240" data-visual-selector-id="pages/ExportFiles240" className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div data-filename="pages/ExportFiles" data-linenumber="241" data-visual-selector-id="pages/ExportFiles241" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div data-filename="pages/ExportFiles" data-linenumber="243" data-visual-selector-id="pages/ExportFiles243" className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div data-filename="pages/ExportFiles" data-linenumber="245" data-visual-selector-id="pages/ExportFiles245" className="flex items-center flex-shrink-0">
              <Link data-filename="pages/ExportFiles" data-linenumber="246" data-visual-selector-id="pages/ExportFiles246" to={createPageUrl("Home")} className="flex items-center">
                <div data-filename="pages/ExportFiles" data-linenumber="247" data-visual-selector-id="pages/ExportFiles247" className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg mr-3 flex-shrink-0">
                  <span data-filename="pages/ExportFiles" data-linenumber="248" data-visual-selector-id="pages/ExportFiles248" className="text-white font-bold text-lg">S</span>
                </div>
                <div data-filename="pages/ExportFiles" data-linenumber="250" data-visual-selector-id="pages/ExportFiles250" className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">ServicePro</h1>
                  <p data-filename="pages/ExportFiles" data-linenumber="252" data-visual-selector-id="pages/ExportFiles252" className="text-xs text-gray-500 -mt-1">Find Local Services</p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Center */}
            <div data-filename="pages/ExportFiles" data-linenumber="258" data-visual-selector-id="pages/ExportFiles258" className="flex-1 max-w-2xl mx-6 hidden md:block">
              <form data-filename="pages/ExportFiles" data-linenumber="259" data-visual-selector-id="pages/ExportFiles259" onSubmit={handleSearch} className="relative">
                <div data-filename="pages/ExportFiles" data-linenumber="260" data-visual-selector-id="pages/ExportFiles260" className="flex">
                  <div data-filename="pages/ExportFiles" data-linenumber="261" data-visual-selector-id="pages/ExportFiles261" className="relative flex-1">
                    <Search data-filename="pages/ExportFiles" data-linenumber="262" data-visual-selector-id="pages/ExportFiles262" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search for restaurants, plumbers, salons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 h-12 text-base border-2 border-gray-200 rounded-l-xl focus:border-red-500 focus:ring-0"
                    />
                  </div>
                  <div data-filename="pages/ExportFiles" data-linenumber="271" data-visual-selector-id="pages/ExportFiles271" className="relative flex-shrink-0">
                    <Input
                      type="text"
                      placeholder="Los Angeles, CA"
                      className="w-48 h-12 text-base border-2 border-l-0 border-gray-200 rounded-none focus:border-red-500 focus:ring-0"
                    />
                    <MapPin data-filename="pages/ExportFiles" data-linenumber="277" data-visual-selector-id="pages/ExportFiles277" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 px-8 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-r-xl border-2 border-red-500 flex-shrink-0"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Actions */}
            <div data-filename="pages/ExportFiles" data-linenumber="290" data-visual-selector-id="pages/ExportFiles290" className="flex items-center space-x-4 flex-shrink-0">
              {!isLoading && (
                <>
                  <Link data-filename="pages/ExportFiles" data-linenumber="293" data-visual-selector-id="pages/ExportFiles293" to={createPageUrl("ExportFiles")} className="hidden lg:block">
                    <Button data-filename="pages/ExportFiles" data-linenumber="294" data-visual-selector-id="pages/ExportFiles294" variant="outline" className="font-semibold border-blue-400 text-blue-800 bg-blue-50 hover:bg-blue-100">
                       <Folder data-filename="pages/ExportFiles" data-linenumber="295" data-visual-selector-id="pages/ExportFiles295" className="w-4 h-4 mr-2" /> ייצוא קבצים
                    </Button>
                  </Link>

                  {/* Business Signup */}
                  {!userHasBusiness && (
                    <Link data-filename="pages/ExportFiles" data-linenumber="301" data-visual-selector-id="pages/ExportFiles301" to={createPageUrl("BusinessRegistration")} className="hidden lg:block">
                      <Button data-filename="pages/ExportFiles" data-linenumber="302" data-visual-selector-id="pages/ExportFiles302" variant="outline" className="font-semibold border-gray-300 text-gray-700 hover:bg-gray-50">
                        For Businesses
                      </Button>
                    </Link>
                  )}

                  {/* Notifications Dropdown */}
                  {currentUser && (
                    <DropdownMenu data-filename="pages/ExportFiles" data-linenumber="310" data-visual-selector-id="pages/ExportFiles310">
                      <DropdownMenuTrigger data-filename="pages/ExportFiles" data-linenumber="311" data-visual-selector-id="pages/ExportFiles311" asChild>
                        <Button data-filename="pages/ExportFiles" data-linenumber="312" data-visual-selector-id="pages/ExportFiles312" variant="ghost" size="icon" className="relative">
                          <Bell data-filename="pages/ExportFiles" data-linenumber="313" data-visual-selector-id="pages/ExportFiles313" className="w-5 h-5 text-gray-600" />
                          {unreadCount > 0 && (
                            <span data-filename="pages/ExportFiles" data-linenumber="315" data-visual-selector-id="pages/ExportFiles315" className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                              {unreadCount}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent data-filename="pages/ExportFiles" data-linenumber="321" data-visual-selector-id="pages/ExportFiles321" align="end" className="w-80 max-h-96 overflow-y-auto">
                        <DropdownMenuLabel data-filename="pages/ExportFiles" data-linenumber="322" data-visual-selector-id="pages/ExportFiles322" className="flex items-center justify-between">
                          <span data-filename="pages/ExportFiles" data-linenumber="323" data-visual-selector-id="pages/ExportFiles323">Notifications</span>
                          <Link data-filename="pages/ExportFiles" data-linenumber="324" data-visual-selector-id="pages/ExportFiles324" to={createPageUrl('Notifications')} className="text-xs text-blue-600 hover:underline">
                            View All
                          </Link>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator data-filename="pages/ExportFiles" data-linenumber="328" data-visual-selector-id="pages/ExportFiles328" />
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <DropdownMenuItem
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-3 cursor-pointer hover:bg-gray-50 ${!notification.is_read && notification.user_id ? 'bg-blue-50' : ''}`}
                            >
                              <div data-filename="pages/ExportFiles" data-linenumber="336" data-visual-selector-id="pages/ExportFiles336" className="flex items-start gap-3 w-full">
                                <div data-filename="pages/ExportFiles" data-linenumber="337" data-visual-selector-id="pages/ExportFiles337" className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div data-filename="pages/ExportFiles" data-linenumber="340" data-visual-selector-id="pages/ExportFiles340" className="flex-1 min-w-0">
                                  <div data-filename="pages/ExportFiles" data-linenumber="341" data-visual-selector-id="pages/ExportFiles341" className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                                      {notification.title}
                                    </h4>
                                    {!notification.is_read && notification.user_id && (
                                      <div data-filename="pages/ExportFiles" data-linenumber="346" data-visual-selector-id="pages/ExportFiles346" className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                                    )}
                                  </div>
                                  <p data-filename="pages/ExportFiles" data-linenumber="349" data-visual-selector-id="pages/ExportFiles349" className="text-xs text-gray-600 line-clamp-2 mb-1">
                                    {notification.message}
                                  </p>
                                  <p data-filename="pages/ExportFiles" data-linenumber="352" data-visual-selector-id="pages/ExportFiles352" className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem data-filename="pages/ExportFiles" data-linenumber="360" data-visual-selector-id="pages/ExportFiles360" disabled className="p-6 text-center">
                            <div data-filename="pages/ExportFiles" data-linenumber="361" data-visual-selector-id="pages/ExportFiles361" className="flex flex-col items-center">
                              <Bell data-filename="pages/ExportFiles" data-linenumber="362" data-visual-selector-id="pages/ExportFiles362" className="w-8 h-8 text-gray-300 mb-2" />
                              <span data-filename="pages/ExportFiles" data-linenumber="363" data-visual-selector-id="pages/ExportFiles363" className="text-sm text-gray-500">No notifications yet</span>
                            </div>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* User Menu */}
                  {currentUser ? (
                    <DropdownMenu data-filename="pages/ExportFiles" data-linenumber="373" data-visual-selector-id="pages/ExportFiles373">
                      <DropdownMenuTrigger data-filename="pages/ExportFiles" data-linenumber="374" data-visual-selector-id="pages/ExportFiles374" asChild>
                        <Button data-filename="pages/ExportFiles" data-linenumber="375" data-visual-selector-id="pages/ExportFiles375" variant="ghost" className="flex items-center space-x-2 p-2">
                          <Avatar data-filename="pages/ExportFiles" data-linenumber="376" data-visual-selector-id="pages/ExportFiles376" className="w-8 h-8">
                            <AvatarImage data-filename="pages/ExportFiles" data-linenumber="377" data-visual-selector-id="pages/ExportFiles377" src={currentUser.avatar_url} />
                            <AvatarFallback data-filename="pages/ExportFiles" data-linenumber="378" data-visual-selector-id="pages/ExportFiles378" className="bg-red-500 text-white text-sm">
                              {currentUser.full_name?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <ChevronDown data-filename="pages/ExportFiles" data-linenumber="382" data-visual-selector-id="pages/ExportFiles382" className="w-4 h-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent data-filename="pages/ExportFiles" data-linenumber="385" data-visual-selector-id="pages/ExportFiles385" align="end" className="w-56">
                        <DropdownMenuLabel data-filename="pages/ExportFiles" data-linenumber="386" data-visual-selector-id="pages/ExportFiles386">
                          <div data-filename="pages/ExportFiles" data-linenumber="387" data-visual-selector-id="pages/ExportFiles387" className="flex flex-col space-y-1">
                            <p data-filename="pages/ExportFiles" data-linenumber="388" data-visual-selector-id="pages/ExportFiles388" className="text-sm font-medium">{currentUser.full_name || 'User'}</p>
                            <p data-filename="pages/ExportFiles" data-linenumber="389" data-visual-selector-id="pages/ExportFiles389" className="text-xs text-gray-500">{currentUser.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator data-filename="pages/ExportFiles" data-linenumber="392" data-visual-selector-id="pages/ExportFiles392" />
                        <DropdownMenuItem data-filename="pages/ExportFiles" data-linenumber="393" data-visual-selector-id="pages/ExportFiles393" asChild>
                          <Link data-filename="pages/ExportFiles" data-linenumber="394" data-visual-selector-id="pages/ExportFiles394" to={createPageUrl("Profile")} className="flex items-center">
                            <UserIcon data-filename="pages/ExportFiles" data-linenumber="395" data-visual-selector-id="pages/ExportFiles395" className="w-4 h-4 mr-2" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        {userHasBusiness && (
                          <DropdownMenuItem data-filename="pages/ExportFiles" data-linenumber="400" data-visual-selector-id="pages/ExportFiles400" asChild>
                            <Link data-filename="pages/ExportFiles" data-linenumber="401" data-visual-selector-id="pages/ExportFiles401" to={createPageUrl("MyBusinessDashboard")} className="flex items-center">
                              <Briefcase data-filename="pages/ExportFiles" data-linenumber="402" data-visual-selector-id="pages/ExportFiles402" className="w-4 h-4 mr-2" />
                              My Business
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {currentUser.role === 'admin' && (
                          <DropdownMenuItem data-filename="pages/ExportFiles" data-linenumber="408" data-visual-selector-id="pages/ExportFiles408" asChild>
                            <Link data-filename="pages/ExportFiles" data-linenumber="409" data-visual-selector-id="pages/ExportFiles409" to={createPageUrl("AdminDashboard")} className="flex items-center">
                              <Briefcase data-filename="pages/ExportFiles" data-linenumber="410" data-visual-selector-id="pages/ExportFiles410" className="w-4 h-4 mr-2" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator data-filename="pages/ExportFiles" data-linenumber="415" data-visual-selector-id="pages/ExportFiles415" />
                        <DropdownMenuItem data-filename="pages/ExportFiles" data-linenumber="416" data-visual-selector-id="pages/ExportFiles416" onClick={handleLogout} className="text-red-600">
                          <LogOut data-filename="pages/ExportFiles" data-linenumber="417" data-visual-selector-id="pages/ExportFiles417" className="w-4 h-4 mr-2" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div data-filename="pages/ExportFiles" data-linenumber="423" data-visual-selector-id="pages/ExportFiles423" className="flex items-center space-x-2">
                      <Button data-filename="pages/ExportFiles" data-linenumber="424" data-visual-selector-id="pages/ExportFiles424" onClick={handleLogin} variant="outline" className="font-semibold">
                        Log In
                      </Button>
                      <Button data-filename="pages/ExportFiles" data-linenumber="427" data-visual-selector-id="pages/ExportFiles427" onClick={handleLogin} className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                        Sign Up
                      </Button>
                    </div>
                  )}

                  {/* Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X data-filename="pages/ExportFiles" data-linenumber="440" data-visual-selector-id="pages/ExportFiles440" className="w-5 h-5" /> : <Menu data-filename='pages/ExportFiles' data-linenumber='440' data-visual-selector-id='pages/ExportFiles440' className="w-5 h-5" />}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div data-filename="pages/ExportFiles" data-linenumber="448" data-visual-selector-id="pages/ExportFiles448" className="md:hidden pb-4">
            <form data-filename="pages/ExportFiles" data-linenumber="449" data-visual-selector-id="pages/ExportFiles449" onSubmit={handleSearch}>
              <div data-filename="pages/ExportFiles" data-linenumber="450" data-visual-selector-id="pages/ExportFiles450" className="relative">
                <Search data-filename="pages/ExportFiles" data-linenumber="451" data-visual-selector-id="pages/ExportFiles451" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-gray-200 rounded-lg"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div data-filename="pages/ExportFiles" data-linenumber="465" data-visual-selector-id="pages/ExportFiles465" className="bg-gray-50 border-t border-gray-200">
          <div data-filename="pages/ExportFiles" data-linenumber="466" data-visual-selector-id="pages/ExportFiles466" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-filename="pages/ExportFiles" data-linenumber="467" data-visual-selector-id="pages/ExportFiles467" className="flex items-center justify-between h-14">
              <div data-filename="pages/ExportFiles" data-linenumber="468" data-visual-selector-id="pages/ExportFiles468" className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={createPageUrl(category.link)}
                    className="flex items-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 flex-shrink-0 whitespace-nowrap"
                  >
                    <category.icon className={`w-4 h-4 ${category.color} flex-shrink-0`} />
                    <span data-filename="pages/ExportFiles" data-linenumber="476" data-visual-selector-id="pages/ExportFiles476">{category.name}</span>
                  </Link>
                ))}
              </div>
              <Link
                to={createPageUrl("Directory")}
                className="flex items-center space-x-2 text-sm font-semibold text-red-600 hover:text-red-700 flex-shrink-0 whitespace-nowrap ml-4"
              >
                <span data-filename="pages/ExportFiles" data-linenumber="484" data-visual-selector-id="pages/ExportFiles484">See All</span>
                <ChevronDown data-filename="pages/ExportFiles" data-linenumber="485" data-visual-selector-id="pages/ExportFiles485" className="w-4 h-4 rotate-[-90deg]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div data-filename="pages/ExportFiles" data-linenumber="493" data-visual-selector-id="pages/ExportFiles493" className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
            <div data-filename="pages/ExportFiles" data-linenumber="494" data-visual-selector-id="pages/ExportFiles494" className="px-4 py-6 space-y-4 max-h-96 overflow-y-auto">
              <Link
                to={createPageUrl("ExportFiles")}
                className="flex items-center space-x-3 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Folder data-filename="pages/ExportFiles" data-linenumber="500" data-visual-selector-id="pages/ExportFiles500" className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span data-filename="pages/ExportFiles" data-linenumber="501" data-visual-selector-id="pages/ExportFiles501" className="font-medium text-gray-900">ייצוא קבצים</span>
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={createPageUrl(category.link)}
                  className="flex items-center space-x-3 py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <category.icon className={`w-5 h-5 ${category.color} flex-shrink-0`} />
                  <span data-filename="pages/ExportFiles" data-linenumber="511" data-visual-selector-id="pages/ExportFiles511" className="font-medium text-gray-900">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main data-filename="pages/ExportFiles" data-linenumber="519" data-visual-selector-id="pages/ExportFiles519" className="flex-1">
        {children}
      </main>

      {/* PWA Install Prompt */}
      <PWAInstaller data-filename="pages/ExportFiles" data-linenumber="524" data-visual-selector-id="pages/ExportFiles524" />

      <footer data-filename="pages/ExportFiles" data-linenumber="526" data-visual-selector-id="pages/ExportFiles526" className="bg-gray-100 border-t border-gray-200 mt-16">
        <div data-filename="pages/ExportFiles" data-linenumber="527" data-visual-selector-id="pages/ExportFiles527" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div data-filename="pages/ExportFiles" data-linenumber="528" data-visual-selector-id="pages/ExportFiles528" className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div data-filename="pages/ExportFiles" data-linenumber="529" data-visual-selector-id="pages/ExportFiles529">
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <ul data-filename="pages/ExportFiles" data-linenumber="531" data-visual-selector-id="pages/ExportFiles531" className="space-y-2 text-sm text-gray-600">
                <li data-filename="pages/ExportFiles" data-linenumber="532" data-visual-selector-id="pages/ExportFiles532"><Link data-filename="pages/ExportFiles" data-linenumber="532" data-visual-selector-id="pages/ExportFiles532" to="#" className="hover:text-red-600 transition-colors">About ServicePro</Link></li>
                <li data-filename="pages/ExportFiles" data-linenumber="533" data-visual-selector-id="pages/ExportFiles533"><Link data-filename="pages/ExportFiles" data-linenumber="533" data-visual-selector-id="pages/ExportFiles533" to="#" className="hover:text-red-600 transition-colors">Careers</Link></li>
                <li data-filename="pages/ExportFiles" data-linenumber="534" data-visual-selector-id="pages/ExportFiles534"><Link data-filename="pages/ExportFiles" data-linenumber="534" data-visual-selector-id="pages/ExportFiles534" to="#" className="hover:text-red-600 transition-colors">Press</Link></li>
              </ul>
            </div>
            <div data-filename="pages/ExportFiles" data-linenumber="537" data-visual-selector-id="pages/ExportFiles537">
              <h3 className="font-semibold text-gray-900 mb-4">Discover</h3>
              <ul data-filename="pages/ExportFiles" data-linenumber="539" data-visual-selector-id="pages/ExportFiles539" className="space-y-2 text-sm text-gray-600">
                <li data-filename="pages/ExportFiles" data-linenumber="540" data-visual-selector-id="pages/ExportFiles540"><Link data-filename="pages/ExportFiles" data-linenumber="540" data-visual-selector-id="pages/ExportFiles540" to={createPageUrl("Directory")} className="hover:text-red-600 transition-colors">Browse Businesses</Link></li>
                <li data-filename="pages/ExportFiles" data-linenumber="541" data-visual-selector-id="pages/ExportFiles541"><Link data-filename="pages/ExportFiles" data-linenumber="541" data-visual-selector-id="pages/ExportFiles541" to={createPageUrl("Promotions")} className="hover:text-red-600 transition-colors">Special Offers</Link></li>
                <li data-filename="pages/ExportFiles" data-linenumber="542" data-visual-selector-id="pages/ExportFiles542"><Link data-filename="pages/ExportFiles" data-linenumber="542" data-visual-selector-id="pages/ExportFiles542" to="#" className="hover:text-red-600 transition-colors">Write a Review</Link></li>
              </ul>
            </div>
            <div data-filename="pages/ExportFiles" data-linenumber="545" data-visual-selector-id="pages/ExportFiles545">
              <h3 className="font-semibold text-gray-900 mb-4">Business Owners</h3>
              <ul data-filename="pages/ExportFiles" data-linenumber="547" data-visual-selector-id="pages/ExportFiles547" className="space-y-2 text-sm text-gray-600">
                <li data-filename="pages/ExportFiles" data-linenumber="548" data-visual-selector-id="pages/ExportFiles548"><Link data-filename="pages/ExportFiles" data-linenumber="548" data-visual-selector-id="pages/ExportFiles548" to={createPageUrl("BusinessRegistration")} className="hover:text-red-600 transition-colors">Add Your Business</Link></li>
                <li data-filename="pages/ExportFiles" data-linenumber="549" data-visual-selector-id="pages/ExportFiles549"><Link data-filename="pages/ExportFiles" data-linenumber="549" data-visual-selector-id="pages/ExportFiles549" to="#" className="hover:text-red-600 transition-colors">Business Support</Link></li>
                <li data-filename="pages/ExportFiles" data-linenumber="550" data-visual-selector-id="pages/ExportFiles550"><Link data-filename="pages/ExportFiles" data-linenumber="550" data-visual-selector-id="pages/ExportFiles550" to="#" className="hover:text-red-600 transition-colors">Advertise</Link></li>
              </ul>
            </div>
            <div data-filename="pages/ExportFiles" data-linenumber="553" data-visual-selector-id="pages/ExportFiles553">
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul data-filename="pages/ExportFiles" data-linenumber="555" data-visual-selector-id="pages/ExportFiles555" className="space-y-2 text-sm text-gray-600">
                <li data-filename="pages/ExportFiles" data-linenumber="556" data-visual-selector-id="pages/ExportFiles556"><Link data-filename="pages/ExportFiles" data-linenumber="556" data-visual-selector-id="pages/ExportFiles556" to="#" className="hover:text-red-600 transition-colors">Contact</Link></li>
                <li data-filename="pages/ExportFiles" data-linenumber="557" data-visual-selector-id="pages/ExportFiles557"><Link data-filename="pages/ExportFiles" data-linenumber="557" data-visual-selector-id="pages/ExportFiles557" to="#" className="hover:text-red-600 transition-colors">FAQ</Link></li>
                <li data-filename="pages/ExportFiles" data-linenumber="558" data-visual-selector-id="pages/ExportFiles558"><Link data-filename="pages/ExportFiles" data-linenumber="558" data-visual-selector-id="pages/ExportFiles558" to="#" className="hover:text-red-600 transition-colors">Safety</Link></li>
              </ul>
            </div>
          </div>
          <div data-filename="pages/ExportFiles" data-linenumber="562" data-visual-selector-id="pages/ExportFiles562" className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p data-filename="pages/ExportFiles" data-linenumber="563" data-visual-selector-id="pages/ExportFiles563" className="text-sm text-gray-500">© 2024 ServicePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
