import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Branch, Language } from '../types';
import { Scissors } from 'lucide-react';

interface InteractiveMapProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelectBranch: (branch: Branch) => void;
  language: Language;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  branches,
  selectedBranch,
  onSelectBranch,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Tashkent (Buyuk Ipak Yoli district)
    const initialLat = selectedBranch ? selectedBranch.lat : 41.332;
    const initialLng = selectedBranch ? selectedBranch.lng : 69.336;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Create markers for each branch
    branches.forEach((branch) => {
      const isSelected = selectedBranch?.id === branch.id;
      const branchName = language === 'ru' ? branch.nameRu : branch.nameUz;

      const markerHtml = `
        <div class="relative cursor-pointer group transform transition-transform duration-300 ${
          isSelected ? 'scale-125 z-30' : 'hover:scale-110'
        }">
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full ${
              isSelected ? 'bg-purple-500/40 animate-ping' : 'bg-purple-500/20'
            }"></span>
            <div class="w-8 h-8 rounded-2xl ${
              isSelected
                ? 'bg-gradient-to-tr from-purple-600 to-fuchsia-500 ring-2 ring-white shadow-lg shadow-purple-600/60'
                : 'bg-[#18181D] border-2 border-purple-500 shadow-md'
            } flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
              </svg>
            </div>
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-[#09090B]/90 border border-purple-500/30 text-[10px] font-bold text-white shadow-md pointer-events-none">
            ${branchName.replace('Филиал ', '').replace('«', '').replace('»', '')}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([branch.lat, branch.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectBranch(branch);
      });

      markersRef.current[branch.id] = marker;
    });

    return () => {
      // Keep map cached
    };
  }, [branches, language]);

  // When selectedBranch changes, pan to it smoothly
  useEffect(() => {
    if (mapInstanceRef.current && selectedBranch) {
      mapInstanceRef.current.flyTo([selectedBranch.lat, selectedBranch.lng], 14, {
        duration: 1.2,
      });
    }
  }, [selectedBranch]);

  return (
    <div className="relative w-full h-[240px] sm:h-[280px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl bg-[#09090B]">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Overlay Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#09090B]/85 backdrop-blur-md border border-purple-500/30 text-xs font-bold text-white shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3 филиала в Ташкенте</span>
      </div>
    </div>
  );
};
