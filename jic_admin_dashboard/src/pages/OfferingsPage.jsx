import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { Sparkles } from 'lucide-react';
import { offeringData } from '../components/data/offeringData';
import OfferingCard from '../components/offerings/OfferingCard';
import OfferingModal from '../components/offerings/OfferingModal';

const OfferingsPage = () => {
  // Sidebar state for dashboard layout
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Offering selection states
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (offering) => {
    setSelectedOffering(offering);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Timeout added to let exit animation run in the Modal component
    setTimeout(() => setSelectedOffering(null), 300);
  };

  return (
    <div className="flex h-screen overflow-hidden font-['Sora']">
      
      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area Wrapper */}
      <div 
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out main-content-scroll" 
        style={{ background: '#f5f5f5' }}
      >
        
        {/* Header Component */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full max-w-[1920px] mx-auto">
            
            {/* Global Styles for Animations */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(24px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes pulse-badge {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.06); }
              }
              @keyframes modalIn {
                from { opacity: 0; transform: scale(0.92); }
                to { opacity: 1; transform: scale(1); }
              }
              @keyframes modalOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.92); }
              }
              @keyframes shimmerBorder {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              @keyframes featureIn {
                from { opacity: 0; transform: translateX(-12px); }
                to { opacity: 1; transform: translateX(0); }
              }
              .shimmer-banner {
                background-size: 200% auto;
                animation: shimmerBorder 8s linear infinite;
              }
            `}} />

            {/* Page Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-[26px] font-[700] text-[#111111] m-0 mb-1">
                  Our Offerings
                </h1>
                <p className="text-[14px] text-[#888888] m-0">
                  Explore our powerful integrations and AI solutions for your business.
                </p>
              </div>
              <div 
                className="rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-wide"
                style={{ 
                  background: 'rgba(3,217,133,0.1)', 
                  border: '1px solid rgba(3,217,133,0.25)', 
                  color: '#02b870' 
                }}
              >
                {offeringData.length} Solutions Available
              </div>
            </div>

            {/* Intro Banner */}
            {/* <div 
              className="w-full rounded-[16px] p-4 sm:p-6 flex items-center gap-5 shimmer-banner mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(3,217,133,0.06) 0%, rgba(3,217,133,0.02) 100%)',
                border: '1px solid rgba(3,217,133,0.12)',
                animation: 'fadeInUp 0.6s ease-out both'
              }}
            >
              <div className="bg-[#03D985]/10 p-3 rounded-full hidden sm:block">
                <Sparkles className="text-[#03D985]" size={28} />
              </div>
              <div>
                <h2 className="text-[#111] text-[18px] font-bold mb-1">Transform Your Business with Smart Integrations</h2>
                <p className="text-[#555] text-[14px] m-0">From WhatsApp automation to AI calling agents — pick the tools that grow with you.</p>
              </div>
            </div> */}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {offeringData.map((offering, index) => (
                <OfferingCard
                  key={offering.id}
                  offering={offering}
                  onClick={handleCardClick}
                  style={{
                    animation: 'fadeInUp 0.5s ease-out both',
                    animationDelay: `${index * 80}ms`
                  }}
                />
              ))}
            </div>

            {/* Modal Rendering */}
            {modalOpen && selectedOffering && (
              <OfferingModal
                offering={selectedOffering}
                onClose={handleCloseModal}
              />
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default OfferingsPage;












// version - 3
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import { 
//   MessageCircle, 
//   Globe, 
//   BadgeInfo, 
//   Brain, 
//   Bot, 
//   Phone, 
//   CheckCircle, 
//   Play, 
//   Volume2, 
//   Maximize, 
//   Calendar, 
//   ArrowRight,
//   Sparkles
// } from 'lucide-react';

// // ==========================================
// // OPTIMIZED SUB-COMPONENTS
// // ==========================================

// // Performant counter using requestAnimationFrame
// const StatCounter = ({ end, suffix = "", duration = 2000 }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let startTimestamp = null;
//     const step = (timestamp) => {
//       if (!startTimestamp) startTimestamp = timestamp;
//       const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//       // easeOutQuart for premium deceleration effect
//       const easeOut = 1 - Math.pow(1 - progress, 4);
      
//       setCount(Math.floor(easeOut * end));
      
//       if (progress < 1) {
//         window.requestAnimationFrame(step);
//       }
//     };
//     window.requestAnimationFrame(step);
//   }, [end, duration]);

//   return <span>{count}{suffix}</span>;
// };

// // Reusable Offering Card Component
// const OfferingCard = ({ data, index }) => {
//   const isAI = data.tag === "Artificial Intelligence";
//   const bgOpacityHex = "26"; // ~15% opacity for hex colors

//   return (
//     <div 
//       className={`group relative flex flex-col bg-white rounded-[14px] p-6 animate-reveal ${isAI ? 'ai-glow-card' : ''}`}
//       style={{ 
//         boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
//         animationDelay: `${index * 0.1}s`,
//         transition: 'all 0.25s ease'
//       }}
//     >
//       {/* Popular Badge for AI Card */}
//       {isAI && (
//         <div 
//           className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full"
//           style={{ background: '#03D985', color: '#111111', fontSize: '10px', fontWeight: 700 }}
//         >
//           <Sparkles size={10} />
//           POPULAR
//         </div>
//       )}

//       {/* Card Header: Icon & Tag */}
//       <div className="flex items-center gap-4 mb-4">
//         <div 
//           className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0"
//           style={{ 
//             background: data.isGradient ? 'rgba(225, 48, 108, 0.15)' : `${data.baseColor}${bgOpacityHex}`
//           }}
//         >
//           <data.icon 
//             size={24} 
//             color={data.isGradient ? undefined : data.baseColor}
//             style={data.isGradient ? { stroke: 'url(#ig-grad)' } : {}}
//           />
//           {/* SVG Gradient Definition for Instagram */}
//           {data.isGradient && (
//             <svg width="0" height="0">
//               <linearGradient id="ig-grad" x1="100%" y1="100%" x2="0%" y2="0%">
//                 <stop stopColor="#F77737" offset="0%" />
//                 <stop stopColor="#E1306C" offset="100%" />
//               </linearGradient>
//             </svg>
//           )}
//         </div>
        
//         <div 
//           className="px-3 py-1 rounded-full flex items-center gap-1.5"
//           style={{ 
//             background: data.isGradient ? 'rgba(225, 48, 108, 0.15)' : `${data.baseColor}${bgOpacityHex}`,
//             color: data.isGradient ? '#E1306C' : data.baseColor,
//             fontSize: '11px',
//             fontWeight: 700
//           }}
//         >
//           {data.tag}
//         </div>
//       </div>

//       {/* Card Body */}
//       <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111111', marginTop: '4px' }}>
//         {data.title}
//       </h3>
//       <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.6, marginTop: '8px', flexGrow: 1 }}>
//         {data.description}
//       </p>

//       {/* Card Footer */}
//       <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#f0f0f0]">
//         <button 
//           className="flex items-center gap-1.5 transition-transform duration-200 group-hover:translate-x-1"
//           style={{ color: '#03D985', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
//         >
//           Learn More <ArrowRight size={14} />
//         </button>
        
//         <button 
//           className="cta-button"
//           style={{ 
//             background: '#03D985', 
//             color: '#111111', 
//             fontWeight: 700, 
//             borderRadius: '8px', 
//             border: 'none',
//             padding: '8px 16px', 
//             fontSize: '13px',
//             cursor: 'pointer',
//             transition: 'all 0.2s ease'
//           }}
//         >
//           {data.cta}
//         </button>
//       </div>
//     </div>
//   );
// };


// // ==========================================
// // MAIN PAGE COMPONENT
// // ==========================================

// export default function OfferingsPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const offeringsData = [
//     {
//       title: 'WhatsApp Business Integration',
//       tag: 'Communication',
//       icon: MessageCircle,
//       baseColor: '#25D366',
//       description: 'Connect with customers via WhatsApp Business API. Send automated messages, order updates, and support tickets directly from your dashboard.',
//       cta: 'Get Started'
//     },
//     {
//       title: 'Instagram Integration',
//       tag: 'Social Media',
//       icon: Globe,
//       baseColor: '#E1306C',
//       isGradient: true,
//       description: 'Track followers, engagement rates, post performance, and DMs from a unified Instagram business hub.',
//       cta: 'Connect Now'
//     },
//     {
//       title: 'Facebook Engagement Tracker',
//       tag: 'Analytics',
//       icon: BadgeInfo,
//       baseColor: '#1877F2',
//       description: 'Monitor page likes, post reach, ad performance, and audience demographics — all in real-time from your dashboard.',
//       cta: 'Start Tracking'
//     },
//     {
//       title: 'AI Integration for Businesses',
//       tag: 'Artificial Intelligence',
//       icon: Brain,
//       baseColor: '#03D985',
//       description: 'Supercharge operations with AI-powered insights, demand forecasting, anomaly detection, and smart recommendations tailored for your district.',
//       cta: 'Explore AI'
//     },
//     {
//       title: 'Chatbot Integration',
//       tag: 'Automation',
//       icon: Bot,
//       baseColor: '#8b5cf6',
//       description: 'Deploy intelligent chatbots on your website and platforms. Handle 1000s of customer queries 24/7 with zero manual effort.',
//       cta: 'Deploy Bot'
//     },
//     {
//       title: 'AI Calling Agent',
//       tag: 'Voice AI',
//       icon: Phone,
//       baseColor: '#f59e0b',
//       description: 'AI-powered voice agents that handle inbound/outbound calls, qualify leads, and schedule appointments — entirely hands-free.',
//       cta: 'Try Calling Agent'
//     }
//   ];

//   return (
//     <div className="flex h-screen overflow-hidden font-sora">
//       {/* Required Internal Styles for specialized animations */}
//       <style>{`
//         @keyframes cardReveal {
//           0% { opacity: 0; transform: translateY(20px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .animate-reveal {
//           animation: cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//           opacity: 0;
//         }
//         .ai-glow-card {
//           box-shadow: 0 0 0 2px rgba(3,217,133,0.4), 0 4px 16px rgba(0,0,0,0.06) !important;
//           animation: cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards, pulseBorder 3s infinite ease-in-out;
//         }
//         @keyframes pulseBorder {
//           0% { box-shadow: 0 0 0 2px rgba(3,217,133,0.3), 0 4px 16px rgba(0,0,0,0.06); }
//           50% { box-shadow: 0 0 0 4px rgba(3,217,133,0.6), 0 8px 24px rgba(3,217,133,0.15); }
//           100% { box-shadow: 0 0 0 2px rgba(3,217,133,0.3), 0 4px 16px rgba(0,0,0,0.06); }
//         }
//         .group:hover {
//           transform: translateY(-6px);
//           box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important;
//         }
//         .ai-glow-card.group:hover {
//           box-shadow: 0 0 0 2px rgba(3,217,133,0.6), 0 16px 40px rgba(3,217,133,0.2) !important;
//         }
//         .cta-button:hover {
//           background: #02b870 !important;
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(3,217,133,0.3);
//         }
//         .play-btn-glow {
//           box-shadow: 0 0 0 12px rgba(3,217,133,0.15), 0 0 0 24px rgba(3,217,133,0.07);
//           transition: all 0.3s ease;
//         }
//         .play-btn-glow:hover {
//           transform: scale(1.08) translate(-50%, -50%) !important;
//           box-shadow: 0 0 0 16px rgba(3,217,133,0.2), 0 0 0 32px rgba(3,217,133,0.1);
//         }
//       `}</style>

//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
//       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden" style={{ background: '#f5f5f5' }}>
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
//         <main className="grow">
//           <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full max-w-[1920px] mx-auto">
            
//             {/* SECTION 1: Header */}
//             <div className="flex justify-between items-center mb-8 flex-wrap gap-4 animate-reveal">
//               <div>
//                 <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111111', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
//                   Our Offerings
//                 </h1>
//                 <p style={{ fontSize: 15, color: '#888888', margin: 0 }}>
//                   Explore powerful integrations & AI solutions for your business
//                 </p>
//               </div>
//             </div>

//             {/* SECTION 2: Cards Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
//               {offeringsData.map((data, idx) => (
//                 <OfferingCard key={idx} data={data} index={idx} />
//               ))}
//             </div>

//             {/* SECTION 3: Stats Strip */}
//             <div 
//               className="w-full bg-white rounded-2xl mb-10 animate-reveal flex flex-col md:flex-row items-center justify-between"
//               style={{ padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', animationDelay: '0.6s' }}
//             >
//               {[
//                 { value: 500, suffix: '+', label: 'Businesses Integrated' },
//                 { value: 98, suffix: '%', label: 'Customer Satisfaction' },
//                 { value: 24, suffix: '/7', label: 'AI Support Available' },
//                 { value: 6, suffix: '', label: 'Powerful Integrations' }
//               ].map((stat, idx) => (
//                 <React.Fragment key={idx}>
//                   <div className="flex flex-col items-center justify-center w-full md:w-1/4 py-4 md:py-0">
//                     <div style={{ fontSize: '32px', fontWeight: 800, color: '#03D985', lineHeight: 1 }}>
//                       <StatCounter end={stat.value} suffix={stat.suffix} />
//                     </div>
//                     <div style={{ fontSize: '13px', color: '#888888', fontWeight: 600, marginTop: '8px' }}>
//                       {stat.label}
//                     </div>
//                   </div>
//                   {idx < 3 && (
//                     <div className="hidden md:block w-px h-12 bg-[#e8e8e8]"></div>
//                   )}
//                   {idx < 3 && (
//                     <div className="block md:hidden h-px w-3/4 bg-[#e8e8e8] my-2"></div>
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>

//             {/* SECTION 4: Video Section */}
//             <div 
//               className="w-full bg-white rounded-2xl p-6 sm:p-8 lg:p-10 animate-reveal"
//               style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', animationDelay: '0.7s' }}
//             >
//               <div className="flex flex-col lg:flex-row gap-10 items-center">
                
//                 {/* Left Column (55%) */}
//                 <div className="w-full lg:w-[55%]">
//                   <div 
//                     className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
//                     style={{ background: 'rgba(3,217,133,0.15)', color: '#02945a', fontSize: '12px', fontWeight: 700 }}
//                   >
//                     <Play size={12} fill="currentColor" /> Watch Demo
//                   </div>
                  
//                   <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111111', lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.02em' }}>
//                     See How It Works
//                   </h2>
//                   <p style={{ fontSize: '15px', color: '#555555', lineHeight: 1.6, marginBottom: '28px', maxWidth: '90%' }}>
//                     From WhatsApp automation to AI voice calling — watch how our platform transforms your business operations in under 3 minutes.
//                   </p>

//                   <div className="flex flex-col gap-4 mb-8">
//                     {[
//                       "Live integration walkthrough",
//                       "Real business use cases from Madhya Pradesh",
//                       "Setup in under 10 minutes"
//                     ].map((item, i) => (
//                       <div key={i} className="flex items-center gap-3">
//                         <CheckCircle size={20} color="#03D985" />
//                         <span style={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>{item}</span>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex flex-wrap items-center gap-6">
//                     <button 
//                       className="cta-button flex items-center gap-2"
//                       style={{ 
//                         background: '#03D985', color: '#111111', fontWeight: 700, 
//                         borderRadius: '8px', border: 'none', padding: '12px 24px', 
//                         fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease'
//                       }}
//                     >
//                       <Calendar size={18} /> Schedule a Demo
//                     </button>
                    
//                     <button 
//                       style={{ 
//                         color: '#03D985', fontSize: '14px', fontWeight: 600, 
//                         background: 'none', border: 'none', padding: 0, cursor: 'pointer' 
//                       }}
//                       className="hover:text-[#02b870] transition-colors"
//                     >
//                       View Documentation &rarr;
//                     </button>
//                   </div>
//                 </div>

//                 {/* Right Column (45%) */}
//                 <div className="w-full lg:w-[45%]">
//                   <div 
//                     className="relative w-full rounded-2xl overflow-hidden shadow-xl"
//                     style={{ 
//                       aspectRatio: '16/9', 
//                       background: 'linear-gradient(135deg, #1a1a2e, #0f3460, #00120b)',
//                     }}
//                   >
//                     {/* Subtle green overlay for brand matching */}
//                     <div className="absolute inset-0 bg-[#03D985] opacity-5 mix-blend-overlay pointer-events-none"></div>

//                     {/* Central Play Button */}
//                     <button 
//                       className="play-btn-glow absolute top-1/2 left-1/2 rounded-full bg-white flex items-center justify-center cursor-pointer border-none z-10"
//                       style={{ width: '72px', height: '72px', transform: 'translate(-50%, -50%)', paddingLeft: '4px' }}
//                     >
//                       <Play size={32} color="#03D985" fill="#03D985" />
//                     </button>

//                     {/* Video Info Overlay */}
//                     <div className="absolute bottom-12 left-6 z-10">
//                       <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
//                         Our Platform Overview
//                       </div>
//                       <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '2px' }}>
//                         3:42 min
//                       </div>
//                     </div>

//                     {/* Fake Progress Bar & Controls */}
//                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent flex flex-col gap-3">
//                       {/* Progress Bar */}
//                       <div className="w-full h-[3px] bg-[rgba(255,255,255,0.2)] rounded-full overflow-hidden cursor-pointer">
//                         <div className="h-full bg-[#03D985] w-[15%] rounded-full relative">
//                           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
//                         </div>
//                       </div>
                      
//                       {/* Controls Row */}
//                       <div className="flex justify-between items-center px-1">
//                         <div className="flex items-center gap-4 text-[rgba(255,255,255,0.8)]">
//                           <Play size={14} fill="currentColor" className="cursor-pointer hover:text-white" />
//                           <Volume2 size={14} className="cursor-pointer hover:text-white" />
//                           <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>0:34 / 3:42</span>
//                         </div>
//                         <Maximize size={14} className="text-[rgba(255,255,255,0.8)] cursor-pointer hover:text-white" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>

//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
















// version - 2 
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import { 
//   MessageCircle, 
//   Globe, 
//   BadgeInfo, 
//   Brain, 
//   Bot, 
//   Phone, 
//   CheckCircle, 
//   Play, 
//   Volume2, 
//   Maximize, 
//   Calendar, 
//   ArrowRight,
//   Sparkles,
//   Zap
// } from 'lucide-react';

// export default function OfferingsPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
  
//   // Stats counter state
//   const [stats, setStats] = useState({
//     businesses: 0,
//     satisfaction: 0,
//     support: 0,
//     integrations: 0
//   });

//   // Animate stats on mount - standard approach for numerical engagement
//   useEffect(() => {
//     const duration = 2000;
//     const steps = 60;
//     const interval = duration / steps;
    
//     let currentStep = 0;
    
//     const timer = setInterval(() => {
//       currentStep++;
//       const progress = currentStep / steps;
//       // Using easeOutQuart for smooth deceleration
//       const easeOut = 1 - Math.pow(1 - progress, 4);
      
//       setStats({
//         businesses: Math.floor(easeOut * 500),
//         satisfaction: Math.floor(easeOut * 98),
//         support: Math.floor(easeOut * 24),
//         integrations: Math.floor(easeOut * 6)
//       });

//       if (currentStep >= steps) clearInterval(timer);
//     }, interval);

//     return () => clearInterval(timer);
//   }, []);

//   const OFFERING_CARDS = [
//     {
//       id: 'whatsapp',
//       title: 'WhatsApp Business Integration',
//       tag: 'Communication',
//       icon: MessageCircle,
//       color: '#25D366',
//       desc: 'Connect with customers via WhatsApp Business API. Send automated messages, order updates, and support tickets directly from your dashboard.',
//       cta: 'Get Started'
//     },
//     {
//       id: 'instagram',
//       title: 'Instagram Integration',
//       tag: 'Social Media',
//       icon: Globe,
//       color: '#E1306C', // Using standard solid for base, gradient handled in render
//       desc: 'Track followers, engagement rates, post performance, and DMs from a unified Instagram business hub.',
//       cta: 'Connect Now'
//     },
//     {
//       id: 'facebook',
//       title: 'Facebook Engagement Tracker',
//       tag: 'Analytics',
//       icon: BadgeInfo,
//       color: '#1877F2',
//       desc: 'Monitor page likes, post reach, ad performance, and audience demographics — all in real-time from your dashboard.',
//       cta: 'Start Tracking'
//     },
//     {
//       id: 'ai-insights',
//       title: 'AI Integration for Businesses',
//       tag: 'Artificial Intelligence',
//       icon: Brain,
//       color: '#03D985',
//       desc: 'Supercharge operations with AI-powered insights, demand forecasting, anomaly detection, and smart recommendations tailored for your district.',
//       cta: 'Explore AI',
//       isPopular: true
//     },
//     {
//       id: 'chatbot',
//       title: 'Chatbot Integration',
//       tag: 'Automation',
//       icon: Bot,
//       color: '#8b5cf6',
//       desc: 'Deploy intelligent chatbots on your website and platforms. Handle 1000s of customer queries 24/7 with zero manual effort.',
//       cta: 'Deploy Bot'
//     },
//     {
//       id: 'ai-voice',
//       title: 'AI Calling Agent',
//       tag: 'Voice AI',
//       icon: Phone,
//       color: '#f59e0b',
//       desc: 'AI-powered voice agents that handle inbound/outbound calls, qualify leads, and schedule appointments — entirely hands-free.',
//       cta: 'Try Calling Agent'
//     }
//   ];

//   return (
//     <div className="flex h-screen overflow-hidden font-sora">
//       <style>{`
//         .font-sora { font-family: 'Sora', sans-serif; }
        
//         @keyframes cardReveal {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
        
//         .animate-reveal {
//           animation: cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//           opacity: 0;
//         }

//         .premium-card {
//           background: #ffffff;
//           border-radius: 14px;
//           box-shadow: 0 4px 16px rgba(0,0,0,0.06);
//           transition: transform 0.25s ease, box-shadow 0.25s ease;
//         }
        
//         .premium-card:hover {
//           transform: translateY(-6px);
//           box-shadow: 0 12px 32px rgba(0,0,0,0.12);
//         }

//         .ai-glow-card {
//           box-shadow: 0 0 0 2px rgba(3,217,133,0.4), 0 4px 16px rgba(0,0,0,0.06);
//         }
        
//         .ai-glow-card:hover {
//           box-shadow: 0 0 0 2px rgba(3,217,133,0.8), 0 12px 32px rgba(3,217,133,0.2);
//         }

//         .btn-primary {
//           background: #03D985;
//           color: #000;
//           font-weight: 700;
//           border-radius: 8px;
//           border: none;
//           padding: 8px 16px;
//           font-size: 14px;
//           transition: all 0.2s ease;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//         }
        
//         .btn-primary:hover {
//           background: #02b870;
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(3, 217, 133, 0.25);
//         }

//         .play-btn-wrapper {
//           transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//         }
        
//         .play-btn-wrapper:hover {
//           transform: scale(1.08);
//         }
        
//         .play-btn-glow {
//           box-shadow: 0 0 0 12px rgba(3,217,133,0.15), 0 0 0 24px rgba(3,217,133,0.07);
//           transition: box-shadow 0.3s ease;
//         }
        
//         .play-btn-wrapper:hover .play-btn-glow {
//           box-shadow: 0 0 0 16px rgba(3,217,133,0.2), 0 0 0 32px rgba(3,217,133,0.1);
//         }

//         /* Standardize scrollbar */
//         .main-content-scroll::-webkit-scrollbar { width: 6px; }
//         .main-content-scroll::-webkit-scrollbar-track { background: transparent; }
//         .main-content-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
//         .main-content-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
//       `}</style>

//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
//       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden main-content-scroll" style={{ background: '#f5f5f5' }}>
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
//         <main className="grow">
//           <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full max-w-[1920px] mx-auto">
            
//             {/* Section 1 — Page Header */}
//             <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//               <div>
//                 <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111111', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
//                   Our Offerings
//                 </h1>
//                 <p style={{ fontSize: 15, color: '#888888', margin: 0 }}>
//                   Explore powerful integrations & AI solutions for your business
//                 </p>
//               </div>
//               <button className="btn-primary" style={{ padding: '10px 20px' }}>
//                 <Zap size={16} className="mr-2" />
//                 View All Plans
//               </button>
//             </div>

//             {/* Section 2 — Offering Cards Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
//               {OFFERING_CARDS.map((card, index) => (
//                 <div 
//                   key={card.id} 
//                   className={`premium-card relative flex flex-col h-full animate-reveal ${card.isPopular ? 'ai-glow-card' : ''}`}
//                   style={{ 
//                     padding: '24px',
//                     animationDelay: `${index * 0.1}s` 
//                   }}
//                 >
//                   {/* Popular Badge */}
//                   {card.isPopular && (
//                     <div 
//                       className="absolute top-4 right-4 flex items-center gap-1"
//                       style={{ 
//                         background: '#03D985', 
//                         color: '#111111', 
//                         fontSize: 10, 
//                         fontWeight: 700, 
//                         borderRadius: 20, 
//                         padding: '4px 10px',
//                         boxShadow: '0 2px 8px rgba(3, 217, 133, 0.3)'
//                       }}
//                     >
//                       <Sparkles size={12} />
//                       POPULAR
//                     </div>
//                   )}

//                   {/* Icon & Tag Row */}
//                   <div className="flex items-center gap-4 mb-4">
//                     <div 
//                       className="flex items-center justify-center shrink-0"
//                       style={{ 
//                         width: 48, 
//                         height: 48, 
//                         borderRadius: 12, 
//                         background: card.id === 'instagram' 
//                           ? 'linear-gradient(135deg, rgba(225,48,108,0.15), rgba(247,119,55,0.15))' 
//                           : `${card.color}20` 
//                       }}
//                     >
//                       <card.icon 
//                         size={24} 
//                         style={{ 
//                           color: card.id === 'instagram' ? '#E1306C' : card.color 
//                         }} 
//                       />
//                     </div>
//                     <div 
//                       style={{ 
//                         background: `${card.color}15`, 
//                         color: card.id === 'instagram' ? '#E1306C' : card.color, 
//                         fontSize: 11, 
//                         fontWeight: 700, 
//                         padding: '4px 10px', 
//                         borderRadius: 100,
//                         textTransform: 'uppercase',
//                         letterSpacing: '0.02em'
//                       }}
//                     >
//                       {card.tag}
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: '0 0 8px 0' }}>
//                     {card.title}
//                   </h3>
//                   <p style={{ fontSize: 13.5, color: '#555555', lineHeight: 1.6, margin: '0 0 24px 0', flexGrow: 1 }}>
//                     {card.desc}
//                   </p>

