// 1. UPDATE IMPORTS (Top of file)
import { exportDashboardToExcel } from "../utils/dashboardUtils";
import useDashboard from "../hooks/useDashboard";
import {
  KPI_ROW_1 as STATIC_KPI_ROW_1,
  KPI_ROW_2 as STATIC_KPI_ROW_2,
  INDUSTRY_DATA as STATIC_INDUSTRY_DATA,
  GROWTH_DATA as STATIC_GROWTH_DATA,
  SECTOR_DATA as STATIC_SECTOR_DATA,
  SKILL_DATA as STATIC_SKILL_DATA,
  ADOPTION_DATA as STATIC_ADOPTION_DATA,
  EXPORT_PRODUCTS as STATIC_EXPORT_PRODUCTS,
  EXPORT_DESTINATIONS as STATIC_EXPORT_DESTINATIONS,
  INDUSTRY_HEALTH as STATIC_INDUSTRY_HEALTH,
  MAP_POINTS as STATIC_MAP_POINTS,
  MAP_LEGEND as STATIC_MAP_LEGEND,
  BOTTOM_STATS as STATIC_BOTTOM_STATS,
} from "../components/data/dashboardData";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import React, { useState } from "react";
import Card from "../components/ui/Card";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
// import { exportDashboardToExcel } from '../utils/dashboardUtils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
} from "lucide-react";
// import {
//   KPI_ROW_1, KPI_ROW_2, INDUSTRY_DATA, GROWTH_DATA,
//   SECTOR_DATA, SKILL_DATA, ADOPTION_DATA, EXPORT_PRODUCTS,
//   EXPORT_DESTINATIONS, INDUSTRY_HEALTH, MAP_POINTS, BOTTOM_STATS,
//   MAP_LEGEND
// } from '../components/data/dashboardData';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const TooltipStyle = {
  background: "#ffffff",
  border: "1px solid #e8e8e8",
  borderRadius: 8,
  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  fontSize: 13,
  color: "#111111",
};

