import { Copy, ExternalLink } from 'lucide-react';
import { contacts } from '../../content/contacts';
import { externalLinkProps, safeExternalUrl } from '../../lib/links';
import styles from './ContactList.module.css';

interface Props {
  /** Called with the copied value; omitted where clipboard feedback is not available. */
  onCopied?: (ok: boolean) => void;
}

export function ContactList({ onCopied }: Props) {
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      onCopied?.(true);
    } catch {
      onCopied?.(false);
    }
  };

  return (
    <ul className={styles.list}>
      {contacts.map((c) => {
        const url = safeExternalUrl(c.url);
        return (
          <li key={c.id} className={styles.item}>
            <span className={styles.label}>{c.label}</span>
            {url ? (
              <a className={styles.value} href={url} {...externalLinkProps}>
                {c.value} <ExternalLink size={12} aria-hidden />
                <span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            ) : (
              <span className={styles.value}>{c.value}</span>
            )}
            {onCopied && (
              <button className={styles.copy} onClick={() => copy(c.url.replace(/^mailto:/, ''))} aria-label={`Copiar ${c.label}`} title="Copiar">
                <Copy size={14} />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
