import { useShell } from '../../shell/ShellContext';
import s from '../shared.module.css';
import { ContactList } from './ContactList';

export default function ContactApp() {
  const { notify } = useShell();
  return (
    <div className={s.page}>
      <h2 className={s.title}>Contato</h2>
      <p className={s.subtitle}>Canais profissionais.</p>
      <ContactList onCopied={(ok) => notify(ok ? 'Copiado para a área de transferência' : 'Não foi possível copiar', ok ? 'success' : 'error')} />
    </div>
  );
}
