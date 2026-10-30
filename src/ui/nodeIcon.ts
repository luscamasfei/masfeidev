import { FileText, Folder, Link2, Package, type LucideIcon } from 'lucide-react';
import { apps } from '../apps/registry';
import type { VNode } from '../fs/types';

export function nodeIcon(node: VNode): LucideIcon {
  if (node.type === 'dir') return Folder;
  switch (node.target.kind) {
    case 'text':
      return FileText;
    case 'project':
      return Package;
    case 'app':
      return apps[node.target.app].icon;
    case 'url':
      return Link2;
  }
}
