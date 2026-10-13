import ThemeToggle from './ThemeToggle';

const textStyle = { fontSize: '0.74rem', letterSpacing: '0.02em', lineHeight: 1.2 };

export default function TopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between px-4 pt-6 font-roobertregular sm:px-[3.4rem] sm:pt-[2.4rem]">
      <p style={textStyle}>
        Open for any
        <br />
        collaborations and offers
      </p>
      <div className="flex flex-col items-end text-right" style={textStyle}>
        <span>
          Folio
          <br />
          Vol.1-
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
