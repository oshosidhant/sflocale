const SERVICES = [
  {
    title: "Positioning & Messaging",
    body: "We turn a crowded pitch into one story your whole team can repeat, on a call or on a landing page.",
  },
  {
    title: "Launch Films & Campaigns",
    body: "Give your launch the push it needs — a film built to travel across every channel you actually use.",
  },
  {
    title: "Product & Explainer Videos",
    body: "We make dense products easy to understand, and worth watching all the way to the end.",
  },
  {
    title: "Brand & Founder Films",
    body: "Documentary-style films that put a real face and a real voice behind your company.",
  },
];

export default function Services() {
  return (
    <section id="services" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
          Complex products, made simple to watch.
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Four ways we help tech and SaaS teams turn a good product into a
          story people actually finish watching.
        </p>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {SERVICES.map((service) => (
            <div key={service.title} className="bg-surface p-8">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