//                   {/* Footer Actions */}
//                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f0f0f0]">
//                     <a 
//                       href="#" 
//                       className="flex items-center gap-1 group font-semibold"
//                       style={{ color: '#03D985', fontSize: 13, textDecoration: 'none' }}
//                     >
//                       Learn More 
//                       <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
//                     </a>
//                     <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
//                       {card.cta}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Section 3 — "Why Choose Our Platform?" Stats Strip */}
//             <div className="bg-white rounded-[14px] p-6 mb-8 w-full animate-reveal flex flex-col md:flex-row justify-between items-center text-center md:text-left shadow-[0_4px_16px_rgba(0,0,0,0.06)]" style={{ animationDelay: '0.6s' }}>
//               <div className="flex-1 w-full md:w-auto py-3 md:py-0 border-b md:border-b-0 md:border-r border-[#e8e8e8]">
//                 <div className="flex flex-col items-center md:items-start md:pl-6">
//                   <span style={{ fontSize: 32, fontWeight: 800, color: '#03D985', lineHeight: 1.2 }}>{stats.businesses}+</span>
//                   <span style={{ fontSize: 13, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Businesses Integrated</span>
//                 </div>
//               </div>
//               <div className="flex-1 w-full md:w-auto py-3 md:py-0 border-b md:border-b-0 md:border-r border-[#e8e8e8]">
//                 <div className="flex flex-col items-center md:items-center">
//                   <span style={{ fontSize: 32, fontWeight: 800, color: '#03D985', lineHeight: 1.2 }}>{stats.satisfaction}%</span>
//                   <span style={{ fontSize: 13, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Customer Satisfaction</span>
//                 </div>
//               </div>
//               <div className="flex-1 w-full md:w-auto py-3 md:py-0 border-b md:border-b-0 md:border-r border-[#e8e8e8]">
//                 <div className="flex flex-col items-center md:items-center">
//                   <span style={{ fontSize: 32, fontWeight: 800, color: '#03D985', lineHeight: 1.2 }}>{stats.support}/7</span>
//                   <span style={{ fontSize: 13, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.02em' }}>AI Support Available</span>
//                 </div>
//               </div>
//               <div className="flex-1 w-full md:w-auto py-3 md:py-0">
//                 <div className="flex flex-col items-center md:items-end md:pr-6">
//                   <span style={{ fontSize: 32, fontWeight: 800, color: '#03D985', lineHeight: 1.2 }}>{stats.integrations}</span>
//                   <span style={{ fontSize: 13, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Powerful Integrations</span>
//                 </div>
//               </div>
//             </div>

