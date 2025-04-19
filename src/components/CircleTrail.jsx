import React, { useEffect, useRef } from "react";
import "../CircleTrail.css";

const CircleTrail = () => {
  const circlesRef = useRef([]);
  const coords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      coords.current.x = e.clientX;
      coords.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    circlesRef.current.forEach((circle, index) => {
      if (circle) {
        circle.x = 0;
        circle.y = 0;
        circle.style.backgroundColor = "#1c1c1c";
      }
    });

    const animateCircles = () => {
      let x = coords.current.x;
      let y = coords.current.y;
      circlesRef.current.forEach((circle, index) => {
        if (circle) {
          circle.style.left = x - 7 + "px";
          circle.style.top = y - 7 + "px";
          const scale = (circlesRef.current.length - index) / circlesRef.current.length;
          circle.style.transform = `scale(${scale})`;
          circle.x = x;
          circle.y = y;
          const nextCircle = circlesRef.current[index + 1] || circlesRef.current[0];
          x += (nextCircle.x - x) * 0.3;
          y += (nextCircle.y - y) * 0.3;
        }
      });
      requestAnimationFrame(animateCircles);
    };
    animateCircles();
  }, []);

  return (
    <>
      {[...Array(21)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (circlesRef.current[i] = el)}
          className="circle"
        ></div>
      ))}
    </>
  );
};

export default CircleTrail;
