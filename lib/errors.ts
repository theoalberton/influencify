// Traduz mensagens de erro do Supabase (Auth e Postgres) para português.
const KNOWN_ERRORS: [RegExp, string][] = [
  [/invalid login credentials/i, "E-mail ou senha inválidos."],
  [/email rate limit exceeded/i, "Limite de envio de e-mails atingido. Tente novamente em alguns minutos."],
  [/user already registered/i, "Este e-mail já está cadastrado. Faça login ou recupere a senha."],
  [/email address .* is invalid/i, "Este endereço de e-mail não é válido."],
  [/password should be at least/i, "A senha precisa ter pelo menos 6 caracteres."],
  [/email not confirmed/i, "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada."],
  [/new password should be different/i, "A nova senha precisa ser diferente da atual."],
  [/token has expired|otp_expired|invalid token/i, "O link expirou ou já foi usado. Solicite um novo."],
  [/for security purposes.*can only request/i, "Por segurança, aguarde alguns segundos antes de tentar de novo."],
  [/row-level security/i, "Sem permissão para essa operação. Recarregue a página e tente novamente."],
  [/duplicate key value/i, "Esse registro já existe."],
  [/fetch failed|network/i, "Falha de conexão. Verifique sua internet e tente novamente."],
];

export function translateError(message: string | undefined | null): string {
  if (!message) return "Algo deu errado. Tente novamente.";
  for (const [pattern, translation] of KNOWN_ERRORS) {
    if (pattern.test(message)) return translation;
  }
  return message;
}