//             {/* Section 4 — Video Section */}
//             <div 
//               className="bg-white rounded-[14px] p-6 md:p-8 animate-reveal shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
//               style={{ animationDelay: '0.7s' }}
//             >
//               <div className="flex flex-col lg:flex-row gap-10 items-center">
                
//                 {/* Left Column - Content */}
//                 <div className="w-full lg:w-[55%] flex flex-col items-start">
//                   <div 
//                     className="inline-flex items-center gap-1.5 mb-4"
//                     style={{ background: '#03D98520', padding: '6px 12px', borderRadius: 20 }}
//                   >
//                     <Play size={12} fill="#02b870" color="#02b870" />
//                     <span style={{ fontSize: 12, fontWeight: 700, color: '#02945a', textTransform: 'uppercase' }}>Watch Demo</span>
//                   </div>
                  
//                   <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111111', margin: '0 0 12px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
//                     See How It Works
//                   </h2>
//                   <p style={{ fontSize: 15, color: '#555555', lineHeight: 1.6, margin: '0 0 24px 0', maxWidth: '90%' }}>
//                     From WhatsApp automation to AI voice calling — watch how our platform transforms your business operations in under 3 minutes.
//                   </p>
                  
//                   <ul className="flex flex-col gap-3 mb-8 w-full">
//                     {[
//                       'Live integration walkthrough',
//                       'Real business use cases from Madhya Pradesh',
//                       'Setup in under 10 minutes'
//                     ].map((item, i) => (
//                       <li key={i} className="flex items-center gap-3">
//                         <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#03D985', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
//                           <CheckCircle size={12} color="#ffffff" strokeWidth={3} />
//                         </div>
//                         <span style={{ fontSize: 14, color: '#333333', fontWeight: 500 }}>{item}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="flex items-center flex-wrap gap-6">
//                     <button className="btn-primary flex items-center gap-2" style={{ padding: '12px 24px', fontSize: 15 }}>
//                       <Calendar size={18} />
//                       Schedule a Demo
//                     </button>
//                     <a 
//                       href="#" 
//                       className="group font-semibold flex items-center gap-1"
//                       style={{ color: '#03D985', fontSize: 14, textDecoration: 'none' }}
//                     >
//                       View Documentation 
//                       <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
//                     </a>
//                   </div>
//                 </div>

