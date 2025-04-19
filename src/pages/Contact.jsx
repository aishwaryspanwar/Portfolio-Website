import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import CircleTrail from "../components/CircleTrail";
import LoadingCursor from '../components/LoadingCursor';

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
        fontSize: "0.66rem",
        fontWeight: 650
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
      fontWeight: 700,
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

function Contact() {
  const [loading, setLoading] = useState(true);
  const [loadStage, setLoadStage] = useState('strip');
  const [hoveredNav, setHoveredNav] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
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

  // Add mouse tracking
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

  return (
    <ThemeProvider>
      <>
        <CircleTrail />
        <AnimatePresence>
          <LoadingCursor mousePosition={mousePosition} loadStage={loadStage} />
        </AnimatePresence>
        <div>
          {/* Custom Loading Cursor */}
          <AnimatePresence>
            {loadStage !== 'done' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  left: mousePosition.x + 40,
                  top: mousePosition.y - 20,
                  pointerEvents: 'none',
                  zIndex: 9999,
                  color: loadStage === 'strip' ? '#262626' : '#ffffff',
                  fontFamily: 'RoxboroughCFRegularItalic',
                  fontSize: '1.5rem',
                  transition: 'color 0.4s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                Loading..
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom Curtain Loading Animation */}
          {loadStage !== 'done' && (
            <div className="fixed inset-0 z-50 pointer-events-none" style={{ overflow: 'hidden' }}>
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
                  background: '#090909',
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
                  background: '#090909',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                  zIndex: 3,
                }}
              />
              {/* Contact text only during strip and expand */}
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
                      fontSize: '9rem',
                      letterSpacing: '0.156em',
                    }}
                  >
                    <span className="font-roxborough-italic">C</span>
                    <span className="font-roobertregular">ontact</span>
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

              {/* Navbar */}
              <nav
                className="fixed top-1/2 left-0 transform -translate-y-1/2 w-full flex justify-center bg-transparent overflow-hidden transition-all duration-500 group"
                style={{
                  height: '4%',
                  backgroundColor: '#ebebeb',
                  color: "#1c1c1c",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.height = '17%';
                  e.currentTarget.style.backgroundColor = '#1c1c1c';
                  e.currentTarget.style.paddingTop = '2.8rem';
                  const links = e.currentTarget.querySelectorAll('.flip-link, .copyright-text');
                  links.forEach(link => link.style.color = '#fff');
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.height = '4%';
                  e.currentTarget.style.backgroundColor = '#ebebeb';
                  e.currentTarget.style.paddingTop = '0rem';
                  const links = e.currentTarget.querySelectorAll('.flip-link, .copyright-text');
                  links.forEach(link => link.style.color = "#1c1c1c");
                  setHoveredNav(null);
                }}
              >
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
                    <FlipLink to="/">About</FlipLink>
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
              {/* Heading */}
              <main className="text-center" style={{ zIndex: 2, marginTop: '6.7rem' }}>
                <h1
                  className="text-[5rem] md:text-[8rem] font-roxborough"
                  style={{
                    fontWeight: 400,
                    fontSize: '4.8rem', // Decreased by 40% from 8rem
                    color: '#1C1C1C',
                    letterSpacing: '-0.05em',
                    maxWidth: '100%',
                    lineHeight: '1.1' // Added smaller line height
                  }}
                >
                  {/* Staggered animation for each letter */}
                  {(() => {
                    const phrase = "Let's collaborate";
                    const secondPhrase = "and make good sh*t together";
                    return (
                      <>
                        <span className="font-roxborough-italic" style={{ fontStyle: "italic" }}>
                          {phrase.split("").map((char, idx) => (
                            <span
                              key={`first-${idx}`}
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
                        <br />
                        <span className="font-roobertregular" style={{ fontWeight: 400 }}>
                          {secondPhrase.split("").map((char, idx) => (
                            <span
                              key={`second-${idx}`}
                              style={{
                                display: 'inline-block',
                                opacity: 0,
                                transform: 'translateY(40px)',
                                animation: `fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards`,
                                animationDelay: `${(phrase.length + idx) * 0.06 + 0.2}s`
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
              </main>
            </div>
          )}
        </div>
      </>
    </ThemeProvider>
  );
}

export default Contact;
