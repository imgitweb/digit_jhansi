import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Phone, Send, ChevronLeft, X, MessageSquare, Mic, MicOff, Square } from 'lucide-react';

import axiosInstance from '../api/axiosInstance';



const theme = {

  sidebarBg: '#0f172a',

  pageBg: '#f8fafc',

  cardBg: '#ffffff',

  cardBorder: '#e2e8f0',

  primary: '#10b981',

  primaryLight: '#d1fae5',

  textPrimary: '#1e293b',

  textLight: '#64748b',

  shadowMd: '0 4px 24px rgba(0,0,0,0.18)'

};



export default function ChatBotWidget() {

  const [isOpen, setIsOpen] = useState(false);

  const [currentView, setCurrentView] = useState('menu'); // 'menu' | 'chat' | 'call'

  const [message, setMessage] = useState('');

  const [conversation, setConversation] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const [callStatus, setCallStatus] = useState('idle');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);



  const recognitionRef = useRef(null);

  const isCallActiveRef = useRef(false);

  const isSpeakingRef = useRef(false);

  const isMutedRef = useRef(false);

  const isLoadingRef = useRef(false);

  const messagesEndRef = useRef(null);

  const audioRef = useRef(null);

  const currentViewRef = useRef(currentView);

  const conversationRef = useRef([]);

  const listeningRestartTimerRef = useRef(null);



  // Track detected language for voice

  const detectedLangRef = useRef('hi-IN');



  // Sync refs with state

  useEffect(() => {

    currentViewRef.current = currentView;

    isSpeakingRef.current = isSpeaking;

    isMutedRef.current = isMuted;

    isLoadingRef.current = loading;

    conversationRef.current = conversation;

  }, [currentView, isSpeaking, isMuted, loading, conversation]);



  // Responsive

  useEffect(() => {

    const handleResize = () => setIsMobile(window.innerWidth <= 640);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, []);



  // Auto-scroll

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, [conversation]);



  const cancelRestartTimer = useCallback(() => {

    if (listeningRestartTimerRef.current) {

      clearTimeout(listeningRestartTimerRef.current);

      listeningRestartTimerRef.current = null;

    }

  }, []);



  const hardStopAudio = useCallback(() => {

    if (audioRef.current) {

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current.pause();

      try { audioRef.current.src = ''; } catch (e) {}

      audioRef.current = null;

    }

    if (window.speechSynthesis) window.speechSynthesis.cancel();

    setIsSpeaking(false);

    isSpeakingRef.current = false;

  }, []);



  const stopVoiceProcesses = useCallback(() => {

    cancelRestartTimer();

    isCallActiveRef.current = false;

    setIsListening(false);

    setCallStatus('idle');

    setLoading(false);

    isLoadingRef.current = false;

    hardStopAudio();

    try { recognitionRef.current?.abort(); } catch (e) {}

  }, [cancelRestartTimer, hardStopAudio]);



  const startListening = useCallback(() => {

    if (!isCallActiveRef.current) return;

    if (isSpeakingRef.current) return;

    if (isMutedRef.current) return;

    if (isLoadingRef.current) return;

    try { recognitionRef.current?.start(); } catch (e) {}

  }, []);



  const scheduleListeningRestart = useCallback((delay = 400) => {

    cancelRestartTimer();

    listeningRestartTimerRef.current = setTimeout(() => {

      startListening();

    }, delay);

  }, [cancelRestartTimer, startListening]);



  const stopAI = useCallback(() => {

    cancelRestartTimer();

    hardStopAudio();

    setLoading(false);

    isLoadingRef.current = false;

    if (isCallActiveRef.current && !isMutedRef.current) {

      setCallStatus('listening');

      scheduleListeningRestart(400);

    }

  }, [cancelRestartTimer, hardStopAudio, scheduleListeningRestart]);



  const toggleMute = useCallback(() => {

    setIsMuted(prev => {

      const newMuted = !prev;

      isMutedRef.current = newMuted;

      if (newMuted) {

        cancelRestartTimer();

        try { recognitionRef.current?.abort(); } catch (e) {}

        setIsListening(false);

      } else {

        if (isCallActiveRef.current && !isSpeakingRef.current && !isLoadingRef.current) {

          scheduleListeningRestart(300);

        }

      }

      return newMuted;

    });

  }, [cancelRestartTimer, scheduleListeningRestart]);



  const playAudioBlob = useCallback(async (blob, aiText) => {

    hardStopAudio();

    setIsSpeaking(true);

    isSpeakingRef.current = true;

    setCallStatus('speaking');



    setConversation(prev => [...prev, { role: 'ai', content: aiText }]);



    const onSpeechEnd = () => {

      setIsSpeaking(false);

      isSpeakingRef.current = false;

      if (isCallActiveRef.current && !isMutedRef.current) {

        setCallStatus('listening');

        scheduleListeningRestart(250); // Faster restart

      } else {

        setCallStatus('idle');

      }

    };



    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);

    audioRef.current = audio;



    audio.onended = () => {

      URL.revokeObjectURL(url);

      audioRef.current = null;

      onSpeechEnd();

    };

    audio.onerror = () => {

      URL.revokeObjectURL(url);

      audioRef.current = null;

      onSpeechEnd();

    };



    try {

      await audio.play();

    } catch (e) {

      onSpeechEnd();

    }

  }, [hardStopAudio, scheduleListeningRestart]);



  const sanitizeForDisplay = useCallback((text) => {

    if (!text) return text;

    return text

      .replace(/₹/g, 'Rs.')

      .replace(/%/g, ' percent')

      .replace(/\bCr\b/g, 'crore')

      .replace(/\bL\b/g, 'lakh')

      .replace(/\*+/g, '')

      .replace(/#+/g, '')

      .trim();

  }, []);



  const detectLang = useCallback((text) => {

    if (!text) return 'hi-IN';

    // Count Hindi Unicode characters (Devanagari block: U+0900–U+097F)

    const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;

    // Count clearly English words (ASCII alphabets that form common English patterns)

    const englishWords = (text.match(/\b[a-zA-Z]{3,}\b/g) || []).length;



    if (hindiChars > 0) return 'hi-IN';         // Any Devanagari = Hindi

    if (englishWords > 2) return 'en-IN';        // Multiple English words = English (India accent)

    return detectedLangRef.current;              // Otherwise keep current

  }, []);



    const speakFallbackText = useCallback((text) => {
    if (!text || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = detectedLangRef.current || 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
        setCallStatus('speaking');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;

        if (isCallActiveRef.current && !isMutedRef.current) {
          setCallStatus('listening');
          scheduleListeningRestart(300);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;

        if (isCallActiveRef.current && !isMutedRef.current) {
          setCallStatus('listening');
          scheduleListeningRestart(300);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Browser speech fallback error:', error);
    }
  }, [scheduleListeningRestart]);


const processVoiceMessage = useCallback(async (userTranscript) => {

    if (!userTranscript.trim() || !isCallActiveRef.current) return;



    setConversation(prev => [...prev, { role: 'user', content: userTranscript }]);

    setLoading(true);

    isLoadingRef.current = true;



    try {

      const historyForApi = conversationRef.current

        .slice(-6)

        .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));



      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')

        .replace(/\/api\/?$/, '');



      const response = await fetch(`${baseUrl}/api/chatbot/voice`, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`

        },

        body: JSON.stringify({ transcript: userTranscript, conversationHistory: historyForApi })

      });



      if (!isCallActiveRef.current) return;



      setLoading(false);

      isLoadingRef.current = false;



      if (!response.ok) {
        let errorMessage = 'Sorry, I could not process that request.';

        try {
          const errorJson = await response.json();
          errorMessage = errorJson?.message || errorJson?.data?.reply || errorMessage;
        } catch (e) {
          // Keep the safe user-facing message when the server does not return JSON.
        }

        throw new Error(errorMessage);
      }

      const isFallback = response.headers.get('X-Fallback') === 'true';

      if (isFallback) {
        const json = await response.json();
        const aiText = sanitizeForDisplay(json?.data?.reply || 'Sorry, I could not process that.');
        const speechText = json?.data?.speechReply || aiText;

        setConversation(prev => [...prev, { role: 'ai', content: aiText }]);

        if (isCallActiveRef.current && !isMutedRef.current) {
          speakFallbackText(speechText);
        }
      } else {

        const encodedAiText = response.headers.get('X-AI-Text') || '';

        const rawAiText = decodeURIComponent(encodedAiText);

        const aiText = sanitizeForDisplay(rawAiText);

        const blob = await response.blob();

        await playAudioBlob(blob, aiText);

      }

    } catch (err) {

      console.error('Voice error:', err);

      if (!isCallActiveRef.current) return;

      setLoading(false);

      isLoadingRef.current = false;

      const errMsg = 'Sorry, there was a network issue. Please try again.';

      setConversation(prev => [...prev, { role: 'ai', content: errMsg }]);

      if (isCallActiveRef.current && !isMutedRef.current) {

        setCallStatus('listening');

        scheduleListeningRestart(600); // Faster recovery

      }

    }

  }, [playAudioBlob, scheduleListeningRestart, sanitizeForDisplay, speakFallbackText]);



  // Speech Recognition Setup

  useEffect(() => {

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRec) {

      console.error('Speech recognition not supported in this browser.');

      return;

    }



    const recognition = new SpeechRec();

    recognition.lang = 'hi-IN'; // Primary language

    recognition.interimResults = false;

    recognition.continuous = false;

    recognition.maxAlternatives = 1;



    recognition.onstart = () => {

      if (!isCallActiveRef.current || isMutedRef.current) {

        try { recognition.abort(); } catch (e) {}

        return;

      }

      setIsListening(true);

      setCallStatus('listening');

    };



    recognition.onresult = (event) => {

      if (!isCallActiveRef.current || isSpeakingRef.current || isMutedRef.current || isLoadingRef.current) return;

      const transcript = event.results[0][0].transcript.trim();

      if (transcript && transcript.length > 1) {

        setIsListening(false);

        cancelRestartTimer();

        setCallStatus('thinking');



        const detectedLang = detectLang(transcript);

        detectedLangRef.current = detectedLang;

        recognition.lang = detectedLang; // Update for next session



        processVoiceMessage(transcript);

      }

    };



    recognition.onerror = (event) => {

      setIsListening(false);

      if (isCallActiveRef.current && !isSpeakingRef.current && !isMutedRef.current &&

          !isLoadingRef.current && event.error !== 'not-allowed' && event.error !== 'aborted') {

        scheduleListeningRestart(600);

      }

    };



    recognition.onend = () => {

      setIsListening(false);

      if (isCallActiveRef.current && !isSpeakingRef.current && !isMutedRef.current && !isLoadingRef.current) {

        scheduleListeningRestart(400);

      }

    };



    recognitionRef.current = recognition;



    return () => {

      try { recognition.abort(); } catch (e) {}

    };

  }, [cancelRestartTimer, processVoiceMessage, scheduleListeningRestart, detectLang]);



  const simulateStreaming = useCallback((fullText) => {

    setConversation(prev => [...prev, { role: 'ai', content: '' }]);

    const words = fullText.split(' ');

    let i = 0;

    const interval = setInterval(() => {

      if (i < words.length) {

        const currentText = words.slice(0, i + 1).join(' ');

        setConversation(prev => {

          const updated = [...prev];

          updated[updated.length - 1] = { ...updated[updated.length - 1], content: currentText };

          return updated;

        });

        i++;

      } else {

        clearInterval(interval);

      }

    }, 45);

  }, []);



  const handleSendText = async () => {

    if (!message.trim() || loading) return;



    const userText = message.trim();

    setMessage('');

    setConversation(prev => [...prev, { role: 'user', content: userText }]);

    setLoading(true);



    try {

      const historyForApi = conversationRef.current

        .slice(-10)

        .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));



      const response = await axiosInstance.post('/chatbot/message', {

        message: userText,

        conversationHistory: historyForApi

      });



      setLoading(false);

      const reply = response.data?.data?.reply || 'I was unable to generate a response.';

      simulateStreaming(reply);

    } catch (err) {

      console.error('Chat error:', err);

      setLoading(false);

      setConversation(prev => [...prev, {

        role: 'ai',

        content: 'Network error. Please check your connection and try again.'

      }]);

    }

  };



  const openView = (view) => {

    stopVoiceProcesses();

    setConversation([]);

    setCurrentView(view);

    setIsMuted(false);

    isMutedRef.current = false;



    if (view === 'chat') {

      setConversation([{

        role: 'ai',

        content: 'Hello! I am DIGIT, the AI assistant for the Jhansi District Dashboard. Ask me about industries, workforce, exports, KPIs, or any dashboard data.'

      }]);

    }



    if (view === 'call') {

      const welcomeText = 'Hello! I am DIGIT, the AI assistant for Jhansi District Dashboard. You can ask me about industries, workforce, exports, or KPIs. How can I help you today?';

      setConversation([{ role: 'ai', content: welcomeText }]);

      isCallActiveRef.current = true;

      setCallStatus('speaking');



      setTimeout(async () => {

        try {

          setLoading(true);

          isLoadingRef.current = true;

          const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')

            .replace(/\/api\/?$/, '');



          const response = await fetch(`${baseUrl}/api/chatbot/voice`, {

            method: 'POST',

            headers: {

              'Content-Type': 'application/json',

              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`

            },

            body: JSON.stringify({ transcript: 'greeting', conversationHistory: [] })

          });



          setLoading(false);

          isLoadingRef.current = false;



          if (!isCallActiveRef.current) return;



          if (!response.ok) {
            throw new Error('Voice greeting request failed');
          }

          const isFallback = response.headers.get('X-Fallback') === 'true';

          if (!isFallback) {
            const blob = await response.blob();
            await playAudioBlob(blob, welcomeText);
          } else {
            if (isCallActiveRef.current && !isMutedRef.current) {
              speakFallbackText(welcomeText);
            }
          }

          } catch (e) {

          setLoading(false);

          isLoadingRef.current = false;

          if (isCallActiveRef.current && !isMutedRef.current) {

            setCallStatus('listening');

            scheduleListeningRestart(500);

          }

        }

      }, 300);

    }

  };



  const closeWidget = () => {

    setIsOpen(false);

    setCurrentView('menu');

    stopVoiceProcesses();

  };



  const goBack = () => {

    stopVoiceProcesses();

    setCurrentView('menu');

  };



  if (!isOpen) {

    return (

      <button

        onClick={() => setIsOpen(true)}

        style={{

          position: 'fixed',

          right: 22,

          bottom: 22,

          width: 70,

          height: 70,

          borderRadius: '34px 34px 34px 8px',

          background: theme.sidebarBg,

          border: 'none',

          cursor: 'pointer',

          zIndex: 9999,

          display: 'flex',

          justifyContent: 'center',

          alignItems: 'center',

          boxShadow: theme.shadowMd,

          transition: 'transform 0.2s',

        }}

        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}

        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}

      >

        <img src="/images/SIC_logo2.png" alt="DIGIT Logo" style={{ width: 80, height: 80, objectFit: 'contain' }} />

      </button>

    );

  }



  const ringAnimation =

    (isListening && !isMuted) ? 'pulseGreen 1.5s infinite' :

    (isSpeaking || loading) ? 'pulseWhite 1.5s infinite' : 'none';



  const ringBorderColor =

    (isListening && !isMuted) ? theme.primary :

    (isSpeaking || loading) ? 'rgba(255,255,255,0.5)' : 'transparent';



  const lastMessage = conversation.length > 0 ? conversation[conversation.length - 1].content : '';

  const displayLastMessage = lastMessage.length > 90 ? lastMessage.substring(0, 90) + '...' : lastMessage;



  return (

    <>

      <style>{`

        @keyframes pulseGreen {

          0%   { box-shadow: 0 0 0 0 #10b98188; }

          70%  { box-shadow: 0 0 0 18px #10b98100; }

          100% { box-shadow: 0 0 0 0 #10b98100; }

        }

        @keyframes pulseWhite {

          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }

          70%  { box-shadow: 0 0 0 18px rgba(255,255,255,0); }

          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }

        }

        .digit-scroll::-webkit-scrollbar { width: 4px; }

        .digit-scroll::-webkit-scrollbar-thumb { background: ${theme.cardBorder}; border-radius: 4px; }

      `}</style>

      <div style={{

        position: 'fixed',

        right: isMobile ? 0 : 20,

        bottom: isMobile ? 0 : 20,

        width: isMobile ? '100vw' : 380,

        height: isMobile ? '100dvh' : 620,

        borderRadius: isMobile ? 0 : 16,

        background: theme.pageBg,

        boxShadow: '0 10px 40px rgba(0,0,0,0.25)',

        border: isMobile ? 'none' : `1px solid ${theme.cardBorder}`,

        display: 'flex',

        flexDirection: 'column',

        zIndex: 9999,

        overflow: 'hidden'

      }}>

        {/* Header */}

        <div style={{

          background: theme.sidebarBg,

          borderBottom: `2px solid ${theme.primary}`,

          padding: currentView === 'menu' ? '40px 20px 60px' : '16px 20px',

          display: 'flex',

          flexDirection: currentView === 'menu' ? 'column' : 'row',

          alignItems: currentView === 'menu' ? 'flex-start' : 'center',

          gap: 12,

          position: 'relative'

        }}>

          <button

            onClick={closeWidget}

            style={{

              position: 'absolute',

              top: 16,

              right: 16,

              width: 32,

              height: 32,

              borderRadius: '50%',

              background: 'rgba(255,255,255,0.1)',

              border: 'none',

              color: 'white',

              display: 'flex',

              justifyContent: 'center',

              alignItems: 'center',

              cursor: 'pointer'

            }}

          >

            <X size={18} />

          </button>



          {currentView !== 'menu' && (

            <button

              onClick={goBack}

              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0, display: 'flex' }}

            >

              <ChevronLeft size={24} />

            </button>

          )}



          <img src="/images/SIC_logo2.png" alt="DIGIT" style={{ width: 80, height: 60, objectFit: 'contain' }} />



          <div style={{ display: 'flex', flexDirection: 'column' }}>

            <span style={{ color: 'white', fontWeight: 'bold', fontSize: currentView === 'menu' ? 17 : 14 }}>

              Digit AI Assistant

            </span>

            {currentView === 'chat' && (

              <span style={{ color: theme.primaryLight, fontSize: 12 }}>Ask questions, get instant support & guidance</span>

            )}

            {currentView === 'call' && (

              <span style={{ color: theme.primaryLight, fontSize: 12 }}>Voice conversation in progress</span>

            )}

          </div>

        </div>



        {/* Body - Menu View */}

        {currentView === 'menu' && (

          <div style={{

            background: theme.cardBg,

            borderRadius: 12,

            boxShadow: theme.shadowMd,

            border: `1px solid ${theme.cardBorder}`,

            margin: '-40px 16px 16px',

            zIndex: 10,

            display: 'flex',

            flexDirection: 'column'

          }}>

            <div style={{ padding: '16px 20px', fontSize: 15, fontWeight: 600, color: theme.textPrimary, borderBottom: `1px solid ${theme.cardBorder}` }}>

              How can we help?

            </div>



            <button

              onClick={() => openView('chat')}

              style={{

                width: '100%',

                padding: '14px 20px',

                display: 'flex',

                alignItems: 'center',

                gap: 14,

                background: 'transparent',

                border: 'none',

                borderBottom: `1px solid ${theme.cardBorder}`,

                cursor: 'pointer',

                textAlign: 'left'

              }}

              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}

              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}

            >

              <div style={{ width: 40, height: 40, borderRadius: 10, background: theme.primaryLight, color: theme.primary, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>

                <MessageSquare size={20} />

              </div>

              <div>

                <div style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary }}>Chat with us</div>

                <div style={{ fontSize: 13, color: theme.textLight, marginTop: 3 }}>Get instant answers via text</div>

              </div>

            </button>



            <button

              onClick={() => openView('call')}

              style={{

                width: '100%',

                padding: '14px 20px',

                display: 'flex',

                alignItems: 'center',

                gap: 14,

                background: 'transparent',

                border: 'none',

                cursor: 'pointer',

                textAlign: 'left'

              }}

              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}

              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}

            >

              <div style={{ width: 40, height: 40, borderRadius: 10, background: theme.primaryLight, color: theme.primary, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>

                <Mic size={20} />

              </div>

              <div>

                <div style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary }}>Voice Call</div>

                <div style={{ fontSize: 13, color: theme.textLight, marginTop: 3 }}>Speak with our AI agent</div>

              </div>

            </button>

          </div>

        )}



        {/* Body - Chat View */}

        {currentView === 'chat' && (

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

            <div className="digit-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16, background: theme.pageBg, display: 'flex', flexDirection: 'column', gap: 12 }}>

              {conversation.map((msg, idx) => (

                <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>

                  <div style={{

                    background: msg.role === 'user' ? theme.primary : theme.cardBg,

                    color: msg.role === 'user' ? 'white' : theme.textPrimary,

                    border: msg.role === 'user' ? 'none' : `1px solid ${theme.cardBorder}`,

                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',

                    padding: '10px 14px',

                    maxWidth: '82%',

                    fontSize: 14,

                    lineHeight: 1.55,

                    whiteSpace: 'pre-wrap'

                  }}>

                    {msg.content === '' ? <span style={{ color: theme.textLight, fontStyle: 'italic' }}>typing...</span> : msg.content}

                  </div>

                </div>

              ))}

              {loading && (conversation.length === 0 || conversation[conversation.length - 1].role !== 'ai') && (

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>

                  <div style={{ background: theme.cardBg, color: theme.textLight, border: `1px solid ${theme.cardBorder}`, borderRadius: '4px 18px 18px 18px', padding: '10px 14px', maxWidth: '82%', fontSize: 13 }}>

                    Agent is typing...

                  </div>

                </div>

              )}

              <div ref={messagesEndRef} />

            </div>



            <div style={{ background: theme.cardBg, borderTop: `1px solid ${theme.cardBorder}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

              <input

                type="text"

                value={message}

                onChange={(e) => setMessage(e.target.value)}

                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}

                placeholder="Ask about Jhansi district data..."

                style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, color: theme.textPrimary, background: 'transparent' }}

              />

              <button

                onClick={handleSendText}

                disabled={!message.trim()}

                style={{

                  width: 38,

                  height: 38,

                  borderRadius: 8,

                  background: message.trim() ? theme.primary : '#d1d5db',

                  border: 'none',

                  color: 'white',

                  display: 'flex',

                  justifyContent: 'center',

                  alignItems: 'center',

                  cursor: message.trim() ? 'pointer' : 'not-allowed'

                }}

              >

                <Send size={16} />

              </button>

            </div>

          </div>

        )}



        {/* Body - Call View */}

        {currentView === 'call' && (

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: theme.sidebarBg, flex: 1, padding: 24 }}>



            <div style={{

              width: 140,

              height: 140,

              borderRadius: '50%',

              background: 'rgba(255,255,255,0.07)',

              display: 'flex',

              justifyContent: 'center',

              alignItems: 'center',

              border: `2px solid ${ringBorderColor}`,

              animation: ringAnimation

            }}>

              <img src="/images/SIC_logo2.png" alt="DIGIT" style={{ width: 72, height: 72, objectFit: 'contain', opacity: isMuted ? 0.5 : 1 }} />

            </div>



            <div style={{ fontSize: 18, color: 'white', fontWeight: 600, margin: '28px 0 8px' }}>

              {loading ? 'Processing...' :

               isSpeaking ? 'DIGIT is speaking...' :

               isMuted ? 'Mic Muted' :

               isListening ? `Listening... (${detectedLangRef.current === 'en-IN' ? 'English' : 'Hindi/Hinglish'})` :

               'Call Connected'}

            </div>



            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 0, maxWidth: '85%', textAlign: 'center', minHeight: 44, lineHeight: 1.5 }}>

              {conversation.length > 0 ? `"${displayLastMessage}"` : "Say something to start — in any language!"}

            </div>



            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: isMuted ? '#f87171' : isListening ? theme.primary : 'rgba(255,255,255,0.35)' }}>

              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}

              {isMuted

                ? 'Mic is Muted'

                : isListening

                  ? 'Mic is ON — bolo / speak now'

                  : isSpeaking

                    ? 'DIGIT is responding...'

                    : loading

                      ? 'Processing your query...'

                      : 'Mic is ready'}

            </div>



            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 20 }}>

              <button

                onClick={toggleMute}

                style={{ width: 50, height: 50, borderRadius: '50%', background: isMuted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', color: isMuted ? '#f87171' : 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}

              >

                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}

              </button>



              <button

                onClick={goBack}

                style={{ width: 64, height: 64, borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}

              >

                <Phone size={24} style={{ transform: 'rotate(135deg)' }} />

              </button>



              <button

                onClick={stopAI}

                disabled={!isSpeaking && !loading}

                style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: (!isSpeaking && !loading) ? 'rgba(255,255,255,0.3)' : 'white', border: 'none', cursor: (!isSpeaking && !loading) ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}

              >

                <Square size={20} fill={(!isSpeaking && !loading) ? 'transparent' : 'currentColor'} />

              </button>

            </div>



          </div>

        )}

      </div>

    </>

  );
}
