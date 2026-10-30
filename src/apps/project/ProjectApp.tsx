import { findProject } from '../../content/projects';
import type { AppComponentProps } from '../registry';
import s from '../shared.module.css';
import { ProjectDetails } from './ProjectDetails';

export default function ProjectApp({ props }: AppComponentProps) {
  const project = findProject(props.slug ?? '');
  return (
    <div className={s.page}>
      {project ? <ProjectDetails project={project} /> : <p role="alert">Projeto não encontrado.</p>}
    </div>
  );
}
