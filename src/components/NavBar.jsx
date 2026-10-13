import { useState } from 'react';
import { motion } from 'framer-motion';
import FlipLink from './FlipLink';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/work' },
  { label: 'Contact', to: '/contact' },
];

// Large page name that fades in behind the open nav.
const StaggeredLabel = ({ text }) => (
  <div
    className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
    style={{
      gap: '0.1em',
      fontSize: 'clamp(3rem, 10vw, 9rem)',
      color: 'var(--nav-label)',
      letterSpacing: '0.08em',
      lineHeight: 1.1,
    }}
    aria-hidden="true"
  >
    {text.split('').map((char, idx) => (
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + idx * 0.04, duration: 0.22, ease: 'easeOut' }}
        className={idx === 0 ? 'font-roxborough-italic' : 'font-roobertregular'}
        style={{ display: 'inline-block' }}
      >
        {char}
      </motion.span>
    ))}
  </div>
);

const smallLabel = { fontSize: '0.605rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 650 };

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  const close = () => {
    setOpen(false);
    setHoveredNav(null);
  };

  return (
    <nav
      aria-label="Main"
      className="fixed left-0 top-1/2 z-20 flex w-full -translate-y-1/2 justify-center overflow-hidden transition-all duration-500"
      style={{
        height: open ? '17%' : '4%',
        minHeight: '2.75rem',
        paddingTop: open ? '2.8rem' : 0,
        backgroundColor: open ? 'var(--hover-bg)' : 'var(--nav-bg)',
        color: open ? 'var(--hover-text)' : 'var(--text-color)',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close();
      }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
        {hoveredNav && <StaggeredLabel key={hoveredNav} text={hoveredNav} />}
      </div>
      <ul className="relative z-10 flex w-full max-w-[100rem] justify-between px-6 sm:px-12 lg:px-24">
        {NAV_ITEMS.map((item, i) => (
          <li
            key={item.to}
            onMouseEnter={() => setHoveredNav(item.label)}
            onMouseLeave={() => setHoveredNav(null)}
            onFocus={() => setHoveredNav(item.label)}
          >
            <div className="font-roobertregular" style={smallLabel} aria-hidden="true">
              0{i + 1}
            </div>
            <FlipLink to={item.to}>{item.label}</FlipLink>
          </li>
        ))}
        <li
          className="font-roobertregular"
          style={{ fontSize: '0.66rem', fontWeight: 650, marginTop: '.5rem' }}
        >
          © {new Date().getFullYear()}
        </li>
      </ul>
    </nav>
  );
}
