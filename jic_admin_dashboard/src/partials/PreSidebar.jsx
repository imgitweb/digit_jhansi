// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { 
//   LayoutDashboard, 
//   ShoppingCart, 
//   Factory, 
//   Building2, 
//   Users, 
//   FolderArchive, 
//   ChevronLeft, 
//   ChevronsRight, 
//   ChevronUp, 
//   X 
// } from "lucide-react";
// import { useAuth } from "../hooks/useAuth";

// const EXPANDED_W = 256;
// const COLLAPSED_W = 72;

// /* ═══════════════════════════════════════
//    HOVER POPUP (Tooltip for collapsed mode)
//    ═══════════════════════════════════════ */
// const HoverPopup = ({ children, content, collapsed }) => {
//   const [visible, setVisible] = useState(false);
//   const timeoutRef = useRef(null);

//   const show = useCallback(() => {
//     clearTimeout(timeoutRef.current);
//     setVisible(true);
//   }, []);

//   const hide = useCallback(() => {
//     timeoutRef.current = setTimeout(() => setVisible(false), 250);
//   }, []);

//   if (!collapsed) return children;

//   return (
//     <div style={{ position: 'relative' }} onMouseEnter={show} onMouseLeave={hide}>
//       {children}
//       {visible && (
//         <>
//           {/* Bridge: invisible area to maintain hover */}
//           <div style={{ position: 'absolute', left: '100%', top: 0, width: 18, height: '100%', zIndex: 9998 }} />
//           {/* Popup */}
//           <div style={{
//             position: 'absolute',
//             left: 'calc(100% + 12px)',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             background: '#151515',
//             border: '1px solid rgba(3,217,133,0.2)',
//             borderRadius: 10,
//             padding: '6px 12px',
//             minWidth: 'max-content',
//             zIndex: 9999,
//             boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 20px rgba(3,217,133,0.06)',
//             color: '#fff',
//             fontSize: 13,
//             fontWeight: 500
//           }}>
//             {/* Arrow */}
//             <div style={{
//               position: 'absolute', left: -5, top: '50%',
//               transform: 'translateY(-50%) rotate(45deg)',
//               width: 10, height: 10, background: '#151515',
//               borderLeft: '1px solid rgba(3,217,133,0.2)',
//               borderBottom: '1px solid rgba(3,217,133,0.2)',
//             }} />
//             {content}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════
//    NAV ITEM STYLE
//    ═══════════════════════════════════════ */
// const getNavStyle = (isActive, collapsed) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: collapsed ? 0 : 12,
//   justifyContent: collapsed ? 'center' : 'flex-start',
//   padding: collapsed ? '10px 0' : '10px 16px',
//   fontSize: 14,
//   borderRadius: 8,
//   cursor: 'pointer',
//   transition: 'all 0.2s',
//   textDecoration: 'none',
//   whiteSpace: 'nowrap',
//   width: '100%',
//   border: 'none',
//   color: isActive ? '#03D985' : '#a0a0a0',
//   background: isActive
//     ? (collapsed ? 'rgba(3,217,133,0.12)' : 'linear-gradient(90deg, rgba(3,217,133,0.12) 0%, transparent 100%)')
//     : 'transparent',
//   borderLeft: collapsed ? 'none' : (isActive ? '3px solid #03D985' : '3px solid transparent'),
//   fontWeight: isActive ? 600 : 400,
// });

// /* ═══════════════════════════════════════
//    SIDEBAR COMPONENT
//    ═══════════════════════════════════════ */
// function Sidebar({ sidebarOpen, setSidebarOpen }) {
//   const navigate = useNavigate();
//   const { admin } = useAuth();
//   const location = useLocation();
//   const trigger = useRef(null);
//   const sidebar = useRef(null);

//   const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
//   const [sidebarExpanded, setSidebarExpanded] = useState(
//     storedSidebarExpanded === null ? true : storedSidebarExpanded === "true"
//   );
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

//   // Responsive listener
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 1024);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Close on click outside (Mobile)
//   useEffect(() => {
//     const clickHandler = ({ target }) => {
//       if (!sidebar.current || !trigger.current) return;
//       if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
//       setSidebarOpen(false);
//     };
//     document.addEventListener("click", clickHandler);
//     return () => document.removeEventListener("click", clickHandler);
//   });

//   // Close on ESC key
//   useEffect(() => {
//     const keyHandler = ({ keyCode }) => {
//       if (!sidebarOpen || keyCode !== 27) return;
//       setSidebarOpen(false);
//     };
//     document.addEventListener("keydown", keyHandler);
//     return () => document.removeEventListener("keydown", keyHandler);
//   });

