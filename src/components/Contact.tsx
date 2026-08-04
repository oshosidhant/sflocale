"use client";

import { useState, type FormEvent } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Have a story to tell?
            <br />
            Let&apos;s talk.
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            Tell us a bit about your project and we&apos;ll get back to you.
          </p>
        </div>

        <div>
          {submitted ? (
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-lg font-medium">Thanks — got it.</p>
              <p className="mt-2 text-sm text-muted">
                We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
                />
              </div>
              <input
                name="company"
                type="text"
                placeholder="Company"
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
              />
              <textarea
                required
                name="message"
                rows={4}
                placeholder="How can we help?"
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
              />
              <button
                type="submit"
                className="w-fit rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
