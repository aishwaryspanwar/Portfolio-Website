import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ArrowLink from '../components/ArrowLink';
import RisingText from '../components/RisingText';

const LINK_COLUMNS = [
  [
    {
      heading: 'Tech',
      links: [
        { label: 'Leetcode', href: 'https://leetcode.com/u/homelander0_0/' },
        { label: 'Github', href: 'https://github.com/aishwaryspanwar' },
      ],
    },
    {
      heading: 'Social',
      links: [
        { label: 'Instagram', href: 'https://instagram.com/aishwarypanwar/' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aishwary-singh-panwar-25066a10a/' },
      ],
    },
  ],
  [
    {
      heading: 'Portfolio',
      links: [{ label: 'Behance', href: 'https://www.behance.net/aishwaryspanwar' }],
    },
    {
      heading: 'Email',
      links: [
        {
          label: 'aishwarypanwar@gmail.com',
          // Let the address wrap after the @ on narrow screens.
          display: <>aishwarypanwar@<wbr />gmail.com</>,
          href: 'https://mail.google.com/mail/?view=cm&fs=1&to=aishwarypanwar@gmail.com&su=Loved%20Your%20Portfolio%20Website!',
        },
      ],
    },
  ],
];

export default function Contact() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-[calc(50%+1.75rem)] top-20 flex items-center justify-center px-6 text-center">
        <h1
          className="font-roxborough-italic"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 4.8rem)', letterSpacing: '-0.05em', lineHeight: 1.1 }}
        >
          <RisingText text="Got Something to Say?" />
        </h1>
      </div>

      <section className="fixed inset-x-0 bottom-0 top-[calc(50%+3.5rem)] z-[2] flex justify-between gap-8 px-6 pt-4 sm:px-12 md:px-32">
        <div className="grid grid-cols-2 content-start gap-x-10 md:flex md:gap-32">
          {LINK_COLUMNS.map((column, i) => (
            <div key={i} className="space-y-8">
              {column.map(({ heading, links }) => (
                <div key={heading}>
                  <h2 className="mb-3 font-roobertregular text-lg" style={{ fontWeight: 500 }}>
                    {heading}
                  </h2>
                  <ul className="space-y-2">
                    {links.map(({ label, display, href }) => (
                      <li key={label}>
                        <ArrowLink href={href} className="text-xs leading-tight sm:text-sm">
                          {display ?? label}
                        </ArrowLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="hidden shrink-0 lg:block dark:invert" aria-hidden="true">
          <DotLottieReact
            src="https://lottie.host/fc6a5cd7-7758-441a-8785-b25ef5a420a7/S5pbSn3klM.lottie"
            loop
            autoplay
            style={{ width: '20rem', height: '20rem' }}
          />
        </div>
      </section>
    </>
  );
}
