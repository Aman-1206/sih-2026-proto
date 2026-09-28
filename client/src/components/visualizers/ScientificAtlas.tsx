import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Radio, MapPin, Database, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

interface AtlasLayerData {
  stations?: { type: string; features: any[] };
  expeditionRoutes?: { type: string; features: any[] };
  expeditionMilestones?: { type: string; features: any[] };
  datasets?: { type: string; features: any[] };
  media?: { type: string; features: any[] };
}

interface ScientificAtlasProps {
  layersData?: AtlasLayerData;
  height?: string;
  selectedStationSlug?: string;
}

const DEFAULT_STATIONS = [
  { properties: { id: 's1', type: 'station', slug: 'bharati-station', name: 'Bharati Station', code: 'BHT-AQ', region: 'East Antarctica (Larsemann Hills)', temperatureC: -18.6, status: 'ACTIVE' }, geometry: { coordinates: [76.1873, -69.4072] } },
  { properties: { id: 's2', type: 'station', slug: 'maitri-station', name: 'Maitri Station', code: 'MTR-AQ', region: 'Schirmacher Oasis, Antarctica', temperatureC: -21.3, status: 'ACTIVE' }, geometry: { coordinates: [11.7333, -70.7667] } },
  { properties: { id: 's3', type: 'station', slug: 'himadri-station', name: 'Himadri Station', code: 'HMD-AR', region: 'Svalbard Arctic (Ny-Ålesund)', temperatureC: -6.4, status: 'ACTIVE' }, geometry: { coordinates: [11.9225, 78.9272] } },
  { properties: { id: 's4', type: 'station', slug: 'himansh-observatory', name: 'Himansh Observatory', code: 'HMS-HM', region: 'Himalayas (Spiti Valley)', temperatureC: -2.1, status: 'ACTIVE' }, geometry: { coordinates: [77.6189, 32.4042] } },
];

const DEFAULT_DATASETS = [
  { properties: { id: 'd1', type: 'dataset', slug: 'larsemann-hills-boundary-met-2024', title: 'Bharati Boundary Met Telemetry', region: 'East Antarctica', doi: '10.5281/oruvia.2024.08912' }, geometry: { coordinates: [76.18, -69.4] } },
  { properties: { id: 'd2', type: 'dataset', slug: 'kongsfjorden-marine-ctd-transect-2024', title: 'Kongsfjorden CTD Ocean Profiles', region: 'Svalbard', doi: '10.5281/oruvia.2024.01149' }, geometry: { coordinates: [11.92, 78.92] } },
  { properties: { id: 'd3', type: 'dataset', slug: 'chandra-basin-glacier-ablation-dgps', title: 'Chandra Basin DGPS Mass Balance', region: 'Himalayas', doi: '10.5281/oruvia.2024.07721' }, geometry: { coordinates: [77.61, 32.40] } },
  { properties: { id: 'd4', type: 'dataset', slug: 'southern-ocean-pco2-carbon-flux', title: 'Southern Ocean pCO2 Flux Series', region: 'Southern Ocean', doi: '10.5281/oruvia.2024.09240' }, geometry: { coordinates: [50.0, -55.0] } },
];

const DEFAULT_EXPEDITIONS = [
  { properties: { id: 'e1', type: 'expedition', slug: 'expedition-antarctic-43', expeditionName: '43rd Indian Antarctic Expedition', title: 'Larsemann Deep Core Boring', date: '2024-01-15' }, geometry: { coordinates: [76.2, -69.4] } },
  { properties: { id: 'e2', type: 'expedition', slug: 'expedition-arctic-summer-2024', expeditionName: 'Svalbard Bio-Oceanic Campaign', title: 'Plankton Bloom UAV Sounding', date: '2024-07-20' }, geometry: { coordinates: [12.2, 79.15] } },
];

const REGION_PRESETS = [
  { id: 'GLOBAL',         label: 'Global View',         lat: 10,   lng: 20,  zoom: 1.4 },
  { id: 'ANTARCTICA',     label: 'East Antarctica',      lat: -70,  lng: 45,  zoom: 3.5 },
  { id: 'ARCTIC',         label: 'Svalbard Arctic',      lat: 78.5, lng: 16,  zoom: 4.8 },
  { id: 'HIMALAYA',       label: 'Himalayas (Chandra)',  lat: 32.4, lng: 77.6, zoom: 5.5 },
  { id: 'SOUTHERN_OCEAN', label: 'Southern Ocean',       lat: -55,  lng: 50,  zoom: 3.0 },
];