//                 {/* Right Column - Video Player */}
//                 <div className="w-full lg:w-[45%]">
//                   <div 
//                     className="relative w-full overflow-hidden flex flex-col justify-between"
//                     style={{ 
//                       background: '#111111', 
//                       borderRadius: 16,
//                       aspectRatio: '16/9',
//                       boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
//                     }}
//                   >
//                     {/* Fake Video Background */}
//                     <div 
//                       className="absolute inset-0"
//                       style={{
//                         background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, rgba(3,217,133,0.1) 100%)',
//                         opacity: 0.9
//                       }}
//                     />

//                     {/* Top Overlay Gradient for depth */}
//                     <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

//                     {/* Center Play Button Area */}
//                     <div className="relative z-10 flex-1 flex flex-col items-center justify-center cursor-pointer play-btn-wrapper group">
//                       <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center play-btn-glow mb-4 relative z-20">
//                         <Play size={28} color="#03D985" fill="#03D985" style={{ marginLeft: '4px' }} />
//                       </div>
//                       <span className="text-white font-semibold text-[14px] tracking-wide mb-1 z-20">Our Platform Overview</span>
//                       <span className="text-white/50 text-[12px] font-medium z-20">3:42 min</span>
//                     </div>

//                     {/* Bottom Controls */}
//                     <div className="relative z-10 w-full px-4 pb-4 pt-8 bg-gradient-to-t from-[#111111] to-transparent">
//                       {/* Fake Progress Bar */}
//                       <div className="w-full h-[3px] bg-white/15 rounded-full mb-3 cursor-pointer overflow-hidden group">
//                         <div className="h-full bg-[#03D985] w-[0%] rounded-full transition-all group-hover:h-[4px]" />
//                       </div>
                      
