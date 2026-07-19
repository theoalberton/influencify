import { waLink } from "@/lib/utils";

/** Abre conversa no WhatsApp com o lead, com mensagem pronta sobre o cupom. */
export function LeadWhatsAppButton({
  phone,
  leadName,
  campaignTitle,
}: {
  phone: string | null;
  leadName: string;
  campaignTitle: string | null;
}) {
  if (!phone) return null;

  const message = `Olá, ${leadName}! Vimos que você resgatou o cupom${
    campaignTitle ? ` da campanha "${campaignTitle}"` : ""
  } e queremos te ajudar a aproveitar o desconto. Podemos conversar?`;

  return (
    <a
      href={waLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      title="Chamar no WhatsApp"
      className="inline-flex items-center gap-1 rounded-full bg-[#0a3625] px-2.5 py-1 text-xs font-bold text-white transition hover:bg-[#145238]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden>
        <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 01-5.8-5.1c-.6-1-1-2.2-1-3 0-.6.3-1.3.8-1.7.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.4-.1.7.5.9 1.2 1.7 2 2.3.4.3.8.6 1.3.8.3.1.5.1.7-.1l.6-.7c.2-.2.4-.3.6-.2l1.9.9c.3.1.4.2.5.4.1.2 0 .8-.4 1.2z" />
      </svg>
      Chamar
    </a>
  );
}
