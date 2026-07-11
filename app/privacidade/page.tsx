import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade — Influencify",
};

export default function PrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" updated="julho de 2026">
      <LegalSection title="1. Quem somos">
        <p>
          O Influencify é uma plataforma que conecta marcas e influenciadores para campanhas de cupons e captação de
          leads. Esta política explica como tratamos dados pessoais, em conformidade com a Lei Geral de Proteção de
          Dados (Lei nº 13.709/2018 — LGPD).
        </p>
      </LegalSection>

      <LegalSection title="2. Quais dados coletamos">
        <p className="mb-3">
          <strong>De visitantes que resgatam cupons:</strong> nome, e-mail, telefone/WhatsApp e cidade (quando
          solicitados pela campanha), além de dados técnicos de navegação (origem do acesso, identificador da campanha
          e do influenciador, parâmetros UTM e endereço IP em forma anonimizada).
        </p>
        <p>
          <strong>De marcas e influenciadores cadastrados:</strong> nome, e-mail, telefone, dados do perfil público
          (foto, bio, redes sociais) e, para assinantes, dados de cobrança processados pelo Stripe — nós não
          armazenamos números de cartão.
        </p>
      </LegalSection>

      <LegalSection title="3. Base legal e finalidade">
        <p>
          Os dados de visitantes são coletados com <strong>consentimento explícito</strong>, registrado no momento do
          resgate do cupom. A finalidade é entregar o cupom e permitir que a marca ou influenciador responsável pela
          campanha entre em contato com ofertas relacionadas. Dados de contas são tratados para execução do contrato
          (funcionamento da plataforma) e obrigações legais.
        </p>
      </LegalSection>

      <LegalSection title="4. Com quem compartilhamos">
        <p>
          O contato deixado por um visitante é compartilhado <strong>exclusivamente</strong> com a marca e/ou
          influenciador responsáveis pela campanha resgatada. Utilizamos operadores de infraestrutura (Supabase para
          banco de dados, Vercel para hospedagem, Stripe para pagamentos e Resend para e-mails transacionais), todos
          sujeitos a obrigações de proteção de dados. Não vendemos dados pessoais.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies e pixels">
        <p>
          Páginas de ofertas podem conter pixels de remarketing (como o Meta Pixel) configurados pela marca responsável
          pela campanha, que registram eventos de visita e conversão conforme as políticas da respectiva plataforma de
          anúncios.
        </p>
      </LegalSection>

      <LegalSection title="6. Seus direitos (LGPD)">
        <p>
          Você pode solicitar a qualquer momento: confirmação do tratamento, acesso, correção, anonimização, exclusão
          dos seus dados e revogação do consentimento. Para exercer seus direitos, entre em contato pelo e-mail
          indicado abaixo. Responderemos nos prazos previstos em lei.
        </p>
      </LegalSection>

      <LegalSection title="7. Retenção e segurança">
        <p>
          Mantemos os dados enquanto a conta ou campanha estiver ativa, ou pelo prazo necessário às finalidades
          descritas. Aplicamos controles de acesso por perfil (cada marca e influenciador só acessa os próprios dados),
          criptografia em trânsito e políticas de segurança em nível de banco de dados.
        </p>
      </LegalSection>

      <LegalSection title="8. Contato">
        <p>
          Dúvidas ou solicitações sobre privacidade: <strong>theodormartinez@gmail.com</strong>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
