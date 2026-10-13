import { useEffect, useState } from 'react';

const EASE = 'cubic-bezier(0.4,0,0.2,1)';

// Two dark strips that grow to cover the screen with the page name, then split apart.
export default function LoadingCurtain({ label, stage }) {
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (stage === 'done') return null;

  const isStrip = stage === 'strip';
  const isBreak = stage === 'break';
  const stripTransition = `all 0.4s ${EASE}, transform 0.5s ${EASE}`;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {isStrip && <div className="absolute inset-0" style={{ background: '#ebebeb' }} />}
      <div
        className={`absolute left-0 w-full ${isStrip ? 'top-[41.5%] h-[9%]' : 'top-0 h-1/2'} ${isBreak ? '-translate-y-full' : ''}`}
        style={{ background: '#090909', transition: stripTransition, zIndex: 3 }}
      />
      <div
        className={`absolute left-0 w-full ${isStrip ? 'top-[50.5%] h-[9%]' : 'top-1/2 h-1/2'} ${isBreak ? 'translate-y-full' : ''}`}
        style={{ background: '#090909', transition: stripTransition, zIndex: 3 }}
      />
      {(isStrip || stage === 'expand') && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
          <span
            style={{
              color: isStrip ? '#262626' : '#ffffff',
              transition: `color 0.4s ${EASE} 0.4s`,
              fontSize: 'clamp(3.5rem, 12vw, 9rem)',
              letterSpacing: '0.156em',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="font-roxborough-italic">{label[0]}</span>
            <span className="font-roobertregular">{label.slice(1)}</span>
          </span>
        </div>
      )}
      {cursor && (
        <div
          className="font-roxborough-italic"
          style={{
            position: 'fixed',
            left: cursor.x + 40,
            top: cursor.y - 20,
            zIndex: 20,
            color: isStrip ? '#262626' : '#ebebeb',
            fontSize: '1.5rem',
            transition: `color 0.4s ${EASE}`,
          }}
        >
          Loading..
        </div>
      )}
    </div>
  );
}
