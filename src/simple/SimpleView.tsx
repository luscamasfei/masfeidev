import { useEffect, useRef } from 'react';
import { Monitor } from 'lucide-react';
import { AboutContent } from '../apps/about/AboutContent';
import { ContactList } from '../apps/contact/ContactList';
import { ProjectDetails } from '../apps/project/ProjectDetails';
import { profile } from '../content/profile';
import { projects } from '../content/projects';
import { useShell } from '../shell/ShellContext';
import s from '../apps/shared.module.css';
import styles from './SimpleView.module.css';

/**
 * Conventional, linear version of the portfolio for visitors who prefer it,
 * for screen readers and for very small screens. Same content, no desktop metaphor.
 */
export function SimpleView() {
  const { setSimpleView } = useShell();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = `${profile.name} · Portfólio`;
    heading.current?.focus();
  }, []);

  return (
    <div className={styles.page}>
      <a href="#conteudo" className={styles.skip}>
        Ir para o conteúdo
      </a>
      <header className={styles.header}>
        <span className={styles.brand}>⭘ {profile.username}</span>
        <nav aria-label="Seções" className={styles.nav}>
          <a href="#sobre">Sobre</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>
        <button className={s.button} onClick={() => setSimpleView(false)}>
          <Monitor size={14} aria-hidden /> Abrir desktop
        </button>
      </header>

      <main id="conteudo" className={styles.main}>
        <h1 ref={heading} tabIndex={-1} className="visually-hidden">
          Portfólio de {profile.name}
        </h1>

        <section id="sobre" className={styles.block}>
          <AboutContent />
        </section>

        <section id="projetos" className={styles.block} aria-labelledby="projetos-titulo">
          <h2 id="projetos-titulo" className={styles.sectionTitle}>
            Projetos
          </h2>
          {projects.map((p) => (
            <div key={p.slug} className={styles.card}>
              <ProjectDetails project={p} headingLevel={3} />
            </div>
          ))}
        </section>

        <section id="contato" className={styles.block} aria-labelledby="contato-titulo">
          <h2 id="contato-titulo" className={styles.sectionTitle}>
            Contato
          </h2>
          <ContactList />
        </section>
      </main>
    </div>
  );
}
