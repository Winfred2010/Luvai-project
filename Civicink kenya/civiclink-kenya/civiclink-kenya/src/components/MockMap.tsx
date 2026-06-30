import React, { useState } from 'react';
import { CommunityReport, DevelopmentProject } from '../types';
import { MapPin, Info, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface MockMapProps {
  reports: CommunityReport[];
  projects: DevelopmentProject[];
  onSelectReport: (report: CommunityReport) => void;
  onSelectProject: (project: DevelopmentProject) => void;
  onSelectCoordinates?: (lat: number, lng: number, address: string) => void;
  isSelectingLocation?: boolean;
}

// Major Kenyan Hubs on our coordinates scale
// Map bounding box approximately: Lat: -4.8 to 4.5, Lng: 33.8 to 41.9
const MAP_WIDTH = 600;
const MAP_HEIGHT = 500;

const KENYAN_HUBS = [
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219, x: 220, y: 320 },
  { name: 'Mombasa', lat: -4.0435, lng: 39.6682, x: 430, y: 440 },
  { name: 'Kisumu', lat: -0.1022, lng: 34.7617, x: 70, y: 260 },
  { name: 'Nakuru', lat: -0.3031, lng: 36.0800, x: 160, y: 270 },
  { name: 'Eldoret', lat: 0.5143, lng: 35.2698, x: 110, y: 230 },
  { name: 'Garissa', lat: -0.4532, lng: 39.6461, x: 420, y: 280 },
  { name: 'Nyeri', lat: -0.4215, lng: 36.9510, x: 230, y: 280 },
  { name: 'Machakos', lat: -1.5177, lng: 37.2634, x: 257, y: 323 },
  { name: 'Kitui', lat: -1.3750, lng: 38.0167, x: 312, y: 316 },
  { name: 'Makueni', lat: -1.8041, lng: 37.6291, x: 284, y: 339 },
  { name: 'Wajir', lat: 1.7471, lng: 40.0596, x: 450, y: 170 },
  { name: 'Lodwar', lat: 3.1190, lng: 35.5973, x: 130, y: 100 }
];

// Helper to convert Lat/Lng into map X/Y coordinates
function getXYFromLatLng(lat: number, lng: number) {
  // Approximate projection for Kenya map area
  const minLng = 33.8;
  const maxLng = 41.9;
  const minLat = -4.8;
  const maxLat = 4.5;

  const x = ((lng - minLng) / (maxLng - minLng)) * MAP_WIDTH;
  // Latitudes are negative in south, invert Y-axis
  const y = MAP_HEIGHT - ((lat - minLat) / (maxLat - minLat)) * MAP_HEIGHT;
  
  return { 
    x: Math.max(20, Math.min(MAP_WIDTH - 20, x)), 
    y: Math.max(20, Math.min(MAP_HEIGHT - 20, y)) 
  };
}