//                       {/* Controls Row */}
//                       <div className="flex justify-between items-center text-white/60">
//                         <div className="flex items-center gap-4">
//                           <Play size={16} className="cursor-pointer hover:text-white transition-colors" />
//                           <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'monospace' }}>0:00 / 3:42</span>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <Volume2 size={16} className="cursor-pointer hover:text-white transition-colors" />
//                           <Maximize size={16} className="cursor-pointer hover:text-white transition-colors" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>

//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }














// version -1

// import React, { useState, memo } from 'react';
// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import { 
//   MessageCircle, Camera, BadgeInfo, Cpu, Bot, PhoneCall, 
//   Zap, Play, Flame, Sparkles, Lock, Smartphone, Check, ArrowRight
// } from 'lucide-react';

// // --- UTILITY FUNCTIONS ---
// // Optimized standard approach: dynamically convert hex to rgba for consistent transparency layers
// const hexToRgba = (hex, alpha) => {
//   const r = parseInt(hex.slice(1, 3), 16);
//   const g = parseInt(hex.slice(3, 5), 16);
//   const b = parseInt(hex.slice(5, 7), 16);
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// };

// // --- STATIC DATA ---
// // Hardcoded outside component to prevent re-initialization on re-renders
// const OFFERINGS_DATA = [
//   {
//     id: 1,
//     title: "WhatsApp Business Integration",
//     accent: "#03D985",
//     icon: MessageCircle,
//     badgeText: "Popular",
//     BadgeIcon: Zap,
//     description: "Connect directly with your customers on WhatsApp. Send automated alerts, handle inquiries, and boost engagement with zero friction.",
//     features: ["Automated message flows", "Broadcast campaigns to 1000s", "Real-time customer support"],
//     category: "Messaging"
//   },
//   {
//     id: 2,
//     title: "Instagram Integration",
//     accent: "#E1306C",
//     icon: Camera,
//     badgeText: null,
//     BadgeIcon: null,
//     description: "Manage your Instagram presence from one place. Track engagement, schedule posts, and convert followers into loyal customers.",
//     features: ["Post scheduling & analytics", "DM automation & replies", "Story & reel performance tracking"],
//     category: "Social Media"
//   },
//   {
//     id: 3,
//     title: "Facebook Engagement Tracking",
//     accent: "#1877F2",
//     icon: BadgeInfo,
//     badgeText: null,
//     BadgeIcon: null,
//     description: "Get deep insights into your Facebook page performance. Monitor reach, engagement trends, and audience behavior in real time.",
//     features: ["Page insights dashboard", "Ad performance tracking", "Audience demographics report"],
//     category: "Analytics"
//   },
//   {
//     id: 4,
//     title: "AI Integration in Your Business",
//     accent: "#7C3AED",
//     icon: Cpu,
//     badgeText: "Trending",
//     BadgeIcon: Flame,
//     description: "Embed powerful AI into your operations — from smart recommendations to predictive analytics — without writing a single line of code.",
//     features: ["Custom AI model deployment", "Predictive business insights", "Seamless ERP/CRM integration"],
//     category: "Artificial Intelligence"
//   },
//   {
//     id: 5,
//     title: "Chatbot Integration",
//     accent: "#F59E0B",
//     icon: Bot,
//     badgeText: null,
//     BadgeIcon: null,
//     description: "Deploy intelligent chatbots on your website or app. Handle FAQs, collect leads, and provide 24/7 customer support — automatically.",
//     features: ["No-code chatbot builder", "Multi-language support", "Lead capture & CRM sync"],
//     category: "Automation"
//   },
//   {
//     id: 6,
//     title: "AI Calling Agent Integration",
//     accent: "#0EA5E9",
//     icon: PhoneCall,
//     badgeText: "New",
//     BadgeIcon: Sparkles,
//     description: "Let AI handle your inbound and outbound calls. From appointment booking to follow-ups — your AI agent never sleeps.",
//     features: ["Human-like voice conversations", "Auto appointment scheduling", "Call transcription & analytics"],
//     category: "AI Voice"
//   }
// ];

