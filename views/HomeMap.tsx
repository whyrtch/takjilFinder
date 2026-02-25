import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Mosque, MosqueStatus } from '../types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon for mosques
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
  popupAnchor: [0, -40],
});

// Custom marker icon for other locations (restaurants, community centers, etc.)
const takjilIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 40px; height: 40px; background: #0f9f59; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 3px solid white;">
        <span style="color: white; font-size: 24px;">🍽️</span>
      </div>
      <div style="position: absolute; bottom: -4px; width: 8px; height: 8px; background: white; transform: rotate(45deg);"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const selectedMosqueIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 40px; height: 40px; background: #FFD700; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 3px solid white;">
        <span style="color: white; font-size: 24px;">🕌</span>
      </div>
      <div style="position: absolute; bottom: -4px; width: 8px; height: 8px; background: white; transform: rotate(45deg);"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const selectedTakjilIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 40px; height: 40px; background: #FFD700; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 3px solid white;">
        <span style="color: white; font-size: 24px;">🍽️</span>
      </div>
      <div style="position: absolute; bottom: -4px; width: 8px; height: 8px; background: white; transform: rotate(45deg);"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Helper function to check if location is a mosque
const isMosqueLocation = (name: string): boolean => {
  const lowerName = name.toLowerCase();
  return (
    lowerName.includes('masjid') || lowerName.includes('mushola') || lowerName.includes('musholla')
  );
};

// Helper function to get the appropriate icon
const getMarkerIcon = (mosque: Mosque, isSelected: boolean): L.DivIcon => {
  const isMosque = isMosqueLocation(mosque.name || '');
  if (isSelected) {
    return isMosque ? selectedMosqueIcon : selectedTakjilIcon;
  }
  return isMosque ? mosqueIcon : takjilIcon;
};

// User location marker icon
const userLocationIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); border: 3px solid white;">
      </div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to update map center
const MapUpdater: React.FC<{ center: [number, number]; shouldCenter: boolean }> = ({
  center,
  shouldCenter,
}) => {
  const map = useMap();

  React.useEffect(() => {
    if (shouldCenter) {
      // Small delay to ensure map is fully loaded
      setTimeout(() => {
        map.flyTo(center, 16, {
          duration: 1.5,
        });
      }, 100);
    }
  }, [center, shouldCenter, map]);

  return null;
};

const HomeMap: React.FC = () => {
  const navigate = useNavigate();
  const { mosques, loading, rateMosque, getUserRating } = useApp();
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [shouldCenterMap, setShouldCenterMap] = useState(false);

  const handleRating = async (mosqueId: string, isThumbsUp: boolean) => {
    try {
      await rateMosque(mosqueId, isThumbsUp);
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
          setMapCenter(newCenter);
          setUserLocation(newCenter);
          setShouldCenterMap(true);
          setTimeout(() => setShouldCenterMap(false), 2000);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Silently fail on first load, don't show alert
        }
      );
    }
  };

  const handleMyLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
          setMapCenter(newCenter);
          setUserLocation(newCenter);
          setShouldCenterMap(true);
          setTimeout(() => setShouldCenterMap(false), 2000);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Automatically get user location on component mount
  useEffect(() => {
    handleMyLocation();
  }, []);

  const displayMosques = mosques.filter((m) => m.status !== MosqueStatus.REJECTED);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ height: '100vh' }}>
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          minZoom={3}
        />
        <MapUpdater center={mapCenter} shouldCenter={shouldCenterMap} />

        {/* User location marker */}
        {userLocation && <Marker position={userLocation} icon={userLocationIcon} />}

        {/* Markers for all mosques (excluding rejected) */}
        {displayMosques.map((mosque) => (
          <Marker
            key={mosque.id}
            position={[mosque.location.lat, mosque.location.lng]}
            icon={getMarkerIcon(mosque, selectedMosque?.id === mosque.id)}
            eventHandlers={{
              click: () => setSelectedMosque(mosque),
            }}
          />
        ))}
      </MapContainer>

      {/* Top Search Bar Overlay */}
      <div className="absolute top-6 left-0 right-0 px-4 z-[1000] pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <div
            onClick={() => navigate('/list')}
            className="flex-1 bg-white dark:bg-background-dark shadow-xl rounded-2xl flex items-center px-4 py-3 border border-slate-100 dark:border-white/10 cursor-pointer hover:border-primary/30 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
            <span className="text-sm text-slate-400">Find nearby free takjil...</span>
          </div>
          <button
            onClick={handleMyLocationClick}
            className="bg-white dark:bg-background-dark p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </div>

      {/* Bottom Sheet Card */}
      {selectedMosque && (
        <div className="absolute bottom-0 left-0 right-0 px-4 z-[400] animate-in slide-in-from-bottom duration-300 pointer-events-none pb-20">
          <div className="bg-white dark:bg-background-dark rounded-3xl p-5 shadow-2xl border border-primary/10 relative overflow-hidden pointer-events-auto">
            {/* Handle for visual aesthetic */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-200 dark:bg-white/10 rounded-full"></div>

            <button
              onClick={() => setSelectedMosque(null)}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-start gap-3 mt-2">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-3xl">
                  {isMosqueLocation(selectedMosque.name || '') ? 'mosque' : 'restaurant'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold leading-tight">{selectedMosque.name}</h3>
                  <span className="material-symbols-outlined text-accent-gold text-lg fill-1">
                    verified
                  </span>
                </div>
                <p className="text-slate-500 text-xs flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {selectedMosque.address}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMosque.menu.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-md border border-primary/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Rating Section */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => handleRating(selectedMosque.id, true)}
                    disabled={getUserRating(selectedMosque.id) !== null}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      getUserRating(selectedMosque.id) === 'up'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-green-50 hover:text-green-600'
                    } disabled:cursor-not-allowed`}
                  >
                    <span className="material-symbols-outlined text-base">thumb_up</span>
                    <span className="text-xs font-bold">{selectedMosque.thumbsUp || 0}</span>
                  </button>
                  <button
                    onClick={() => handleRating(selectedMosque.id, false)}
                    disabled={getUserRating(selectedMosque.id) !== null}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      getUserRating(selectedMosque.id) === 'down'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-red-50 hover:text-red-600'
                    } disabled:cursor-not-allowed`}
                  >
                    <span className="material-symbols-outlined text-base">thumb_down</span>
                    <span className="text-xs font-bold">{selectedMosque.thumbsDown || 0}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/mosque/${selectedMosque.id}`)}
                    className="flex-1 bg-primary/10 text-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined">info</span>
                    Details
                  </button>
                  <button
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedMosque.location.lat},${selectedMosque.location.lng}`;
                      window.open(url, '_blank');
                    }}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined">directions</span>
                    Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeMap;
