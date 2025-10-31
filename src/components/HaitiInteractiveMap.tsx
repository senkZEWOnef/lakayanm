"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * HaitiInteractiveMap
 * ------------------------------------------------------
 * Interactive SVG map of Haiti with clickable departments and cities
 * Integrated with Next.js routing system
 */

// ---------- Types ----------
interface City {
  name: string;
  slug: string;
  x: number; // in the same 1000x800 coordinate system
  y: number;
}

interface Department {
  key: string; // stable id
  name: string;
  slug: string; // for routing
  polygon: readonly [number, number][]; // [x,y] pairs in 1000x800 space
  fill: string; // base color
  cities: City[]; // up to 3
}


// ---------- Simplified accurate Haiti department boundaries ----------
const DEPARTMENTS: Department[] = [
  {
    key: "nwo",
    name: "Nord-Ouest",
    slug: "nord-ouest",
    polygon: [
      [50, 100], [180, 95], [220, 110], [250, 130], [280, 145], 
      [300, 170], [280, 200], [250, 220], [200, 230], [150, 240], 
      [100, 230], [70, 210], [50, 180], [40, 150], [50, 120]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Port-de-Paix", slug: "port-de-paix", x: 180, y: 180 },
      { name: "Saint-Louis-du-Nord", slug: "saint-louis-du-nord", x: 220, y: 160 },
      { name: "Jean-Rabel", slug: "jean-rabel", x: 140, y: 200 },
    ],
  },
  {
    key: "nord",
    name: "Nord",
    slug: "nord",
    polygon: [
      [280, 145], [350, 140], [420, 150], [480, 160], [540, 170], 
      [600, 180], [650, 190], [700, 200], [740, 220], [720, 250], 
      [680, 270], [640, 280], [600, 290], [550, 280], [500, 270], 
      [450, 260], [400, 250], [350, 240], [300, 220], [280, 200]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Cap-Haïtien", slug: "cap-haitien", x: 650, y: 230 },
      { name: "Limbé", slug: "limbe", x: 580, y: 250 },
      { name: "Plaine-du-Nord", slug: "plaine-du-nord", x: 620, y: 270 },
    ],
  },
  {
    key: "ne",
    name: "Nord-Est",
    slug: "nord-est",
    polygon: [
      [740, 220], [780, 230], [820, 240], [860, 250], [900, 260], 
      [940, 280], [960, 320], [950, 360], [920, 390], [880, 400], 
      [840, 390], [800, 380], [760, 370], [720, 350], [680, 330], 
      [660, 300], [680, 270], [720, 250]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Fort-Liberté", slug: "fort-liberte", x: 860, y: 300 },
      { name: "Ouanaminthe", slug: "ouanaminthe", x: 920, y: 340 },
      { name: "Trou-du-Nord", slug: "trou-du-nord", x: 780, y: 320 },
    ],
  },
  {
    key: "art",
    name: "Artibonite",
    slug: "artibonite",
    polygon: [
      [300, 220], [350, 240], [400, 250], [450, 260], [500, 270], 
      [550, 280], [580, 300], [600, 330], [580, 360], [550, 380], 
      [500, 390], [450, 400], [400, 390], [350, 380], [300, 360], 
      [280, 340], [270, 320], [280, 300], [290, 280], [300, 260]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Gonaïves", slug: "gonaiives", x: 480, y: 320 },
      { name: "Saint-Marc", slug: "saint-marc", x: 520, y: 350 },
      { name: "Dessalines", slug: "dessalines", x: 440, y: 340 },
    ],
  },
  {
    key: "centre",
    name: "Centre",
    slug: "centre",
    polygon: [
      [580, 360], [620, 370], [660, 380], [700, 390], [740, 400], 
      [780, 410], [820, 420], [840, 450], [820, 480], [780, 500], 
      [740, 510], [700, 520], [660, 510], [620, 500], [580, 490], 
      [560, 470], [550, 440], [560, 410], [580, 380]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Hinche", slug: "hinche", x: 720, y: 450 },
      { name: "Mirebalais", slug: "mirebalais", x: 650, y: 470 },
      { name: "Lascahobas", slug: "lascahobas", x: 780, y: 460 },
    ],
  },
  {
    key: "ouest",
    name: "Ouest",
    slug: "ouest",
    polygon: [
      [450, 400], [500, 390], [550, 380], [580, 400], [600, 430], 
      [620, 460], [640, 490], [620, 520], [600, 550], [580, 580], 
      [550, 600], [520, 610], [480, 600], [440, 590], [420, 570], 
      [410, 540], [420, 510], [440, 480], [460, 450], [450, 420]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Port-au-Prince", slug: "port-au-prince", x: 520, y: 550 },
      { name: "Delmas", slug: "delmas", x: 540, y: 540 },
      { name: "Carrefour", slug: "carrefour", x: 500, y: 570 },
    ],
  },
  {
    key: "nippes",
    name: "Nippes",
    slug: "nippes",
    polygon: [
      [410, 540], [440, 550], [470, 560], [500, 570], [520, 590], 
      [500, 620], [480, 650], [450, 670], [420, 680], [390, 670], 
      [370, 650], [360, 620], [370, 590], [390, 570], [410, 550]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Miragoâne", slug: "miragoane", x: 440, y: 630 },
      { name: "Anse-à-Veau", slug: "anse-a-veau", x: 400, y: 640 },
      { name: "Baradères", slug: "baraderes", x: 480, y: 650 },
    ],
  },
  {
    key: "sud",
    name: "Sud",
    slug: "sud",
    polygon: [
      [300, 650], [340, 660], [380, 670], [420, 680], [460, 690], 
      [500, 700], [540, 710], [560, 730], [540, 750], [500, 760], 
      [460, 750], [420, 740], [380, 730], [340, 720], [300, 710], 
      [280, 690], [270, 670], [280, 650]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Les Cayes", slug: "les-cayes", x: 420, y: 720 },
      { name: "Aquin", slug: "aquin", x: 480, y: 730 },
      { name: "Torbeck", slug: "torbeck", x: 380, y: 710 },
    ],
  },
  {
    key: "ga",
    name: "Grand'Anse",
    slug: "grand-anse",
    polygon: [
      [80, 650], [120, 660], [160, 670], [200, 680], [240, 690], 
      [280, 700], [300, 720], [280, 740], [240, 750], [200, 760], 
      [160, 750], [120, 740], [80, 730], [60, 710], [50, 690], 
      [60, 670], [80, 650]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Jérémie", slug: "jeremie", x: 180, y: 720 },
      { name: "Anse-d'Hainault", slug: "anse-dhainault", x: 120, y: 710 },
      { name: "Moron", slug: "moron", x: 220, y: 730 },
    ],
  },
  {
    key: "se",
    name: "Sud-Est",
    slug: "sud-est",
    polygon: [
      [520, 610], [560, 620], [600, 630], [640, 640], [680, 650], 
      [720, 660], [760, 670], [800, 680], [820, 710], [800, 740], 
      [760, 750], [720, 760], [680, 750], [640, 740], [600, 730], 
      [560, 720], [540, 700], [520, 680], [520, 650], [520, 630]
    ],
    fill: "#f59e0b",
    cities: [
      { name: "Jacmel", slug: "jacmel", x: 680, y: 710 },
      { name: "Bainet", slug: "bainet", x: 740, y: 720 },
      { name: "Belle-Anse", slug: "belle-anse", x: 780, y: 710 },
    ],
  },
];

