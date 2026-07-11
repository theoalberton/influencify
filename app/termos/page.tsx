import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Termos de Uso — Influencify",
};

export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" updated="julho de 2026">
      <LegalSection title="1. O serviço">
        <p>
          O Influencify oferece a marcas e influenciadores ferramentas para criar campanhas de cupons, perfis públicos,
          links rastreáveis e captação de leads. Ao criar uma conta, você concorda com estes termos.
        </p>
      </LegalSection>

      <LegalSection title="2. Contas e responsabilidades">
        <p className="mb-3">
          Você é responsável pela veracidade das informações da sua conta e pela confidencialidade da sua senha.
          Marcas são responsáveis pela validade dos cupons, descontos e ofertas que publicam; influenciadores são
          responsáveis pelas campanhas próprias que criam e pelos produtos ou serviços nelas ofertados.
        </p>
        <p>
          É proibido publicar ofertas enganosas, conteúdo ilegal, ou usar a plataforma para captar dados sem
          consentimento ou fora das finalidades declaradas.
        </p>
      </LegalSection>

      <LegalSection title="3. Leads e dados de visitantes">
        <p>
          Os dados de visitantes captados em uma campanha pertencem ao visitante e são disponibilizados à marca e/ou
          influenciador responsáveis, que assumem o papel de controladores desses dados e devem tratá-los conforme a
          LGPD e a nossa <a href="/privacidade" className="text-[#0071e3] hover:underline">Política de Privacidade</a>.
          O uso dos leads para fins diferentes dos consentidos é de responsabilidade exclusiva de quem os utiliza.
        </p>
      </LegalSection>

      <LegalSection title="4. Planos e pagamento">
        <p>
          O plano gratuito tem limites de recursos descritos na página de planos. Assinaturas pagas são cobradas de
          forma recorrente via Stripe, com período de teste quando indicado, e podem ser canceladas a qualquer momento
          pelo portal de assinatura — o acesso permanece até o fim do período já pago. Podemos alterar preços com
          aviso prévio razoável.
        </p>
      </LegalSection>

      <LegalSection title="5. Propriedade intelectual">
        <p>
          O conteúdo enviado por você (fotos, logos, textos de campanhas) continua seu; você nos concede licença para
          exibi-lo na plataforma e nas páginas públicas que você criar. A marca Influencify e o software são de nossa
          titularidade.
        </p>
      </LegalSection>

      <LegalSection title="6. Suspensão e encerramento">
        <p>
          Podemos suspender ou encerrar contas que violem estes termos, publiquem conteúdo fraudulento ou coloquem em
          risco a segurança da plataforma e dos dados. Você pode encerrar sua conta a qualquer momento.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitação de responsabilidade">
        <p>
          A plataforma é fornecida &quot;como está&quot;. Não garantimos volume de leads, conversões ou resultados
          comerciais, e não nos responsabilizamos por negociações realizadas diretamente entre marcas, influenciadores
          e consumidores.
        </p>
      </LegalSection>

      <LegalSection title="8. Contato">
        <p>
          Dúvidas sobre estes termos: <strong>theodormartinez@gmail.com</strong>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
