"use client";

import { useEffect, useState } from "react";

type ScrollMetrics = {
  size: number;
  top: number;
};

export default function ScrollProgress() {
  const [metrics, setMetrics] = useState<ScrollMetrics>({ size: 1, top: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const root = document.documentElement;
        const viewport = root.clientHeight;
        const height = Math.max(root.scrollHeight, viewport);
        const size = Math.max(0.06, Math.min(1, viewport / height));
        const maxScroll = Math.max(1, height - viewport);
        const progress = Math.max(0, Math.min(1, root.scrollTop / maxScroll));
        setMetrics({ size, top: progress * (1 - size) });
      });
    };

    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    observer.observe(document.documentElement);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <aside className="scroll-rail" aria-hidden="true">
      <span className="scroll-rail-thumb" style={{ height: `${metrics.size * 100}%`, top: `${metrics.top * 100}%` }} />
    </aside>
  );
}
