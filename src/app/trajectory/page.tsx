import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trajectory | SF Locale",
  description: "LaserMan Scene 4 production trajectories, including action families, candidate states, prompts, references and reward-vector audits.",
};

export default function TrajectoryPage() {
  return (
    <main className="trajectory-page">
      <iframe
        title="LaserMan Scene 4 production trajectories"
        src="/laserman/scene-4-production-mdp.html"
        className="trajectory-frame"
      />
    </main>
  );
}