// // --- REUSABLE COMPONENTS ---
// // Memoized to ensure performance stability
// const OfferingCard = memo(({ data }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const IconComponent = data.icon;

//   return (
//     <div
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         background: '#ffffff',
//         borderRadius: '16px',
//         border: `1px solid ${isHovered ? '#03D985' : '#e8e8e8'}`,
//         padding: '28px',
//         boxShadow: isHovered ? '0 8px 32px rgba(3,217,133,0.15)' : '0 4px 16px rgba(0,0,0,0.06)',
//         cursor: 'pointer',
//         transition: 'all 0.3s ease',
//         transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
//         position: 'relative',
//         overflow: 'hidden',
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100%'
//       }}
//     >
//       {/* 1. TOP ROW — Icon + Badge */}
//       <div className="flex justify-between items-start w-full">
//         <div
//           style={{
//             width: '56px',
//             height: '56px',
//             borderRadius: '14px',
//             background: hexToRgba(data.accent, 0.15),
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexShrink: 0
//           }}
//         >
//           <IconComponent size={28} color={data.accent} strokeWidth={2} />
//         </div>

//         {data.badgeText && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '16px',
//               right: '16px',
//               background: data.accent === '#03D985' ? '#03D985' : hexToRgba(data.accent, 0.15),
//               color: data.accent === '#03D985' ? '#000000' : data.accent,
//               fontSize: '11px',
//               fontWeight: 700,
//               padding: '4px 12px',
//               borderRadius: '20px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '4px'
//             }}
//           >
//             {data.BadgeIcon && (
//                <data.BadgeIcon 
//                  size={12} 
//                  fill={data.accent === '#03D985' ? 'currentColor' : 'none'} 
//                  strokeWidth={2.5} 
//                />
//             )}
//             {data.badgeText}
//           </div>
//         )}
//       </div>

