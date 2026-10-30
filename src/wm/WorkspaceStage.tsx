import { Component, createRef, type ReactNode } from 'react';
import { useWMState } from './WindowManager';
import styles from './WorkspaceStage.module.css';

/** Same curve and similar speed as `workspaces, 1, 5, overshot, slide` in animation.conf. */
const SLIDE: KeyframeAnimationOptions = { duration: 450, easing: 'cubic-bezier(0.13, 0.99, 0.29, 1.05)' };

interface Props {
  workspace: number;
  children: ReactNode;
}

interface Snapshot {
  ghost: HTMLElement;
  /** Scroll offsets by element index, since clones always start scrolled to the top. */
  scroll: [number, number, number][];
  direction: 1 | -1;
}

/**
 * Slides the whole desktop (icons and windows) when the workspace changes:
 * the old workspace leaves to one side while the new one enters from the other.
 * The wallpaper is outside the stage and stays still, as in Hyprland.
 *
 * The leaving workspace is a static DOM copy taken right before React commits
 * the change, so real windows are never re-mounted and keep their state.
 * A class component is used because only `getSnapshotBeforeUpdate` runs at
 * that moment, while the old workspace is still on screen.
 */
class Stage extends Component<Props> {
  private stage = createRef<HTMLDivElement>();
  private ghostHost = createRef<HTMLDivElement>();
  private animations: Animation[] = [];

  getSnapshotBeforeUpdate(prev: Props): Snapshot | null {
    const stage = this.stage.current;
    if (prev.workspace === this.props.workspace || !stage) return null;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

    this.stop();
    const ghost = stage.cloneNode(true) as HTMLElement;
    ghost.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    const scroll: Snapshot['scroll'] = [];
    stage.querySelectorAll('*').forEach((el, i) => {
      if (el.scrollTop || el.scrollLeft) scroll.push([i, el.scrollTop, el.scrollLeft]);
    });
    return { ghost, scroll, direction: this.props.workspace > prev.workspace ? 1 : -1 };
  }

  componentDidUpdate(_prev: Props, _state: unknown, snapshot: Snapshot | null) {
    const stage = this.stage.current;
    const host = this.ghostHost.current;
    if (!snapshot || !stage || !host) return;
    try {
      this.slide(stage, host, snapshot);
    } catch (error) {
      // The transition is decoration: if it fails, switch without it instead of breaking the desktop.
      console.error('Workspace transition failed:', error);
      this.stop();
    }
  }

  private slide(stage: HTMLElement, host: HTMLElement, snapshot: Snapshot) {
    const { ghost, scroll, direction } = snapshot;
    host.replaceChildren(ghost);
    const copies = ghost.querySelectorAll('*');
    for (const [i, top, left] of scroll) {
      copies[i]?.scrollTo(left, top);
    }

    // Windows that just became visible would replay their opening pop-in; the slide replaces it.
    // Only the window frames: app content may run infinite animations, which cannot be finished.
    for (const animation of stage.getAnimations({ subtree: true })) {
      const target = (animation.effect as KeyframeEffect | null)?.target;
      if (animation instanceof CSSAnimation && target instanceof Element && target.matches('[data-window-id]')) {
        animation.finish();
      }
    }

    const out = ghost.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${-direction * 100}%)` }],
      { ...SLIDE, fill: 'forwards' },
    );
    const enter = stage.animate([{ transform: `translateX(${direction * 100}%)` }, { transform: 'translateX(0)' }], SLIDE);
    out.onfinish = () => {
      if (ghost.parentNode === host) ghost.remove();
    };
    this.animations = [out, enter];
  }

  componentWillUnmount() {
    this.stop();
  }

  /** Ends a transition still running, so quick switches never stack ghosts. */
  private stop() {
    this.animations.forEach((a) => a.cancel());
    this.animations = [];
    this.ghostHost.current?.replaceChildren();
  }

  render() {
    return (
      <>
        <div ref={this.stage} className={styles.stage}>
          {this.props.children}
        </div>
        <div ref={this.ghostHost} className={styles.ghostHost} aria-hidden inert />
      </>
    );
  }
}

export function WorkspaceStage({ children }: { children: ReactNode }) {
  const { workspace } = useWMState();
  return <Stage workspace={workspace}>{children}</Stage>;
}
