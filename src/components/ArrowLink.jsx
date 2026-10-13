// External link that swaps to the italic serif and reveals an arrow on hover.
export default function ArrowLink({ href, children, className = '', hoverClassName = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex w-fit items-center gap-2 font-roobertregular ${className}`}
    >
      <span
        className={`transition-all duration-500 group-hover:font-roxborough-italic group-hover:font-bold group-hover:italic group-focus-visible:font-roxborough-italic ${hoverClassName}`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${hoverClassName}`}
      >
        →
      </span>
    </a>
  );
}
