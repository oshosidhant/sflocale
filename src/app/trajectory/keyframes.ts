export const scene4Keyframes = [
  287, 292, 434, 474, 475, 560, 564, 565, 577, 584, 898, 899, 900, 901,
  904, 917, 918, 935, 936, 937, 938, 939, 944, 946, 1201, 1203, 1204, 1206,
  1765, 1767, 1772, 1779, 1780, 1782, 1894,
] as const;

export type Scene4KeyframeId = (typeof scene4Keyframes)[number];

export function keyframeIdFromSlug(slug: string): Scene4KeyframeId | null {
  const match = /^kf-(\d+)$/.exec(slug);
  if (!match) return null;

  const keyframeId = Number(match[1]);
  return scene4Keyframes.includes(keyframeId as Scene4KeyframeId)
    ? (keyframeId as Scene4KeyframeId)
    : null;
}

export function keyframePath(keyframeId: number): string {
  return `/trajectory/kf-${keyframeId}`;
}
