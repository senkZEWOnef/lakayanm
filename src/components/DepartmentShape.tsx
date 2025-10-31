"use client";

import React from "react";

interface City {
  name: string;
  slug: string;
  x: number;
  y: number;
}

interface DepartmentData {
  key: string;
  name: string;
  slug: string;
  polygon: readonly [number, number][];
  fill: string;
  cities: City[];
}

// Department shapes data (same as in HaitiInteractiveMap)
const DEPARTMENT_SHAPES: { [key: string]: DepartmentData } = {
  "nord-ouest": {
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
  "nord": {
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
  "nord-est": {
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
  "artibonite": {
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
  "centre": {
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
  "ouest": {
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
  "nippes": {
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
  "sud": {
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
  "grand-anse": {
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
  "sud-est": {
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
};

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

function pointsToString(pts: readonly [number, number][]) {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

interface DepartmentShapeProps {
  departmentSlug: string;
  basePath?: string;
  className?: string;
  showCities?: boolean;
}

export default function DepartmentShape({ 
  departmentSlug, 
  basePath, 
  className = "",
  showCities = true 
}: DepartmentShapeProps) {
  const dept = DEPARTMENT_SHAPES[departmentSlug];
  
  const handleCityClick = (citySlug: string) => {
    if (basePath) {
      window.location.href = `${basePath}/${citySlug}`;
    }
  };
  
  if (!dept) {
    return (
      <div className={`flex items-center justify-center bg-slate-800/50 border border-amber-400/30 rounded-lg p-8 ${className}`}>
        <p className="text-white/70">Department map not available</p>
      </div>
    );
  }

  // Calculate bounds for centering
  const xs = dept.polygon.map(p => p[0]);
  const ys = dept.polygon.map(p => p[1]);
  const minX = Math.min(...xs) - 50;
  const maxX = Math.max(...xs) + 50;
  const minY = Math.min(...ys) - 50;
  const maxY = Math.max(...ys) + 50;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  return (
    <div className={`w-full bg-slate-800/80 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{dept.name}</h3>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
      </div>
      
      <div className="relative aspect-[4/3] w-full max-w-md mx-auto">
        <svg viewBox={viewBox} className="w-full h-full">
          {/* Department shape */}
          <polygon
            points={pointsToString(dept.polygon)}
            fill="rgba(245, 158, 11, 0.3)"
            stroke="#f59e0b"
            strokeWidth={2}
            className="drop-shadow-lg"
          />
          
          {/* Department label */}
          <text
            x={dept.polygon.reduce((s, p) => s + p[0], 0) / dept.polygon.length}
            y={dept.polygon.reduce((s, p) => s + p[1], 0) / dept.polygon.length - 20}
            textAnchor="middle"
            className="select-none font-bold"
            fontSize={18}
            fontWeight={700}
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth={0.5}
          >
            {dept.name}
          </text>

          {/* City pins */}
          {showCities && dept.cities.map((city) => (
            <g key={city.slug}>
              <Pin 
                x={city.x} 
                y={city.y} 
                active 
                onClick={basePath ? () => handleCityClick(city.slug) : undefined}
              />
              <text 
                x={city.x + 12} 
                y={city.y - 12} 
                fontSize={12} 
                fontWeight={600} 
                fill="#ffffff" 
                stroke="#1e293b"
                strokeWidth={0.3}
                className={`select-none ${basePath ? 'cursor-pointer' : ''}`}
                onClick={basePath ? () => handleCityClick(city.slug) : undefined}
              >
                {city.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      
      {showCities && (
        <div className="mt-4">
          <p className="text-amber-400 font-medium text-sm mb-2">Major Cities:</p>
          <div className="flex flex-wrap gap-2">
            {dept.cities.map((city) => (
              <button
                key={city.slug}
                onClick={basePath ? () => handleCityClick(city.slug) : undefined}
                className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-200 rounded text-xs hover:bg-amber-500/30 transition-colors"
                disabled={!basePath}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}