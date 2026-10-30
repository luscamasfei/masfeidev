import type { AppId } from '../apps/ids';

/** What happens when a file is opened. */
export type FileTarget =
  | { kind: 'text'; content: string }
  | { kind: 'project'; slug: string }
  | { kind: 'app'; app: AppId }
  | { kind: 'url'; url: string };

interface NodeBase {
  name: string;
  description?: string;
}

export interface VDir extends NodeBase {
  type: 'dir';
  children: VNode[];
}

export interface VFile extends NodeBase {
  type: 'file';
  target: FileTarget;
}

export type VNode = VDir | VFile;
