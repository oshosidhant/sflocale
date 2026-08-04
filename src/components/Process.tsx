const STEPS = [
  {
    number: "01",
    title: "Discovery",
    body: "We learn your product, your market, and the way your team actually talks about both.",
  },
  {
    number: "02",
    title: "Script",
    body: "A story built around your real differentiation, not a template.",
  },
  {
    number: "03",
    title: "Shoot",
    body: "On location or in-studio, wherever the story lives best.",
  },
  {
    number: "04",
    title: "Post-Production",
    body: "Edit, sound, motion graphics, and color — until it feels right.",
  },
  {
    number: "05",
    title: "Launch",
    body: "We help you ship it where your audience actually spends time.",
  },
];

export default function Process() {
  return (
    <section id="approach" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
        From brief to launch, one clear process.
      </h2>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step) => (
          <div key={step.number}>
            <span className="text-sm font-medium text-accent">
              {step.number}
            </span>
            <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
