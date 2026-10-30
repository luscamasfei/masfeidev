import { MapPin } from 'lucide-react';
import { profile } from '../../content/profile';
import s from '../shared.module.css';

/** Biography built only from src/content/profile.ts; empty sections are hidden. */
export function AboutContent({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2';
  const Sub = `h${headingLevel + 1}` as 'h3';

  return (
    <>
      <H className={s.title}>{profile.name}</H>
      <p className={s.subtitle}>
        <MapPin size={13} aria-hidden /> {profile.location} · @{profile.username}
      </p>
      {profile.bio.map((line) => (
        <p key={line} style={{ margin: '0 0 4px' }}>
          {line}
        </p>
      ))}

      {profile.education && profile.education.length > 0 && (
        <section className={s.section}>
          <Sub className={s.heading}>Formação</Sub>
          <ul className={s.list}>
            {profile.education.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={s.section}>
        <Sub className={s.heading}>Tecnologias que uso</Sub>
        <ul className={s.chips}>
          {profile.technologies.map((t) => (
            <li key={t} className={s.chip}>
              {t}
            </li>
          ))}
        </ul>
      </section>

      {profile.goals && profile.goals.length > 0 && (
        <section className={s.section}>
          <Sub className={s.heading}>Objetivos</Sub>
          <ul className={s.list}>
            {profile.goals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={s.section}>
        <Sub className={s.heading}>Hobbies</Sub>
        <ul className={s.chips}>
          {profile.hobbies.map((h) => (
            <li key={h} className={s.chip}>
              {h}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
