import Scene from '../components/Scene'
import Socials from '../components/Socials'
import data from '../data/projects.json'
const { projects } = data

const experience = [
  ['Feb – Jul 2026', 'Aubonne', 'AI & Data Science Intern · Merck Serono, Data & Analytics', [
    'Built NLP and generative-AI text-analysis tools and a chatbot to support knowledge management.',
    'Prototyped an environment, health & safety (EHS) application with AI features, front end and back end, using React, Palantir, AWS and Azure DevOps.',
    'Created Tableau reports, KPIs and tracking tools, and a Palantir Foundry (Slate) app centralising KPI tracking for production-team performance reviews.',
    'Gathered and formalised user requirements with stakeholders across teams.',
    'Presented solutions in meetings, workshops and debriefs, and trained users to drive adoption.',
  ]],
  ['Jul – Sep 2025', 'Campus Biotech, Geneva', 'Research Intern · Mathis Group, EPFL', 'Extended the LMMs-Eval framework to benchmark vision-language models on wildlife species and behaviour recognition (MammAlps, AnimalKingdom). Built reproducible, containerised evaluation pipelines on Run:AI (RCP).'],
  ['Feb 2025 – Jan 2026', 'Lausanne', 'Student Teaching Assistant · EPFL', 'Mentored first-year students in physiology and linear algebra, sharpening my own scientific communication along the way.'],
  ['2024', 'Lausanne & Sion', 'Science Workshop Facilitator · Festival Scientastic, EPFL', 'Ran hands-on workshops introducing children to the scientific method.'],
  ['2019 – 2020', 'France', 'Volunteer Firefighter & Lifeguard', 'Emergency response and public safety in high-stress environments.'],
]
const education = [
  ['2024 – present', 'Lausanne', 'M.Sc. Life Sciences Engineering, Minor in Data Science · EPFL', 'Computational methods for complex biological systems: machine learning, generative AI, applied data analysis, NLP and genomics.'],
  ['2020 – 2024', 'Lausanne', 'B.Sc. Life Sciences Engineering · EPFL', 'Interdisciplinary foundation in engineering, computational modelling and life sciences; ML for bioengineers, software engineering, OOP and statistics.'],
]
const activities = [
  ['Oct 2025', 'Paris', 'Volunteer · iGEM Grand Jamboree', 'Volunteered at the 2025 Grand Jamboree, supporting international teams and event logistics.'],
  ['Sep 2025 – Jan 2026', 'Lausanne', 'Project Member · GenoRobotics', 'Owned the bioinformatics pipeline of a sample-to-sequence protocol for aquatic biodiversity monitoring, from post-PCR reads to species-by-sample matrices.'],
  ['Sep 2025 – Jan 2026', 'Lausanne', 'Communication Team · N-pulse, EPFL', 'Ran the project website and designed scientific posters communicating our progress.'],
  ['Sep 2023 – Sep 2025', 'Lausanne', 'Student Representative · EPFL', 'Organised career events and represented the student body to faculty.'],
]

function Entry({ when, where, role, text }) {
  return (
    <article className="entry" data-reveal>
      <p className="entry-meta">{when}<br />{where}</p>
      <div className="entry-body"><h3>{role}</h3>{Array.isArray(text) ? <ul>{text.map((t) => <li key={t}>{t}</li>)}</ul> : <p>{text}</p>}</div>
    </article>
  )
}

const entries = (rows) => rows.map(([when, where, role, text]) => <Entry key={role} when={when} where={where} role={role} text={text} />)

