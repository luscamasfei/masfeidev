import { shortcuts } from '../../wm/shortcuts';
import s from '../shared.module.css';
import styles from './KeysApp.module.css';

/** Equivalent of the Super+H key hints script on the real desktop. */
export default function KeysApp() {
  return (
    <div className={s.page}>
      <h2 className={s.title}>Atalhos de teclado</h2>
      <p className={s.subtitle}>No desktop real a tecla principal é Super; aqui ela é Alt, que o navegador consegue receber.</p>
      <dl className={styles.list}>
        {shortcuts.map((sc) => (
          <div key={sc.keys} className={styles.row}>
            <dt>
              {sc.keys.split(' + ').map((k, i) => (
                <span key={k}>
                  {i > 0 && ' + '}
                  <kbd className={styles.kbd}>{k}</kbd>
                </span>
              ))}
            </dt>
            <dd>{sc.action}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
