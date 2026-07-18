/**
 * Botões de contato comercial com o influenciador — usados apenas em telas
 * de marca logada (o contato nunca aparece no perfil público).
 */

/** "(11) 99999-9999" → "5511999999999" para o wa.me. */
function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Número BR sem DDI ganha o 55; com DDI (12+ dígitos) fica como está.
  return digits.length <= 11 ? `55${digits}` : digits;
}

export function ContactInfluencer({
  name,
  whatsapp,
  contactEmail,
  brandName,
}: {
  name: string;
  whatsapp: string | null;
  contactEmail: string | null;
  brandName: string;
}) {
  if (!whatsapp && !contactEmail) {
    return <p className="text-xs text-[#a3ac9c]">Não autorizou contato direto ainda</p>;
  }

  const message = encodeURIComponent(
    `Olá, ${name}! Somos da ${brandName} e encontramos o seu perfil na Influencify. Queremos conversar sobre uma parceria — podemos falar?`
  );
  const subject = encodeURIComponent(`Parceria com a ${brandName} via Influencify`);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {whatsapp && (
        <a
          href={`https://wa.me/${toWaNumber(whatsapp)}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0a3625] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#145238]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
            <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 01-5.8-5.1c-.6-1-1-2.2-1-3 0-.6.3-1.3.8-1.7.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.4-.1.7.5.9 1.2 1.7 2 2.3.4.3.8.6 1.3.8.3.1.5.1.7-.1l.6-.7c.2-.2.4-.3.6-.2l1.9.9c.3.1.4.2.5.4.1.2 0 .8-.4 1.2z" />
          </svg>
          Chamar no WhatsApp
        </a>
      )}
      {contactEmail && (
        <a
          href={`mailto:${contactEmail}?subject=${subject}`}
          className="rounded-full border border-[#dde0cb] px-4 py-1.5 text-xs font-semibold text-[#0a3625] transition hover:border-[#0a3625]"
        >
          Enviar e-mail
        </a>
      )}
    </div>
  );
}