//   // Persist sidebar state
//   useEffect(() => {
//     localStorage.setItem("sidebar-expanded", sidebarExpanded);
//     if (sidebarExpanded) {
//       document.querySelector("body").classList.add("sidebar-expanded");
//     } else {
//       document.querySelector("body").classList.remove("sidebar-expanded");
//     }
//   }, [sidebarExpanded]);

//   const effectiveCollapsed = isMobile ? false : !sidebarExpanded;
//   const w = effectiveCollapsed ? COLLAPSED_W : EXPANDED_W;

//   const now = new Date();
//   const formattedDate = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].slice(0, 5) + ' GMT';

//   const adminName = admin?.name || 'Administrator';
//   const adminInitials = adminName.charAt(0).toUpperCase();
//   const adminRole = admin?.role === 'superadmin' ? 'Super Admin' : 'Admin';

//   const handleNavClick = () => {
//     if (isMobile) setSidebarOpen(false);
//   };

//   const HoverBtn = ({ onClick, children, style: extraStyle }) => {
//     const [h, setH] = useState(false);
//     return (
//       <button
//         onClick={onClick}
//         onMouseEnter={() => setH(true)}
//         onMouseLeave={() => setH(false)}
//         style={{
//           width: 28, height: 28,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
//           background: h ? 'rgba(3,217,133,0.08)' : 'rgba(255,255,255,0.04)',
//           border: `1px solid ${h ? 'rgba(3,217,133,0.3)' : 'rgba(255,255,255,0.08)'}`,
//           color: h ? '#03D985' : '#666',
//           flexShrink: 0,
//           ...extraStyle,
//         }}
//       >
//         {children}
//       </button>
//     );
//   };

//   const sidebarStyle = isMobile
//     ? {
//         position: 'fixed', left: 0, top: 0,
//         width: EXPANDED_W, height: '100vh',
//         display: 'flex', flexDirection: 'column',
//         zIndex: 50, background: '#0a0a0a',
//         borderRight: '1px solid rgba(255,255,255,0.06)',
//         transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
//         transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
//         overflow: 'visible',
//       }
//     : {
//         // Change from 'fixed' to 'relative' and add flexShrink: 0
//         position: 'relative', flexShrink: 0,
//         width: w, height: '100vh',
//         display: 'flex', flexDirection: 'column',
//         zIndex: 50, background: '#0a0a0a',
//         borderRight: '1px solid rgba(255,255,255,0.06)',
//         transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
//         overflow: 'visible',
//       };

//   const menuItems = [
//     { name: 'Dashboard', path: '/', end: true, icon: LayoutDashboard },
//     { name: 'Ecommerce Enablers', path: '/enablers', icon: ShoppingCart },
//     { name: 'Industry Pool (<50L)', path: '/industries-under50l', icon: Factory },
//     { name: 'Industry Pool (50L+)', path: '/industries-50lplus', icon: Building2 },
//     { name: 'Riders Database', path: '/riders', icon: Users },
//     { name: 'Resource Hub', path: '/resources', icon: FolderArchive },
//   ];

//   return (
//     <>
//       {/* Mobile Backdrop */}
//       {isMobile && sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           style={{
//             position: 'fixed', inset: 0, zIndex: 45,
//             background: 'rgba(0,0,0,0.55)',
//             backdropFilter: 'blur(2px)',
//             transition: 'opacity 0.3s ease',
//           }}
//         />
//       )}

//       <aside ref={sidebar} style={sidebarStyle}>
//         {/* Bottom Green Gradient Glow */}
//         <div style={{
//           position: 'absolute', bottom: 0, left: 0, width: '100%', height: '45%',
//           background: 'radial-gradient(ellipse at 10% 100%, rgba(3,217,133,0.25) 0%, rgba(3,217,133,0.12) 35%, transparent 70%)',
//           pointerEvents: 'none', zIndex: 0,
//         }} />

//         {/* LOGO AREA */}
//         <div style={{
//           padding: effectiveCollapsed ? '20px 12px 8px' : '20px 16px 8px',
//           display: 'flex', alignItems: 'center',
//           justifyContent: effectiveCollapsed ? 'center' : 'space-between',
//           position: 'relative', zIndex: 10, gap: 8,
//         }}>
//           <div 
//           onClick={()=> navigate('/')}
//           style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, cursor: 'pointer' }}>
//             <div style={{
//               width: 34, height: 34, borderRadius: 8, background: '#03D985',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 0 20px rgba(3,217,133,0.3)', flexShrink: 0,
//             }}>
//               <span style={{ color: '#000', fontWeight: 700, fontSize: 16 }}>S</span>
//             </div>
//             {!effectiveCollapsed && (
//               <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
//                 Satna PRD
//               </span>
//             )}
//           </div>
//           {!effectiveCollapsed && !isMobile && (
//             <HoverBtn onClick={() => setSidebarExpanded(false)}>
//               <ChevronLeft style={{ width: 16, height: 16 }} />
//             </HoverBtn>
//           )}
//           {isMobile && (
//             <button
//               ref={trigger}
//               onClick={() => setSidebarOpen(false)}
//               style={{
//                 width: 32, height: 32, borderRadius: 8,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
//                 color: '#888', cursor: 'pointer', transition: 'all 0.2s',
//               }}
//             >
//               <X style={{ width: 16, height: 16 }} />
//             </button>
//           )}
//         </div>

