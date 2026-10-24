// Configurações do negócio — pontos que dependem de informação real do depósito.
// NÃO invente valores. Preencha com dados confirmados.
//
// WHATSAPP_NUMBER: DDI + DDD + número, apenas dígitos. Ex.: "5511999999999".
// Enquanto vazio, o botão de envio fica desativado e a revisão mostra aviso.

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "";

// Quando as regras de frete forem definidas, adicione aqui e use na revisão.
export const FRETE_INFO = null; // ex.: { tipo: "fixo", valor: 5 } ou { tipo: "por_bairro", tabela: {...} }