export default function MockMap({
  reports,
  projects,
  onSelectReport,
  onSelectProject,
  onSelectCoordinates,
  isSelectingLocation = false
}: MockMapProps) {
  const [filterType, setFilterType] = useState<'all' | 'reports' | 'projects'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<{ name: string; type: string; details: string; x: number; y: number } | null>(null);
  const [tempPin, setTempPin] = useState<{ lat: number; lng: number; x: number; y: number } | null>(null);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isSelectingLocation || !onSelectCoordinates) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert map X/Y back to approximate Lat/Lng
    const minLng = 33.8;
    const maxLng = 41.9;
    const minLat = -4.8;
    const maxLat = 4.5;

    const pctX = clickX / MAP_WIDTH;
    const pctY = (MAP_HEIGHT - clickY) / MAP_HEIGHT;

    const calculatedLng = minLng + pctX * (maxLng - minLng);
    const calculatedLat = minLat + pctY * (maxLat - minLat);

    // Round to 4 decimals for neatness
    const finalLat = parseFloat(calculatedLat.toFixed(4));
    const finalLng = parseFloat(calculatedLng.toFixed(4));

    setTempPin({ lat: finalLat, lng: finalLng, x: clickX, y: clickY });

    // Suggest a county based on nearest city
    let nearestCounty = 'Nairobi';
    let minDist = Infinity;
    KENYAN_HUBS.forEach(hub => {
      const dist = Math.hypot(hub.lat - finalLat, hub.lng - finalLng);
      if (dist < minDist) {
        minDist = dist;
        nearestCounty = hub.name;
      }
    });

    onSelectCoordinates(finalLat, finalLng, `${nearestCounty} County Area, Kenya`);
  };

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'water': return 'fill-blue-500 stroke-white';
      case 'electricity': return 'fill-yellow-500 stroke-white';
      case 'roads': return 'fill-orange-600 stroke-white';
      case 'infrastructure': return 'fill-emerald-600 stroke-white';
      case 'health': return 'fill-red-500 stroke-white';
      default: return 'fill-indigo-500 stroke-white';
    }
  };

  const getProjectMarkerColor = (sector: string) => {
    switch (sector) {
      case 'water': return 'fill-blue-700 stroke-blue-200';
      case 'energy': return 'fill-yellow-600 stroke-yellow-200';
      case 'roads': return 'fill-orange-800 stroke-orange-200';
      default: return 'fill-emerald-800 stroke-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-emerald-600" />
            CivicLink Live GIS Map
          </h3>
          <p className="text-xs text-slate-500">
            {isSelectingLocation 
              ? "🎯 Tap anywhere on the map to pinpoint your challenge location" 
              : "Geospatial coordinate grid mapping across Kenyan counties"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          <button 
            type="button"
            onClick={() => setFilterType('all')} 
            className={`px-2.5 py-1 rounded-md transition-colors ${filterType === 'all' ? 'bg-white text-slate-800 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All
          </button>
          <button 
            type="button"
            onClick={() => setFilterType('reports')} 
            className={`px-2.5 py-1 rounded-md transition-colors ${filterType === 'reports' ? 'bg-white text-slate-800 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Challenges
          </button>
          <button 
            type="button"
            onClick={() => setFilterType('projects')} 
            className={`px-2.5 py-1 rounded-md transition-colors ${filterType === 'projects' ? 'bg-white text-slate-800 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Projects
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative flex-1 bg-slate-50 rounded-xl border border-slate-150 overflow-hidden flex items-center justify-center min-h-[360px]">
        
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

        {/* Kenya Vector Base Map Simulation */}
        <svg 
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} 
          className={`w-full max-w-[600px] h-auto ${isSelectingLocation ? 'cursor-crosshair' : 'cursor-default'} select-none`}
          onClick={handleMapClick}
        >
          {/* Simulated Outline of Kenya (Stylized SVG Polygons/Paths representing Kenyan borders) */}
          <path 
            d="M 120 70 L 190 60 L 290 80 L 370 70 L 450 120 L 490 200 L 430 310 L 440 370 L 410 440 L 390 450 L 320 380 L 230 330 L 150 330 L 100 320 L 60 290 L 70 200 L 90 140 Z" 
            className="fill-emerald-50/40 stroke-slate-200 stroke-[2] transition-colors hover:fill-emerald-50/60"
          />

          {/* Major Lakes (Lake Victoria, Lake Turkana) */}
          {/* Lake Victoria */}
          <circle cx="50" cy="270" r="18" className="fill-blue-100 stroke-blue-200" />
          <text x="35" y="295" className="fill-blue-500 text-[9px] font-medium pointer-events-none">L. Victoria</text>

          {/* Lake Turkana */}
          <ellipse cx="140" cy="110" rx="10" ry="25" className="fill-blue-100 stroke-blue-200 transform -rotate-12" />
          <text x="155" y="110" className="fill-blue-500 text-[9px] font-medium pointer-events-none">L. Turkana</text>

          {/* Major County Hubs (for geographical references) */}
          {KENYAN_HUBS.map(hub => (
            <g key={hub.name} className="opacity-40">
              <circle cx={hub.x} cy={hub.y} r="3" className="fill-slate-400" />
              <text 
                x={hub.x + 6} 
                y={hub.y + 3} 
                className="fill-slate-500 text-[10px] font-medium"
              >
                {hub.name}
              </text>
            </g>
          ))}

          {/* Render Development Projects */}
          {filterType !== 'reports' && projects.map(proj => {
            const { x, y } = getXYFromLatLng(proj.location.lat, proj.location.lng);
            const isHovered = hoveredItem?.name === proj.title;

            return (
              <g 
                key={proj.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProject(proj);
                }}
                onMouseEnter={() => setHoveredItem({
                  name: proj.title,
                  type: 'Development Project',
                  details: `Funded by: ${proj.fundedBy} | Progress: ${proj.progress}%`,
                  x, y
                })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Ring animation for ongoing projects */}
                {proj.status === 'ongoing' && (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isHovered ? "20" : "12"} 
                    className="stroke-blue-500 fill-none opacity-40 animate-ping" 
                  />
                )}
                {/* Octagon shape for projects */}
                <polygon 
                  points={`${x},${y-7} ${x+6},${y-3} ${x+6},${y+3} ${x},${y+7} ${x-6},${y+3} ${x-6},${y-3}`}
                  className={`${getProjectMarkerColor(proj.sector)} stroke-2 shadow-xs group-hover:scale-125 transition-transform`} 
                />
              </g>
            );
          })}

          {/* Render Community Reports */}
          {filterType !== 'projects' && reports.map(rep => {
            const { x, y } = getXYFromLatLng(rep.location.lat, rep.location.lng);
            const isHovered = hoveredItem?.name === rep.title;

            return (
              <g 
                key={rep.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectReport(rep);
                }}
                onMouseEnter={() => setHoveredItem({
                  name: rep.title,
                  type: `Report: ${rep.category.toUpperCase()}`,
                  details: `Status: ${rep.status.replace('_', ' ')} | upvotes: ${rep.likes.length}`,
                  x, y
                })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Pulse wave for reported (urgent) status */}
                {rep.status === 'reported' && (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isHovered ? "16" : "9"} 
                    className="stroke-red-500 fill-none opacity-40 animate-pulse" 
                  />
                )}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? "8" : "5.5"} 
                  className={`${getMarkerColor(rep.category)} stroke-1.5 shadow-sm group-hover:scale-135 transition-transform`} 
                />
              </g>
            );
          })}

          {/* Render Temp User Pin during Location selection */}
          {isSelectingLocation && tempPin && (
            <g>
              <circle cx={tempPin.x} cy={tempPin.y} r="16" className="stroke-emerald-600 fill-none animate-ping opacity-60" />
              <path 
                d="M12 -3 L12 12 M4 4 L20 4" 
                transform={`translate(${tempPin.x - 12}, ${tempPin.y - 12})`} 
                className="stroke-emerald-600 stroke-2" 
              />
              <circle cx={tempPin.x} cy={tempPin.y} r="4" className="fill-emerald-600 stroke-white stroke-2" />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay inside SVG Frame */}
        {hoveredItem && (
          <div 
            className="absolute z-10 bg-slate-900/95 text-white text-xs rounded-lg p-2.5 shadow-md border border-slate-800 max-w-[200px] pointer-events-none transition-all duration-150"
            style={{
              left: Math.min(MAP_WIDTH - 210, Math.max(10, hoveredItem.x - 100)),
              top: Math.min(MAP_HEIGHT - 90, Math.max(10, hoveredItem.y - 85))
            }}
          >
            <div className="font-semibold text-emerald-400 mb-0.5 flex items-center gap-1 justify-between">
              <span>{hoveredItem.type}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </div>
            <div className="font-medium text-slate-100 line-clamp-1 mb-1">{hoveredItem.name}</div>
            <div className="text-[10px] text-slate-400 leading-tight">{hoveredItem.details}</div>
          </div>
        )}

        {/* Floating Controls/Legend overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200/80 shadow-xs text-[11px] text-slate-600 max-w-[220px] pointer-events-none space-y-1.5">
          <div className="font-semibold text-slate-800 text-xs pb-1 border-b border-slate-100">GIS Legend</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block border border-white"></span>
              <span>Water</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block border border-white"></span>
              <span>Electricity</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block border border-white"></span>
              <span>Roads</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block border border-white"></span>
              <span>Buildings</span>
            </div>
            <div className="col-span-2 flex items-center gap-1 border-t border-slate-100 pt-1 mt-1">
              <span className="w-2.5 h-2.5 polygon rotate-45 bg-blue-700 inline-block border border-white"></span>
              <span className="font-medium text-slate-700">Project (Octagon)</span>
            </div>
          </div>
        </div>

        {isSelectingLocation && (
          <div className="absolute top-3 left-3 right-3 bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-medium text-center shadow-md animate-bounce">
            📍 TAP WATER OR LAND TO RE-CENTER THE GPS MARKER
          </div>
        )}
      </div>

      {isSelectingLocation && tempPin && (
        <div className="mt-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-3 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-semibold">Selected Location:</span> Lat: {tempPin.lat}, Lng: {tempPin.lng}
            <div className="text-[10px] text-emerald-700">Approx: Westlands Area, Nairobi</div>
          </div>
        </div>
      )}
    </div>
  );
}
