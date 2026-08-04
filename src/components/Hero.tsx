export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <p className="mb-6 text-sm font-medium tracking-widest text-accent uppercase">
        Video & Brand Storytelling — San Francisco
      </p>

      <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
        Ideas that travel.
        <br />
        Stories that convert.
      </h1>

      <p className="mt-6 max-w-xl text-lg text-muted">
        SFlocale makes brand films, launch campaigns, and product videos for
        tech and SaaS companies building out of the Bay Area — and shipping
        to the world.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#contact"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Start a project
        </a>
        <a
          href="#services"
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground"
        >
          See what we do
        </a>
      </div>
    </section>
  );
}