const KPICard = ({ icon: Icon, iconColor, label, value, trend, trendUp }) => (
  <Card
    style={{
      padding: "7px 18px",
      display: "flex",
      flexDirection: "row",
      gap: "12px",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: `${iconColor}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon style={{ width: 20, height: 20, color: iconColor }} />
    </div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#888888" }}>
        {label}
      </span>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#111111" }}>
        {value}
      </span>
      <div
        style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}
      >
        {trendUp ? (
          <TrendingUp size={10} color="#16a34a" />
        ) : (
          <TrendingDown size={10} color="#ef4444" />
        )}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: trendUp ? "#16a34a" : "#ef4444",
          }}
        >
          {trend}
        </span>
      </div>
    </div>
  </Card>
);

const SectionHeader = ({ title, subtitle, rightElement }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    }}
  >
    <div>
      <h3
        style={{ fontSize: 15, fontWeight: 600, color: "#111111", margin: 0 }}
      >
        {title}
      </h3>
      {subtitle && (
        <p style={{ fontSize: 12, color: "#888888", marginTop: 2, margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
    {rightElement}
  </div>
);

export default function DistrictDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("This Year (2024-25)");

  const { dashboardData, loading } = useDashboard(selectedPeriod);

  const handleDownload = () =>
    exportDashboardToExcel(selectedPeriod, dashboardData);

  const KPI_ROW_1 = dashboardData?.kpiRow1 || STATIC_KPI_ROW_1;
  const KPI_ROW_2 = dashboardData?.kpiRow2 || STATIC_KPI_ROW_2;
  const INDUSTRY_DATA = dashboardData?.industryData || STATIC_INDUSTRY_DATA;
  const GROWTH_DATA = dashboardData?.growthData || STATIC_GROWTH_DATA;
  const SECTOR_DATA = dashboardData?.sectorData || STATIC_SECTOR_DATA;
  const SKILL_DATA = dashboardData?.skillData || STATIC_SKILL_DATA;
  const ADOPTION_DATA = dashboardData?.adoptionData || STATIC_ADOPTION_DATA;
  const EXPORT_PRODUCTS =
    dashboardData?.exportProducts || STATIC_EXPORT_PRODUCTS;
  const EXPORT_DESTINATIONS =
    dashboardData?.exportDestinations || STATIC_EXPORT_DESTINATIONS;
  const INDUSTRY_HEALTH =
    dashboardData?.industryHealth || STATIC_INDUSTRY_HEALTH;
  const MAP_POINTS = dashboardData?.mapPoints || STATIC_MAP_POINTS;
  const MAP_LEGEND = dashboardData?.mapLegend || STATIC_MAP_LEGEND;
  const BOTTOM_STATS = dashboardData?.bottomStats || STATIC_BOTTOM_STATS;
  const exportSummary = dashboardData?.exportSummary || {
    totalExport: 1128,
    exportingUnits: 214,
    countriesExported: 28,
  };
  const workforce = dashboardData?.workforce || {
    workingPopulation: 15.82,
    skilledWorkforce: 5.37,
    unemploymentRate: 6.7,
    femaleWorkforce: 32.8,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 3. ADD LOADING BAR (Top of main area) */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "#03D985",
            zIndex: 9999,
            animation: "dashLoading 1.5s ease-in-out infinite",
          }}
        >
          <style>{`@keyframes dashLoading { 0%{width:0%} 70%{width:80%} 100%{width:100%} }`}</style>
        </div>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out main-content-scroll"
        style={{ background: "#f5f5f5" }}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-2 sm:px-3 lg:px-5 pt-3 pb-8 w-full max-w-[1920px] mx-auto">
            {/* ROW 1 — PAGE HEADER */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h1
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#111111",
                    margin: "0 0 4px 0",
                  }}
                >
                  District Overview
                </h1>
                <p style={{ fontSize: 14, color: "#888888", margin: 0 }}>
                  Jhansi, Madhya Pradesh
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <select
                    className="w-full sm:min-w-[220px]"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    style={{
                      appearance: "none",
                      background: "#ffffff",
                      border: "1px solid #dddddd",
                      color: "#555555",
                      borderRadius: 8,
                      padding: "8px 36px 8px 14px",
                      fontSize: 14,
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option>This Year (2025-26)</option>
                    <option>Last Year (2024-25)</option>
                    <option>Last 2 Years</option>
                    <option>Last 5 Years</option>
                    <option>Custom Range</option>
                  </select>
                  <ChevronDown
                    style={{
                      width: 16,
                      height: 16,
                      color: "#888888",
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                <button
                  className="w-full sm:w-auto justify-center"
                  onClick={handleDownload}
                  style={{
                    background: "#03D985",
                    color: "#000000",
                    fontWeight: 700,
                    borderRadius: 8,
                    border: "none",
                    padding: "8px 16px",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#02b870")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#03D985")
                  }
                >
                  <Download
                    style={{ width: 16, height: 16, color: "#000000" }}
                  />
                  Download Report
                </button>
              </div>
            </div>

            {/* ROW 2 — KPI STAT CARDS */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 mb-4">
              {KPI_ROW_1.map((kpi, idx) => (
                <KPICard key={`row1-${idx}`} {...kpi} />
              ))}
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
              {KPI_ROW_2.map((kpi, idx) => (
                <KPICard key={`row2-${idx}`} {...kpi} />
              ))}
            </div>

            {/* GRAPHS GRID - 4 Rows, 2 Columns */}

            {/* ROW A */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              {/* GRAPH 1: Industry Distribution */}
              <Card
                style={{
                  padding: "16px",
                  minHeight: 320,
                  overflow: "hidden",
                }}
              >
                <SectionHeader
                  title="Industry Distribution"
                  subtitle="By Number of Businesses"
                  rightElement={
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#03D985",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                        flexShrink: 0,
                      }}
                    >
                      View All
                    </button>
                  }
                />

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-center lg:items-start">
                  {/* CHART SECTION */}
                  <div className="w-full lg:w-[42%] flex justify-center">
                    <div className="relative w-[220px] h-[220px] sm:w-[240px] sm:h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={INDUSTRY_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius="58%"
                            outerRadius="82%"
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {INDUSTRY_DATA.map((entry, i) => (
                              <Cell key={`cell-${i}`} fill={entry.color} />
                            ))}
                          </Pie>

                          <Tooltip
                            contentStyle={TooltipStyle}
                            itemStyle={{ color: "#555555" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* CENTER CONTENT */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[24px] sm:text-[28px] font-bold text-[#111] leading-none">
                          {INDUSTRY_DATA.reduce(
                            (sum, i) => sum + (Number(i.value) || 0),
                            0,
                          ).toLocaleString("en-IN")}
                        </span>

                        <span className="text-[12px] text-[#888] mt-1">
                          Total
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LEGEND SECTION */}
                  <div
                    className="
                      w-full lg:flex-1
                      flex flex-col
                      gap-3
                      max-h-[260px]
                      overflow-y-auto
                      pr-1
                    "
                  >
                    {INDUSTRY_DATA.map((item, idx) => (
                      <div key={idx} className="flex items-center min-w-0">
                        {/* COLOR DOT */}
                        <span
                          className="shrink-0 mr-2 mt-[2px]"
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: item.color,
                          }}
                        />

                        {/* LABELS */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[13px] sm:text-[14px] text-[#555] truncate">
                            {item.name}
                          </span>

                          <span className="text-[11px] text-[#888]">
                            {item.value.toLocaleString()}
                          </span>
                        </div>

                        {/* PERCENTAGE */}
                        <span className="text-[13px] sm:text-[14px] font-semibold text-[#111] ml-3 shrink-0">
                          {item.pct}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* GRAPH 2: Business Growth Trend */}
              <Card style={{ padding: "16px 20px", minHeight: 320 }}>
                <SectionHeader
                  title="Business Growth Trend"
                  subtitle="New Registrations vs Active Businesses"
                  rightElement={
                    <button
                      style={{
                        background: "#f5f5f5",
                        border: "1px solid #e8e8e8",
                        color: "#555",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                      }}
                    >
                      Monthly <ChevronDown style={{ width: 14, height: 14 }} />
                    </button>
                  }
                />
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={GROWTH_DATA}
                      barGap={4}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#888" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#888" }}
                      />
                      <Tooltip
                        contentStyle={TooltipStyle}
                        itemStyle={{ color: "#555555" }}
                        cursor={{ fill: "rgba(0,0,0,0.02)" }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                      />
                      <Bar
                        dataKey="newReg"
                        name="New Registrations"
                        fill="#3b82f6"
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        dataKey="active"
                        name="Active Businesses"
                        fill="#03D985"
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* ROW B */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              {/* GRAPH 3: Employment & Workforce */}
              <Card
                style={{
                  padding: "16px 20px",
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111111",
                    margin: "0 0 16px 0",
                  }}
                >
                  Employment & Workforce
                </h3>
                <div
                  className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-8
                    xl:gap-5
                    items-start
                  "
                >
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-3 sm:mb-3 md:mb-4 lg:mb-6">
                      <div className="w-9 h-9 rounded-lg bg-[#03D98518] flex items-center justify-center">
                        <Users size={18} color="#03D985" />
                      </div>
                      <div>
                        <div className="text-[12px] text-[#888]">
                          Working Population
                        </div>
                        <div className="text-[16px] font-bold text-[#111]">
                          {workforce.workingPopulation} Lakhs
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:mb-3 md:mb-4 lg:mb-6">
                      <div className="w-9 h-9 rounded-lg bg-[#3b82f618] flex items-center justify-center">
                        <Briefcase size={18} color="#3b82f6" />
                      </div>
                      <div>
                        <div className="text-[12px] text-[#888]">
                          Skilled Workforce
                        </div>
                        <div className="text-[16px] font-bold text-[#111]">
                          {workforce.skilledWorkforce} Lakhs
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:mb-3 md:mb-4 lg:mb-6">
                      <div className="w-9 h-9 rounded-lg bg-[#ef444418] flex items-center justify-center">
                        <TrendingDown size={18} color="#ef4444" />
                      </div>
                      <div>
                        <div className="text-[12px] text-[#888]">
                          Unemployment Rate
                        </div>
                        <div className="text-[16px] font-bold text-[#111]">
                          {workforce.unemploymentRate}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#8b5cf618] flex items-center justify-center">
                        <Users size={18} color="#8b5cf6" />
                      </div>
                      <div>
                        <div className="text-[12px] text-[#888]">
                          Female Workforce
                        </div>
                        <div className="text-[16px] font-bold text-[#111]">
                          {workforce.femaleWorkforce}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full min-w-0">
                    {/* TITLE */}
                    <span className="text-[12px] text-[#888] font-medium">
                      Employment by Sector
                    </span>

                    {/* CHART */}
                    <div className="w-full h-[220px] sm:h-[250px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={SECTOR_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius="58%"
                            outerRadius="82%"
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {SECTOR_DATA.map((entry, i) => (
                              <Cell key={`cell-${i}`} fill={entry.color} />
                            ))}
                          </Pie>

                          <Tooltip
                            contentStyle={TooltipStyle}
                            itemStyle={{ color: "#555555" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* CUSTOM LEGEND */}
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-x-4
                        gap-y-2
                        mt-2
                        px-1
                      "
                    >
                      {SECTOR_DATA.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{
                              backgroundColor: item.color,
                            }}
                          />

                          <span
                            className="
                              text-[12px]
                              sm:text-[13px]
                              text-[#555]
                              whitespace-nowrap
                            "
                          >
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* GRAPH 4: Skill Gap Analysis */}
              <Card style={{ padding: "16px 20px", minHeight: 320 }}>
                <SectionHeader
                  title="Skill Gap Analysis"
                  subtitle="Demand vs Available Skilled Resources"
                  rightElement={
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#03D985",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      View Details
                    </button>
                  }
                />
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={SKILL_DATA}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#888" }}
                      />
                      <YAxis
                        dataKey="skill"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#555", width: 60 }}
                      />
                      <Tooltip
                        contentStyle={TooltipStyle}
                        itemStyle={{ color: "#555555" }}
                        cursor={{ fill: "rgba(0,0,0,0.02)" }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                      />
                      <Bar
                        dataKey="demand"
                        name="Demand"
                        fill="#3b82f6"
                        radius={[0, 3, 3, 0]}
                        barSize={10}
                      />
                      <Bar
                        dataKey="available"
                        name="Available"
                        fill="#03D985"
                        radius={[0, 3, 3, 0]}
                        barSize={10}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* ROW C */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              {/* GRAPH 5: Digital Adoption */}
              <Card style={{ padding: "16px 20px", minHeight: 320 }}>
                <SectionHeader
                  title="Digital Adoption Overview"
                  subtitle="Percentage of Businesses"
                  rightElement={
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#03D985",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      View Report
                    </button>
                  }
                />
                <div className="flex flex-col justify-center h-full pb-4">
                  {ADOPTION_DATA.map((item, idx) => (
                    <div key={idx} className="mb-[14px]">
                      <div className="flex justify-between items-center mb-[6px]">
                        <span className="text-[13px] text-[#555]">
                          {item.label}
                        </span>
                        <span className="text-[13px] font-bold text-[#111]">
                          {item.pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#f0f0f0] rounded-full w-full">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            background: item.color,
                            width: `${item.pct}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* GRAPH 6: Export Analytics Dashboard */}
              <Card style={{ padding: "16px 20px", minHeight: 320 }}>
                <SectionHeader
                  title="Export Analytics"
                  subtitle="Top Products & Destinations"
                />
                <div className="flex flex-col sm:flex-row gap-6 mb-4">
                  <div className="w-full sm:w-1/2">
                    <div style={{ height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={EXPORT_PRODUCTS}
                          layout="vertical"
                          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                        >
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="product"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#555" }}
                            width={80}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(0,0,0,0.02)" }}
                            contentStyle={TooltipStyle}
                          />
                          <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={[0, 3, 3, 0]}
                            barSize={12}
                          >
                            {EXPORT_PRODUCTS.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill="#3b82f6" />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2 flex flex-col justify-center gap-3">
                    {EXPORT_DESTINATIONS.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-lg">{item.flag}</span>
                        <span className="text-[12px] text-[#555] w-20 truncate">
                          {item.country}
                        </span>
                        <div className="flex-1 h-[6px] bg-[#f0f0f0] rounded-full mx-2">
                          <div
                            className="h-full bg-[#03D985] rounded-full"
                            style={{ width: `${item.pct}%` }}
                          ></div>
                        </div>
                        <span className="text-[12px] font-bold text-[#111]">
                          {item.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-[#e8e8e8] pt-4 mt-2">
                  <div className="text-center">
                    <div className="text-[10px] text-[#888] uppercase">
                      Total Export
                    </div>
                    <div className="text-[14px] font-bold text-[#111]">
                      ₹{exportSummary.totalExport.toLocaleString("en-IN")} Cr
                    </div>
                  </div>
                  <div className="w-[1px] h-6 bg-[#e8e8e8]"></div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#888] uppercase">
                      Exporting Units
                    </div>
                    <div className="text-[14px] font-bold text-[#111]">
                      {exportSummary.exportingUnits}
                    </div>
                  </div>
                  <div className="w-[1px] h-6 bg-[#e8e8e8]"></div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#888] uppercase">
                      Countries Exported
                    </div>
                    <div className="text-[14px] font-bold text-[#111]">
                      {exportSummary.countriesExported}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* ROW D */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              {/* GRAPH 7: Industry Health Meter */}
              <Card style={{ padding: "16px 20px", minHeight: 380 }}>
                <SectionHeader
                  title="Industry Health Meter"
                  subtitle="Industry-wise Performance Status"
                  rightElement={
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#03D985",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      View All
                    </button>
                  }
                />
                <div className="flex flex-col h-full">
                  {INDUSTRY_HEALTH.map((item, idx) => (
                    <div
                      key={`health-${idx}`}
                      className="flex items-center py-[10px] border-b border-[#f0f0f0] last:border-0 w-full overflow-hidden"
                    >
                      {/* Column 1: Industry Name */}
                      <span className="text-[13px] font-medium text-[#555] min-w-[130px] truncate">
                        {item.name}
                      </span>

                      {/* Column 2: Colored Score Number */}
                      <span
                        className="text-[13px] font-bold min-w-[28px] text-right shrink-0"
                        style={{ color: item.color }}
                      >
                        {item.score}
                      </span>

                      {/* Column 3: Zigzag Sparkline */}
                      <div className="flex-1 h-[36px] mx-[12px] min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={item.trend.map((v) => ({ v }))}
                            margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
                          >
                            <Line
                              type="monotone"
                              dataKey="v"
                              stroke={item.color}
                              strokeWidth={1.5}
                              dot={false}
                              isAnimationActive={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Column 4: Score Badge Circle */}
                      <div
                        className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.score}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* GRAPH 8: District Economic Map (Leaflet) */}
              <Card style={{ padding: "16px 20px", minHeight: 420 }}>
                <SectionHeader
                  title="District Economic Map"
                  subtitle="Industrial & Infrastructure Zones"
                />

                <div className="w-full relative bg-[#f9fafb] rounded-lg border border-[#f0f0f0] overflow-hidden">
                  <MapContainer
                    center={[25.4484, 78.5685]}
                    zoom={8}
                    style={{
                      height: "320px",
                      width: "100%",
                      borderRadius: "8px",
                      zIndex: 0,
                    }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {MAP_POINTS.map((point, idx) => (
                      <CircleMarker
                        key={`map-point-${idx}`}
                        center={[point.lat, point.lng]}
                        radius={8}
                        pathOptions={{
                          color: point.color,
                          fillColor: point.color,
                          fillOpacity: 0.85,
                          weight: 2,
                        }}
                      >
                        <LeafletTooltip
                          direction="top"
                          offset={[0, -10]}
                          opacity={1}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#111",
                            }}
                          >
                            {point.label}
                          </span>
                          <br />
                          <span style={{ fontSize: 11, color: "#888" }}>
                            {point.category}
                          </span>
                        </LeafletTooltip>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>

                {/* Map Legend */}
                <div className="flex flex-wrap items-center justify-center gap-[12px] mt-[12px]">
                  {MAP_LEGEND.map((legendItem, idx) => (
                    <div
                      key={`legend-${idx}`}
                      className="flex items-center gap-[6px]"
                    >
                      <div
                        className="w-[10px] h-[10px] rounded-full"
                        style={{ backgroundColor: legendItem.color }}
                      ></div>
                      <span className="text-[11px] text-[#555]">
                        {legendItem.category}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ROW 6 — BOTTOM STATS STRIP */}
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0">
                {BOTTOM_STATS.map((stat, idx) => {
                  const isLast = idx === BOTTOM_STATS.length - 1;
                  return (
                    <div
                      key={idx}
                      className="flex flex-row items-center gap-3 px-3 py-4 transition-colors duration-200 cursor-default hover:bg-[#fafafa]"
                      style={{
                        borderRight: isLast ? "none" : "1px solid #e8e8e8",
                      }}
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#03D98518] flex items-center justify-center shrink-0">
                        <stat.icon
                          style={{ width: 18, height: 18, color: "#03D985" }}
                        />
                      </div>
                      <div className="flex flex-col justify-center truncate">
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#111111",
                          }}
                          className=""
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#888888",
                            marginTop: 2,
                          }}
                          className="truncate"
                        >
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