//         {/* COLLAPSED EXPAND BUTTON */}
//         {effectiveCollapsed && !isMobile && (
//           <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0', position: 'relative', zIndex: 10 }}>
//             <HoverBtn onClick={() => setSidebarExpanded(true)} style={{ width: 36, height: 26 }}>
//               <ChevronsRight style={{ width: 16, height: 16 }} />
//             </HoverBtn>
//           </div>
//         )}

//         {/* NAVIGATION LINKS */}
//         <nav className="no-scrollbar" style={{
//           flex: 1, marginTop: 16, display: 'flex', flexDirection: 'column',
//           overflowY: effectiveCollapsed ? 'visible' : 'auto',
//           overflowX: effectiveCollapsed ? 'visible' : 'hidden',
//           position: 'relative', zIndex: 10,
//         }}>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: effectiveCollapsed ? '0 8px' : '0 12px' }}>
            
//             {/* GROUP LABEL */}
//             <div style={{
//               padding: '0 16px 8px', fontSize: 11, fontWeight: 700, color: '#444', 
//               textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8
//             }}>
//                {effectiveCollapsed ? <span style={{ textAlign: 'center', display: 'block' }}>•••</span> : 'PAGES'}
//             </div>

//             {menuItems.map((item) => (
//               <HoverPopup key={item.name} collapsed={effectiveCollapsed} content={item.name}>
//                 <NavLink
//                   to={item.path}
//                   end={item.end}
//                   onClick={handleNavClick}
//                   style={({ isActive }) => getNavStyle(isActive, effectiveCollapsed)}
//                   onMouseEnter={(e) => {
//                     if (!location.pathname.startsWith(item.path) && !(item.path==="/" && location.pathname==="/")) {
//                       e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!location.pathname.startsWith(item.path) && !(item.path==="/" && location.pathname==="/")) {
//                       e.currentTarget.style.background = 'transparent';
//                     }
//                   }}
//                 >
//                   <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
//                   {!effectiveCollapsed && <span>{item.name}</span>}
//                 </NavLink>
//               </HoverPopup>
//             ))}
//           </div>
//         </nav>

//         {/* USER PROFILE FOOTER */}
//         <div style={{
//           padding: effectiveCollapsed ? '12px 8px' : '12px 16px 16px',
//           borderTop: '1px solid rgba(255,255,255,0.06)',
//           position: 'relative', zIndex: 10,
//         }}>
//           {effectiveCollapsed ? (
//             <HoverPopup collapsed={effectiveCollapsed} content={adminName}>
//               <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
//                 <div style={{
//                   width: 32, height: 32, borderRadius: '50%', background: '#03D985', color: '#000',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontWeight: 700, fontSize: 12, boxShadow: '0 0 12px rgba(3,217,133,0.3)',
//                 }}>
//                   {adminInitials}
//                 </div>
//               </div>
//             </HoverPopup>
//           ) : (
//             <>
//               <div style={{
//                 display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
//                 background: 'rgba(3,217,133,0.06)', border: '1px solid rgba(3,217,133,0.1)',
//                 borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = 'rgba(3,217,133,0.10)';
//                 e.currentTarget.style.borderColor = 'rgba(3,217,133,0.2)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = 'rgba(3,217,133,0.06)';
//                 e.currentTarget.style.borderColor = 'rgba(3,217,133,0.1)';
//               }}>
//                 <div style={{
//                   width: 32, height: 32, borderRadius: '50%', background: '#03D985', color: '#000',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontWeight: 700, fontSize: 12, flexShrink: 0, boxShadow: '0 0 12px rgba(3,217,133,0.3)',
//                 }}>
//                   {adminInitials}
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                     <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       {adminName}
//                     </span>
//                     <ChevronUp style={{ width: 14, height: 14, color: '#03D985', flexShrink: 0 }} />
//                   </div>
//                   <span style={{ fontSize: 11, color: '#606060' }}>{adminRole}</span>
//                 </div>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingLeft: 4 }}>
//                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#03D985' }} />
//                 <span style={{ fontSize: 11, color: '#505050' }}>{formattedDate}</span>
//               </div>
//             </>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;