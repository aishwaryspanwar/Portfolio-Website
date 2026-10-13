import { useEffect, useState } from 'react';
import LoadingCurtain from './LoadingCurtain';
import NavBar from './NavBar';
import TopBar from './TopBar';

// The first visit gets the full intro; moving between pages uses a shorter curtain.
const TIMINGS = {
  intro: { expand: 400, content: 1100, break: 2400, done: 3400 },
  quick: { expand: 250, content: 700, break: 1300, done: 1900 },
};
let introPlayed = false;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function PageShell({ label, title, children }) {
  const [stage, setStage] = useState(() => (prefersReducedMotion() ? 'done' : 'strip'));
  const [showContent, setShowContent] = useState(stage === 'done');

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (stage === 'done') return;
    const t = introPlayed ? TIMINGS.quick : TIMINGS.intro;
    const timers = [
      setTimeout(() => setStage('expand'), t.expand),
      setTimeout(() => setShowContent(true), t.content),
      setTimeout(() => setStage('break'), t.break),
      setTimeout(() => {
        introPlayed = true;
        setStage('done');
      }, t.done),
    ];
    return () => timers.forEach(clearTimeout);
    // Runs once per mount; the shell is remounted on every navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LoadingCurtain label={label} stage={stage} />
      {showContent && (
        <div className="min-h-screen">
          <TopBar />
          <NavBar />
          <main>{children}</main>
        </div>
      )}
    </>
  );
}
