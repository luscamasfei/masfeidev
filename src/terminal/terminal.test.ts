import { describe, expect, it } from 'vitest';
import { commandNames, execute } from './commands';
import { complete } from './complete';
import { MAX_INPUT, tokenize } from './parser';

describe('tokenize', () => {
  it('splits words and honours quotes and escapes', () => {
    expect(tokenize('help  a   b')).toEqual({ ok: true, tokens: ['help', 'a', 'b'] });
    expect(tokenize('echo "a b"')).toEqual({ ok: true, tokens: ['echo', 'a b'] });
    expect(tokenize("echo 'a  b' c")).toEqual({ ok: true, tokens: ['echo', 'a  b', 'c'] });
    expect(tokenize('x a\\ b')).toEqual({ ok: true, tokens: ['x', 'a b'] });
  });

  it('rejects unbalanced quotes and oversized input', () => {
    expect(tokenize('echo "abc').ok).toBe(false);
    expect(tokenize('x'.repeat(MAX_INPUT + 1)).ok).toBe(false);
  });
});

describe('commands', () => {
  it('only help is available for now', () => {
    expect(commandNames).toEqual(['help']);
    expect(execute(['help'])).toMatchObject({ output: expect.anything() });
  });

  it('unknown commands fail, including prototype names', () => {
    for (const name of ['ls', 'rm', 'constructor', '__proto__', 'toString']) {
      expect(execute([name])).toMatchObject({ error: true });
    }
  });
});

describe('complete', () => {
  it('completes command names only', () => {
    expect(complete('he', commandNames)).toEqual({ line: 'help ', options: [] });
    expect(complete('zzz', commandNames)).toEqual({ line: 'zzz', options: [] });
    expect(complete('help ab', commandNames)).toEqual({ line: 'help ab', options: [] });
  });
});
