
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Mosque, MosqueStatus } from '../types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  popupAnchor: [0, -40]
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
  popupAnchor: [0, -40]
});

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
  iconAnchor: [10, 10]
});

// Component to update map center
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const HomeMap: React.FC = () => {
  const navigate = useNavigate();
  const { mosques } = useApp();
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
          setMapCenter(newCenter);
          setUserLocation(newCenter);
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

  const verifiedMosques = mosques.filter(m => m.status === MosqueStatus.VERIFIED);

  // Default center (Jakarta)
  const defaultCenter: [number, number] = [-6.2088, 106.8456];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution=''
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater center={mapCenter} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={userLocationIcon}
          />
        )}
        
        {/* Markers for verified mosques */}
        {verifiedMosques.map(mosque => (
          <Marker
            key={mosque.id}
            position={[mosque.location.lat, mosque.location.lng]}
            icon={selectedMosque?.id === mosque.id ? selectedMosqueIcon : mosqueIcon}
            eventHandlers={{
              click: () => setSelectedMosque(mosque)
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
            <span className="text-sm text-slate-400">Find nearby mosques...</span>
          </div>
          <button
            onClick={handleMyLocation}
            className="bg-white dark:bg-background-dark p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </div>

      {/* Bottom Sheet Card */}
      {selectedMosque && (
        <div className="absolute bottom-0 left-0 right-0 px-4 z-[1000] animate-in slide-in-from-bottom duration-300 pointer-events-none pb-20">
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
                <span className="material-symbols-outlined text-primary text-3xl">mosque</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold leading-tight">{selectedMosque.name}</h3>
                  <span className="material-symbols-outlined text-accent-gold text-lg fill-1">verified</span>
                </div>
                <p className="text-slate-500 text-xs flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {selectedMosque.address}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMosque.menu.map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-md border border-primary/10">
                      {item}
                    </span>
                  ))}
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
