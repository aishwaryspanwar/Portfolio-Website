// src/App.jsx
import React from "react";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import Lottie from "lottie-react";
import animationData from './images/Animation - 1744821291852.json';
import CircleTrail from './components/CircleTrail';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Contact from "./pages/Contact"; // Make sure this path is correct
import Work from "./pages/Work";
import LoadingCursor from './components/LoadingCursor';

const FolioHeader = () => (
  <div
    className="fixed font-roobertregular"
    style={{
      top: '2rem',
      right: '3rem',
      fontSize: '0.74rem',
      fontWeight: 400,
      letterSpacing: '0.02em',
      zIndex: 10,
      textAlign: 'right',
      lineHeight: '1.2'
    }}
  >
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Folio
    <br />
    Vol.1-
  </div>
);

function App() {
  // This state manages dark mode.
  const [isDark, setIsDark] = useState(false);

  // Loading state for splash screen
  const [loading, setLoading] = useState(true);
  const [loadStage, setLoadStage] = useState('strip');
  const [hoveredNav, setHoveredNav] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100); // Reduced duration to 900ms
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) {
      setLoadStage('strip');
      setTimeout(() => setLoadStage('expand'), 400); // expand after 1.4s
      setTimeout(() => setLoadStage('break'), 2400);  // break after 1s delay post expand
      setTimeout(() => setLoadStage('done'), 3400);   // done after 1s delay post break
    }
  }, [loading]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (loadStage !== 'done') {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [loadStage]);

  // Apply the mode to the document root
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    document.title = "Aishwary Panwar";
  }, []);
  
  // Camera-based ambient light detection for dark mode
  useEffect(() => {
    let videoStream = null;
    let animationFrameId = null;
    let video = null;
    let canvas = null;
    let context = null;

    async function setupCameraLightDetection() {
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video = document.createElement('video');
        video.srcObject = videoStream;
        video.play();

        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');

        function checkBrightness() {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frame = context.getImageData(0, 0, canvas.width, canvas.height);
            let sum = 0;
            for (let i = 0; i < frame.data.length; i += 4) {
              const r = frame.data[i];
              const g = frame.data[i + 1];
              const b = frame.data[i + 2];
              sum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }
            const avg = sum / (frame.data.length / 4);
            // Threshold: < 60 is dark, > 80 is bright
            if (avg < 60 && !isDark) setIsDark(true);
            if (avg > 80 && isDark) setIsDark(false);
          }
          animationFrameId = requestAnimationFrame(checkBrightness);
        }

        video.addEventListener('play', checkBrightness);
      } catch (err) {
        // Camera access denied or not available
      }
    }

    setupCameraLightDetection();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (video) {
        video.remove();
      }
      if (canvas) {
        canvas.remove();
      }
    };
    // eslint-disable-next-line
  }, [isDark]);

  // FlipLink component for animated nav links
  const DURATION = 0.25;
  const STAGGER = 0.025;

  const FlipLink = ({ children, onClick, to }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [hoverKey, setHoverKey] = useState(0);

    const handleMouseEnter = () => {
      setIsHovered(true);
      setHoverKey(prev => prev + 1);
    };
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const content = (
      <motion.div
        initial="initial"
        animate={isHovered ? "hovered" : "initial"}
        className="relative block overflow-hidden whitespace-nowrap text-xs uppercase cursor-pointer font-roobertregular"
        style={{
          lineHeight: 1.2,
          minWidth: "max-content",
          fontSize: "0.66rem", // Increased from 0.6rem by 10%
          fontWeight: 650 // Increased from 500 by 30%
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          {children.split("").map((l, i) => (
            <motion.span
              key={`top-${hoverKey}-${i}`}
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
              className="inline-block"
            >
              {l}
            </motion.span>
          ))}
        </div>
        <div className="absolute inset-0">
          {children.split("").map((l, i) => (
            <motion.span
              key={`bottom-${hoverKey}-${i}`}
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
              className="inline-block"
            >
              {l}
            </motion.span>
          ))}
        </div>
      </motion.div>
    );
    return to ? <Link to={to}>{content}</Link> : content;
  };

  // Helper for staggered animated label
  const StaggeredLabel = ({ text }) => (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: {},
        visible: {},
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        display: 'flex',
        gap: '0.1em',
        fontWeight: 650,
        fontSize: '8.67rem', // Increased from 8.5rem by 2%
        color: '#262626',
        letterSpacing: '0.08em',
        zIndex: 1,
        textAlign: 'center',
        lineHeight: 1.1,
      }}
    >
      {text.split("").map((char, idx) => {
        const isFirstLetter = idx === 0;
        return (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              delay: 0.3 + idx * 0.04,
              duration: 0.22,
              ease: "easeOut"
            }}
            className={isFirstLetter ? "font-roxborough-italic" : "font-roobertregular"}
            style={{ display: 'inline-block' }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </motion.div>
  );

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <CircleTrail />
                <AnimatePresence>
                  <LoadingCursor mousePosition={mousePosition} loadStage={loadStage} />
                </AnimatePresence>
                <div>
                  {/* Custom Curtain Loading Animation */}
                  {loadStage !== 'done' && (
                    <div className="fixed inset-0 z-50 pointer-events-none" style={{ overflow: 'hidden' }}>
                      {/* ebebeb background only during the 'strip' stage */}
                      {loadStage === 'strip' && (
                        <div className="absolute inset-0" style={{ background: '#ebebeb', zIndex: 0 }} />
                      )}
                      {/* Top strip */}
                      <div
                        className={`
                          absolute left-0 w-full
                          transition-all duration-400
                          ${loadStage === 'strip' ? 'top-[41.5%] h-[9%]' : 'top-0 h-1/2'}
                          ${loadStage === 'break' ? '-translate-y-full' : ''}
                        `}
                        style={{
                          background: '#090909', // Changed from #1c1c1c to #090909
                          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                          zIndex: 3,
                        }}
                      />
                      {/* Bottom strip */}
                      <div
                        className={`
                          absolute left-0 w-full
                          transition-all duration-400
                          ${loadStage === 'strip' ? 'top-[50.5%] h-[9%]' : 'top-1/2 h-1/2'}
                          ${loadStage === 'break' ? 'translate-y-full' : ''}
                        `}
                        style={{
                          background: '#090909', // Changed from #1c1c1c to #090909
                          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                          zIndex: 3,
                        }}
                      />
                      {/* Home text only during strip and expand */}
                      {(loadStage === 'strip' || loadStage === 'expand') && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          style={{
                            zIndex: 10,
                          }}
                        >
                          <span
                            style={{ 
                              color: loadStage === 'strip' ? '#262626' : '#ffffff',
                              transition: 'color 0.4s cubic-bezier(0.4,0,0.2,1)',
                              transitionDelay: '0.4s',
                              fontSize: '9rem', // Increased from 8xl/7xl by 30%
                              letterSpacing: '0.156em', // Increased by 50%
                            }}
                          >
                            <span className="font-roxborough-italic">H</span>
                            <span className="font-roobertregular">ome</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Main Content */}
                  {!loading && (
                    <div
                      className="min-h-screen flex flex-col items-center"
                      style={{
                        backgroundColor: "#ebebeb",
                        color: "#1c1c1c"
                      }}
                    >
                      {/* Collaboration text */}
                      <div
                        className="fixed font-roobertregular"
                        style={{
                          top: '2.4rem', // Changed from '2rem' to match Folio
                          left: '3.4rem', // Changed from '3rem' to mirror Folio's right spacing
                          fontSize: '0.74rem',
                          fontWeight: 400,
                          letterSpacing: '0.02em',
                          zIndex: 10,
                          lineHeight: '1.2'
                        }}
                      >
                        Open for any
                        <br />
                        collaborations and offers
                      </div>

                      {/* Add Folio text */}
                      <FolioHeader />

                      {/* Social Buttons Row */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '1.8rem', // Reduced from 2.5rem
                          position: 'absolute',
                          top: '2rem',
                          left: 0,
                          right: 0,
                          margin: '0 auto',
                          zIndex: 11,
                        }}
                      >
                        <a
                          href="https://github.com/aishwaryspanwar"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '1.8rem', // Reduced from 2.5rem
                            height: '1.8rem', // Reduced from 2.5rem
                            borderRadius: '50%',
                            background: 'transparent',
                            transition: 'background 0.2s',
                          }}
                        >
                          <img
                            src="https://github.com/aishwaryspanwar/Portfolio-Website/blob/master/src/images/icons8-github.svg"
                            alt="GitHub"
                            style={{ width: '1.6rem', height: '1.6rem', objectFit: 'contain' }} // Reduced from 2.2rem
                          />
                        </a>
                        <a
                          href="https://www.linkedin.com/in/aishwary-singh-panwar-25066a10a/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '1.8rem', // Reduced from 2.5rem
                            height: '1.8rem', // Reduced from 2.5rem
                            borderRadius: '50%',
                            background: 'transparent',
                            transition: 'background 0.2s',
                          }}
                        >
                          <img
                            src="https://github.com/aishwaryspanwar/Portfolio-Website/blob/master/src/images/icons8-linkedin.svg"
                            alt="LinkedIn"
                            style={{ width: '1.6rem', height: '1.6rem', objectFit: 'contain' }} // Reduced from 2.2rem
                          />
                        </a>
                        <a
                          href="mailto:your@email.com"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '1.8rem', // Reduced from 2.5rem
                            height: '1.8rem', // Reduced from 2.5rem
                            borderRadius: '50%',
                            background: 'transparent',
                            transition: 'background 0.2s',
                          }}
                        >
                          <img
                            src="/src/images/mail.png"
                            alt="Mail"
                            style={{ width: '1.6rem', height: '1.6rem', objectFit: 'contain' }} // Reduced from 2.2rem
                          />
                        </a>
                      </div>

                      <nav
                        className="fixed top-1/2 left-0 transform -translate-y-1/2 w-full flex justify-center bg-transparent overflow-hidden transition-all duration-500 group"
                        style={{
                          height: '4%',
                          backgroundColor: '#ebebeb',
                          color: "#1c1c1c",
                            // Add initial padding
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.height = '17%';
                          e.currentTarget.style.backgroundColor = '#1c1c1c'; // Changed from #1c1c1c to #090909
                          e.currentTarget.style.paddingTop = '2.8rem'; // Decreased from 3.3rem
                          const links = e.currentTarget.querySelectorAll('.flip-link, .copyright-text');
                          links.forEach(link => link.style.color = '#fff');
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.height = '4%';
                          e.currentTarget.style.backgroundColor = '#ebebeb';
                          e.currentTarget.style.paddingTop = '0rem'; // Keep consistent padding
                          const links = e.currentTarget.querySelectorAll('.flip-link, .copyright-text');
                          links.forEach(link => link.style.color = "#1c1c1c");
                          setHoveredNav(null);
                        }}
                      >
                        {/* Animated label: between nav bg and fliplinks */}
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
                          {hoveredNav && (
                            <StaggeredLabel text={hoveredNav} />
                          )}
                        </div>
                        <ul className="flex space-x-[28rem] text-s font-sans relative z-10">
                          <li
                            className="flip-link"
                            onMouseEnter={() => setHoveredNav("About")}
                            onMouseLeave={() => setHoveredNav(null)}
                          >
                            <div className="font-roobertregular" style={{ fontSize: '0.605rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 650 }}>01</div>
                            <FlipLink onClick={() => window.location.reload()}>About</FlipLink>
                          </li>
                          <li
                            className="flip-link"
                            onMouseEnter={() => setHoveredNav("Work")}
                            onMouseLeave={() => setHoveredNav(null)}
                          >
                            <div className="font-roobertregular" style={{ fontSize: '0.605rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 650 }}>02</div>
                            <FlipLink to="/work">Work</FlipLink>
                          </li>
                          <li
                            className="flip-link"
                            onMouseEnter={() => setHoveredNav("Contact")}
                            onMouseLeave={() => setHoveredNav(null)}
                          >
                            <div className="font-roobertregular" style={{ fontSize: '0.605rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 650 }}>03</div>
                            <FlipLink to="/contact">Contact</FlipLink>
                          </li>
                          <li
                            className="copyright-text"
                            style={{ 
                              fontSize: '0.66rem',
                              fontWeight: 650,
                              fontFamily: 'roobertregular',
                              marginTop: '.5rem'
                            }}
                          >
                            © 2025
                          </li>
                        </ul>
                      </nav>
                      {/* Left descriptive text */}
                      <div
                        className="fixed max-w-[300px] text-center"
                        style={{
                          top: '80%',
                          left: '10%',
                          fontFamily: 'RoobertSemiMono, sans-serif',
                          fontSize: '0.79rem',
                          lineHeight: '1.08', // Decreased from 1.5
                          zIndex: 1
                        }}
                      >
                        <img
                          src="https://github.com/aishwaryspanwar/Portfolio-Website/blob/master/src/images/Shapes.svg"  // Changed to use direct path
                          alt="Shape"
                          className="absolute"
                          style={{
                            top: '-60px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '1.6rem',
                          }}
                        />
                        AISHWARY PANWAR (HE/HIM) IS A DRIVEN SOPHOMORE ENGINEERING STUDENT BASED IN NEW DELHI, INDIA.
                      </div>

                      {/* Center Animation */}
                      <div className="fixed"
                        style={{
                          top: '78%',
                          left: '48%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1,
                          width: '34em', // Increased from 200px
                          height: 'auto'
                        }}
                      >
                        <img
                          src="https://github.com/aishwaryspanwar/Portfolio-Website/blob/master/src/images/Artboard%201.png"
                          alt="Artboard"
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      </div>

                      {/* Right descriptive text */}
                      <div
                        className="fixed max-w-[300px] text-center"
                        style={{
                          top: '80%',
                          right: '10%',
                          fontFamily: 'RoobertSemiMono, sans-serif',
                          fontSize: '0.79rem',
                          lineHeight: '1.08', // Decreased from 1.5
                            zIndex: 1
                          }}
                          >
                          <img
                            src="/src/images/Shapes.svg"
                            alt="SHAPE"
                            className="absolute"
                            style={{
                            top: '-60px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '1.6rem',
                            }}
                          />
                          PASSIONATE ABOUT CREATING UNFORGETTABLE AND BEAUTIFUL DIGITAL EXPERIENCES.
                          </div>

                          <main className="text-center mt-2" style={{ zIndex: 2 }}>
                          <h1
                            className="text-[5rem] md:text-[8rem] font-roxborough"
                            style={{ 
                            marginTop: '3.4rem',
                            fontWeight: 400,
                            fontSize: '10rem',
                            color: '#1C1C1C',
                            letterSpacing: '-0.05em' // DECREASED BY 30% FROM 0.08EM
                          }}
                        >
                          {/* Staggered animation for each letter */}
                          {(() => {
                            const name = "Aishwary Panwar";
                            const splitIdx = name.indexOf(" ");
                            const first = name.slice(0, splitIdx); // "Aishwary"
                            const second = name.slice(splitIdx + 1); // "Panwar"
                            return (
                              <>
                                <span className="font-roxborough-italic" style={{ fontStyle: "italic" }}>
                                  {first.split("").map((char, idx) => (
                                    <span
                                      key={`aishwary-${idx}`}
                                      style={{
                                        display: 'inline-block',
                                        opacity: 0,
                                        transform: 'translateY(40px)',
                                        animation: `fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards`,
                                        animationDelay: `${idx * 0.06 + 0.2}s`
                                      }}
                                    >
                                      {char === " " ? "\u00A0" : char}
                                    </span>
                                  ))}
                                </span>
                                <span> </span>
                                <span className="font-roobertregular" style={{ fontWeight: 400 }}>
                                  {second.split("").map((char, idx) => (
                                    <span
                                      key={`panwar-${idx}`}
                                      style={{
                                        display: 'inline-block',
                                        opacity: 0,
                                        transform: 'translateY(40px)',
                                        animation: `fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards`,
                                        animationDelay: `${(first.length + 1 + idx) * 0.06 + 0.2}s`
                                      }}
                                    >
                                      {char === " " ? "\u00A0" : char}
                                    </span>
                                  ))}
                                </span>
                              </>
                            );
                          })()}
                        </h1>
                        {/* Removed the "Open for any collaborations and offers" text */}
                      </main>
                    </div>
                  )}
                </div>
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div>
                <Contact />
                <FolioHeader />
              </div>
            }
          />
          <Route
            path="/work"
            element={
              <div>
                <Work />
                <FolioHeader />
              </div>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
