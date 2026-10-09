import { notFound } from 'next/navigation'
import data from '../../../data/projects.json'
const { projects } = data

export const dynamicParams = false
export const generateStaticParams = () => projects.map(({ slug }) => ({ slug }))

export async function generateMetadata({ params }) {
  const { slug } = await params
  const p = projects.find((x) => x.slug === slug)
  return { title: p?.title }
}

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const i = projects.findIndex((x) => x.slug === slug)
  if (i < 0) notFound()
  const { title, affiliation, tags, link, body } = projects[i]
  const prev = projects[(i + projects.length - 1) % projects.length]
  const next = projects[(i + 1) % projects.length]
  return (
    <>
      <article className="project">
        <header className="project-head">
          <p className="section-label">{affiliation}</p>
          <h1>{title}</h1>
          <ul className="tags">{tags.map((t) => <li className="tag" key={t}>{t}</li>)}</ul>
          <a className="btn btn--ghost" href={link} target="_blank" rel="noopener">
            {link.includes('github.com') ? 'Repository ↗' : 'Project site ↗'}
          </a>
        </header>
        {/* ponytail: trusted build-time HTML from our own JSON; switch to MDX if content gets authored by others */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
      </article>
      <nav className="project-pager" aria-label="Projects">
        <a href={`/projects/${prev.slug}/`}>← {prev.title}</a>
        <a href="/#work">All work</a>
        <a href={`/projects/${next.slug}/`}>{next.title} →</a>
      </nav>
    </>
  )
}
