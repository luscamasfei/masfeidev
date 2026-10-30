import { ExternalLink, Lock } from 'lucide-react';
import { statusLabel, type Project } from '../../content/projects';
import { externalLinkProps, safeExternalUrl } from '../../lib/links';
import s from '../shared.module.css';

const base = import.meta.env.BASE_URL;

/** Full project presentation. Sections without data are omitted. */
export function ProjectDetails({ project, headingLevel = 2 }: { project: Project; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2';
  const Sub = `h${headingLevel + 1}` as 'h3';
  const repoUrl = project.repository.url ? safeExternalUrl(project.repository.url) : null;
  const demoUrl = project.demoUrl ? safeExternalUrl(project.demoUrl) : null;

  return (
    <article>
      <H className={s.title}>{project.name}</H>
      <p className={s.subtitle}>
        <span className={s.badge}>{statusLabel[project.status]}</span>
        {project.statusNote && <> {project.statusNote}</>}
      </p>
      <p>{project.summary}</p>

      {project.goal && (
        <section className={s.section}>
          <Sub className={s.heading}>Objetivo</Sub>
          <p>{project.goal}</p>
        </section>
      )}

      <section className={s.section}>
        <Sub className={s.heading}>Tecnologias</Sub>
        {project.technologies.map((group) => (
          <div key={group.area} style={{ marginBottom: 10 }}>
            <div className={s.muted}>{group.area}</div>
            <ul className={s.chips}>
              {group.items.map((item) => (
                <li key={item} className={s.chip}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={s.section}>
        <Sub className={s.heading}>Funcionalidades implementadas</Sub>
        <ul className={s.list}>
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      {project.notYet && project.notYet.length > 0 && (
        <section className={s.section}>
          <Sub className={s.heading}>Ainda não existe</Sub>
          <ul className={s.list}>
            {project.notYet.map((f) => (
              <li key={f} className={s.muted}>
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.architecture && (
        <section className={s.section}>
          <Sub className={s.heading}>Arquitetura</Sub>
          <pre className={s.code}>{project.architecture}</pre>
        </section>
      )}

      {project.screenshots && project.screenshots.length > 0 && (
        <section className={s.section}>
          <Sub className={s.heading}>Capturas de tela</Sub>
          {project.screenshots.map((shot) => (
            <img key={shot.src} src={`${base}${shot.src}`} alt={shot.alt} loading="lazy" style={{ maxWidth: '100%', marginBottom: 8 }} />
          ))}
        </section>
      )}

      <section className={s.section}>
        <Sub className={s.heading}>Código</Sub>
        <div className={s.buttonRow}>
          {repoUrl ? (
            <a className={s.button} href={repoUrl} {...externalLinkProps}>
              <ExternalLink size={14} aria-hidden /> Repositório
            </a>
          ) : (
            <p className={s.note}>
              <Lock size={13} aria-hidden /> O repositório deste projeto é privado.
            </p>
          )}
          {demoUrl && (
            <a className={s.button} href={demoUrl} {...externalLinkProps}>
              <ExternalLink size={14} aria-hidden /> Demonstração
            </a>
          )}
        </div>
      </section>
    </article>
  );
}
