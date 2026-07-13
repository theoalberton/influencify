// Envio de e-mail transacional via Resend (https://resend.com).
// Sem RESEND_API_KEY configurada, tudo degrada silenciosamente (retorna false)
// para nunca bloquear o fluxo de captação.

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailArgs): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  const from = process.env.EMAIL_FROM ?? "Influencify <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const baseStyles = `margin:0;padding:0;background:#f4f6e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;`;
const cardStyles = `max-width:480px;margin:32px auto;background:#ffffff;border-radius:20px;padding:40px;`;

export function couponEmailHtml({
  visitorName,
  campaignTitle,
  ownerName,
  couponCode,
  destinationUrl,
}: {
  visitorName: string;
  campaignTitle: string;
  ownerName: string;
  couponCode: string | null;
  destinationUrl: string | null;
}): string {
  return `
  <body style="${baseStyles}">
    <div style="${cardStyles}">
      <p style="font-size:14px;color:#7a8578;margin:0 0 4px;">Influencify</p>
      <h1 style="font-size:22px;color:#0a3625;margin:0 0 16px;">Aqui está o seu cupom, ${visitorName}!</h1>
      <p style="font-size:15px;color:#4d584d;line-height:1.5;margin:0 0 24px;">
        Você resgatou a oferta <strong>${campaignTitle}</strong> de ${ownerName}.
      </p>
      ${
        couponCode
          ? `<div style="background:#f4f6e8;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
               <p style="font-size:12px;color:#7a8578;margin:0 0 6px;">SEU CUPOM</p>
               <p style="font-size:26px;font-weight:700;letter-spacing:3px;color:#0a3625;margin:0;font-family:monospace;">${couponCode}</p>
             </div>`
          : ""
      }
      ${
        destinationUrl
          ? `<div style="text-align:center;">
               <a href="${destinationUrl}" style="display:inline-block;background:#0a3625;color:#ffffff;text-decoration:none;font-size:15px;font-weight:500;padding:13px 32px;border-radius:999px;">Usar meu cupom</a>
             </div>`
          : ""
      }
      <p style="font-size:12px;color:#a3ac9c;margin:32px 0 0;text-align:center;">
        Você recebeu este e-mail porque resgatou um cupom no Influencify e consentiu com o contato.
      </p>
    </div>
  </body>`;
}

export function newLeadEmailHtml({
  ownerName,
  leadName,
  campaignTitle,
  influencerName,
  dashboardUrl,
}: {
  ownerName: string;
  leadName: string;
  campaignTitle: string;
  influencerName: string | null;
  dashboardUrl: string;
}): string {
  return `
  <body style="${baseStyles}">
    <div style="${cardStyles}">
      <p style="font-size:14px;color:#7a8578;margin:0 0 4px;">Influencify</p>
      <h1 style="font-size:22px;color:#0a3625;margin:0 0 16px;">🎉 Novo lead, ${ownerName}!</h1>
      <p style="font-size:15px;color:#4d584d;line-height:1.6;margin:0 0 24px;">
        <strong>${leadName}</strong> acabou de resgatar o cupom da campanha
        <strong>${campaignTitle}</strong>${influencerName ? ` via <strong>${influencerName}</strong>` : ""}.
      </p>
      <div style="text-align:center;">
        <a href="${dashboardUrl}" style="display:inline-block;background:#0a3625;color:#ffffff;text-decoration:none;font-size:15px;font-weight:500;padding:13px 32px;border-radius:999px;">Ver no dashboard</a>
      </div>
      <p style="font-size:12px;color:#a3ac9c;margin:32px 0 0;text-align:center;">
        Notificação automática de novo lead do Influencify.
      </p>
    </div>
  </body>`;
}
