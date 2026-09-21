import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, BusFront, CreditCard, LoaderCircle, MapPin, RotateCcw, ShieldCheck, Smartphone, Ticket } from "lucide-react";
import { ConfirmedTicket } from "@/components/fodium/confirmed-ticket";
import { Button } from "@/components/ui/button";
import { getEvent } from "@/lib/events-data";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Événement indisponible — Fodium" }, { name: "robots", content: "noindex" }] };
    const { event } = loaderData;
    return { meta: [
      { title: `${event.name} — Fodium` },
      { name: "description", content: `${event.fullDate}, ${event.place}, ${event.city}. Billet seul ou billet + navette.` },
      { property: "og:title", content: `${event.name} — Fodium` },
      { property: "og:description", content: event.tagline },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ]};
  },
  notFoundComponent: EventNotFound,
  component: EventPage,
});

const paymentMethods = [
  { name: "Wave", detail: "Solde mobile", mark: "W", selectedClass: "payment-electric" },
  { name: "Orange Money", detail: "Compte mobile", mark: "OM", selectedClass: "payment-warm" },
  { name: "Carte", detail: "Visa · Mastercard", mark: "••••", selectedClass: "payment-primary" },
] as const;

type PaymentStatus = "idle" | "loading" | "failed" | "success";

const paymentCopy = {
  Wave: { loading: "Connexion sécurisée à votre compte Wave…", failed: "Wave n’a pas confirmé la transaction." },
  "Orange Money": { loading: "Validation de votre demande Orange Money…", failed: "La validation Orange Money a expiré." },
  Carte: { loading: "Autorisation de votre carte en cours…", failed: "L’autorisation de la carte a été refusée." },
};

function EventNotFound() {
  return <div className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
    <div><h1 className="font-display text-3xl font-bold">Événement introuvable</h1><p className="mt-2 text-sm text-muted-foreground">Cet événement n’est plus à l’affiche.</p><Button asChild variant="luminous" size="pill" className="mt-6"><Link to="/events">Voir les événements</Link></Button></div>
  </div>;
}

