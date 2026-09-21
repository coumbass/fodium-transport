import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { BusFront, CalendarDays, Check, Download, MapPin, Share2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FodiumEvent } from "@/lib/events-data";


type ConfirmedTicketProps = {
  event: FodiumEvent;
  total: number;
  payment: string;
  departure?: string | undefined;
};

export function ConfirmedTicket({ event, total, payment, departure }: ConfirmedTicketProps) {
  const ticketId = event.ticketId;

  const [qrUrl, setQrUrl] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    QRCode.toDataURL(`https://fodium.co/ticket/${ticketId}`, {
      width: 480,
      margin: 2,
      color: { dark: "#101528", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then(setQrUrl).catch(() => setQrUrl(""));
  }, [ticketId]);

  const makeTicketFile = async () => {
    if (!qrUrl) return undefined;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    context.fillStyle = "#101528";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#75dbe5";
    context.fillRect(0, 0, 24, canvas.height);
    context.fillStyle = "#ffffff";
    context.font = "700 34px sans-serif";
    context.fillText("FODIUM", 76, 100);
    context.font = "700 72px sans-serif";
    context.fillText(event.name, 76, 210);
    context.font = "32px sans-serif";
    context.fillStyle = "#aeb9d1";
    context.fillText(event.fullDate, 76, 280);
    context.fillText(`${event.place}, ${event.city}`, 76, 334);

    if (departure) context.fillText(`Navette · ${departure}`, 76, 388);
    const image = new Image();
    image.src = qrUrl;
    await image.decode();
    context.fillStyle = "#ffffff";
    context.fillRect(290, 470, 500, 500);
    context.drawImage(image, 310, 490, 460, 460);
    context.fillStyle = "#ffffff";
    context.font = "600 32px monospace";
    context.textAlign = "center";
    context.fillText(ticketId, 540, 1030);
    context.font = "28px sans-serif";
    context.fillStyle = "#aeb9d1";
    context.fillText(`${total.toLocaleString("fr-FR")} F · ${payment}`, 540, 1090);
    context.font = "24px sans-serif";
    context.fillText("Présentez ce QR code à l’entrée", 540, 1240);
    return new Promise<File>((resolve) => canvas.toBlob((blob) => resolve(new File([blob ?? ""], `billet-${ticketId}.png`, { type: "image/png" })), "image/png"));
  };

  const downloadTicket = async () => {
    const file = await makeTicketFile();
    if (!file) return;
    const href = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = href;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(href);
    setShareStatus("Billet téléchargé");
  };

  const shareTicket = async () => {
    const file = await makeTicketFile();
    const shareData = { title: "Mon billet Fodium", text: `${event.name} · billet ${ticketId}` };
    try {
      if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ ...shareData, files: [file] });
      else if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(`${event.name} · ${ticketId}`); setShareStatus("Référence copiée"); }

    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("Partage indisponible");
    }
  };

  return <section aria-label="Billet confirmé" className="ticket-reveal mt-5 overflow-hidden rounded-2xl border border-electric/40 bg-card">
    <header className="relative overflow-hidden bg-electric p-5 text-accent-foreground">
      <span className="absolute -right-4 -top-6 font-display text-8xl font-bold opacity-10">F</span>
      <div className="relative flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-background text-electric"><Check /></span><div><p className="text-[10px] font-bold uppercase">Paiement confirmé</p><h2 className="font-display text-xl font-bold">{event.confirmation}</h2></div></div>
    </header>
    <div className="p-5">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-electric">PASS FODIUM</p><h3 className="mt-1 font-display text-2xl font-bold">{event.name}</h3></div><Ticket className="size-7 text-electric" /></div>
      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <p className="flex items-start gap-2 text-muted-foreground"><CalendarDays className="mt-0.5 size-4 shrink-0 text-electric" /><span><b className="block text-foreground">{event.fullDate}</b>{event.doors}</span></p>
        <p className="flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0 text-electric" /><span><b className="block text-foreground">{event.place}</b>{event.city}</span></p>

        {departure && <p className="flex items-start gap-2 text-muted-foreground sm:col-span-2"><BusFront className="mt-0.5 size-4 shrink-0 text-electric" /><span><b className="block text-foreground">Navette aller-retour</b>{departure}</span></p>}
      </div>
      <div className="my-5 border-t border-dashed border-glass-border" />
      <div className="grid place-items-center">
        <div className="rounded-xl bg-foreground p-2">{qrUrl ? <img src={qrUrl} alt={`QR code du billet ${ticketId}`} className="size-36" /> : <div className="size-36 animate-pulse bg-muted" />}</div>
        <p className="mt-3 font-mono text-xs font-semibold">{ticketId}</p><p className="mt-1 text-[10px] text-muted-foreground">Présentez ce code à l’entrée</p>
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-glass-border pt-4"><span className="text-xs text-muted-foreground">Payé avec {payment}</span><strong className="font-display text-xl">{total.toLocaleString("fr-FR")} F</strong></div>
      <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="glass" onClick={downloadTicket} disabled={!qrUrl}><Download />Télécharger</Button><Button variant="glass" onClick={shareTicket} disabled={!qrUrl}><Share2 />Partager</Button></div>
      {shareStatus && <p role="status" className="mt-2 text-center text-xs text-electric">{shareStatus}</p>}
      <Button asChild variant="link" className="mt-2 w-full"><Link to="/tickets">Voir dans Mes billets</Link></Button>
    </div>
  </section>;
}