import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingCart,
    Factory,
    Building2,
    Users,
    FolderArchive,
    ChevronLeft,
    ChevronsRight,
    ChevronUp,
    X,
    ChevronRight,
    BarChart2,
    TrendingUp,
    Package,
    Globe2,
    Brain,
    Wifi,
    ClipboardList,
    Building,
    FileText,
    Settings,
    ChevronDown,
    MapMinusIcon,
    Handshake,
    GraduationCap 
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";


const EXPANDED_W = 260;
const COLLAPSED_W = 72;

/* ═══════════════════════════════════════
   HOVER POPUP (Tooltip for collapsed mode)
   ═══════════════════════════════════════ */
const HoverPopup = ({ children, content, collapsed }) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);

    const show = useCallback(() => {
        clearTimeout(timeoutRef.current);
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        timeoutRef.current = setTimeout(() => setVisible(false), 250);
    }, []);

    if (!collapsed) return children;

    return (
        <div style={{ position: 'relative' }} onMouseEnter={show} onMouseLeave={hide}>
            {children}
            {visible && (
                <>
                    {/* Bridge: invisible area to maintain hover */}
                    <div style={{ position: 'absolute', left: '100%', top: 0, width: 18, height: '100%', zIndex: 9998 }} />
                    {/* Popup */}
                    <div style={{
                        position: 'absolute',
                        left: 'calc(100% + 12px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#151515',
                        border: '1px solid rgba(3,217,133,0.2)',
                        borderRadius: 10,
                        padding: '6px 12px',
                        minWidth: 'max-content',
                        zIndex: 9999,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 20px rgba(3,217,133,0.06)',
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 500
                    }}>
                        {/* Arrow */}
                        <div style={{
                            position: 'absolute', left: -5, top: '50%',
                            transform: 'translateY(-50%) rotate(45deg)',
                            width: 10, height: 10, background: '#151515',
                            borderLeft: '1px solid rgba(3,217,133,0.2)',
                            borderBottom: '1px solid rgba(3,217,133,0.2)',
                        }} />
                        {content}
                    </div>
                </>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════
   NAV ITEM STYLE
   ═══════════════════════════════════════ */
const getNavStyle = (isActive, collapsed) => ({
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? 0 : 12,
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: collapsed ? '10px 0' : '10px 16px',
    fontSize: 14,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: '100%',
    border: 'none',
    color: isActive ? '#03D985' : '#a0a0a0',
    background: isActive
        ? (collapsed ? 'rgba(3,217,133,0.12)' : 'linear-gradient(90deg, rgba(3,217,133,0.12) 0%, transparent 100%)')
        : 'transparent',
    boxShadow: collapsed
        ? 'none'
        : (isActive ? 'inset 2px 0 0 #03D985' : 'none'),
    fontWeight: 500,
});

const MENU_CONFIG = [
    {
        groupKey: 'main',
        groupLabel: 'PAGES',
        items: [
            {
                name: 'Overview',
                path: '/',
                end: true,
                icon: LayoutDashboard
            },
        ]
    },
    {
        groupKey: 'business',
        groupLabel: 'BUSINESS & INDUSTRY',
        items: [
            {
                name: 'Industries',
                key: 'industries',
                icon: Factory,
                hasSubmenu: true,
                children: [
                    {
                        name: 'Institution Pool',
                        path: '/institutions',
                        icon: GraduationCap
                    },
                    {
                        name: 'Ecommerce Enablers',
                        path: '/enablers',
                        icon: ShoppingCart
                    },
                    {
                        name: 'Industry Pool (<50L)',
                        path: '/industries-under50l',
                        icon: Factory
                    },
                    {
                        name: 'Industry Pool (50L+)',
                        path: '/industries-50lplus',
                        icon: Building2
                    },
                    {
                        name: 'Riders Database',
                        path: '/riders',
                        icon: Users
                    },
                    {
                        name: 'Resource Hub',
                        path: '/resources',
                        icon: FolderArchive
                    },
                ]
            },
            {
                name: 'Cohorts',
                path: '/cohorts',
                icon: Package
            },
            {
                name: 'Our Offerings',
                path: '/offerings',
                icon: Handshake
            },
            {
                name: 'Workforce',
                path: '/workforce',
                icon: Users
            },
            {
                name: 'Opportunities',
                path: '/opportunities',
                icon: TrendingUp
            },
            {
                name: 'OPOP & Exports',
                path: '/opop-exports',
                icon: Globe2
            },
        ]
    },

    {
        groupKey: 'analytics',
        groupLabel: 'ANALYTICS & REPORTS',
        items: [
            {
                name: 'Analytics',
                path: '/analytics',
                icon: BarChart2
            },
            {
                name: 'Digital Readiness',
                path: '/digital-readiness',
                icon: Wifi
            },
            {
                name: 'Surveys',
                path: '/surveys',
                icon: ClipboardList
            },
            {
                name: 'Institutions',
                path: '/institutions',
                icon: Building
            },
            {
                name: 'Reports',
                path: '/reports',
                icon: FileText
            },
            {
                name: 'AI Insights',
                path: '/ai-insights',
                icon: Brain
            },
        ]
    },
    {
        groupKey: 'system',
        groupLabel: 'SYSTEM',
        items: [
            {
                name: 'Settings',
                path: '/settings',
                icon: Settings
            },
        ]
    },
    {
        groupKey: 'dashboard-management',
        groupLabel: 'DASHBOARD MANAGEMENT',
        items: [
            {
                name: 'Dashboard Management',
                key: 'dashboard-management',
                icon: MapMinusIcon,
                hasSubmenu: true,
                children: [
                    {
                        name: 'Summary KPIs',
                        path: '/summary-kpis',
                        icon: ShoppingCart
                    },
                    {
                        name: 'Industry Distribution',
                        path: '/industry-distribution',
                        icon: Factory
                    },
                    {
                        name: 'Business Growth',
                        path: '/business-growth',
                        icon: Building2
                    },
                    {
                        name: 'Workforce Analytics',
                        path: '/workforce-analytics',
                        icon: Users
                    },
                    {
                        name: 'Skill Gap Analysis',
                        path: '/skill-gap-analysis',
                        icon: FolderArchive
                    },
                    {
                        name: 'Digital Adoption',
                        path: '/digital-adoption',
                        icon: FolderArchive
                    },
                    {
                        name: 'Export Analytics',
                        path: '/export-analytics',
                        icon: FolderArchive
                    },
                    {
                        name: 'Industry Health',
                        path: '/industry-health',
                        icon: FolderArchive
                    },
                    {
                        name: 'Economic Map',
                        path: '/economic-map',
                        icon: FolderArchive
                    },
                    {
                        name: 'Infrastructure Stats',
                        path: '/infrastructure-stats',
                        icon: FolderArchive
                    },
                ]
            },
        ]
    },
];


/* ═══════════════════════════════════════
   SIDEBAR COMPONENT
   ═══════════════════════════════════════ */
function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const { admin } = useAuth();
    const location = useLocation();
    const trigger = useRef(null);
    const sidebar = useRef(null);
    const navScrollRef = useRef(null);
    const scrollPositionRef = useRef(0);

    // const prevPathRef = useRef(location.pathname);

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? true : storedSidebarExpanded === "true"
    );
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    const industriesPaths = [
        '/enablers',
        '/industries-under50l',
        '/industries-50lplus',
        '/riders',
        '/resources',
    ];

    const dashboardManagementPaths = [
        '/summary-kpis',
        '/industry-distribution',
        '/business-growth',
        '/workforce-analytics',
        '/skill-gap-analysis',
        '/digital-adoption',
        '/export-analytics',
        '/industry-health',
        '/economic-map',
        '/infrastructure-stats',
    ];

    const [openSubmenus, setOpenSubmenus] = useState(() => ({
        industries: industriesPaths.some(path =>
            location.pathname.startsWith(path)
        ),

        'dashboard-management': dashboardManagementPaths.some(path =>
            location.pathname.startsWith(path)
        ),
    }));

    const toggleSubmenu = useCallback((key) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    }, []);
    // const childIsActive = location.pathname === child.path;

    // Responsive listener
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close on click outside (Mobile)
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!sidebar.current || !trigger.current) return;
            if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, [sidebarOpen]);

    // Close on ESC key
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, [sidebarOpen]);

    // Persist sidebar state
    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded);
        if (sidebarExpanded) {
            document.querySelector("body").classList.add("sidebar-expanded");
        } else {
            document.querySelector("body").classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);



    const effectiveCollapsed = isMobile ? false : !sidebarExpanded;
    const w = effectiveCollapsed ? COLLAPSED_W : EXPANDED_W;

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].slice(0, 5) + ' GMT';

    const adminName = admin?.name || 'Administrator';
    const adminInitials = adminName.charAt(0).toUpperCase();
    const adminRole = admin?.role === 'superadmin' ? 'Super Admin' : 'Admin';

    const handleNavClick = () => {
        if (isMobile) setSidebarOpen(false);
    };

    const HoverBtn = ({ onClick, children, style: extraStyle }) => {
        const [h, setH] = useState(false);
        return (
            <button
                onClick={onClick}
                onMouseEnter={() => setH(true)}
                onMouseLeave={() => setH(false)}
                style={{
                    width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
                    background: h ? 'rgba(3,217,133,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${h ? 'rgba(3,217,133,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: h ? '#03D985' : '#666',
                    flexShrink: 0,
                    ...extraStyle,
                }}
            >
                {children}
            </button>
        );
    };

    const sidebarStyle = isMobile
        ? {
            position: 'fixed', left: 0, top: 0,
            width: EXPANDED_W, height: '100vh',
            display: 'flex', flexDirection: 'column',
            zIndex: 50, background: '#0a0a0a',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'visible',
        }
        : {
            position: 'relative',
            top: 0,
            flexShrink: 0,
            width: w,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            background: '#0a0a0a',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'visible',
        }


    const renderItem = (item) => {
        // ── ITEM WITH SUBMENU (Industries) ──
        if (item.hasSubmenu) {
            const isOpen = openSubmenus[item.key];
            const isAnyChildActive = item.children.some(
                child => location.pathname === child.path
            );

            // COLLAPSED MODE → show icon only with HoverPopup
            // that shows the children as flyout
            if (effectiveCollapsed) {
                return (
                    <HoverPopup
                        key={item.name}
                        collapsed={effectiveCollapsed}
                        content={
                            <div style={{ padding: '4px 0' }}>
                                <div style={{
                                    padding: '6px 14px 8px',
                                    fontSize: 11, fontWeight: 700,
                                    color: '#555',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                    marginBottom: 2,
                                }}>
                                    {item.name}
                                </div>
                                {item.children.map(child => {
                                    const childIsActive = location.pathname === child.path;

                                    return (
                                        <NavLink
                                            key={child.name}
                                            to={child.path}
                                            preventScrollReset={true}
                                            tabIndex={-1}
                                            onClick={handleNavClick}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '9px 16px',
                                                fontSize: 13,
                                                textDecoration: 'none',
                                                color: childIsActive ? '#03D985' : '#909090',
                                                fontWeight: 500,
                                                background: childIsActive
                                                    ? 'rgba(3,217,133,0.06)'
                                                    : 'transparent',
                                                transition: 'all 0.15s',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <child.icon
                                                style={{
                                                    width: 14, height: 14,
                                                    flexShrink: 0
                                                }}
                                            />
                                            <span>{child.name}</span>
                                        </NavLink>
                                    );
                                })}
                            </div >
                        }
                    >
                        <div
                            style={getNavStyle(isAnyChildActive,
                                effectiveCollapsed)}
                        >
                            <item.icon
                                style={{
                                    width: 18, height: 18,
                                    flexShrink: 0
                                }}
                            />
                        </div>
                    </HoverPopup >
                );
            }

            // EXPANDED MODE → accordion with children
            return (
                <div key={item.name}>
                    {/* Parent button */}
                    <button
                        onClick={() => toggleSubmenu(item.key)}
                        style={{
                            ...getNavStyle(isAnyChildActive, false),
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center', gap: 12
                        }}>
                            <item.icon
                                style={{
                                    width: 18, height: 18,
                                    flexShrink: 0
                                }}
                            />
                            <span>{item.name}</span>
                        </div>
                        {/* Chevron rotates when open */}
                        <ChevronDown
                            style={{
                                width: 14, height: 14,
                                flexShrink: 0,
                                color: isAnyChildActive
                                    ? '#03D985' : '#666',
                                transform: isOpen
                                    ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                            }}
                        />
                    </button>

                    {/* Submenu children — animated expand/collapse */}
                    <div
                        style={{
                            maxHeight: isOpen ? '800px' : '0px',
                            overflow: 'hidden',
                            transition: 'max-height 0.28s ease',
                        }}
                    >
                        <div
                            style={{
                                paddingLeft: 12,
                                paddingTop: 2,
                                paddingBottom: 4,
                            }}
                        >
                            {item.children.map(child => {
                                const childIsActive = location.pathname === child.path;

                                return (
                                    <NavLink
                                        key={child.name}
                                        to={child.path}
                                        preventScrollReset={true}
                                        tabIndex={-1}
                                        onClick={handleNavClick}
                                        onMouseEnter={(e) => {
                                            if (!childIsActive) {
                                                e.currentTarget.style.color = '#FFFFFF';
                                                e.currentTarget.style.background =
                                                    'rgba(255,255,255,0.05)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!childIsActive) {
                                                e.currentTarget.style.color = '#707070';
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            padding: '8px 12px 8px 16px',
                                            fontSize: 13,
                                            borderRadius: 6,
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            whiteSpace: 'nowrap',
                                            color: childIsActive ? '#03D985' : '#707070',
                                            fontWeight: 500,
                                            background: childIsActive
                                                ? 'rgba(3,217,133,0.08)'
                                                : 'transparent',
                                            boxShadow: childIsActive
                                                ? 'inset 2px 0 0 #03D985'
                                                : 'none',
                                            marginBottom: 2,
                                        }}
                                    >
                                        {/* Small dot indicator */}
                                        <span style={{
                                            width: 5, height: 5,
                                            borderRadius: '50%',
                                            background: 'currentColor',
                                            opacity: 0.5,
                                            flexShrink: 0,
                                        }} />
                                        <span>{child.name}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        // ── REGULAR ITEM (no submenu) ──
        if (effectiveCollapsed) {
            return (
                <HoverPopup
                    key={item.name}
                    collapsed={effectiveCollapsed}
                    content={item.name}
                >
                    <NavLink
                        to={item.path}
                        preventScrollReset={true}
                        tabIndex={-1}
                        end={item.end}
                        onClick={handleNavClick}
                        style={({ isActive }) =>
                            getNavStyle(isActive, effectiveCollapsed)}
                    >
                        <item.icon
                            style={{
                                width: 18, height: 18,
                                flexShrink: 0
                            }}
                        />
                    </NavLink>
                </HoverPopup>
            );
        }

        return (
            <NavLink
                key={item.name}
                to={item.path}
                preventScrollReset={true}
                end={item.end}
                tabIndex={-1}
                onClick={handleNavClick}
                style={({ isActive }) =>
                    getNavStyle(isActive, effectiveCollapsed)}
            >
                <item.icon
                    style={{ width: 18, height: 18, flexShrink: 0 }}
                />
                <span>{item.name}</span>
            </NavLink>
        );
    }

    useEffect(() => {
        const navEl = navScrollRef.current;
        if (!navEl) return;
        const handleScroll = () => {
            scrollPositionRef.current = navEl.scrollTop;
        };
        navEl.addEventListener('scroll', handleScroll);
        return () => navEl.removeEventListener('scroll', handleScroll);
    }, []);

    useLayoutEffect(() => {
        const navEl = navScrollRef.current;
        if (navEl) {
            navEl.scrollTop = scrollPositionRef.current;
        }
    }, [location.pathname]);


    return (
        <>
            {/* Mobile Backdrop */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 45,
                        background: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(2px)',
                        transition: 'opacity 0.3s ease',
                    }}
                />
            )}

            <aside ref={sidebar} style={sidebarStyle}>
                {/* Bottom Green Gradient Glow */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%',
                    background: 'radial-gradient(ellipse at 10% 100%, rgba(3,217,133,0.25) 0%, rgba(3,217,133,0.12) 35%, transparent 70%)',
                    pointerEvents: 'none', zIndex: 0,
                }} />

                {/* LOGO AREA */}
                <div
                    style={{
                        padding: effectiveCollapsed ? '16px 10px' : '20px 16px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: effectiveCollapsed ? 'center' : 'space-between',
                        position: 'relative',
                        zIndex: 10,
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        minHeight: 88,
                        // border: '1px solid white',
                    }}
                >
                    {/* Logo */}
                    <div
                        onClick={() => navigate('/')}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
                            // width: '100%',
                            overflow: 'hidden',
                            width: effectiveCollapsed ? 42 : 120,
                            marginTop: effectiveCollapsed ? 0 : -40,
                            marginBottom: effectiveCollapsed ? 0 : -50,
                        }}
                    >
                        <img
                            src="/images/SIC_logo.png"
                            alt="DIGIT Logo"
                            style={{
                                // height: effectiveCollapsed ? 42 : 64,
                                width: 'auto',
                                // maxWidth: effectiveCollapsed ? 42 : 180,
                                objectFit: 'contain',
                                display: 'block',
                                transition: 'all 0.3s ease',
                                filter: 'drop-shadow(0 0 12px rgba(3,217,133,0.08))',
                            }}
                        />
                    </div>

                    {/* Collapse Button */}
                    {!effectiveCollapsed && !isMobile && (
                        <HoverBtn onClick={() => setSidebarExpanded(false)}>
                            <ChevronLeft style={{ width: 16, height: 16 }} />
                        </HoverBtn>
                    )}

                    {/* Mobile Close Button */}
                    {isMobile && (
                        <button
                            ref={trigger}
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#888',
                                cursor: 'pointer',
                            }}
                        >
                            <X style={{ width: 16, height: 16 }} />
                        </button>
                    )}
                </div>
                {/* COLLAPSED EXPAND BUTTON */}
                {effectiveCollapsed && !isMobile && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0', position: 'relative', zIndex: 10 }}>
                        <HoverBtn onClick={() => setSidebarExpanded(true)} style={{ width: 36, height: 26 }}>
                            <ChevronsRight style={{ width: 16, height: 16 }} />
                        </HoverBtn>
                    </div>
                )}

                {/* NAVIGATION LINKS */}
                <nav
                    key="sidebar-nav"
                    ref={navScrollRef}
                    style={{
                        flex: 1,
                        marginTop: 8,
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: effectiveCollapsed ? 'visible' : 'auto',
                        overflowX: effectiveCollapsed ? 'visible' : 'hidden',
                        position: 'relative',
                        zIndex: 10,
                        /* Custom scrollbar — ultra thin green tinted */
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(3,217,133,0.15) transparent',
                    }}
                >


                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                        padding: effectiveCollapsed ? '0 8px' : '0 12px',
                        paddingBottom: 16,
                    }}>
                        {MENU_CONFIG.map((group, groupIdx) => (
                            <div key={group.groupKey} style={{
                                marginBottom: 8
                            }}>
                                {/* Group label — hidden in collapsed mode */}
                                {!effectiveCollapsed && (
                                    <div style={{
                                        padding: '12px 16px 6px',
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: '#444444',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        userSelect: 'none',
                                    }}>
                                        {group.groupLabel}
                                    </div>
                                )}

                                {/* Collapsed mode: show dots separator 
                    between groups */}
                                {effectiveCollapsed && groupIdx > 0 && (
                                    <div style={{
                                        margin: '8px 12px',
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                    }} />
                                )}

                                {/* Items */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}>
                                    {group.items.map(item => renderItem(item))}
                                </div>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* USER PROFILE FOOTER */}
                <div style={{
                    padding: effectiveCollapsed ? '12px 8px' : '12px 16px 16px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative', zIndex: 10,
                }}>
                    {effectiveCollapsed ? (
                        <HoverPopup collapsed={effectiveCollapsed} content={adminName}>
                            <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%', background: '#03D985', color: '#000',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: 12, boxShadow: '0 0 12px rgba(3,217,133,0.3)',
                                }}>
                                    {adminInitials}
                                </div>
                            </div>
                        </HoverPopup>
                    ) : (
                        <>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                                background: 'rgba(3,217,133,0.06)', border: '1px solid rgba(3,217,133,0.1)',
                                borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s, color 0.2s'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(3,217,133,0.10)';
                                    e.currentTarget.style.borderColor = 'rgba(3,217,133,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(3,217,133,0.06)';
                                    e.currentTarget.style.borderColor = 'rgba(3,217,133,0.1)';
                                }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%', background: '#03D985', color: '#000',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: 12, flexShrink: 0, boxShadow: '0 0 12px rgba(3,217,133,0.3)',
                                }}>
                                    {adminInitials}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {adminName}
                                        </span>
                                        <ChevronUp style={{ width: 14, height: 14, color: '#03D985', flexShrink: 0 }} />
                                    </div>
                                    <span style={{ fontSize: 11, color: '#606060' }}>{adminRole}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingLeft: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#03D985' }} />
                                <span style={{ fontSize: 11, color: '#505050' }}>{formattedDate}</span>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
}

export default Sidebar;