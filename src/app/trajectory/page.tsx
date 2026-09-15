import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trajectory | SF Locale",
  description: "LaserMan Scene 4 production trajectories, including action families, candidate states, prompts, references and reward-vector audits.",
};

export default function TrajectoryPage() {
  return (
    <div className="trajectory-shell">
      <header className="trajectory-header">
        <Link className="trajectory-back" href="/" aria-label="Back to SF Locale research">
          <span aria-hidden="true">←</span>
          <span>SF Locale</span>
        </Link>
        <p className="trajectory-header-label">Research archive</p>
        <a className="trajectory-header-link" href="#canvas">LaserMan / Scene 4</a>
      </header>
      <main className="trajectory-page" id="canvas">
        <iframe
          title="LaserMan Scene 4 production trajectories"
          src="/laserman/scene-4-keyframe-canvas.html"
          className="trajectory-frame"
        />
      </main>
      <footer className="trajectory-footer">
        <p><strong>SF Locale</strong><span aria-hidden="true">·</span> LaserMan production archive</p>
        <p>Scene 4 <span aria-hidden="true">·</span> 35 keyframe families <span aria-hidden="true">·</span> <Link href="/">Back to research&nbsp;→</Link></p>
      </footer>
    </div>
  );
}
