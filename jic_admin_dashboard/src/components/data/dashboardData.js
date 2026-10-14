import { 
  Users, Building2, Factory, Globe, ShieldCheck, 
  BarChart2, MapPin, Briefcase, GraduationCap, 
  Zap, Wifi, BookOpen, Award, TrendingUp, TrendingDown
} from 'lucide-react';

export const KPI_ROW_1 = [
  { icon: Factory, iconColor: '#3b82f6', label: "District GDP", value: "₹18,752 Cr", trend: "+12.4% vs LY", trendUp: true },
  { icon: Users, iconColor: '#f97316', label: "Per Capita Income", value: "₹1,62,417", trend: "+8.7% vs LY", trendUp: true },
  { icon: Globe, iconColor: '#8b5cf6', label: "Total Population", value: "31.39 Lakhs", trend: "+1.2% vs LY", trendUp: true },
  { icon: Briefcase, iconColor: '#03D985', label: "Employment Rate", value: "78.3%", trend: "+4.6% vs LY", trendUp: true },
  { icon: Factory, iconColor: '#f59e0b', label: "Total Industries", value: "4,285", trend: "+9.3% vs LY", trendUp: true },
  { icon: Globe, iconColor: '#ef4444', label: "Total Exports", value: "₹1,128 Cr", trend: "+18.6% vs LY", trendUp: true }
];

export const KPI_ROW_2 = [
  { icon: Building2, iconColor: '#06b6d4', label: "Total Registered Businesses", value: "6,842", trend: "+11.2% vs LY", trendUp: true },
  { icon: ShieldCheck, iconColor: '#8b5cf6', label: "Active MSMEs", value: "3,512", trend: "+10.7% vs LY", trendUp: true },
  { icon: Zap, iconColor: '#f97316', label: "Startup Count", value: "284", trend: "+22.4% vs LY", trendUp: true },
  { icon: TrendingUp, iconColor: '#03D985', label: "Industrial Growth %", value: "14.8%", trend: "+3.2% vs LY", trendUp: true },
  { icon: BarChart2, iconColor: '#3b82f6', label: "Tax Revenue Contribution", value: "₹842 Cr", trend: "+7.9% vs LY", trendUp: true },
  { icon: Award, iconColor: '#f59e0b', label: "Exporters Count", value: "214", trend: "+15.3% vs LY", trendUp: true }
];

export const INDUSTRY_DATA = [
  { name: 'Mining', value: 1221, pct: '28.5%', color: '#3b82f6' },
  { name: 'Retail & Wholesale', value: 1041, pct: '24.3%', color: '#f97316' },
  { name: 'Manufacturing', value: 714, pct: '16.7%', color: '#03D985' },
  { name: 'Agriculture', value: 420, pct: '9.8%', color: '#f59e0b' },
  { name: 'Education', value: 262, pct: '6.1%', color: '#8b5cf6' },
  { name: 'Services', value: 231, pct: '5.4%', color: '#06b6d4' },
  { name: 'Logistics', value: 180, pct: '4.2%', color: '#ec4899' },
  { name: 'Healthcare', value: 124, pct: '2.9%', color: '#14b8a6' },
  { name: 'Tourism', value: 92, pct: '2.1%', color: '#a78bfa' },
];

export const GROWTH_DATA = [
  { month:'Apr', newReg:320, active:4100 }, { month:'May', newReg:280, active:4200 },
  { month:'Jun', newReg:350, active:4350 }, { month:'Jul', newReg:410, active:4500 },
  { month:'Aug', newReg:380, active:4650 }, { month:'Sep', newReg:290, active:4700 },
  { month:'Oct', newReg:440, active:4900 }, { month:'Nov', newReg:390, active:5050 },
  { month:'Dec', newReg:420, active:5200 }, { month:'Jan', newReg:460, active:5400 },
  { month:'Feb', newReg:350, active:5500 }, { month:'Mar', newReg:480, active:5700 },
];

export const SECTOR_DATA = [
  { name: 'Mining', value: 31, color: '#3b82f6' },
  { name: 'Manufacturing', value: 18, color: '#03D985' },
  { name: 'Agriculture', value: 17, color: '#f59e0b' },
  { name: 'Services', value: 14, color: '#8b5cf6' },
  { name: 'Retail', value: 10, color: '#ef4444' },
  { name: 'Logistics', value: 5, color: '#06b6d4' },
  { name: 'Healthcare', value: 3, color: '#ec4899' },
  { name: 'Tourism', value: 2, color: '#14b8a6' },
];

export const SKILL_DATA = [
  { skill: 'IT & Software', demand: 2400, available: 1200 },
  { skill: 'Sales & Mktg', demand: 1800, available: 900 },
  { skill: 'Manufacturing', demand: 2100, available: 1800 },
  { skill: 'Healthcare', demand: 1600, available: 800 },
  { skill: 'Logistics', demand: 1400, available: 1100 },
  { skill: 'Finance', demand: 1200, available: 700 },
  { skill: 'Mining Ops', demand: 2800, available: 2200 },
  { skill: 'Construction', demand: 1900, available: 1600 },
];

