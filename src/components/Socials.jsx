const links = [
  ['Email', 'mailto:lucie.huamani-cantrelle@epfl.ch'],
  ['GitHub', 'https://github.com/luciehmct'],
  ['LinkedIn', 'https://www.linkedin.com/in/lucie-huamani-cantrelle'],
]

export default function Socials() {
  return (
    <ul className="socials">
      {links.map(([label, href]) => (
        <li key={label}>
          <a href={href} {...(href.startsWith('http') && { target: '_blank', rel: 'noopener' })}>{label}</a>
        </li>
      ))}
    </ul>
  )
}
