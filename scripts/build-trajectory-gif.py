from pathlib import Path

from PIL import Image


root = Path("public/research")
sources = [
    root / "trajectory-scene-map.png",
    root / "trajectory-keyframe-route.png",
    root / "trajectory-reward-inspector.png",
]

frames = []
for source in sources:
    image = Image.open(source).convert("RGB")
    image.thumbnail((900, 548), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (900, 548), "white")
    canvas.paste(image, ((900 - image.width) // 2, (548 - image.height) // 2))
    frames.append(canvas)

timeline = [frames[0]]
durations = [1400]
for current, following in zip(frames, frames[1:] + [frames[0]]):
    for alpha in (0.25, 0.5, 0.75):
        timeline.append(Image.blend(current, following, alpha))
        durations.append(130)
    timeline.append(following)
    durations.append(1400)

palette_frames = [frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT) for frame in timeline]
palette_frames[0].save(
    root / "trajectory-walkthrough.gif",
    save_all=True,
    append_images=palette_frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
    disposal=2,
)