// Read CARTO API key from Vite env — set VITE_CARTO_API_KEY in your .env file
const CARTO_API_KEY = (import.meta as any).env?.VITE_CARTO_API_KEY as string | undefined;

function buildCartoStyle(): maplibregl.StyleSpecification {
  const apiKeyParam = CARTO_API_KEY ? `?api_key=${CARTO_API_KEY}` : '';
  return {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: [
          `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png${apiKeyParam}`,
          `https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png${apiKeyParam}`,
          `https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png${apiKeyParam}`,
          `https://cartodb-basemaps-d.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png${apiKeyParam}`,
          `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
        ],
        tileSize: 256,
        attribution: '© <a href="https://carto.com">CARTO</a> © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      { id: 'bg',      type: 'background', paint: { 'background-color': '#0D1211' } },
      { id: 'basemap', type: 'raster',     source: 'carto-dark',
        paint: { 'raster-opacity': 0.95, 'raster-saturation': -0.1 } },
    ],
  };
}

export const ScientificAtlas: React.FC<ScientificAtlasProps> = ({
  layersData,
  height = '680px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLayers, setActiveLayers] = useState({ stations: true, datasets: true, expeditions: true });
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [activeRegion, setActiveRegion] = useState('GLOBAL');

  const stations = layersData?.stations?.features || DEFAULT_STATIONS;
  const datasets = layersData?.datasets?.features || DEFAULT_DATASETS;
  const expeditions = layersData?.expeditionMilestones?.features || DEFAULT_EXPEDITIONS;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: buildCartoStyle(),
      center: [20, 10],
      zoom: 1.4,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    map.on('load', () => setMapLoaded(true));
    map.on('error', () => setMapLoaded(true));

    const loadTimer = setTimeout(() => setMapLoaded(true), 2000);

    mapRef.current = map;
    return () => {
      clearTimeout(loadTimer);
      markersRef.current.forEach(m => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Rebuild markers on layer / year changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const addMarker = (html: string, lngLat: [number, number], onClick: () => void, onEnter: () => void, onLeave: () => void) => {
      const el = document.createElement('div');
      el.innerHTML = html;
      el.style.cursor = 'pointer';
      el.addEventListener('click', onClick);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      const m = new maplibregl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
      markersRef.current.push(m);
    };

    if (activeLayers.stations) {
      stations.forEach((st: any) => {
        const popup = new maplibregl.Popup({ offset: 16, closeButton: false, maxWidth: '220px' }).setHTML(`
          <div style="background:#131B19;border:1px solid rgba(183,255,90,0.4);border-radius:10px;padding:10px 12px;font-family:monospace;color:#F4F2EC;min-width:180px;">
            <div style="font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#B7FF5A;margin-bottom:3px;">RESEARCH STATION · ${st.properties.code}</div>
            <div style="font-size:13px;font-weight:600;font-family:Georgia,serif;">${st.properties.name}</div>
            <div style="font-size:10px;color:#747A75;margin-top:2px;">${st.properties.region}</div>
            <div style="margin-top:8px;font-size:15px;color:#B7FF5A;font-weight:700;">${st.properties.temperatureC}°C</div>
            <div style="font-size:9px;color:#747A75;">AMBIENT TEMP · LIVE TELEMETRY</div>
          </div>`);
        addMarker(`
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <span style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(183,255,90,0.28);animation:atlas-ping 1.8s ease-out infinite;"></span>
            <div style="width:14px;height:14px;border-radius:50%;background:#B7FF5A;border:2.5px solid #0D1211;box-shadow:0 0 12px rgba(183,255,90,0.7);display:flex;align-items:center;justify-content:center;">
              <div style="width:5px;height:5px;border-radius:50%;background:#0D1211;"></div>
            </div>
          </div>`,
          st.geometry.coordinates as [number, number],
          () => setSelectedFeature(st),
          () => popup.addTo(map),
          () => popup.remove()
        );
      });
    }

    if (activeLayers.datasets) {
      datasets.forEach((ds: any) => {
        addMarker(`<div style="width:12px;height:12px;border-radius:50%;background:#3D7BFF;border:2px solid #F4F2EC;box-shadow:0 0 10px rgba(61,123,255,0.7);"></div>`,
          ds.geometry.coordinates as [number, number],
          () => setSelectedFeature(ds),
          () => {}, () => {}
        );
      });
    }

    if (activeLayers.expeditions) {
      expeditions.forEach((exp: any) => {
        addMarker(`<div style="width:12px;height:12px;background:#E5A93C;border:2px solid #0D1211;box-shadow:0 0 10px rgba(229,169,60,0.7);transform:rotate(45deg);"></div>`,
          exp.geometry.coordinates as [number, number],
          () => setSelectedFeature(exp),
          () => {}, () => {}
        );
      });
    }
  }, [mapLoaded, activeLayers, stations, datasets, expeditions]);

  const flyTo = (lng: number, lat: number, zoom: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom, speed: 1.4, curve: 1.4, essential: true });
  };

  const handleRegionSelect = (r: typeof REGION_PRESETS[0]) => {
    setActiveRegion(r.id);
    flyTo(r.lng, r.lat, r.zoom);
  };

  const toggleLayer = (k: keyof typeof activeLayers) =>
    setActiveLayers(p => ({ ...p, [k]: !p[k] }));

  return (
    <>
      <style>{`
        @keyframes atlas-ping { 75%,100% { transform:scale(2.2); opacity:0; } }
        .maplibregl-popup-content { background:transparent!important; padding:0!important; box-shadow:none!important; }
        .maplibregl-popup-tip { display:none!important; }
        .maplibregl-ctrl-attrib { background:rgba(13,18,17,0.85)!important; color:#747A75!important; font-size:9px!important; border-radius:6px!important; }
        .maplibregl-ctrl-attrib a { color:#B7FF5A!important; }
        .maplibregl-ctrl-group { background:#192220!important; border:1px solid rgba(116,122,117,0.3)!important; border-radius:10px!important; }
        .maplibregl-ctrl-group button { background:transparent!important; color:#F4F2EC!important; }
      `}</style>

      <div className="relative w-full border border-[#747A75]/30 rounded-2xl bg-[#0D1211] overflow-hidden text-[#F4F2EC] shadow-2xl" style={{ height }}>

        {/* MapLibre canvas */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

        {/* Loading spinner */}
        {!mapLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#0D1211] pointer-events-none">
            <div className="w-8 h-8 border-2 border-[#B7FF5A]/30 border-t-[#B7FF5A] rounded-full animate-spin" />
            <p className="text-[11px] font-mono text-[#747A75] tracking-widest uppercase">Loading map tiles…</p>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-0 left-0 w-full p-3 z-30 flex flex-wrap items-start gap-2 bg-gradient-to-b from-[#0D1211]/90 via-[#0D1211]/50 to-transparent pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B7FF5A] bg-[#0D1211]/90 px-2.5 py-1 rounded-md border border-[#B7FF5A]/40">
              MapLibre Scientific Atlas
            </span>
            <div className="hidden sm:flex items-center gap-1 bg-[#192220]/90 backdrop-blur-md px-2 py-1 rounded-xl border border-[#747A75]/30 text-xs font-mono">
              {REGION_PRESETS.map(r => (
                <button key={r.id} onClick={() => handleRegionSelect(r)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${activeRegion === r.id ? 'bg-[#B7FF5A] text-[#0D1211] font-bold' : 'text-[#747A75] hover:text-[#F4F2EC]'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pointer-events-auto ml-auto flex flex-wrap items-center gap-2 bg-[#192220]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#747A75]/30 text-xs font-mono">
            <div className="flex items-center gap-2 pr-2 border-r border-[#747A75]/30">
              <span className="text-[#B7FF5A] font-semibold">Timeline:</span>
              <input type="range" min="1981" max="2026" value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="w-20 accent-[#B7FF5A] cursor-pointer" />
              <span className="text-[#F4F2EC] font-bold w-10">{selectedYear}</span>
            </div>
            <button onClick={() => toggleLayer('stations')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${activeLayers.stations ? 'bg-[#B7FF5A] text-[#0D1211]' : 'text-[#747A75] hover:text-[#F4F2EC]'}`}>
              <Radio className="w-3 h-3" /> Stations
            </button>
            <button onClick={() => toggleLayer('datasets')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${activeLayers.datasets ? 'bg-[#3D7BFF] text-white' : 'text-[#747A75] hover:text-[#F4F2EC]'}`}>
              <Database className="w-3 h-3" /> Datasets
            </button>
            <button onClick={() => toggleLayer('expeditions')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${activeLayers.expeditions ? 'bg-[#E5A93C] text-[#0D1211]' : 'text-[#747A75] hover:text-[#F4F2EC]'}`}>
              <MapPin className="w-3 h-3" /> Expeditions
            </button>
          </div>
        </div>

        {/* Feature Inspector */}
        {selectedFeature && (
          <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:w-96 bg-[#0D1211]/95 backdrop-blur-xl border border-[#747A75]/40 rounded-2xl p-5 shadow-2xl z-40">
            <div className="flex items-start justify-between pb-3 border-b border-[#747A75]/20">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                  selectedFeature.properties.type === 'station' ? 'bg-[#B7FF5A] text-[#0D1211]'
                  : selectedFeature.properties.type === 'dataset' ? 'bg-[#3D7BFF] text-white'
                  : 'bg-[#E5A93C] text-[#0D1211]'}`}>
                  {selectedFeature.properties.type}
                </span>
                <h4 className="font-serif text-lg font-medium text-[#F4F2EC] mt-1">
                  {selectedFeature.properties.name || selectedFeature.properties.title || selectedFeature.properties.expeditionName}
                </h4>
              </div>
              <button onClick={() => setSelectedFeature(null)}
                className="text-[#747A75] hover:text-[#F4F2EC] font-mono p-1 rounded-full hover:bg-[#192220] ml-2 shrink-0">✕</button>
            </div>

            <div className="py-3 space-y-1.5 text-xs font-mono text-[#747A75]">
              <p>COORDINATES: <span className="text-[#F4F2EC] font-semibold">
                {Math.abs(selectedFeature.geometry.coordinates[1]).toFixed(4)}°{selectedFeature.geometry.coordinates[1] >= 0 ? 'N' : 'S'},{' '}
                {Math.abs(selectedFeature.geometry.coordinates[0]).toFixed(4)}°{selectedFeature.geometry.coordinates[0] >= 0 ? 'E' : 'W'}
              </span></p>
              {selectedFeature.properties.region && <p>REGION: <span className="text-[#F4F2EC]">{selectedFeature.properties.region}</span></p>}
              {selectedFeature.properties.temperatureC !== undefined && (
                <p>AMBIENT TEMP: <span className="text-[#B7FF5A] font-bold">{selectedFeature.properties.temperatureC}°C</span></p>
              )}
              {selectedFeature.properties.doi && (
                <p className="truncate">DOI: <span className="text-[#3D7BFF]">{selectedFeature.properties.doi}</span></p>
              )}
            </div>

            <div className="pt-2 border-t border-[#747A75]/20 flex gap-2">
              <button onClick={() => flyTo(...selectedFeature.geometry.coordinates as [number, number], 7)}
                className="flex-1 py-2 px-3 bg-[#192220] text-[#B7FF5A] rounded-xl text-xs font-mono uppercase font-semibold hover:bg-[#222e2b] transition-colors border border-[#B7FF5A]/30">
                Fly To
              </button>
              <Link href={`/${selectedFeature.properties.type === 'station' ? 'stations' : selectedFeature.properties.type === 'dataset' ? 'datasets' : 'expeditions'}/${selectedFeature.properties.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#B7FF5A] text-[#0D1211] rounded-xl text-xs font-mono uppercase font-bold hover:bg-[#a3f040] transition-colors shadow">
                Open Record <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 text-[11px] font-mono text-[#747A75] bg-[#0D1211]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#747A75]/30 shadow">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#B7FF5A] shadow-[0_0_6px_#B7FF5A]" /> Research Station</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3D7BFF] shadow-[0_0_6px_#3D7BFF]" /> Dataset</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rotate-45 bg-[#E5A93C] shadow-[0_0_6px_#E5A93C]" /> Expedition</span>
        </div>
      </div>
    </>
  );
};
