import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, BusFront, MapPin, Search, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { events, searchEvents } from "@/lib/events-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Fodium — Un billet, une navette, un seul geste" },
    { name: "description", content: "Découvrez les événements au Sénégal et ajoutez votre navette à votre billet." },
    { property: "og:title", content: "Fodium — Billetterie & navettes événementielles" },
    { property: "og:description", content: "Votre événement et votre trajet réunis dans un seul pass." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: HomePage,
});

function HomePage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchEvents(query), [query]);
  const isSearching = query.trim().length > 0;

  return <div className="relative min-h-screen overflow-hidden bg-background pb-28 pt-24 text-foreground lg:pt-32">
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="ambient-drift absolute -left-32 -top-40 size-[520px] rounded-full bg-primary/25 blur-[120px]" />
      <div className="absolute -right-40 top-1/3 size-[560px] rounded-full bg-electric/20 blur-[130px]" />
      <div className="absolute bottom-0 left-1/3 size-[380px] rounded-full bg-warm/10 blur-[120px]" />
    </div>
    <main className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
      <section className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-semibold text-electric">Billetterie & navettes événementielles</p>
        <h1 className="font-display text-5xl font-bold leading-[1.02] md:text-7xl">Un billet, <span className="text-electric">une navette</span>,<br />un seul geste.</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">Réservez votre place et votre trajet retour en une interaction continue. Sans formulaire interminable, sans redirection.</p>
      </section>

      <section className="mb-8 rounded-2xl border border-glass-border bg-glass p-3 shadow-2xl backdrop-blur-2xl">
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(event) => event.preventDefault()} role="search">
          <label className="flex flex-1 items-center gap-3 rounded-xl bg-glass px-4 py-3.5">
            <Search className="size-5 text-muted-foreground" /><span className="sr-only">Rechercher un événement ou un trajet</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Événement, ville ou trajet…" />
          </label>
          <Button type="submit" variant="luminous" size="pill">Rechercher <ArrowRight /></Button>
        </form>
        {isSearching && <p aria-live="polite" className="px-2 pb-1 pt-3 text-xs text-muted-foreground">{results.length === 0 ? "Aucun résultat. Essayez « Dakar », « concert » ou « Thiès »." : `${results.length} résultat${results.length > 1 ? "s" : ""} pour « ${query.trim()} »`}</p>}
      </section>

      <section className="mb-12 grid grid-cols-2 gap-3 md:gap-5">
        <Link to="/events" className="group rounded-2xl border border-glass-border bg-primary/15 p-4 backdrop-blur-2xl transition hover:-translate-y-1 md:p-6">
          <Ticket className="mb-8 size-6 text-electric md:size-8" /><h2 className="font-display text-xl font-semibold md:text-2xl">Événements</h2><p className="mt-1 text-xs text-muted-foreground md:text-sm">Concerts, spectacles, sports.</p>
        </Link>
        <Link to="/transport" className="group relative rounded-2xl border border-glass-border bg-electric/10 p-4 backdrop-blur-2xl transition hover:-translate-y-1 md:p-6">
          <span className="badge-live absolute right-3 top-3 rounded-full bg-electric/15 px-2 py-1 text-[9px] font-bold uppercase text-electric">bientôt</span>
          <BusFront className="mb-8 size-6 text-electric md:size-8" /><h2 className="font-display text-xl font-semibold md:text-2xl">Transport</h2><p className="mt-1 text-xs text-muted-foreground md:text-sm">Navettes & trajets interurbains.</p>
        </Link>
      </section>

      <section className="mb-14">
        <div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase text-electric">{isSearching ? "Résultats" : "Sélection"}</p><h2 className="font-display text-3xl font-semibold">{isSearching ? "Correspondances" : "À venir"}</h2></div><Link to="/events" className="text-sm font-medium text-electric">Tout voir →</Link></div>
        {results.length === 0 ? <p className="rounded-2xl border border-glass-border bg-glass p-6 text-sm text-muted-foreground backdrop-blur-2xl">Rien ne correspond encore à cette recherche. Nos navettes interurbaines arrivent bientôt sur de nouvelles villes.</p> : <div className="grid gap-5 md:grid-cols-3">
          {results.map((event) => <article key={event.slug} className="overflow-hidden rounded-2xl border border-glass-border bg-glass backdrop-blur-2xl transition hover:-translate-y-1">
            <img src={event.image} alt="" width={1024} height={640} loading="lazy" className="aspect-[16/10] w-full object-cover" />
            <div className="p-5"><p className="text-xs font-semibold text-electric">{event.shortDate}</p><h3 className="mt-1 font-display text-xl font-semibold">{event.name}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-3.5" />{event.place}</p>
              <div className="mt-5 flex items-center justify-between"><span className="font-display text-lg font-bold">{event.price.toLocaleString("fr-FR")} FCFA</span><Button asChild variant="glass"><Link to="/events/$slug" params={{ slug: event.slug }}>Réserver</Link></Button></div>
            </div>
          </article>)}
        </div>}
      </section>

      <section className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-2xl md:p-8">
        <div className="flex flex-col gap-7 md:flex-row md:items-center"><div className="flex-1"><span className="text-xs font-semibold uppercase text-electric">Pass combiné</span><h2 className="mt-1 font-display text-3xl font-semibold">Billet + Navette</h2><p className="mt-2 max-w-md text-sm text-muted-foreground">Choisissez votre départ. Le trajet s’ajoute à votre billet et le total s’actualise immédiatement.</p></div>
          <div className="flex flex-wrap items-center gap-3"><div className="rounded-xl bg-glass px-4 py-3 text-center"><b className="font-display text-lg">25 000</b><small className="block text-muted-foreground">Billet</small></div><span className="text-electric">+</span><div className="rounded-xl bg-glass px-4 py-3 text-center"><b className="font-display text-lg">5 000</b><small className="block text-muted-foreground">Navette</small></div><Button asChild variant="luminous" size="pill"><Link to="/events/$slug" params={{ slug: events[0]!.slug }}>Composer mon pass</Link></Button></div>
        </div>
      </section>
    </main>
  </div>;
}
