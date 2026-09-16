"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { keyframePath } from "./keyframes";

type TrajectoryRouteMessage = {
  type: "sf-locale:trajectory-route";
  keyframeId: number | null;
};

function isTrajectoryRouteMessage(value: unknown): value is TrajectoryRouteMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return message.type === "sf-locale:trajectory-route" && (message.keyframeId === null || typeof message.keyframeId === "number");
}

export function TrajectoryFrame({ keyframeId }: { keyframeId?: number }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const source = `/laserman/scene-4-production-mdp.html${keyframeId ? `?keyframe=${keyframeId}` : ""}`;

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow || !isTrajectoryRouteMessage(event.data)) return;
      const destination = event.data.keyframeId ? keyframePath(event.data.keyframeId) : "/trajectory";
      if (destination !== pathname) router.push(destination, { scroll: false });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [pathname, router]);

  return <main className="trajectory-page"><iframe ref={frameRef} title={keyframeId ? `LaserMan Scene 4 — KF ${keyframeId}` : "LaserMan Scene 4 production trajectories"} src={source} className="trajectory-frame" /></main>;
}
