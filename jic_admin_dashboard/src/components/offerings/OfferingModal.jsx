import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const OfferingModal = ({ offering, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Matches animation duration
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === offering.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? offering.images.length - 1 : prev - 1));
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/65 backdrop-blur-[6px]"
        onClick={handleClose}
        style={{
          opacity: isClosing ? 0 : 1,
          transition: 'opacity 300ms ease'
        }}
      />
      
      {/* Modal Container */}
      <div 
        className="relative bg-white w-full max-w-[860px] max-h-[90vh] md:max-h-none rounded-[20px] overflow-hidden flex flex-col md:flex-row shadow-2xl overflow-y-auto md:overflow-y-visible"
        style={{
          animation: `${isClosing ? 'modalOut' : 'modalIn'} 300ms cubic-bezier(0.34,1.56,0.64,1) forwards`
        }}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="cursor-pointer absolute top-4 right-4 z-50 w-9 h-9 bg-[#f5f5f5] hover:bg-[#eeeeee] rounded-full flex items-center justify-center text-[#666] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Left Column: Full Height Image Carousel */}
        <div className="w-full md:w-[55%] relative flex flex-col min-h-[250px] sm:min-h-[350px] md:min-h-full bg-[#f9f9f9]">
          {/* Image Slider */}
          {offering.images.map((img, idx) => (
            <img 
              key={idx}
              src={img}
              alt={`${offering.title} preview ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: currentImageIndex === idx ? 1 : 0,
                transform: `translateX(${(idx - currentImageIndex) * 10}px)`,
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                pointerEvents: currentImageIndex === idx ? 'auto' : 'none'
              }}
            />
          ))}
          
          {/* Arrows */}
          <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:text-[#03D985] transition-colors z-10">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:text-[#03D985] transition-colors z-10">
            <ChevronRight size={18} />
          </button>

          {/* Pagination Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-10">
            <div className="flex items-center gap-2">
              {offering.images.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className="h-2 rounded-full transition-all duration-300 shadow-sm"
                  style={{
                    width: currentImageIndex === idx ? '24px' : '8px',
                    backgroundColor: currentImageIndex === idx ? '#03D985' : '#e5e7eb'
                  }}
                />
              ))}
            </div>
            <span className="text-[12px] text-[#333] font-medium bg-white/90 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm">
              {currentImageIndex + 1} / {offering.images.length}
            </span>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col bg-white">
          <div>
            <span 
              className="inline-block text-[11px] font-semibold uppercase rounded-full px-3 py-1 mb-3"
              style={{
                backgroundColor: `${offering.accentColor}1A`,
                color: offering.accentColor
              }}
            >
              Integration
            </span>
            <h2 className="text-[22px] font-[800] text-[#111] mb-2 font-['Sora'] leading-tight">
              {offering.title}
            </h2>
            <p className="text-[14px] text-[#555] leading-[1.7] mb-6">
              {offering.description}
            </p>
          </div>

          {/* Features List */}
          <div className="flex-grow mb-6 mt-2">
            <h4 className="text-[13px] font-bold text-[#111] uppercase tracking-[0.08em] mb-3">
              What's Included
            </h4>
            <ul className="space-y-2">
              {offering.features.map((feature, idx) => (
                <li 
                  key={idx} 
                  className="flex items-start gap-2.5 opacity-0"
                  style={{
                    animation: `featureIn 0.4s ease forwards`,
                    animationDelay: `${(idx * 50) + 150}ms`
                  }}
                >
                  <CheckCircle2 size={16} className="text-[#03D985] flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#444] leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          {/* <button 
            className="w-full h-[48px] rounded-xl text-black font-bold text-[15px] flex items-center justify-center gap-2 transition-all mt-auto"
            style={{
              background: 'linear-gradient(135deg, #03D985, #02b870)',
              boxShadow: '0 4px 20px rgba(3,217,133,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get Started Today <ChevronRight size={18} />
          </button> */}
        </div>
      </div>
    </div>
  );

  // Portal to document body to avoid z-index/overflow clipping from parent containers
  return ReactDOM.createPortal(modalContent, document.body);
};

export default OfferingModal;