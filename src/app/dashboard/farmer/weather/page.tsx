'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  CloudSun,
  Search,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Navigation,
  Loader2,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WeatherForecastPage() {
  const langCtx = useLanguage();
  const t = langCtx ? langCtx.t : (k: string) => k;
  const { user } = useAuth();

  const [city, setCity] = useState('Colombo');
  const [searchQuery, setSearchQuery] = useState('Colombo');
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  const fetchWeather = async (targetCity: string) => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '47ad32d93de6480e64413263006';
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(targetCity)}&days=7&aqi=no`
      );
      if (!res.ok) {
        throw new Error('City not found or API error');
      }
      const data = await res.json();
      setWeatherData(data);
      setCity(data.location.name);
      setSearchQuery(data.location.name);
    } catch (err: any) {
      console.error(err);
      toast.error('Could not fetch weather data. Please try another city.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.address) {
      fetchWeather(user.address);
    } else if (user && user.location) {
      fetchWeather(user.location);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          fetchWeather(coords);
        },
        (error) => {
          console.log('Geolocation error, falling back to default Colombo:', error);
          fetchWeather('Colombo');
        }
      );
    } else {
      fetchWeather('Colombo');
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
    }
  };

  // Dynamic tip generator
  const getDynamicTip = (current: any) => {
    if (!current) return 'Optimizing field conditions...';

    const humidity = current.humidity;
    const wind = current.wind_kph;
    const textLower = current.condition.text.toLowerCase();
    const isRaining = textLower.includes('rain') || textLower.includes('drizzle') || textLower.includes('shower');
    const temp = current.temp_c;

    if (isRaining) {
      return '🌧️ Rain Alert: Avoid irrigation, check drainage paths, and delay any chemical sprays to prevent runoff.';
    }
    if (humidity > 85) {
      return '💧 High Humidity Alert: Increased risk of fungal diseases. Inspect leaves for powdery mildew and improve airflow.';
    }
    if (wind > 20) {
      return '💨 High Wind Alert: Postpone pesticide spraying to avoid drift, and secure delicate nursery plants.';
    }
    if (temp > 32) {
      return '☀️ Heat Alert: High temp. Irrigate crops in early morning or evening hours to reduce water evaporation loss.';
    }
    return '🌱 Weather conditions are optimal. Ideal time for planting, weeding, and compost application.';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Top Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#e4e6df] rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e4d1e] tracking-tight">
            {t('menu.weather') || 'Weather Forecast'}
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Real-time weather insights & 7-day planning for your fields
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search city (e.g. Kandy, Jaffna)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f0] border-2 border-[#e4e6df] focus:border-[#1e4d1e] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-[#1e4d1e] hover:bg-[#163d16] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#1e4d1e] animate-spin" />
          <p className="text-sm font-bold text-gray-400">Fetching latest weather advisories...</p>
        </div>
      ) : weatherData ? (
        <div className="space-y-8">
          
          {/* Main Grid: Current Weather & Agri Tip */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Current Weather Card */}
            <div className="lg:col-span-2 bg-white border border-[#e4e6df] rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[250px]">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 bg-[#edf4e2] text-[#4a6d2f] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#d2dfc2] w-fit">
                    <Navigation className="w-3 h-3 fill-current rotate-45" /> {city}, {weatherData.location.country}
                  </span>
                  <h3 className="text-4xl font-extrabold text-gray-900 pt-3">
                    {weatherData.current.temp_c}°C
                  </h3>
                  <p className="text-sm font-bold text-[#4a6d2f]">
                    {weatherData.current.condition.text}
                  </p>
                </div>
                <img
                  src={`https:${weatherData.current.condition.icon}`}
                  alt={weatherData.current.condition.text}
                  className="w-20 h-20 object-contain"
                />
              </div>

              {/* Weather parameters */}
              <div className="grid grid-cols-3 gap-4 border-t border-[#f4f5f0] pt-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#edf4e2] rounded-xl text-[#1e4d1e]">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Humidity</span>
                    <span className="text-sm font-extrabold text-gray-800">{weatherData.current.humidity}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Wind</span>
                    <span className="text-sm font-extrabold text-gray-800">{weatherData.current.wind_kph} km/h</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">UV Index</span>
                    <span className="text-sm font-extrabold text-gray-800">{weatherData.current.uv}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Advisor Panel */}
            <div className="bg-[#edf4e2] border border-[#d2dfc2] rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e4d1e]">
                  <Compass className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">Agricultural Advisory</h4>
                </div>
                <p className="text-xs leading-relaxed text-[#355220] font-medium">
                  {getDynamicTip(weatherData.current)}
                </p>
              </div>

              <div className="mt-6 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Updated just now
              </div>
            </div>

          </div>

          {/* 7-Day Forecast Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">7-Day Forecast</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {weatherData.forecast.forecastday.map((dayData: any) => {
                const date = new Date(dayData.date);
                const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
                const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                return (
                  <div
                    key={dayData.date}
                    className="bg-white border border-[#e4e6df] rounded-2xl p-4 flex flex-col items-center justify-between text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <span className="block text-xs font-extrabold text-gray-900">{dayName}</span>
                      <span className="block text-[10px] font-semibold text-gray-400 mt-0.5">{formattedDate}</span>
                    </div>

                    <img
                      src={`https:${dayData.day.condition.icon}`}
                      alt={dayData.day.condition.text}
                      className="w-12 h-12 object-contain my-3"
                    />

                    <div>
                      <div className="flex items-center justify-center gap-1.5 text-xs">
                        <span className="font-extrabold text-gray-900">{Math.round(dayData.day.maxtemp_c)}°</span>
                        <span className="font-bold text-gray-400">{Math.round(dayData.day.mintemp_c)}°</span>
                      </div>
                      <span className="block text-[9px] font-extrabold text-[#4a6d2f] mt-1.5 uppercase tracking-wider truncate max-w-[100px]">
                        {dayData.day.condition.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Failed to Load Weather Information</h4>
            <p className="text-xs mt-1">Please check your internet connection or verify the configured API key.</p>
          </div>
        </div>
      )}

    </div>
  );
}
