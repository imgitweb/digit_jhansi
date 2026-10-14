import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

function NotFound() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content Wrapper (matches your layout structure exactly) */}
      <div 
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out"
        style={{ background: '#f5f5f5' }}
      >
        {/* Header Component */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area - Centered for the 404 message */}
        <main className="grow flex items-center justify-center">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto flex justify-center">
            
            {/* 404 / Coming Soon Card */}
            <div 
              className="bg-white flex flex-col items-center justify-center p-10 max-w-md w-full text-center"
              style={{ border: '1px solid #e8e8e8', borderRadius: 12 }}
            >
              
              {/* Icon / Illustration */}
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(3, 217, 133, 0.08)' }}>
                  <svg className="w-10 h-10" style={{ color: '#03D985' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Text Content */}
              <h1 className="text-[24px] sm:text-[28px] font-bold text-[#111111] mb-3">
                Coming Soon!
              </h1>
              <p className="text-[#555555] mb-8 text-[14px] leading-relaxed">
                Oops! The page you are looking for is currently under development or doesn't exist yet. We are working hard to bring this feature to you.
              </p>

              {/* Action Button */}
              <button
                onClick={() => navigate(-1)} // Alternatively navigate('/') for Dashboard home
                style={{ 
                  background: '#03D985', 
                  color: '#000000', 
                  fontWeight: 700, 
                  borderRadius: 8, 
                  border: 'none', 
                  fontSize: 14 
                }}
                className="flex items-center justify-center px-6 py-3 hover:bg-[#02b870] transition-colors transform hover:-translate-y-[1px] shadow-[0_4px_14px_rgba(3,217,133,0.25)]"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go Back
              </button>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NotFound;