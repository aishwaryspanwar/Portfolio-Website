import { Link } from 'react-router-dom';
import RisingText from '../components/RisingText';

export default function NotFound() {
  return (
    <div className="fixed inset-x-0 bottom-[calc(50%+1.75rem)] top-20 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-roxborough-italic" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.8rem)', letterSpacing: '-0.05em' }}>
        <RisingText text="Nothing here." />
      </h1>
      <Link to="/" className="font-roobertregular text-sm underline underline-offset-4 opacity-70 hover:opacity-100">
        Back to home
      </Link>
    </div>
  );
}
