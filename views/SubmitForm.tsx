
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon for location picker
const pickerIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 40px; height: 40px; background: #0f9f59; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 3px solid white; animation: pulse 2s infinite;">
        <span style="color: white; font-size: 24px;">📍</span>
      </div>
      <div style="position: absolute; bottom: -4px; width: 8px; height: 8px; background: white; transform: rotate(45deg);"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

interface LocationPickerProps {
  position: [number, number];
  onLocationChange: (lat: number, lng: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ position, onLocationChange }) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={position} icon={pickerIcon} />;
};

const SubmitForm: React.FC = () => {
  const navigate = useNavigate();
  const { addMosque } = useApp();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [menu, setMenu] = useState(['']);
  const [notes, setNotes] = useState('');
  const [portion, setPortion] = useState('0');
  const [iftarTime, setIftarTime] = useState('18:20');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [location, setLocation] = useState<[number, number]>([-6.2088, 106.8456]); // Default Jakarta

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation([lat, lng]);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
          setShowMapPicker(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please select manually on the map.');
          setShowMapPicker(true);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setShowMapPicker(true);
    }
  };

  const handleAddMenuItem = () => setMenu([...menu, '']);
  const handleRemoveMenuItem = (index: number) => setMenu(menu.filter((_, i) => i !== index));
  const handleMenuChange = (index: number, val: string) => {
    const newMenu = [...menu];
    newMenu[index] = val;
    setMenu(newMenu);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;
    
    setIsSubmitting(true);
    try {
      await addMosque({
        name,
        address,
        location: { lat: location[0], lng: location[1] },
        menu: menu.filter(m => m.trim() !== ''),
        notes,
        portion: portion || '0',
        iftarTime: iftarTime || undefined
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting mosque:', error);
      alert('Failed to submit mosque. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-8 text-center geometric-pattern">
        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce">
          <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Submission Successful!</h2>
        <p className="text-slate-500 text-sm mb-8">
          Thank you for contributing! Your submission is currently being reviewed by our team.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-xs bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 ios-blur border-b border-slate-100 dark:border-white/5 px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold tracking-tight">Submit New Mosque</h1>
        <p className="text-xs text-slate-400 mt-1">Help the community find iftar by sharing details.</p>
      </header>

      <main className="p-4 flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold block">Mosque Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Al-Markaz Al-Islami"
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Location Picker</label>
              {!showMapPicker ? (
                <div className="space-y-2">
                  <div 
                    onClick={() => setShowMapPicker(true)}
                    className="relative h-32 rounded-xl bg-slate-100 dark:bg-white/10 overflow-hidden group cursor-pointer border border-dashed border-slate-300 dark:border-white/20 hover:border-primary transition-colors"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-3xl mb-1">my_location</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Tap to Pin on Map</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="w-full bg-primary/10 text-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">gps_fixed</span>
                    Use My Current Location
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border-2 border-primary" style={{ height: '256px' }}>
                    <MapContainer
                      center={location}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                      zoomControl={true}
                    >
                      <TileLayer
                        attribution=''
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                      />
                      <LocationPicker position={location} onLocationChange={handleLocationChange} />
                    </MapContainer>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">gps_fixed</span>
                      My Location
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(false)}
                      className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-bold"
                    >
                      Confirm Location
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    📍 Lat: {location[0].toFixed(6)}, Lng: {location[1].toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Street Address</label>
              <textarea 
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full address details..."
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 resize-none"
              ></textarea>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold block">Takjil / Menu Items</label>
                <button 
                  type="button"
                  onClick={handleAddMenuItem}
                  className="bg-primary/10 text-primary p-1 rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <div className="space-y-2">
                {menu.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={item}
                      onChange={(e) => handleMenuChange(idx, e.target.value)}
                      placeholder="e.g., Dates, Mineral Water"
                      className="flex-1 bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary/20"
                    />
                    {menu.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveMenuItem(idx)}
                        className="text-slate-400"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Notes (Optional)</label>
              <input 
                type="text" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific info (e.g., every Friday only)"
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Available Portions (Optional)</label>
              <input 
                type="text" 
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="e.g., 200"
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-slate-400">Approximate number of portions available</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Iftar Time (Optional)</label>
              <input 
                type="time" 
                value={iftarTime}
                onChange={(e) => setIftarTime(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-slate-400">Time when iftar is served</p>
            </div>
          </div>

          <div className="pt-2">
            <button 
              disabled={isSubmitting}
              type="submit"
              className={`w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'shadow-primary/20'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Mosque'}
              {!isSubmitting && <span className="material-symbols-outlined text-xl">send</span>}
            </button>
            
            <div className="mt-6 flex flex-col items-center gap-2 px-4 opacity-50">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Submission Pending Review</span>
              </div>
              <p className="text-[10px] text-center leading-relaxed">
                To maintain data quality, all new submissions are verified by the TakjilFinder team before appearing on the map.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitForm;
