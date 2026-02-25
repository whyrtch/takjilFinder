import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { MosqueStatus } from '../types';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistance, formatDistance, getUserLocation } from '../utils/utils';

// Custom marker icon
const mosqueIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 40px; height: 40px; background: #0f9f59; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 3px solid white;">
        <span style="color: white; font-size: 24px;">🕌</span>
      </div>
      <div style="position: absolute; bottom: -4px; width: 8px; height: 8px; background: white; transform: rotate(45deg);"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const MosqueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mosques, rateMosque, getUserRating } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCopied, setShowCopied] = useState(false);
  const [distance, setDistance] = useState<string | null>(null);

  const mosque = mosques.find((m) => m.id === id);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate distance from user location
  useEffect(() => {
    if (mosque) {
      getUserLocation()
        .then((userLoc) => {
          const dist = calculateDistance(
            userLoc.lat,
            userLoc.lng,
            mosque.location.lat,
            mosque.location.lng
          );
          setDistance(formatDistance(dist));
        })
        .catch((error) => {
          console.log('Could not get user location:', error);
          setDistance(null);
        });
    }
  }, [mosque]);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: mosque?.name || 'TakjilFinder',
          text: `Check out ${mosque?.name} on TakjilFinder`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRating = async (isThumbsUp: boolean) => {
    if (!mosque) return;
    try {
      await rateMosque(mosque.id, isThumbsUp);
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  // Show not found if mosque doesn't exist or is rejected
  if (!mosque || mosque.status === MosqueStatus.REJECTED) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-8 text-center">
        <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">mosque</span>
        <h2 className="text-xl font-bold mb-2">Mosque Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The mosque you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/list')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold"
        >
          Back to List
        </button>
      </div>
    );
  }

  const iftarTime = mosque.iftarTime || '18:20';
  const availablePortions = mosque.portion || Math.floor(Math.random() * 300) + 100;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background-dark">
      {/* Hero Section */}
      <div className="relative h-64 bg-primary">
        <img src={mosque.image} alt={mosque.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-lg"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-white">
            arrow_back
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-6 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-lg active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-white">share</span>
        </button>

        {showCopied && (
          <div className="absolute top-16 right-4 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50">
            Link copied!
          </div>
        )}

        {/* Mosque Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm fill-1">verified</span>
              VERIFIED
            </span>
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold">
              {distance || 'Calculating...'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold mb-1 leading-tight">{mosque.name}</h1>
          <p className="text-sm text-white/90 flex items-center gap-1">
            <span className="material-symbols-outlined text-base">calendar_today</span>
            Ramadan 1447H • Jakarta
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-8 mb-4 relative z-10">
        <div className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-white/5">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                Available Portions
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-primary">restaurant</span>
                {availablePortions === '0' || availablePortions === 0 ? (
                  <span className="text-2xl font-extrabold text-primary">∞</span>
                ) : (
                  <>
                    <span className="text-2xl font-extrabold text-primary">
                      ~{availablePortions}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">PACKS</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-center border-l border-slate-200 dark:border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                Iftar Time
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-accent-gold">schedule</span>
                <span className="text-2xl font-extrabold">{iftarTime}</span>
                <span className="text-xs text-slate-400 font-bold">WIB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-24 space-y-4">
        {/* Today's Iftar Menu */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <span className="text-yellow-500">●</span>
              Today's Iftar Menu
            </h2>
            <span className="text-xs text-slate-400">Updated 5m ago</span>
          </div>
          <div className="space-y-2">
            {mosque.menu.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20"></div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Community Rating */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5">
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <span className="text-yellow-500">●</span>
            Community Rating
          </h2>
          <p className="text-xs text-slate-400 mb-4">Help others by rating this mosque</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRating(true)}
              disabled={getUserRating(mosque.id) !== null}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                getUserRating(mosque.id) === 'up'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 border-2 border-green-500'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-green-50 hover:text-green-600 border-2 border-transparent'
              } disabled:cursor-not-allowed`}
            >
              <span className="material-symbols-outlined text-2xl">thumb_up</span>
              <div className="text-left">
                <div className="text-xs font-medium opacity-60">Helpful</div>
                <div className="text-lg font-bold">{mosque.thumbsUp || 0}</div>
              </div>
            </button>
            <button
              onClick={() => handleRating(false)}
              disabled={getUserRating(mosque.id) !== null}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                getUserRating(mosque.id) === 'down'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 border-2 border-red-500'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-red-50 hover:text-red-600 border-2 border-transparent'
              } disabled:cursor-not-allowed`}
            >
              <span className="material-symbols-outlined text-2xl">thumb_down</span>
              <div className="text-left">
                <div className="text-xs font-medium opacity-60">Not Helpful</div>
                <div className="text-lg font-bold">{mosque.thumbsDown || 0}</div>
              </div>
            </button>
          </div>
          {getUserRating(mosque.id) && (
            <p className="text-xs text-center text-slate-400 mt-3">Thank you for your feedback!</p>
          )}
        </div>

        {/* Location Section */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5">
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <span className="text-yellow-500">●</span>
            Location
          </h2>

          <div className="relative rounded-xl overflow-hidden mb-4" style={{ height: '200px' }}>
            <MapContainer
              center={[mosque.location.lat, mosque.location.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%', zIndex: 20 }}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution=""
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[mosque.location.lat, mosque.location.lng]} icon={mosqueIcon} />
            </MapContainer>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
            <span className="material-symbols-outlined text-slate-400 mt-0.5">location_on</span>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {mosque.address}
            </p>
          </div>
        </div>

        {mosque.notes && (
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5">
            <h2 className="text-base font-bold flex items-center gap-2 mb-3">
              <span className="text-yellow-500">●</span>
              Additional Notes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {mosque.notes}
            </p>
          </div>
        )}
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-background-dark/80 ios-blur border-t border-slate-100 dark:border-white/5 max-w-md mx-auto z-50">
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.location.lat},${mosque.location.lng}`;
            window.open(url, '_blank');
          }}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">directions</span>
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default MosqueDetail;