// Utility to stringify polygon points for SVG
function pointsToString(pts: readonly [number, number][]) {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

// Pin icon for city markers
const Pin: React.FC<{ 
  x: number; 
  y: number; 
  active?: boolean; 
  onClick?: () => void;
}> = ({ x, y, active, onClick }) => (
  <g 
    transform={`translate(${x - 8}, ${y - 20})`} 
    className={onClick ? "cursor-pointer" : ""}
    onClick={onClick}
  >
    <path
      d="M8 0c4.418 0 8 3.582 8 8 0 6-8 16-8 16S0 14 0 8c0-4.418 3.582-8 8-8z"
      fill={active ? "#f59e0b" : "#1e293b"}
      stroke="#ffffff"
      strokeWidth={1.5}
    />
    <circle cx={8} cy={8} r={3.5} fill="#ffffff" />
  </g>
);

export default function HaitiInteractiveMap({
  mapSrc = "/banner.png", // Using your existing Haiti image
  initialDepartment = null,
  className = "",
}: {
  mapSrc?: string;
  initialDepartment?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string | null>(initialDepartment);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  
  const selected = useMemo(
    () => DEPARTMENTS.find(d => d.key === selectedKey) || null,
    [selectedKey]
  );

  const handleDepartmentClick = (dept: Department) => {
    setSelectedKey(dept.key);
    router.push(`/dept/${dept.slug}`);
  };

  const handleCityClick = (dept: Department, city: City) => {
    router.push(`/dept/${dept.slug}/city/${city.slug}`);
  };

  return (
    <div className={`w-full flex flex-col lg:flex-row gap-6 ${className}`}>
      {/* Map area */}
      <div className="relative w-full lg:w-2/3 aspect-[5/4] rounded-2xl shadow-2xl overflow-hidden border border-amber-400/30 bg-slate-800">
        <svg viewBox="0 0 1000 800" className="w-full h-full">
          {/* Base map image with dark overlay */}
          <defs>
            <filter id="darkOverlay">
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0.6"/>
              </feComponentTransfer>
            </filter>
          </defs>
          
          <image 
            href={mapSrc} 
            x={0} 
            y={0} 
            width={1000} 
            height={800} 
            preserveAspectRatio="xMidYMid slice"
            filter="url(#darkOverlay)"
          />

          {/* Dark overlay for better contrast */}
          <rect x={0} y={0} width={1000} height={800} fill="rgba(30, 41, 59, 0.7)" />

          {/* All departments as base map - showing full Haiti */}
          {DEPARTMENTS.map((d) => (
            <polygon
              key={`base-${d.key}`}
              points={pointsToString(d.polygon)}
              fill="rgba(30, 41, 59, 0.8)"
              stroke="rgba(245, 158, 11, 0.5)"
              strokeWidth={1}
              className="department-base"
            />
          ))}

          {/* Clickable interactive regions */}
          {DEPARTMENTS.map((d) => {
            const isActive = selectedKey === d.key;
            const isHovered = hoveredKey === d.key;
            
            return (
              <g key={d.key} className="cursor-pointer">
                {/* Interactive department region - highlighted on selection */}
                <polygon
                  points={pointsToString(d.polygon)}
                  fill={isActive ? "rgba(245, 158, 11, 0.4)" : isHovered ? "rgba(245, 158, 11, 0.2)" : "transparent"}
                  stroke={isActive ? "#f59e0b" : isHovered ? "#f59e0b" : "transparent"}
                  strokeWidth={isActive ? 3 : isHovered ? 2 : 0}
                  className="transition-all duration-300"
                  onClick={() => handleDepartmentClick(d)}
                  onMouseEnter={() => setHoveredKey(d.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                />
                
                {/* Department label */}
                <text
                  x={d.polygon.reduce((s, p) => s + p[0], 0) / d.polygon.length}
                  y={d.polygon.reduce((s, p) => s + p[1], 0) / d.polygon.length}
                  textAnchor="middle"
                  className="select-none pointer-events-none font-bold"
                  fontSize={isActive ? 20 : 16}
                  fontWeight={700}
                  fill="#ffffff"
                  stroke="#1e293b"
                  strokeWidth={0.5}
                  onClick={() => handleDepartmentClick(d)}
                >
                  {d.name.length > 12 ? d.name.split(' ')[0] : d.name}
                </text>
              </g>
            );
          })}

          {/* City pins for the selected department */}
          {selected && (
            <g>
              {selected.cities.map((c) => (
                <g key={c.name}>
                  <Pin 
                    x={c.x} 
                    y={c.y} 
                    active 
                    onClick={() => handleCityClick(selected, c)}
                  />
                  <text 
                    x={c.x + 12} 
                    y={c.y - 12} 
                    fontSize={14} 
                    fontWeight={600} 
                    fill="#ffffff" 
                    stroke="#1e293b"
                    strokeWidth={0.3}
                    className="select-none cursor-pointer"
                    onClick={() => handleCityClick(selected, c)}
                  >
                    {c.name}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>

        {/* Floating toolbar */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-3 border border-amber-400/30">
          <button
            onClick={() => setSelectedKey(null)}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            title="Show all departments"
          >
            Show all
          </button>
          {DEPARTMENTS.slice(0, 6).map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedKey(d.key)}
              className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                selectedKey === d.key 
                  ? "bg-amber-500 text-white" 
                  : "bg-slate-700 text-white hover:bg-slate-600 border border-amber-400/20"
              }`}
              title={d.name}
            >
              {d.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lg:w-1/3 w-full rounded-2xl border border-amber-400/30 shadow-xl px-6 py-8 bg-slate-800/90 backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selected ? selected.name : "Haiti — Departments"}
          </h2>
          {selected && (
            <button 
              onClick={() => setSelectedKey(null)} 
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {!selected && (
          <div className="space-y-4">
            <p className="text-white/70 text-sm">Click on a department to explore its cities</p>
            <div className="grid grid-cols-1 gap-2">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setSelectedKey(d.key)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-amber-400/30 hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="inline-block w-3 h-3 rounded-full border border-amber-400/50" 
                      style={{ backgroundColor: d.fill }} 
                    />
                    <span className="text-white font-medium group-hover:text-amber-200 transition-colors">
                      {d.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selected && (
          <div className="space-y-6">
            <div>
              <p className="text-amber-400 font-medium mb-3">Major Cities:</p>
              <div className="space-y-2">
                {selected.cities.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleCityClick(selected, c)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-amber-400/20 hover:border-amber-400/40 hover:bg-slate-700/30 transition-all group"
                  >
                    <span className="inline-block w-2.5 h-2.5 bg-amber-400 rounded-full" />
                    <span className="font-medium text-white group-hover:text-amber-200 transition-colors">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-amber-400/20">
              <button
                onClick={() => handleDepartmentClick(selected)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Explore {selected.name}
              </button>
            </div>
            
            <div className="pt-2 border-t border-slate-600">
              <p className="text-xs text-white/50">
                Click on pins or city names to visit individual city pages
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}