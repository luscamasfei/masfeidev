import { getNode } from '../../fs/vfs';
import { displayPath } from '../../fs/path';
import type { AppComponentProps } from '../registry';
import styles from './TextApp.module.css';

/** Plain-text viewer. Content is rendered as text, never as HTML. */
export default function TextApp({ props }: AppComponentProps) {
  const path = props.path ?? '';
  const node = getNode(path);
  const content = node?.type === 'file' && node.target.kind === 'text' ? node.target.content : null;

  return (
    <div className={styles.viewer}>
      <div className={styles.path}>{displayPath(path)}</div>
      {content === null ? (
        <p role="alert" className={styles.error}>
          Não foi possível abrir este arquivo como texto.
        </p>
      ) : content === '' ? (
        <p className={styles.empty}>Arquivo vazio.</p>
      ) : (
        <pre className={styles.content}>{content}</pre>
      )}
    </div>
  );
}
