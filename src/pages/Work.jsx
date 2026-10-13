import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AlbumCarousel from '../components/AlbumCarousel';
import ArrowLink from '../components/ArrowLink';
import { PROJECTS } from '../data/projects';

// The ring looks best with ~10 cards, so the project list is shown twice.
const RING = [...PROJECTS, ...PROJECTS];
const COVERS = RING.map((p) => ({ src: p.cover, alt: `${p.title} cover` }));

const EASE = [0.4, 0, 0.2, 1];

export default function Work() {
  const [activeIdx, setActiveIdx] = useState(0);
  const project = RING[activeIdx] ?? PROJECTS[0];

  return (
    <>
      {/* Extra height gives the page something to scroll; scrolling spins the carousel. */}
      <div aria-hidden="true" style={{ height: 'calc(100vh + 2000px)' }} />

      <section
        aria-live="polite"
        className="fixed inset-x-0 bottom-[calc(50%+1.75rem)] top-20 flex flex-col items-center justify-center px-6 text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <h1 className="mb-3 font-roxborough-italic text-3xl sm:mb-4 sm:text-5xl">{project.title}</h1>
            <p className="mb-3 max-w-[37rem] font-roobertregular text-sm opacity-80 sm:mb-4 sm:text-lg">
              {project.description}
            </p>
            <ArrowLink
              href={project.link}
              className="text-base opacity-70 transition-opacity hover:opacity-100 sm:text-lg"
              hoverClassName="group-hover:text-[color:var(--accent)]"
            >
              View project
            </ArrowLink>
          </motion.div>
        </AnimatePresence>
      </section>

      <section aria-label="Projects" className="fixed inset-x-0 bottom-[3%] top-[calc(50%+2rem)] z-10">
        <AlbumCarousel covers={COVERS} onSlideChange={setActiveIdx} />
      </section>
    </>
  );
}
