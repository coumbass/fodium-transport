import { Link } from "@tanstack/react-router";
import { CalendarDays, Home, Ticket, UserRound, BusFront } from "lucide-react";

const items = [
  { to: "/" as const, label: "Accueil", short: "Accueil", icon: Home },
  { to: "/events" as const, label: "Événements", short: "Évén.", icon: CalendarDays },
  { to: "/transport" as const, label: "Transport", short: "Transport", icon: BusFront, soon: true },
  { to: "/tickets" as const, label: "Mes billets", short: "Billets", icon: Ticket },
  { to: "/profile" as const, label: "Profil", short: "Profil", icon: UserRound },
];

export function AppNavigation() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 hidden lg:block">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass px-5 py-3 shadow-2xl backdrop-blur-2xl">
            <Link to="/" className="flex items-center gap-2.5" aria-label="Fodium, accueil">
              <span className="grid size-8 place-items-center rounded-lg bg-primary font-display font-bold text-primary-foreground">F</span>
              <span className="font-display text-lg font-semibold">Fodium</span>
              <span className="rounded-full border border-electric/30 bg-electric/10 px-2 py-0.5 text-xs text-electric">Transport</span>
            </Link>
            <nav className="flex items-center gap-1" aria-label="Navigation principale">
              {items.map((item) => (
                <Link key={item.to} to={item.to} className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-glass-hover hover:text-foreground" activeProps={{ className: "bg-glass-hover text-foreground" }}>
                  {item.label}
                  {item.soon && <span className="badge-live rounded-full bg-electric/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-electric">bientôt</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-3 z-50 lg:hidden" aria-label="Navigation principale">
        <div className="mx-auto flex max-w-[430px] items-center justify-around rounded-2xl border border-glass-border bg-background/80 p-1.5 shadow-2xl backdrop-blur-2xl">
          {items.map((item) => {
            const Icon = item.icon;
            return <Link key={item.to} to={item.to} className="relative flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] text-muted-foreground transition" activeProps={{ className: "bg-glass-hover text-foreground" }}>
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.short}</span>
              {item.soon && <span className="badge-live absolute right-0 top-0 rounded-full bg-electric px-1 py-0.5 text-[7px] font-bold uppercase text-accent-foreground">bientôt</span>}
            </Link>;
          })}
        </div>
      </nav>
    </>
  );
}