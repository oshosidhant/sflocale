import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { keyframeIdFromSlug, scene4Keyframes } from "../keyframes";
import { TrajectoryFrame } from "../trajectory-frame";

type KeyframePageProps = { params: Promise<{ keyframe: string }> };

export function generateStaticParams() {
  return scene4Keyframes.map((keyframeId) => ({ keyframe: `kf-${keyframeId}` }));
}

export async function generateMetadata({ params }: KeyframePageProps): Promise<Metadata> {
  const keyframeId = keyframeIdFromSlug((await params).keyframe);
  if (!keyframeId) return {};
  return {
    title: `LaserMan Scene 4 — KF ${keyframeId} | SF Locale`,
    description: `The recorded LaserMan Scene 4 production trajectory for keyframe family ${keyframeId}.`,
  };
}

export default async function KeyframeTrajectoryPage({ params }: KeyframePageProps) {
  const keyframeId = keyframeIdFromSlug((await params).keyframe);
  if (!keyframeId) notFound();
  return <TrajectoryFrame keyframeId={keyframeId} />;
}
