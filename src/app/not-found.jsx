import data from '../data/projects.json'
const { projects } = data

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow">Error 404</p>
        <h1 className="hero-title">Signal lost.</h1>
        <p className="hero-lede">This page doesn't exist. Here's the way back.</p>
        <div className="hero-actions">
          <a className="btn" href="/">Home</a>
          <a className="btn btn--ghost" href="/#work">All work</a>
        </div>
      </section>

      <section className="section">
        <h2 className="section-label">Projects</h2>
        <ol className="project-list">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <a className="project-row" href={`/projects/${p.slug}/`}>
                <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="project-title">{p.title}</span>
                <span className="project-affiliation">{p.affiliation}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
