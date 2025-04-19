import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from 'gsap/Draggable';
import debounce from 'lodash/debounce';
import './Carousel.css';

const COVERS = [
    "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*IOWhMijeI03LYVmVhW4QXw.jpeg",
    "https://sigchi.iiitd.ac.in/_next/static/media/image1.a1adfd7b.svg",
    "/src/images/mast.png",
    "https://img.electronicdesign.com/files/base/ebm/electronicdesign/image/2020/11/RISC_V_logo.5fa1b8aab3304.png?auto=format%2Ccompress&w=640&width=640",
    "https://sigchi.iiitd.ac.in/_next/static/media/image1.a1adfd7b.svg",
    "https://img.freepik.com/free-vector/navigation-concept-illustration_114360-956.jpg",
    "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*IOWhMijeI03LYVmVhW4QXw.jpeg",
    "https://sigchi.iiitd.ac.in/_next/static/media/image1.a1adfd7b.svg",
    "/src/images/mast.png",
    "https://img.electronicdesign.com/files/base/ebm/electronicdesign/image/2020/11/RISC_V_logo.5fa1b8aab3304.png?auto=format%2Ccompress&w=640&width=640",
  ];

  export default function AlbumCarousel({ onSlideChange }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const boxesRef = useRef([]);
    const proxyRef = useRef(null);
  
    // Debounced slide change handler
    const debouncedSlideChange = useRef(
      debounce((index) => {
        if (currentIndex !== index) {
          setCurrentIndex(index);
          onSlideChange?.(index);
        }
      }, 150)
    ).current;
  
    useEffect(() => {
      gsap.registerPlugin(ScrollTrigger, Draggable);
      const boxes = boxesRef.current;
      
      gsap.set(boxes, { 
        yPercent: -50,
        display: 'block'
      });
  
      const STAGGER = 0.1;
      const DURATION = 1;
      const OFFSET = 0;

      const wrap = (value, min, max) => {
        const range = max - min;
        return min + ((((value - min) % range) + range) % range);
      };
  
      const LOOP = gsap.timeline({
        paused: true,
        repeat: -1,
        ease: 'none',
      });
  
      const SHIFTS = [...boxes, ...boxes, ...boxes];
  
      SHIFTS.forEach((box, i) => {
        const tl = gsap.timeline()
          .set(box, {
            xPercent: 200,
            rotateY: -50,
            opacity: 0,
            scale: 0.5,
            zIndex: i
          })
          .to(box, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          }, 0)
          .to(box, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: "power2.in"
          }, 0.7)
          .fromTo(box,
            { xPercent: 200 },
            {
              xPercent: -200, // Reduced negative range to match left offset
              duration: 1,
              immediateRender: false,
              ease: 'power2.inOut',
            }, 0)
          .fromTo(box,
            { rotateY: -45 },
            {
              rotateY: 45,
              immediateRender: false,
              duration: 1,
              ease: 'power2.inOut',
            }, 0)
          .fromTo(box,
            { zIndex: 1 },
            {
              zIndex: boxes.length,
              duration: 0.5,
              immediateRender: false
            }, 0.25);
        LOOP.add(tl, i * STAGGER);
      });
  
      const cycleDur = STAGGER * boxes.length;
      const startTime = cycleDur + DURATION * 0.5 + OFFSET;
  
      const head = gsap.fromTo(LOOP,
        { totalTime: startTime },
        { 
          totalTime: `+=${cycleDur}`,
          duration: 1,
          ease: 'none',
          repeat: -1,
          paused: true,
        }
      );
  
      const playhead = { pos: 0 };
      const wrapTime = gsap.utils.wrap(0, head.duration());
      const scrub = gsap.to(playhead, {
        pos: 0,
        onUpdate: () => head.totalTime(wrapTime(playhead.pos)),
        paused: true,
        duration: 0.25,
        ease: 'power3',
      });
  
      let iteration = 0;
      const wrapIteration = (iterationDelta, scrollTo) => {
        iteration += iterationDelta;
        trigger.scroll(scrollTo);
        trigger.update();
      };

      const snap = gsap.utils.snap(1 / boxes.length);

      const progressToScroll = progress =>
        gsap.utils.clamp(
          1,
          trigger.end - 1,
          gsap.utils.wrap(0, 1, progress) * trigger.end
        );

      const updateActiveSlide = (position) => {
        const normalizedPos = gsap.utils.wrap(0, 1, position);
        const index = Math.round(normalizedPos * boxes.length) % boxes.length;
        debouncedSlideChange(index);
      };

      const scrollToPosition = position => {
        const snapPos = snap(position);
        const progress = (snapPos - head.duration() * iteration) / head.duration();
        const scroll = progressToScroll(progress);
        updateActiveSlide(snapPos);
        if (progress >= 1 || progress < 0) return wrapIteration(Math.floor(progress), scroll);
        trigger.scroll(scroll);
      };

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 0,
        end: '+=2000',
        horizontal: false,
        pin: true,
        onUpdate: self => {
          const scroll = self.scroll();
          if (scroll > self.end - 1) {
            wrapIteration(1, 1);
          } else if (scroll < 1 && self.direction < 0) {
            wrapIteration(-1, self.end - 1);
          } else {
            const newPos = (iteration + self.progress) * head.duration();
            scrub.vars.pos = newPos;
            scrub.invalidate().restart();
            updateActiveSlide(newPos);
          }
        }
      });
  
      const next = () => scrollToPosition(scrub.vars.pos - 1 / boxes.length);
      const prev = () => scrollToPosition(scrub.vars.pos + 1 / boxes.length);
  
      ScrollTrigger.addEventListener('scrollEnd', () => 
        scrollToPosition(scrub.vars.pos)
      );
  
      document.querySelector('.next').addEventListener('click', next);
      document.querySelector('.prev').addEventListener('click', prev);
  
      Draggable.create(proxyRef.current, {
        type: 'x',
        trigger: '.box',
        onPress() { this.startOffset = scrub.vars.pos; },
        onDrag() {
          const newPos = this.startOffset + (this.startX - this.x) * 0.001;
          scrub.vars.pos = newPos;
          scrub.invalidate().restart();
          updateActiveSlide(newPos);
        },
        onDragEnd() {
          scrollToPosition(scrub.vars.pos);
        }
      });
  
      // Add keyboard controls
      const handleKeydown = (event) => {
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') next();
        if (event.code === 'ArrowRight' || event.code === 'KeyD') prev();
      };
      
      document.addEventListener('keydown', handleKeydown);
  
      // Add box click handling
      const handleBoxClick = (e) => {
        const box = e.target.closest('.box');
        if (box) {
          const target = boxes.indexOf(box);
          const current = gsap.utils.wrap(
            0,
            boxes.length,
            Math.floor(boxes.length * scrub.vars.pos)
          );
          let bump = target - current;
          if (target > current && target - current > boxes.length * 0.5) {
            bump = (boxes.length - bump) * -1;
          }
          if (current > target && current - target > boxes.length * 0.5) {
            bump = boxes.length + bump;
          }
          scrollToPosition(scrub.vars.pos + bump * (1 / boxes.length));
        }
      };
  
      containerRef.current.addEventListener('click', handleBoxClick);
  
      // Cleanup
      return () => {
        debouncedSlideChange.cancel();
        ScrollTrigger.killAll();
        document.removeEventListener('keydown', handleKeydown);
        containerRef.current?.removeEventListener('click', handleBoxClick);
      };
    }, [onSlideChange]);
  
    return (
      <div ref={containerRef} className="boxes">
        {COVERS.map((src, i) => (
          <div
            key={i}
            className="box"
            ref={el => (boxesRef.current[i] = el)}
            style={{ '--src': `url(${src})` }}
          >
            <span className="visually-hidden">Album {i + 1}</span>
            <img src={src} alt={`Album cover ${i + 1}`} />
          </div>
        ))}
        <div className="controls">
          <button className="next"><span className="visually-hidden">Previous album</span>◀</button>
          <button className="prev"><span className="visually-hidden">Next album</span>▶</button>
        </div>
        <div ref={proxyRef} className="drag-proxy"></div>
      </div>
    );
  }