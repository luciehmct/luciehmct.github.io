import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import Socials from '../components/Socials'
import '../css/tokens.css'
import '../css/globals.css'
import '../css/motion.css'

const sans = IBM_Plex_Sans({ weight: ['400', '500', '600'], subsets: ['latin'], display: 'swap', variable: '--font-plex-sans' })
const mono = IBM_Plex_Mono({ weight: ['400', '500'], subsets: ['latin'], display: 'swap', variable: '--font-plex-mono' })

export const metadata = {
  title: { default: 'Lucie Huamani-Cantrelle', template: '%s | Lucie Huamani-Cantrelle' },
  description: 'I build reproducible ML pipelines for biology, from benchmarking vision-language models on wildlife behaviour to nanopore eDNA analysis.',
}

const nav = [['Experience', '/#experience'], ['Work', '/#work'], ['Education', '/#education'], ['Contact', '/#contact']]

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-nav">
          <a href="/" className="site-nav-name">Lucie Huamani-Cantrelle</a>
          <nav aria-label="Primary">
            <ul>
              {nav.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
            </ul>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer" id="contact">
          <p className="section-label">Contact</p>
          <p>Get in touch.</p>
          <Socials />
          <p className="site-footer-meta">© 2026 Lucie Huamani-Cantrelle</p>
        </footer>
      </body>
    </html>
  )
}