function EventPage() {
  const { event } = Route.useLoaderData();
  const [bundle, setBundle] = useState(true); const [departure, setDeparture] = useState(0); const [payment, setPayment] = useState<keyof typeof paymentCopy>("Wave"); const [status, setStatus] = useState<PaymentStatus>("idle"); const beam = useRef<HTMLDivElement>(null); const resultTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const selectedDeparture = event.departures[departure] ?? { name: "Départ à confirmer", price: 0 };
  const total = event.price + (bundle ? selectedDeparture.price : 0);
  useEffect(() => { setBundle(true); setDeparture(0); setStatus("idle"); }, [event.slug]);
  useEffect(() => { beam.current?.animate([{ transform: "translateX(-120%)" }, { transform: "translateX(160%)" }], { duration: 3000, iterations: Infinity, easing: "ease-in-out" }); }, []);
  useEffect(() => () => { if (resultTimer.current) clearTimeout(resultTimer.current); }, []);
  const resetPayment = () => { setStatus("idle"); };
  const startPayment = () => {
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    resultTimer.current = setTimeout(() => setStatus("success"), 1100);
  };
  return <div className="min-h-screen bg-background pb-28 pt-6 text-foreground lg:pt-28">
    <main className="mx-auto max-w-6xl px-4 md:px-6">
      <Button asChild variant="glass"><Link to="/events"><ArrowLeft />Événements</Link></Button>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div><div className="relative overflow-hidden rounded-2xl"><img src={event.image} alt={`${event.category} ${event.name}`} width={1024} height={640} className="aspect-[16/10] w-full object-cover" /><div className="absolute inset-0 bg-background/20" /><div ref={beam} className="absolute inset-y-0 w-1/2 -skew-x-12 bg-electric/15 blur-2xl" /></div>
          <div className="mt-6"><p className="text-sm font-semibold text-electric">{event.fullDate}</p><h1 className="mt-1 font-display text-4xl font-bold md:text-6xl">{event.name}</h1><p className="mt-3 flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" />{event.place}, {event.city}</p><p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{event.description}</p></div>
        </div>
        {status === "success" ? <ConfirmedTicket event={event} total={total} payment={payment} departure={bundle ? selectedDeparture.name : undefined} /> : <section className="h-fit rounded-2xl border border-glass-border bg-glass p-5 backdrop-blur-2xl md:p-6">
          <p className="text-xs font-semibold uppercase text-electric">Composez votre pass</p><h2 className="mt-1 font-display text-2xl font-semibold">{event.tagline}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="glass" onClick={() => { setBundle(false); resetPayment(); }} className={`h-auto items-start rounded-xl p-4 text-left ${!bundle ? "border-primary bg-primary/15" : ""}`}><span><Ticket className="mb-4 size-5" /><b className="block font-display">Billet seul</b><span className="text-xs text-muted-foreground">{event.price.toLocaleString("fr-FR")} FCFA</span></span></Button>
            <Button variant="glass" onClick={() => { setBundle(true); resetPayment(); }} className={`h-auto items-start rounded-xl p-4 text-left ${bundle ? "border-electric bg-electric/10" : ""}`}><span><BusFront className="mb-4 size-5 text-electric" /><b className="block font-display">Billet + Navette</b><span className="text-xs text-muted-foreground">Retour inclus</span></span></Button>
          </div>
          {bundle && <label className="mt-5 block"><span className="mb-2 block text-xs font-medium text-muted-foreground">Point de départ</span><select value={departure} onChange={(e) => { setDeparture(Number(e.target.value)); resetPayment(); }} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm">{event.departures.map((d,i) => <option key={d.name} value={i}>{d.name} · +{d.price.toLocaleString("fr-FR")} F</option>)}</select></label>}
          <div className="my-6 border-t border-glass-border" />
          <div className="flex justify-between text-sm text-muted-foreground"><span>Billet</span><span>{event.price.toLocaleString("fr-FR")} F</span></div>{bundle && <div className="mt-2 flex justify-between text-sm text-muted-foreground"><span>Navette</span><span>{selectedDeparture.price.toLocaleString("fr-FR")} F</span></div>}
          <div className="mt-3 flex items-end justify-between"><span className="font-medium">Total</span><strong className="font-display text-3xl">{total.toLocaleString("fr-FR")} F</strong></div>

          <div className="mt-7"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase text-electric">Paiement express</span><span className="flex items-center gap-1 text-[10px] text-muted-foreground"><ShieldCheck className="size-3" /> Simulation sécurisée</span></div>
            <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Moyen de paiement">{paymentMethods.map((method) => <Button key={method.name} variant="glass" role="radio" aria-checked={payment === method.name} disabled={status === "loading"} onClick={() => { setPayment(method.name); resetPayment(); }} className={`h-24 min-w-0 flex-col gap-1 rounded-xl px-2 py-3 ${payment === method.name ? `${method.selectedClass} ring-1 ring-current` : "text-muted-foreground"}`}><span className="grid size-8 place-items-center rounded-lg bg-background/70 font-display text-xs">{method.name === "Carte" ? <CreditCard className="size-4" /> : method.mark}</span><strong className="max-w-full whitespace-normal text-center text-xs leading-tight">{method.name}</strong><span className="hidden text-[9px] font-normal opacity-70 sm:block">{method.detail}</span></Button>)}</div>
            <div className="mt-4">
              <Button onClick={startPayment} disabled={status === "loading"} variant={status === "failed" ? "destructive" : "luminous"} size="pill" className="relative w-full overflow-hidden select-none" aria-label={`Payer ${total.toLocaleString("fr-FR")} francs avec ${payment}`}>
                <span className="relative flex items-center gap-2">{status === "loading" ? <><LoaderCircle className="payment-spin" />Traitement en cours</> : status === "failed" ? <><RotateCcw />Réessayer avec {payment}</> : <><Smartphone />Payer {total.toLocaleString("fr-FR")} F</>}</span>
              </Button>
              {status === "idle" && <p className="mt-2 text-center text-[10px] text-muted-foreground">{total.toLocaleString("fr-FR")} F · {payment} · un simple clic</p>}
              {status === "loading" && <div role="status" className="mt-3 flex items-center gap-3 rounded-xl border border-primary/35 bg-primary/10 p-3 text-sm text-foreground"><LoaderCircle className="payment-spin size-5 shrink-0 text-primary" /><span><b className="block">Demande envoyée</b><span className="text-xs text-muted-foreground">{paymentCopy[payment].loading}</span></span></div>}
              {status === "failed" && <div role="alert" className="mt-3 flex items-start gap-3 rounded-xl border border-destructive/45 bg-destructive/10 p-3 text-sm"><AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" /><span><b className="block text-destructive">Transaction non aboutie</b><span className="text-xs text-muted-foreground">{paymentCopy[payment].failed} Aucun montant n’a été débité.</span></span></div>}
            </div>
          </div>
        </section>}
      </div>
    </main>
  </div>;
}
