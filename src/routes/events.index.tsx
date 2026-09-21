import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BusFront, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchEvents } from "@/lib/events-data";

export const Route = createFileRoute("/events/")({
  head: () => ({ meta: [
    { title: "Événements — Fodium" },
    { name: "description", content: "Tous les concerts, spectacles et matchs Fodium, avec navette optionnelle." },
    { property: "og:title", content: "Événements — Fodium" },
    { property: "og:description", content: "Concerts, spectacles et sport au Sénégal, billet et navette réunis." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: EventsIndex,
});

function EventsIndex() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchEvents(query), [query]);

  return <div className="min-h-screen bg-background pb-28 pt-24 text-foreground lg:pt-32">
    <main className="mx-auto max-w-5xl px-4 md:px-6">
      <p className="text-xs font-semibold uppercase text-electric">Fodium</p>
      <h1 className="mt-1 font-display text-4xl font-bold md:text-5xl">Événements</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">Chaque billet peut embarquer sa navette aller-retour. Filtrez par nom, ville ou point de départ.</p>

      <label className="mt-7 flex items-center gap-3 rounded-2xl border border-glass-border bg-glass px-4 py-3.5 backdrop-blur-2xl">
        <Search className="size-5 text-muted-foreground" /><span className="sr-only">Filtrer les événements</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Nom, ville, catégorie ou départ…" />
      </label>
      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">{results.length} événement{results.length > 1 ? "s" : ""} disponible{results.length > 1 ? "s" : ""}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {results.map((event) => <article key={event.slug} className="overflow-hidden rounded-2xl border border-glass-border bg-glass backdrop-blur-2xl transition hover:-translate-y-1">
          <img src={event.image} alt="" width={1024} height={640} loading="lazy" className="aspect-[16/10] w-full object-cover" />
          <div className="p-5">
            <p className="text-xs font-semibold text-electric">{event.category} · {event.shortDate}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">{event.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-3.5" />{event.place}, {event.city}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><BusFront className="size-3.5 text-electric" />{event.departures.length} points de départ navette</p>
            <div className="mt-5 flex items-center justify-between"><span className="font-display text-lg font-bold">{event.price.toLocaleString("fr-FR")} FCFA</span><Button asChild variant="luminous" size="pill"><Link to="/events/$slug" params={{ slug: event.slug }}>Composer mon pass</Link></Button></div>
          </div>
        </article>)}
      </div>
      {results.length === 0 && <p className="mt-6 rounded-2xl border border-glass-border bg-glass p-6 text-sm text-muted-foreground backdrop-blur-2xl">Aucun événement ne correspond à cette recherche.</p>}
    </main>
  </div>;
}
