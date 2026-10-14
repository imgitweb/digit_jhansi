import React from 'react';
import { ChevronRight } from 'lucide-react';

const OfferingCard = ({ offering, onClick, style }) => {
  return (
    <div 
      onClick={() => onClick(offering)}
      className="offering-card relative bg-white rounded-[16px] cursor-pointer flex flex-col overflow-hidden group"
      style={{
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(3,217,133,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
      }}
    >
      {/* Top Image Area */}
      <div className="relative h-[160px] w-full overflow-hidden bg-[#f5f5f5]">
        <img 
          src={offering.images[2]} 
          alt={offering.title} 
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Subtle gradient overlay to ensure badge pops naturally over any image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

        {/* Conditional Badge */}
        {offering.badge && (
          <div 
            className="absolute top-3 right-3 bg-[#03D985] text-black px-[10px] py-[2px] rounded-full uppercase z-20 shadow-sm"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              animation: 'pulse-badge 2s infinite'
            }}
          >
            {offering.badge}
          </div>
        )}
      </div>

      {/* Bottom Content Area */}
      <div className="p-[20px] pb-[24px] px-[24px] flex flex-col flex-grow">
        <h3 className="text-[#111111] font-bold text-[13px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mb-1.5 font-['Sora']">
          {offering.title}
        </h3>
        <p className="text-[#888888] text-[10px] md:text-[10px] lg:text-[10px] xl:text-[11px] 2xl:text-[12px] mb-[15px] flex-grow">
          {offering.tagline}
        </p>
        
        <div className="w-full border-t border-[#f0f0f0] mb-[16px]"></div>
        
        <button 
          className="learn-more-btn w-full h-[44px] bg-[#03D985] text-black font-bold text-[14px] rounded-[10px] flex items-center justify-center gap-2 border-none cursor-pointer"
          style={{ transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#02b870';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(3,217,133,0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#03D985';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Learn More <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OfferingCard;