//       {/* 2. TITLE */}
//       <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111111', marginTop: '20px', marginBottom: '0' }}>
//         {data.title}
//       </h3>

//       {/* 3. SHORT DESCRIPTION */}
//       <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.6, marginTop: '8px', marginBottom: '20px', flexGrow: 1 }}>
//         {data.description}
//       </p>

//       {/* 4. FEATURE BULLETS */}
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//         {data.features.map((feature, idx) => (
//           <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
//             <Check size={14} color={data.accent} strokeWidth={3} style={{ flexShrink: 0, marginTop: '2px' }} />
//             <span style={{ fontSize: '12px', color: '#555555', lineHeight: 1.4 }}>{feature}</span>
//           </div>
//         ))}
//       </div>

//       {/* 5. BOTTOM ROW — Divider + CTA */}
//       <div
//         style={{
//           borderTop: '1px solid #f0f0f0',
//           marginTop: '24px',
//           paddingTop: '16px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}
//       >
//         <span
//           style={{
//             color: data.accent,
//             fontSize: '13px',
//             fontWeight: 600,
//             display: 'flex',
//             alignItems: 'center',
//             gap: '4px',
//             transition: 'gap 0.2s',
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
//           onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
//         >
//           Learn More <ArrowRight size={14} />
//         </span>
//         <div
//           style={{
//             background: hexToRgba(data.accent, 0.12),
//             color: data.accent,
//             fontSize: '11px',
//             borderRadius: '12px',
//             padding: '4px 10px',
//             fontWeight: 600
//           }}
//         >
//           {data.category}
//         </div>
//       </div>
//     </div>
//   );
// });

// // --- MAIN PAGE COMPONENT ---
// export default function Offerings() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [ctaHover, setCtaHover] = useState(false);

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
//       <div
//         className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out main-content-scroll"
//         style={{ background: '#f5f5f5', fontFamily: '"Sora", sans-serif' }}
//       >
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
//         <main className="grow">
//           <div className="px-2 sm:px-3 lg:px-5 pt-3 pb-8 w-full max-w-[1920px] mx-auto">
            
