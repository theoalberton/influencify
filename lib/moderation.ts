/**
 * Filtro de moderação: campanhas cujo texto bate em categorias sensíveis
 * nascem com status 'under_review' e só vão ao ar após aprovação do admin.
 * Falso positivo é aceitável — o custo é uma revisão manual, não um bloqueio.
 */

const RISK_CATEGORIES: { label: string; pattern: RegExp }[] = [
  {
    label: "saúde/promessa milagrosa",
    pattern:
      /emagre|queima\s*gordura|perca\s*peso|detox|milagros|cura\s|anabolizante|esteroide|turbinar\s*(o\s*)?corpo/,
  },
  {
    label: "dinheiro fácil/apostas",
    pattern:
      /renda\s*(extra\s*)?garantida|lucro\s*garantido|ganho\s*garantido|fique\s*rico|piramide|aposta|cassino|tigrinho|\bbet\b|trader\s*profissional|investimento\s*garantido/,
  },
  {
    label: "álcool/tabaco",
    pattern: /cerveja|vodka|whisky|cachaca|bebida\s*alcoolica|destilado|cigarro|tabaco|vape|nicotina|narguile/,
  },
  {
    label: "conteúdo adulto",
    pattern: /conteudo\s*adulto|\+\s*18|onlyfans|privacy\b|acompanhante|sexual/,
  },
  {
    label: "pirataria",
    pattern: /iptv|crackeado|pirata|conta\s*compartilhada|licenca\s*vitalicia\s*windows|chave\s*de\s*ativacao/,
  },
];

/** Minúsculas e sem acento, para o regex não depender de grafia. */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Retorna as categorias de risco encontradas nos textos da campanha. */
export function getCampaignRiskFlags(...texts: (string | null | undefined)[]): string[] {
  const haystack = normalize(texts.filter(Boolean).join(" \n "));
  return RISK_CATEGORIES.filter((c) => c.pattern.test(haystack)).map((c) => c.label);
}

export const CAMPAIGN_STATUS_LABEL: Record<string, string> = {
  active: "ativa",
  paused: "pausada",
  ended: "encerrada",
  under_review: "em análise",
};