export default function Home() {
  return (
    <>
      <Scene />

      <section className="hero" data-scene="helix">
        <p className="hero-eyebrow">MSc Life Sciences Engineering · Data Science · EPFL</p>
        <h1 className="hero-title">Machine learning for living systems.</h1>
        <p className="hero-lede">I build reproducible ML pipelines for biology, from benchmarking vision-language models on wildlife behaviour to nanopore eDNA analysis.</p>
        <div className="hero-actions">
          <a className="btn" href="/assets/CV_Lucie_Huamani-Cantrelle.pdf" download>Download CV</a>
          <a className="btn btn--ghost" href="#work">Selected work</a>
          <Socials />
        </div>
      </section>

      <section className="section" id="experience" data-scene="globe">
        <h2 className="section-label" data-reveal>01 / Experience</h2>
        {entries(experience)}
      </section>


      <section className="section" id="work" data-scene="network">
        <h2 className="section-label" data-reveal>02 / Work</h2>
        <ol className="project-list">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <a className="project-row" href={`/projects/${p.slug}/`} data-reveal>
                <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="project-title">{p.title}</span>
                <span className="project-affiliation">{p.affiliation}</span>
                <p className="project-desc">{p.description}</p>
                <ul className="tags">{p.tags.map((t) => <li className="tag" key={t}>{t}</li>)}</ul>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" id="education" data-scene="lattice">
        <h2 className="section-label" data-reveal>03 / Education</h2>
        {entries(education)}
        <details className="courses">
          <summary>Full course list</summary>
        <h3>M.Sc. · Data Science &amp; Machine Learning</h3>
        <ul>
        <li>Machine Learning (CS-433)</li>
        <li>Foundation Models and Generative AI (CS-461)</li>
        <li>Applied Data Analysis (CS-401)</li>
        <li>Modern Natural Language Processing (CS-552)</li>
        <li>Applied Biostatistics (MATH-493)</li>
        <li>Statistics for Data Science (MATH-413)</li>
        </ul>
        <h3>M.Sc. · Life Sciences &amp; Engineering</h3>
        <ul>
        <li>Genomics and Bioinformatics (BIO-463)</li>
        <li>Life Sciences Engineering: Genome to Function (BIO-411)</li>
        <li>Next-Generation Biomaterials (BIOENG-458)</li>
        <li>iGEM Lab (BIO-511)</li>
        <li>Scientific Project Design in Drug Discovery (BIO-494)</li>
        <li>Entrepreneurship in Life Sciences (BIO-490)</li>
        </ul>
        <h3>M.Sc. · Humanities (SHS)</h3>
        <ul>
        <li>Droit et technique I (HUM-410)</li>
        <li>Droit et technique II (HUM-414)</li>
        </ul>
        <h3>B.Sc. · CS, ML &amp; Data Science</h3>
        <ul>
        <li>Introduction to Machine Learning for Bioengineers (BIO-322)</li>
        <li>Applied Software Engineering for Life Sciences (BIO-210)</li>
        <li>Object Oriented Programming (CS-112(i))</li>
        <li>Information, Computation, Communication (CS-119(g))</li>
        </ul>
        <h3>B.Sc. · Math &amp; Statistics</h3>
        <ul>
        <li>Probability and Statistics I (MATH-231)</li>
        <li>Probability and Statistics II (MATH-236)</li>
        <li>Numerical Analysis (MATH-251(c))</li>
        <li>Analysis I–IV (MATH-101, 106, 203, 207)</li>
        <li>Linear Algebra (MATH-111(f))</li>
        </ul>
        <h3>B.Sc. · Life Sciences &amp; Bioengineering</h3>
        <ul>
        <li>Neuroscience (BIO-311)</li>
        <li>Oncology (BIO-392)</li>
        <li>Immunoengineering (BIOENG-399)</li>
        <li>Physiology by Systems (BIO-377)</li>
        <li>Physiology Lab II (BIO-379)</li>
        <li>Cellular and Molecular Biology I &amp; II (BIO-205, 207)</li>
        <li>Biological Chemistry I &amp; II (BIO-212, 213)</li>
        <li>Physics of the Cell (BIO-244)</li>
        <li>General Biology (BIOENG-110)</li>
        <li>Integrated Lab in Life Sciences II (BIO-204)</li>
        <li>Fluid Mechanics (for SV) (BIOENG-312)</li>
        <li>Bachelor Project in Life Sciences (BIOENG-390)</li>
        </ul>
        <h3>B.Sc. · Engineering &amp; Systems</h3>
        <ul>
        <li>Dynamical Systems in Biology (BIO-341)</li>
        <li>Signals and Systems I &amp; II (MICRO-310, 311)</li>
        <li>Electrical Systems and Electronics I &amp; II (EE-295, 296)</li>
        </ul>
        <h3>B.Sc. · Physics &amp; Chemistry</h3>
        <ul>
        <li>Advanced General Chemistry (CH-160(e))</li>
        <li>Organic Chemistry (CH-112)</li>
        <li>General Physics: Mechanics (PHYS-101)</li>
        <li>General Physics: Thermodynamics (PHYS-106(h))</li>
        <li>General Physics: Electromagnetism (PHYS-201(a))</li>
        <li>General Physics: Quanta (PHYS-207(a))</li>
        </ul>
        <h3>B.Sc. · Humanities &amp; Management (SHS)</h3>
        <ul>
        <li>Global Issues: Food (HUM-120(a))</li>
        <li>Cognitive Psychology (HUM-213)</li>
        <li>Business Law (HUM-234)</li>
        <li>Graphic Design (HUM-326)</li>
        <li>Contemporary Japan (HUM-357)</li>
        </ul>
        </details>
      </section>

      <section className="section" id="activities" data-scene="cells">
        <h2 className="section-label" data-reveal>04 / Activities</h2>
        {entries(activities)}
      </section>

      <section className="section" id="recognition" data-scene="medal">
        <h2 className="section-label" data-reveal>05 / Recognition</h2>
        <p>iGEM 2023 · <a href="/projects/cadmium-catcher/">Cadmium Catcher</a></p>
        <ul className="awards">
          <li>Gold Medal</li>
          <li>Best Education Prize (winner)</li>
          <li>Best Therapeutics Project (nominee)</li>
          <li>Safety &amp; Security Award (nominee)</li>
        </ul>
      </section>
    </>
  )
}
