import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { Download, Activity, Calendar, SlidersHorizontal, AlertCircle, Table, BarChart2, Info, FileSpreadsheet, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { IDatasetVariable } from '@oruvia/shared';

interface DataVisualizerProps {
  title?: string;
  variables?: IDatasetVariable[];
  sampleData?: Array<Record<string, any>>;
  isDemoData?: boolean;
}

type ViewMode = 'CHART' | 'TABLE' | 'METADATA' | 'FILES';

export const DataVisualizer: React.FC<DataVisualizerProps> = ({
  title = 'Calibrated Sensor Telemetry',
  variables = [
    { name: 'Air Temperature', unit: '°C', description: 'Ambient air sensor measurement', dataType: 'Float' },
    { name: 'Wind Speed', unit: 'm/s', description: 'Ultrasonic anemometer', dataType: 'Float' },
    { name: 'Atmospheric Pressure', unit: 'hPa', description: 'Barometric sensor', dataType: 'Float' },
    { name: 'Relative Humidity', unit: '%', description: 'Hygrometer sensor', dataType: 'Float' },
  ],
  sampleData,
  isDemoData = true,
}) => {
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('CHART');
  const [timeFilter, setTimeFilter] = useState<string>('ALL');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Active Variable details
  const activeVar = variables[selectedVarIndex] || variables[0];
  const activeVarKey = activeVar?.name || 'Air Temperature';
  const activeUnit = activeVar?.unit || '°C';

  // Generate 500 rows of realistic demo observation data if not passed
  const fullDemoRows = useMemo(() => {
    if (sampleData && sampleData.length > 0) return sampleData;
    return Array.from({ length: 500 }).map((_, i) => {
      const dateObj = new Date(2024, 0, 1, 0, i * 30); // every 30 mins from Jan 1, 2024
      const isoStr = dateObj.toISOString().replace('T', ' ').substring(0, 16);
      const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
      return {
        id: i + 1,
        timestamp: isoStr,
        month: monthStr,
        time: isoStr.substring(11, 16),
        'Air Temperature': parseFloat((-12.5 + Math.sin(i / 15) * 4.2 + (Math.random() * 0.6 - 0.3)).toFixed(2)),
        'Wind Speed': parseFloat((14.0 + Math.cos(i / 10) * 7.1 + Math.random() * 2).toFixed(2)),
        'Atmospheric Pressure': parseFloat((986.0 + Math.sin(i / 20) * 5.5).toFixed(1)),
        'Relative Humidity': parseFloat(Math.min(99, Math.max(40, 75 + Math.cos(i / 12) * 20)).toFixed(1)),
      };
    });
  }, [sampleData]);

  // Apply Time Period Filtering
  const filteredData = useMemo(() => {
    if (timeFilter === 'ALL') return fullDemoRows;
    return fullDemoRows.filter((r) => r.month?.toUpperCase() === timeFilter);
  }, [fullDemoRows, timeFilter]);

  // Apply Table Search & Pagination
  const searchFilteredTableRows = useMemo(() => {
    if (!tableSearch) return filteredData;
    return filteredData.filter((r) =>
      Object.values(r).some((val) => String(val).toLowerCase().includes(tableSearch.toLowerCase()))
    );
  }, [filteredData, tableSearch]);

  const totalPages = Math.ceil(searchFilteredTableRows.length / pageSize);
  const pagedRows = searchFilteredTableRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Generate Downloadable Demo CSV
  const handleDownloadCsv = () => {
    let csv = `Timestamp,${variables.map((v) => `${v.name} (${v.unit})`).join(',')}\n`;
    filteredData.forEach((row: any) => {
      const vals = variables.map((v) => row[v.name] !== undefined ? row[v.name] : 'N/A');
      csv += `${row.timestamp || row.time},${vals.join(',')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_demo_observations.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] p-6 space-y-4 shadow-sm">
      {/* Top Header & View Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#0D1211]/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-medium text-[#0D1211]">{title}</h3>
            {isDemoData && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/15 text-amber-800 font-semibold border border-amber-500/30">
                ILLUSTRATIVE / DEMO DATA — NOT REAL OBSERVATIONS
              </span>
            )}
          </div>
          <p className="text-xs text-[#747A75] font-mono mt-1">
            Active Variable: <span className="text-[#3D7BFF] font-semibold">{activeVarKey}</span> ({activeUnit}) · Total Records: {filteredData.length}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex bg-[#F4F2EC] p-1 rounded-lg border border-[#0D1211]/10">
            {[
              { id: 'CHART', label: 'Chart', icon: BarChart2 },
              { id: 'TABLE', label: 'Table Explorer', icon: Table },
              { id: 'METADATA', label: 'Metadata', icon: Info },
              { id: 'FILES', label: 'Files', icon: FileSpreadsheet },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as ViewMode)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === id
                    ? 'bg-[#0D1211] text-[#B7FF5A] font-semibold shadow-sm'
                    : 'text-[#747A75] hover:text-[#0D1211]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-2 bg-[#0D1211] text-[#B7FF5A] rounded-lg font-mono text-xs uppercase flex items-center gap-1.5 hover:bg-[#192220] transition-colors"
            title="Download Demo CSV"
          >
            <Download className="w-3.5 h-3.5" /> Download CSV
          </button>
        </div>
      </div>

      {/* Variables & Time Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F4F2EC] rounded-xl border border-[#0D1211]/10 font-mono text-xs">
        {/* Variable Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#747A75] text-[10px] uppercase font-semibold mr-1">Variable:</span>
          {variables.map((v, idx) => (
            <button
              key={v.name}
              onClick={() => setSelectedVarIndex(idx)}
              className={`px-3 py-1 rounded-full uppercase transition-all font-semibold ${
                selectedVarIndex === idx
                  ? 'bg-[#3D7BFF] text-white shadow-sm'
                  : 'bg-[#FAF9F5] text-[#747A75] hover:text-[#0D1211] border border-[#0D1211]/10'
              }`}
            >
              {v.name} ({v.unit})
            </button>
          ))}
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[#747A75] text-[10px] uppercase font-semibold">Time Period:</span>
          {['ALL', 'JAN', 'FEB', 'MAR'].map((t) => (
            <button
              key={t}
              onClick={() => { setTimeFilter(t); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                timeFilter === t ? 'bg-[#0D1211] text-[#B7FF5A]' : 'bg-[#FAF9F5] text-[#747A75] hover:text-[#0D1211]'
              }`}
            >
              {t === 'ALL' ? 'All Records' : t}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW MODE 1: CHART VIEW */}
      {viewMode === 'CHART' && (
        <div className="space-y-4 pt-2">
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData.slice(0, 48)} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="demoSciGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D7BFF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3D7BFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBE8DF" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#747A75', fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#D8D4C8" />
                <YAxis tick={{ fill: '#747A75', fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#D8D4C8" unit={` ${activeUnit}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1211',
                    color: '#F4F2EC',
                    borderRadius: '8px',
                    border: '1px solid #747A75',
                    fontSize: '12px',
                    fontFamily: 'IBM Plex Mono',
                  }}
                  formatter={(val: any) => [`${val} ${activeUnit}`, activeVarKey]}
                />
                <Area type="monotone" dataKey={activeVarKey} stroke="#3D7BFF" strokeWidth={2} fillOpacity={1} fill="url(#demoSciGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TABLE EXPLORER VIEW */}
      {viewMode === 'TABLE' && (
        <div className="space-y-4 font-mono text-xs">
          {/* Table Search */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#747A75] absolute left-3 top-2.5" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search rows..."
                className="w-full bg-[#F4F2EC] pl-8 pr-3 py-1.5 rounded-lg border border-[#0D1211]/10 text-xs focus:outline-none"
              />
            </div>
            <span className="text-[#747A75] text-[11px]">
              Page {currentPage} of {totalPages || 1} ({searchFilteredTableRows.length} total rows)
            </span>
          </div>

          {/* Table Container */}
          <div className="border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F4F2EC] border-b border-[#0D1211]/10 text-[#747A75] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">ISO Timestamp</th>
                  {variables.map((v) => (
                    <th key={v.name} className="py-2.5 px-3">{v.name} ({v.unit})</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0D1211]/10">
                {pagedRows.map((r: Record<string, any>, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F2EC]/60">
                    <td className="py-2 px-3 text-[#747A75]">{r.id || idx + 1}</td>
                    <td className="py-2 px-3 text-[#0D1211] font-semibold">{r.timestamp || r.time}</td>
                    {variables.map((v) => (
                      <td key={v.name} className="py-2 px-3 text-[#3D7BFF]">
                        {r[v.name] !== undefined ? r[v.name] : <span className="text-amber-600 font-normal">N/A (Missing)</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded border border-[#0D1211]/20 disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" /> Prev Page
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded border border-[#0D1211]/20 disabled:opacity-30 flex items-center gap-1"
            >
              Next Page <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: METADATA VIEW */}
      {viewMode === 'METADATA' && (
        <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 font-mono text-xs space-y-3">
          <h4 className="font-semibold text-[#0D1211]">Variable Schema & Data Specifications</h4>
          <div className="space-y-2 text-[#747A75]">
            {variables.map((v) => (
              <div key={v.name} className="p-3 rounded bg-[#FAF9F5] border border-[#0D1211]/5">
                <span className="text-[#0D1211] font-bold">{v.name}</span> ({v.unit}) — Data Type: <span className="text-[#3D7BFF]">{v.dataType}</span>
                <p className="font-sans text-xs mt-0.5">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 4: FILES VIEW */}
      {viewMode === 'FILES' && (
        <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#0D1211]/10 font-mono text-xs space-y-3">
          <h4 className="font-semibold text-[#0D1211]">Available Demo Telemetry Formats</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded bg-[#FAF9F5] border border-[#0D1211]/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0D1211] block">demo_telemetry_observations.csv</span>
                <span className="text-[10px] text-[#747A75]">500 Rows · 14.5 KB</span>
              </div>
              <button onClick={handleDownloadCsv} className="px-3 py-1.5 bg-[#0D1211] text-[#B7FF5A] rounded font-semibold text-[11px]">
                Download CSV
              </button>
            </div>
            <div className="p-4 rounded bg-[#FAF9F5] border border-[#0D1211]/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0D1211] block">demo_telemetry_matrix.nc</span>
                <span className="text-[10px] text-[#747A75]">NetCDF-4 Binary · 2.1 MB</span>
              </div>
              <button onClick={handleDownloadCsv} className="px-3 py-1.5 bg-[#0D1211] text-[#B7FF5A] rounded font-semibold text-[11px]">
                Download NetCDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between border-t border-[#0D1211]/10 pt-3 text-xs font-mono text-[#747A75]">
        <span>Quality Level: L2 (Spike-Filtered & QC Validated)</span>
        <span className="text-[#3D7BFF] font-semibold">FAIR Compliant Telemetry</span>
      </div>
    </div>
  );
};
