const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#approach", label: "Approach" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <a href="#top" className="font-semibold tracking-tight text-foreground">
          SF<span className="text-accent">locale</span>
        </a>

        <ul className="flex flex-wrap gap-6">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p>San Francisco, CA · © {new Date().getFullYear()} SF Locale</p>
      </div>
    </footer>
  );
}
