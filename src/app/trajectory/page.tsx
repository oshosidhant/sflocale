import type { Metadata } from "next";
import { TrajectoryFrame } from "./trajectory-frame";

export const metadata: Metadata = {
  title: "Trajectory | SF Locale",
  description: "LaserMan Scene 4 production trajectories, including action families, candidate states, prompts, references and reward-vector audits.",
};

export default function TrajectoryPage() {
  return <TrajectoryFrame />;
}
