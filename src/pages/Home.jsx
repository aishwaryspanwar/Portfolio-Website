import RisingText from '../components/RisingText';
import loopVideo from '../images/loop-video.mp4';
import shapeIcon from '../images/Shapes.svg';
import githubIcon from '../images/icons8-github.svg';
import linkedinIcon from '../images/icons8-linkedin.svg';
import mailIcon from '../images/mail.png';

const FIRST_NAME = 'Aishwary';
const LAST_NAME = 'Panwar';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/aishwaryspanwar', icon: githubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aishwary-singh-panwar-25066a10a/', icon: linkedinIcon },
  {
    label: 'Email',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=aishwarypanwar@gmail.com&su=Loved%20Your%20Portfolio%20Website!',
    icon: mailIcon,
  },
];

const Blurb = ({ children, className = '' }) => (
  <div className={`flex max-w-[300px] flex-col items-center gap-4 justify-self-center text-center ${className}`}>
    <img src={shapeIcon} alt="" className="w-5 dark:invert md:w-[1.6rem]" />
    <p className="font-semimono text-[0.65rem] md:text-[0.79rem]" style={{ lineHeight: 1.08 }}>
      {children}
    </p>
  </div>
);

export default function Home() {
  return (
    <>
      <h1
        className="mt-28 text-center font-roxborough sm:mt-[5.8rem]"
        style={{ fontWeight: 400, fontSize: 'clamp(3.25rem, 11vw, 10rem)', letterSpacing: '-0.05em', lineHeight: 1.1 }}
      >
        <RisingText text={FIRST_NAME} className="font-roxborough-italic" />{' '}
        <RisingText text={LAST_NAME} startIndex={FIRST_NAME.length + 1} className="font-roobertregular" />
      </h1>

      <ul className="z-30 mt-6 flex items-center justify-center gap-6 sm:fixed sm:left-1/2 sm:top-8 sm:mt-0 sm:-translate-x-1/2 sm:gap-[1.8rem]">
        {SOCIALS.map(({ label, href, icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group inline-flex h-[1.8rem] w-[1.8rem] items-center justify-center"
            >
              <img
                src={icon}
                alt=""
                className="h-[1.6rem] w-[1.6rem] object-contain transition-transform duration-[250ms] group-hover:scale-125 dark:invert"
              />
            </a>
          </li>
        ))}
      </ul>

      <section className="fixed inset-x-0 bottom-0 top-[calc(50%+2rem)] z-[1] grid grid-cols-2 content-center items-center gap-x-6 gap-y-8 px-6 md:grid-cols-[1fr_auto_1fr] md:px-[8%]">
        <video
          src={loopVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          // contrast pushes the video's light-grey background to pure white so it inverts to pure black.
          className="col-span-2 w-[min(20em,70vw)] justify-self-center dark:contrast-125 dark:invert md:order-2 md:col-span-1"
        />
        <Blurb className="md:order-1">
          AISHWARY PANWAR (HE/HIM) IS A DRIVEN SOPHOMORE ENGINEERING STUDENT STUDYING AT IIIT DELHI, BASED IN NEW
          DELHI, INDIA.
        </Blurb>
        <Blurb className="md:order-3">PASSIONATE ABOUT CREATING UNFORGETTABLE AND BEAUTIFUL DIGITAL EXPERIENCES.</Blurb>
      </section>
    </>
  );
}
