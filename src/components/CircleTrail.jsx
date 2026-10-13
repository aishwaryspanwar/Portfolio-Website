import { useEffect, useRef } from 'react';

const COUNT = 21;
const RADIUS = 7;

// Trail of shrinking dots that follows the mouse. Hidden on touch devices via CSS.
const CircleTrail = () => {
  const circlesRef = useRef([]);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const circles = circlesRef.current;
    const mouse = { x: 0, y: 0 };
    const points = circles.map(() => ({ x: 0, y: 0 }));
    let frame = null;

    const animate = () => {
      let { x, y } = mouse;
      points.forEach((point, i) => {
        point.x = x;
        point.y = y;
        const scale = (COUNT - i) / COUNT;
        circles[i].style.transform = `translate(${x - RADIUS}px, ${y - RADIUS}px) scale(${scale})`;
        const next = points[i + 1] || points[0];
        x += (next.x - x) * 0.3;
        y += (next.y - y) * 0.3;
      });
      frame = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (frame === null) {
        // Start on the first move so the trail doesn't sit in the top-left corner.
        points.forEach((p) => { p.x = mouse.x; p.y = mouse.y; });
        circles.forEach((c) => { c.style.opacity = '1'; });
        frame = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <div key={i} ref={(el) => (circlesRef.current[i] = el)} className="circle" />
      ))}
    </div>
  );
};

export default CircleTrail;
