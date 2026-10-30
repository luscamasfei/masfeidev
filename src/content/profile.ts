/**
 * Personal information shown across the portfolio (About app, terminal, simple view).
 * Edit this file to update the biography. Every field here must be real information;
 * leave optional fields undefined instead of inventing content.
 */
export interface Profile {
  name: string;
  /** GitHub login, also used as the user name in the simulated system. */
  username: string;
  location: string;
  /** Short lines shown as the biography. */
  bio: string[];
  technologies: string[];
  hobbies: string[];
  /** Optional sections, shown only when filled in. */
  education?: string[];
  goals?: string[];
}

export const profile: Profile = {
  name: 'Lucas Maffei',
  username: 'luscamasfei',
  location: 'Florianópolis',
  bio: [
    'Entusiasta de tecnologia, apaixonado pelo que faz.',
    'Sempre buscando melhorar e aprender mais.',
  ],
  technologies: ['Java', 'Python', 'Maven', 'Git', 'GitHub', 'Arch Linux', 'VS Code'],
  hobbies: ['anime', 'osu!', 'corrida'],
};
