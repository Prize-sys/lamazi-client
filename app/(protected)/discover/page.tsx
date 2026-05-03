'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Loader } from '@googlemaps/js-api-loader';
import { Search, MapPin, Star, Crown, Medal, Award, Filter, AlertCircle } from 'lucide-react';

interface NearbyTherapist {
  id: string;
  full_name: string;
  avatar_url?: string;
  specialties: string[];
  rating: number;
  review_count: number;
  price_per_session: number;
  distance_km?: string;
  membership_tier: 'Gold' | 'Silver' | 'Bronze';
  latitude: number;
  longitude: number;
  city?: string;
}

const SPECIALTIES = ['All', 'Anxiety', 'Trauma', 'Couples', 'Teen Support', 'Depression', 'OCD', 'PTSD'];
const TIERS = ['All', 'Gold', 'Silver', 'Bronze'];
const RADII = [10, 25, 50, 100];

function getTierIcon(tier: string) {
  if (tier === 'Gold') return <Crown className="w-3.5 h-3.5 text-yellow-600" />;
  if (tier === 'Silver') return <Medal className="w-3.5 h-3.5 text-gray-500" />;
  return <Award className="w-3.5 h-3.5 text-orange-600" />;
}

function getTierBadgeClass(tier: string) {
  if (tier === 'Gold') return 'bg-yellow-100 text-yellow-800';
  if (tier === 'Silver') return 'bg-gray-100 text-gray-800';
  return 'bg-orange-100 text-orange-800';
}

function getTierMarkerColor(tier: string) {
  if (tier === 'Gold') return '#F59E0B';
  if (tier === 'Silver') return '#9CA3AF';
  return '#F97316';
}

export default function DiscoverPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [therapists, setTherapists] = useState<NearbyTherapist[]>([]);
  const [filtered, setFiltered] = useState<NearbyTherapist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(25);
  const [specialty, setSpecialty] = useState('All');
  const [tier, setTier] = useState('All');
  const [currentLocation] = useState({ lat: -1.2921, lng: 36.8219 }); // Nairobi default

  // Init Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    const loader = new Loader({ apiKey, version: 'weekly' });

    loader.load().then(() => {
      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center: currentLocation,
        zoom: 12,
        styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      mapInstanceRef.current = map;

      // Current location marker (blue)
      new google.maps.Marker({
        position: currentLocation,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#2563EB',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
        title: 'Your location',
      });

      loadTherapists(map);
    }).catch(() => {
      setError('Failed to load Google Maps. Check your API key.');
    });
  }, []);

  const loadTherapists = useCallback(async (map?: google.maps.Map) => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        lat: String(currentLocation.lat),
        lng: String(currentLocation.lng),
        radius: String(radius),
      });
      if (specialty !== 'All') params.set('specialty', specialty);
      if (tier !== 'All') params.set('tier', tier.toLowerCase());

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/therapists/nearby?${params}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('lamazi_token')}` } }
      );
      if (!res.ok) throw new Error('Failed to fetch therapists');
      const data = await res.json();
      const list: NearbyTherapist[] = data.nearby || [];
      setTherapists(list);
      setFiltered(list);
      updateMarkers(list, map || mapInstanceRef.current);
    } catch (e: any) {
      setError(e.message || 'Failed to load therapists');
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation, radius, specialty, tier]);

  const updateMarkers = (list: NearbyTherapist[], map: google.maps.Map | null) => {
    if (!map) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    list.forEach(t => {
      if (!t.latitude || !t.longitude) return;
      const marker = new google.maps.Marker({
        position: { lat: t.latitude, lng: t.longitude },
        map,
        title: t.full_name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: getTierMarkerColor(t.membership_tier),
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });
      marker.addListener('click', () => {
        document.getElementById(`therapist-${t.id}`)?.scrollIntoView({ behavior: 'smooth' });
      });
      markersRef.current.push(marker);
    });

    // Draw radius circle
    new google.maps.Circle({
      map,
      center: currentLocation,
      radius: radius * 1000,
      strokeColor: '#2563EB',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: '#2563EB',
      fillOpacity: 0.05,
    });
  };

  // Re-filter client-side on specialty/tier change (fast UX)
  useEffect(() => {
    let result = [...therapists];
    if (specialty !== 'All') {
      result = result.filter(t =>
        t.specialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }
    if (tier !== 'All') {
      result = result.filter(t => t.membership_tier === tier);
    }
    setFiltered(result);
    updateMarkers(result, mapInstanceRef.current);
  }, [specialty, tier, therapists]);

  // Reload on radius change
  useEffect(() => {
    if (mapInstanceRef.current) loadTherapists(mapInstanceRef.current);
  }, [radius]);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
      {/* MAP */}
      <div className="flex-1 relative">
        {/* Search Bar overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 space-y-2">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-gray-700 text-sm">Nairobi, Kenya</span>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-900 outline-none text-sm font-medium"
            >
              {RADII.map(r => (
                <option key={r} value={r}>{r} km</option>
              ))}
            </select>
          </div>

          {/* Specialty filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${
                  specialty === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tier legend */}
        <div className="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-xl border border-gray-200 p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Tier</p>
          {[
            { label: 'Gold', color: 'bg-yellow-400' },
            { label: 'Silver', color: 'bg-gray-400' },
            { label: 'Bronze', color: 'bg-orange-400' },
            { label: 'You', color: 'bg-blue-600' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-xs text-gray-700">{label}</span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Count badge */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <span className="text-sm font-medium text-gray-900">
            {filtered.length} therapist{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}
      </div>

      {/* THERAPIST LIST SIDEBAR */}
      <div className="w-96 bg-gray-900 overflow-y-auto flex-shrink-0">
        {/* Tier filter */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-2">
            {TIERS.map(t => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tier === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-white">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-400">Loading therapists...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No therapists found in this area</p>
              <p className="text-xs mt-1 text-gray-500">Try increasing the search radius</p>
            </div>
          ) : (
            filtered.map(t => (
              <Link
                key={t.id}
                id={`therapist-${t.id}`}
                href={`/therapist/${t.id}`}
                className="block bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-blue-500"
              >
                <div className="flex gap-3">
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt={t.full_name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {t.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-medium text-sm truncate">{t.full_name}</h3>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getTierBadgeClass(t.membership_tier)}`}>
                        {getTierIcon(t.membership_tier)}
                        {t.membership_tier}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2 truncate">
                      {t.specialties?.slice(0, 2).join(' · ') || 'General'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-300 text-xs">{t.rating}</span>
                        <span className="text-gray-500 text-xs">({t.review_count})</span>
                      </div>
                      {t.distance_km && (
                        <span className="text-gray-400 text-xs">{t.distance_km} km</span>
                      )}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <span className="text-white font-semibold text-sm">
                        KES {t.price_per_session?.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-xs"> /session</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
