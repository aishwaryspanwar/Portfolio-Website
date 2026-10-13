import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from 'gsap/Draggable';
import debounce from 'lodash/debounce';
import clickSoundUrl from '../audio/audio.mp3';
import './Carousel.css';

gsap.registerPlugin(ScrollTrigger, Draggable);

// 3D looping cover-flow driven by page scroll, drag, arrow buttons, keys, and clicks.
// `covers` is a list of { src, alt }; `onSlideChange` receives the active index.
export default function AlbumCarousel({ covers, onSlideChange }) {
  const containerRef = useRef(null);
  const boxesRef = useRef([]);
  const proxyRef = useRef(null);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const onSlideChangeRef = useRef(onSlideChange);
  onSlideChangeRef.current = onSlideChange;

  useEffect(() => {
    const container = containerRef.current;
    const leftButton = leftButtonRef.current;
    const rightButton = rightButtonRef.current;
    const boxes = boxesRef.current.slice(0, covers.length);

    const clickSound = new Audio(clickSoundUrl);
    clickSound.volume = 0.6;
    const playClickSound = () => {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    };

    let lastIndex = -1;
    const emitSlideChange = debounce((index) => {
      if (index !== lastIndex) {
        lastIndex = index;
        onSlideChangeRef.current?.(index);
      }
    }, 150);

    const ctx = gsap.context(() => {
      gsap.set(boxes, { yPercent: -50, display: 'block' });

      const STAGGER = 0.1;
      const DURATION = 1;

      const LOOP = gsap.timeline({ paused: true, repeat: -1, ease: 'none' });
      const SHIFTS = [...boxes, ...boxes, ...boxes];

      SHIFTS.forEach((box, i) => {
        const tl = gsap
          .timeline()
          .set(box, { xPercent: 200, rotateY: -50, opacity: 0, scale: 0.5, zIndex: i })
          .to(box, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0)
          .to(box, { opacity: 0, scale: 0.5, duration: 0.3, ease: 'power2.in' }, 0.7)
          .fromTo(box, { xPercent: 200 }, { xPercent: -200, duration: 1, immediateRender: false, ease: 'power2.inOut' }, 0)
          .fromTo(box, { rotateY: -45 }, { rotateY: 45, immediateRender: false, duration: 1, ease: 'power2.inOut' }, 0)
          .fromTo(box, { zIndex: 1 }, { zIndex: boxes.length, duration: 0.5, immediateRender: false }, 0.25);
        LOOP.add(tl, i * STAGGER);
      });

      const cycleDur = STAGGER * boxes.length;
      const startTime = cycleDur + DURATION * 0.5;

      const head = gsap.fromTo(
        LOOP,
        { totalTime: startTime },
        { totalTime: `+=${cycleDur}`, duration: 1, ease: 'none', repeat: -1, paused: true }
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
      const snap = gsap.utils.snap(1 / boxes.length);

      const updateActiveSlide = (position) => {
        const normalizedPos = gsap.utils.wrap(0, 1, position);
        emitSlideChange(Math.round(normalizedPos * boxes.length) % boxes.length);
      };

      // Scrolling the page moves the carousel; the scroll position wraps for an endless loop.
      const trigger = ScrollTrigger.create({
        start: 0,
        end: '+=2000',
        onUpdate: (self) => {
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
        },
      });

      function wrapIteration(iterationDelta, scrollTo) {
        iteration += iterationDelta;
        trigger.scroll(scrollTo);
        trigger.update();
      }

      const progressToScroll = (progress) =>
        gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, progress) * trigger.end);

      const scrollToPosition = (position) => {
        const snapPos = snap(position);
        const progress = (snapPos - head.duration() * iteration) / head.duration();
        const scroll = progressToScroll(progress);
        updateActiveSlide(snapPos);
        if (progress >= 1 || progress < 0) return wrapIteration(Math.floor(progress), scroll);
        trigger.scroll(scroll);
      };

      const goLeft = () => {
        playClickSound();
        scrollToPosition(scrub.vars.pos - 1 / boxes.length);
      };
      const goRight = () => {
        playClickSound();
        scrollToPosition(scrub.vars.pos + 1 / boxes.length);
      };

      const handleScrollEnd = () => scrollToPosition(scrub.vars.pos);
      ScrollTrigger.addEventListener('scrollEnd', handleScrollEnd);

      leftButton.addEventListener('click', goLeft);
      rightButton.addEventListener('click', goRight);

      const [drag] = Draggable.create(proxyRef.current, {
        type: 'x',
        trigger: boxes,
        onPress() {
          this.startOffset = scrub.vars.pos;
        },
        onDrag() {
          const newPos = this.startOffset + (this.startX - this.x) * 0.001;
          scrub.vars.pos = newPos;
          scrub.invalidate().restart();
          updateActiveSlide(newPos);
        },
        onDragEnd() {
          scrollToPosition(scrub.vars.pos);
        },
      });

      const handleKeydown = (event) => {
        if (event.target.closest?.('input, textarea, [contenteditable]')) return;
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') goLeft();
        if (event.code === 'ArrowRight' || event.code === 'KeyD') goRight();
      };
      document.addEventListener('keydown', handleKeydown);

      const handleBoxClick = (e) => {
        const box = e.target.closest('.box');
        if (!box) return;
        playClickSound();
        const target = boxes.indexOf(box);
        const current = gsap.utils.wrap(0, boxes.length, Math.floor(boxes.length * scrub.vars.pos));
        let bump = target - current;
        if (target > current && target - current > boxes.length * 0.5) {
          bump = (boxes.length - bump) * -1;
        }
        if (current > target && current - target > boxes.length * 0.5) {
          bump = boxes.length + bump;
        }
        scrollToPosition(scrub.vars.pos + bump * (1 / boxes.length));
      };
      container.addEventListener('click', handleBoxClick);

      return () => {
        ScrollTrigger.removeEventListener('scrollEnd', handleScrollEnd);
        leftButton.removeEventListener('click', goLeft);
        rightButton.removeEventListener('click', goRight);
        document.removeEventListener('keydown', handleKeydown);
        container.removeEventListener('click', handleBoxClick);
        drag.kill();
      };
    }, container);

    return () => {
      emitSlideChange.cancel();
      ctx.revert();
      clickSound.pause();
      clickSound.removeAttribute('src');
    };
  }, [covers]);

  return (
    <div className="carousel">
      <button ref={leftButtonRef} type="button" className="control-button left-control">
        <span className="sr-only">Previous project</span>
      </button>
      <div ref={containerRef} className="boxes">
        {covers.map((cover, i) => (
          <div key={i} className="box" ref={(el) => (boxesRef.current[i] = el)}>
            <img src={cover.src} alt={cover.alt} draggable="false" />
          </div>
        ))}
      </div>
      <button ref={rightButtonRef} type="button" className="control-button right-control">
        <span className="sr-only">Next project</span>
      </button>
      <div ref={proxyRef} className="drag-proxy" />
    </div>
  );
}
