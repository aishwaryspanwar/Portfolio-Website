// Renders text letter by letter, each rising into place with a short stagger.
// Letters are grouped per word so lines only wrap between words.
// Screen readers get the plain text via the visually hidden copy.
export default function RisingText({ text, className = '', startIndex = 0 }) {
  const words = text.split(' ');
  // Position of each word's first letter in the whole string (spaces count, as in the original timing).
  const offsets = words.map((_, w) => words.slice(0, w).join(' ').length + (w > 0 ? 1 : 0));

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((char, i) => (
                <span
                  key={i}
                  className="letter-rise"
                  style={{ animationDelay: `${(startIndex + offsets[w] + i) * 0.06 + 0.2}s` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