//             {/* ROW 1 — Page Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//               <div>
//                 <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111111', margin: '0 0 4px 0' }}>
//                   Our Offerings
//                 </h1>
//                 <p style={{ fontSize: '14px', color: '#888888', margin: 0 }}>
//                   Supercharge your business with cutting-edge integrations & AI-powered tools
//                 </p>
//               </div>
//               <div
//                 style={{
//                   background: 'rgba(3,217,133,0.10)',
//                   color: '#03D985',
//                   border: '1px solid rgba(3,217,133,0.25)',
//                   borderRadius: '20px',
//                   padding: '6px 16px',
//                   fontSize: '13px',
//                   fontWeight: 600,
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '6px'
//                 }}
//               >
//                 <Zap size={14} fill="currentColor" />
//                 6 Powerful Solutions
//               </div>
//             </div>

//             {/* ROW 2 — Top 3 Offering Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
//               {OFFERINGS_DATA.slice(0, 3).map((offering) => (
//                 <OfferingCard key={offering.id} data={offering} />
//               ))}
//             </div>

//             {/* ROW 3 — Full-Width Video Section */}
//             <div
//               style={{
//                 background: '#111111',
//                 borderRadius: '20px',
//                 padding: '40px 48px',
//                 margin: '0 0 24px 0',
//                 position: 'relative',
//                 overflow: 'hidden'
//               }}
//               className="flex flex-col lg:flex-row items-center gap-10"
//             >
//               {/* Background Blob */}
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: '-80px',
//                   right: '-80px',
//                   width: '400px',
//                   height: '400px',
//                   background: 'radial-gradient(circle, rgba(3,217,133,0.12) 0%, transparent 70%)',
//                   borderRadius: '50%',
//                   pointerEvents: 'none',
//                   zIndex: 0
//                 }}
//               />

//               {/* Video Left Side */}
//               <div className="w-full lg:w-[40%] relative z-10 flex flex-col items-start">
//                 <div
//                   style={{
//                     background: 'rgba(3,217,133,0.15)',
//                     color: '#03D985',
//                     fontSize: '12px',
//                     fontWeight: 600,
//                     borderRadius: '20px',
//                     padding: '6px 14px',
//                     marginBottom: '16px',
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     gap: '6px'
//                   }}
//                 >
//                   <Play size={12} fill="currentColor" /> Watch & Learn
//                 </div>
                
//                 <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, margin: 0 }} className="text-[22px] lg:text-[28px]">
//                   See How We Transform Your Business
//                 </h2>
                
//                 <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '12px', lineHeight: 1.6 }}>
//                   In just 3 minutes, discover how our AI-powered integrations help district businesses grow faster, smarter, and reach customers everywhere.
//                 </p>

//                 {/* Stats Inline Row */}
//                 <div style={{ display: 'flex', alignItems: 'center', marginTop: '28px', gap: '16px', flexWrap: 'wrap' }}>
//                   <div className="flex flex-col">
//                     <span style={{ color: '#03D985', fontSize: '22px', fontWeight: 700 }}>500+</span>
//                     <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Businesses Served</span>
//                   </div>
//                   <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />
//                   <div className="flex flex-col">
//                     <span style={{ color: '#03D985', fontSize: '22px', fontWeight: 700 }}>6</span>
//                     <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Integrations</span>
//                   </div>
//                   <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />
//                   <div className="flex flex-col">
//                     <span style={{ color: '#03D985', fontSize: '22px', fontWeight: 700 }}>3 min</span>
//                     <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Watch Time</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Video Right Side */}
//               <div className="w-full lg:w-[60%] relative z-10 flex flex-col items-center">
//                 <div
//                   style={{
//                     borderRadius: '16px',
//                     overflow: 'hidden',
//                     border: '2px solid rgba(3,217,133,0.25)',
//                     boxShadow: '0 0 40px rgba(3,217,133,0.15)',
//                     width: '100%',
//                     background: '#000'
//                   }}
//                 >
//                   <video
//                     src="https://res.cloudinary.com/dbufssz8v/video/upload/v1779795503/Cinfy_Introduction_Fc2_dlm3rt.mp4"
//                     controls
//                     width="100%"
//                     poster="https://res.cloudinary.com/dbufssz8v/image/upload/v1779795504/video_placeholder_dark.jpg" // Optional dark fallback
//                     style={{ display: 'block', borderRadius: '14px', width: '100%', outline: 'none' }}
//                   />
//                 </div>
                
//                 {/* Security/Trust Badges */}
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
//                     <Lock size={12} /> Secure & Private
//                   </span>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
//                     <Smartphone size={12} /> Mobile Friendly
//                   </span>
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
//                     <Zap size={12} /> Always Available
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* ROW 4 — Bottom 3 Offering Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
//               {OFFERINGS_DATA.slice(3, 6).map((offering) => (
//                 <OfferingCard key={offering.id} data={offering} />
//               ))}
//             </div>

//             {/* ROW 5 — Bottom CTA Banner */}
//             <div
//               style={{
//                 background: 'linear-gradient(135deg, #03D985 0%, #02b870 100%)',
//                 borderRadius: '16px',
//                 padding: '32px 40px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 flexWrap: 'wrap',
//                 gap: '20px'
//               }}
//             >
//               <div>
//                 <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000000', margin: 0 }}>
//                   Ready to Transform Your Business?
//                 </h2>
//                 <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.6)', marginTop: '4px', margin: 0 }}>
//                   Our team is ready to help you integrate the right tools for your district business.
//                 </p>
//               </div>
              
//               <button
//                 onMouseEnter={() => setCtaHover(true)}
//                 onMouseLeave={() => setCtaHover(false)}
//                 style={{
//                   background: ctaHover ? '#1a1a1a' : '#000000',
//                   color: '#ffffff',
//                   borderRadius: '10px',
//                   padding: '12px 28px',
//                   fontSize: '14px',
//                   fontWeight: 700,
//                   border: 'none',
//                   cursor: 'pointer',
//                   transition: 'all 0.2s',
//                   transform: ctaHover ? 'translateY(-1px)' : 'translateY(0)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px'
//                 }}
//               >
//                 Get Started Today <ArrowRight size={16} />
//               </button>
//             </div>

//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }