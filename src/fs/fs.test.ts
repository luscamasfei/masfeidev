import { describe, expect, it } from 'vitest';
import { basename, dirname, displayPath, HOME } from './path';
import { allFiles, desktopEntries, getNode, listDir } from './vfs';

describe('path helpers', () => {
  it('splits and displays paths', () => {
    expect(dirname(`${HOME}/Projetos`)).toBe(HOME);
    expect(dirname('/home')).toBe('/');
    expect(basename(`${HOME}/Projetos/nyx.proj`)).toBe('nyx.proj');
    expect(displayPath(HOME)).toBe('~');
    expect(displayPath(`${HOME}/Projetos`)).toBe('~/Projetos');
    expect(displayPath('/home')).toBe('/home');
  });
});

describe('virtual file system', () => {
  it('contains the expected home directories', () => {
    const home = getNode(HOME);
    expect(home?.type).toBe('dir');
    if (home?.type !== 'dir') return;
    expect(home.children.map((c) => c.name)).toEqual(
      expect.arrayContaining(['Projetos', 'Repositorios', 'Sobre-mim', 'Documentos', 'Contato']),
    );
    expect(home.children.map((c) => c.name)).not.toContain('Desktop');
  });

  it('puts apps and projects loose on the desktop, without folders or contact', () => {
    const names = desktopEntries.map((e) => e.name);
    expect(names).toEqual(expect.arrayContaining(['Terminal', 'Arquivos', 'Sobre mim', 'Nyx']));
    expect(names).not.toContain('Projetos');
    expect(names).not.toContain('Contato');
    expect(desktopEntries.some((e) => e.target.kind === 'project')).toBe(true);
  });

  it('resolves files and rejects paths through files', () => {
    expect(getNode(`${HOME}/Projetos/nyx.proj`)?.type).toBe('file');
    expect(getNode(`${HOME}/Projetos/nyx.proj/x`)).toBeNull();
    expect(getNode(`${HOME}/nope`)).toBeNull();
    expect(getNode('/')?.type).toBe('dir');
  });

  it('lists folders first', () => {
    const home = getNode(HOME);
    if (home?.type !== 'dir') throw new Error('home missing');
    const listed = listDir(home);
    const firstFile = listed.findIndex((n) => n.type === 'file');
    expect(firstFile === -1 || listed.slice(firstFile).every((n) => n.type === 'file')).toBe(true);
  });

  it('only links to https or mailto URLs', () => {
    for (const { node } of allFiles()) {
      if (node.target.kind === 'url') expect(node.target.url).toMatch(/^(https:|mailto:)/);
    }
  });
});
