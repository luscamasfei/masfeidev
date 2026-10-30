/**
 * Professional contact channels. Only add channels with real, public URLs.
 * `url` must use https: or mailto: (checked by `safeExternalUrl`).
 */
export interface Contact {
  id: string;
  label: string;
  /** Text displayed to the visitor, e.g. the handle or address. */
  value: string;
  url: string;
}

export const contacts: Contact[] = [
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/luscamasfei',
    url: 'https://github.com/luscamasfei',
  },
];

export const githubProfile = contacts.find((c) => c.id === 'github');
