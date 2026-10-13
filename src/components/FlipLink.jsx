import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DURATION = 0.25;
const STAGGER = 0.025;

// Nav link whose letters roll up to reveal a second copy on hover.
export default function FlipLink({ children, to }) {
  const [isHovered, setIsHovered] = useState(false);

  const letters = (from, to) =>
    children.split('').map((l, i) => (
      <motion.span
        key={i}
        variants={{ initial: { y: from }, hovered: { y: to } }}
        transition={{ duration: DURATION, ease: 'easeInOut', delay: STAGGER * i }}
        className="inline-block"
      >
        {l}
      </motion.span>
    ));

  return (
    <Link
      to={to}
      aria-label={children}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <motion.span
        initial="initial"
        animate={isHovered ? 'hovered' : 'initial'}
        aria-hidden="true"
        className="relative block overflow-hidden whitespace-nowrap uppercase font-roobertregular"
        style={{ lineHeight: 1.2, fontSize: '0.66rem', fontWeight: 650 }}
      >
        <span className="block">{letters(0, '-100%')}</span>
        <span className="absolute inset-0">{letters('100%', 0)}</span>
      </motion.span>
    </Link>
  );
}