export const ADOPTION_DATA = [
  { label: 'Has Website', pct: 32.4, color: '#3b82f6' },
  { label: 'Social Media', pct: 48.7, color: '#03D985' },
  { label: 'Digital Payments', pct: 62.1, color: '#f97316' },
  { label: 'E-commerce Enabled', pct: 18.3, color: '#8b5cf6' },
  { label: 'Uses CRM / ERP', pct: 14.6, color: '#ef4444' },
  { label: 'Online Sales', pct: 24.8, color: '#06b6d4' },
];

export const EXPORT_PRODUCTS = [
  { product: 'Limestone', value: 428, pct: '42%' },
  { product: 'Stone & Tiles', value: 183, pct: '18%' },
  { product: 'Agri Products', value: 122, pct: '12%' },
  { product: 'Handicrafts', value: 82, pct: '8%' },
  { product: 'Others', value: 204, pct: '20%' },
];

export const EXPORT_DESTINATIONS = [
  { country: 'UAE', flag: '🇦🇪', pct: 28 },
  { country: 'China', flag: '🇨🇳', pct: 17 },
  { country: 'USA', flag: '🇺🇸', pct: 15 },
  { country: 'Bangladesh', flag: '🇧🇩', pct: 10 },
  { country: 'Others', flag: '🌐', pct: 30 },
];

export const INDUSTRY_HEALTH = [
  { name: 'Mining',             score: 82, color: '#03D985', trend: [74,77,73,79,76,81,78,82,79,83,80,84,81,83,82] },
  { name: 'Manufacturing',      score: 75, color: '#03D985', trend: [68,71,69,73,70,74,72,76,73,75,72,77,74,76,75] },
  { name: 'Retail & Wholesale', score: 68, color: '#f59e0b', trend: [64,67,65,69,66,68,65,70,67,69,66,70,67,69,68] },
  { name: 'Agriculture',        score: 65, color: '#f59e0b', trend: [61,64,62,66,63,65,62,67,64,66,63,67,64,66,65] },
  { name: 'Education',          score: 60, color: '#f59e0b', trend: [57,60,58,62,59,61,58,62,59,61,58,62,59,61,60] },
  { name: 'Services',           score: 57, color: '#f59e0b', trend: [53,56,54,58,55,57,54,58,55,57,54,59,56,58,57] },
  { name: 'Tourism',            score: 45, color: '#ef4444', trend: [55,52,57,50,54,48,52,46,50,47,49,45,48,46,45] },
  { name: 'Logistics',          score: 40, color: '#ef4444', trend: [50,47,52,44,49,43,47,42,45,43,44,41,43,41,40] },
];

export const MAP_POINTS = [
  { label: 'Industrial Cluster', lat: 24.5700, lng: 80.8322, color: '#3b82f6',  category: 'Industrial Cluster' },
  { label: 'Mining Area (Maihar)', lat: 24.2617, lng: 80.7561, color: '#f59e0b', category: 'Mining Area' },
  { label: 'Mining Area (Raghurajnagar)', lat: 24.7800, lng: 80.7200, color: '#f59e0b', category: 'Mining Area' },
  { label: 'MSME Unit (Satna)', lat: 24.5850, lng: 80.8500, color: '#03D985',  category: 'MSME Unit' },
  { label: 'Education Hub (Birsinghpur)', lat: 24.6800, lng: 80.9700, color: '#8b5cf6', category: 'Education Institute' },
  { label: 'Skill Center (Nagod)', lat: 24.5600, lng: 80.5900, color: '#06b6d4', category: 'Skill Center' },
  { label: 'Warehouse Zone (Rampur Baghelan)', lat: 24.3900, lng: 81.0100, color: '#ec4899', category: 'Warehouse' },
  { label: 'High Unemp. Zone (Unchahara)', lat: 24.3700, lng: 80.6800, color: '#ef4444', category: 'High Unemployment Zone' },
  { label: 'Mining Area (Amarpatan)', lat: 24.3200, lng: 81.0300, color: '#f59e0b', category: 'Mining Area' },
  { label: 'MSME Unit (Maihar)', lat: 24.2617, lng: 80.7500, color: '#03D985',  category: 'MSME Unit' },
  { label: 'Skill Center (Majhgawan)', lat: 24.6700, lng: 80.7300, color: '#06b6d4', category: 'Skill Center' },
  { label: 'Industrial Cluster (Ramnagar)', lat: 24.2000, lng: 81.1200, color: '#3b82f6',  category: 'Industrial Cluster' },
];

export const MAP_LEGEND = [
  { category: 'Industrial Cluster',    color: '#3b82f6' },
  { category: 'Mining Area',           color: '#f59e0b' },
  { category: 'MSME Unit',             color: '#03D985' },
  { category: 'Education Institute',   color: '#8b5cf6' },
  { category: 'Skill Center',          color: '#06b6d4' },
  { category: 'Warehouse',             color: '#ec4899' },
  { category: 'High Unemployment Zone',color: '#ef4444' },
];

export const BOTTOM_STATS = [
  { icon: BookOpen, value: "79.3%", label: "Literacy Rate" },
  { icon: Users, value: "11.48 Lakhs", label: "Youth (15-35)" },
  { icon: GraduationCap, value: "42", label: "No. of Colleges" },
  { icon: Award, value: "18", label: "No. of ITIs" },
  { icon: Zap, value: "26", label: "Skill Centers" },
  { icon: MapPin, value: "95%", label: "Road Connectivity" },
  { icon: Wifi, value: "68%", label: "Internet Penetration" },
];