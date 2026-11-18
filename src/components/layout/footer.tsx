import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import {
  CONTACT,
  POPULAR_CATEGORIES,
  QUICK_LINKS,
  SOCIAL_LINKS,
} from "@/constants/footer";

const linkClass =
  "text-sm text-white/70 transition-colors hover:text-brand-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange";

const headingClass =
  "text-xs font-semibold uppercase tracking-[0.15em] text-white";

/**
 * Cache Components forbids reading the clock during prerender, so the year is
 * computed once and cached instead of at render time.
 */
async function getCopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCopyrightYear();

  return (
    <footer className="bg-brand-navy">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_1.3fr_1.2fr] lg:gap-0 lg:divide-x lg:divide-white/10">
      
          <div className="lg:pr-8">
            <Logo />
            <p className="mt-5 max-w-60 text-sm leading-relaxed text-white/70">
              Trusted repair services, right at your doorstep.
            </p>
          </div>

       
          <nav aria-labelledby="footer-quick-links" className="lg:px-8">
            <h2 id="footer-quick-links" className={headingClass}>
              Quick Links
            </h2>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        
          <nav aria-labelledby="footer-categories" className="lg:px-8">
            <h2 id="footer-categories" className={headingClass}>
              Popular Categories
            </h2>
            <ul className="mt-5 space-y-3">
              {POPULAR_CATEGORIES.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`group inline-flex items-center gap-3 ${linkClass}`}
                  >
                    <Icon
                      className="size-4 shrink-0 text-white/50 transition-colors group-hover:text-brand-orange"
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:pl-8">
            <h2 className={headingClass}>Contact Us</h2>

            <address className="mt-5 not-italic">
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className={`inline-flex items-center gap-3 ${linkClass}`}
                  >
                    <Mail className="size-4 shrink-0 text-white/50" aria-hidden="true" />
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className={`inline-flex items-center gap-3 ${linkClass}`}
                  >
                    <Phone className="size-4 shrink-0 text-white/50" aria-hidden="true" />
                    {CONTACT.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/70">
                  <MapPin className="size-4 shrink-0 text-white/50" aria-hidden="true" />
                  {CONTACT.address}
                </li>
              </ul>
            </address>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-brand-orange hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/60">
          © {year} FixMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
