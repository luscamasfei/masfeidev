import s from '../shared.module.css';
import { AboutContent } from './AboutContent';

export default function AboutApp() {
  return (
    <div className={s.page}>
      <AboutContent />
    </div>
  );
}
