/**
 * @fileoverview Centralized tooltip content configuration for feedback components.
 * 
 * @description Contains all tooltip text strings used throughout the feedback
 * configuration form. Organized by section (header, geral, ai) to match the
 * form structure. This centralization ensures consistent messaging and makes
 * it easy to update help text across the entire feature.
 * 
 * @module components/feedback/config/TooltipContent
 */

/**
 * Tooltip content organized by form section.
 * 
 * @property {Object} header - Tooltip content for header elements (currently empty)
 * @property {Object} geral - Tooltip content for the General section
 * @property {Object} ai - Tooltip content for the AI section
 * 
 * @example
 * ```tsx
 * import { TooltipContent } from '../config/TooltipContent';
 * 
 * <Tooltip content={TooltipContent.geral.Titulo_do_relatorio} />
 * ```
 */
export const TooltipContent = {
  /** Tooltip content for header elements */
  header: {},
  /** Tooltip content for the General section */
  geral: {
    /** Tooltip for report title input */
    Titulo_do_relatorio: "Define o título que aparecerá no topo do relatório de feedback gerado",
    Exibir_pontuacao: "Quando ativado, exibe a pontuação numérica (0-100) no feedback final",
    Exibir_testes_aprovados: "Exibe quais testes foram aprovados no relatório de feedback",
    Adicionar_resumo: "Inclui um resumo geral do desempenho no início do relatório",
    Adicionar_conteudo_online_de_apoio: "Materiais de apoio vinculados a testes específicos para ajudar o aluno"
  },
  ai: {
    inteligencia_artificial: "Defina como a Inteligência Artificial deve se comportar ao avaliar o aluno",
    Fornecimento_de_solucoes: "Define se o feedback deve incluir dicas, soluções completas, ou apenas avaliação",
    Tom_do_feedback: "Determina o tom utilizado pela IA ao gerar o feedback (encorajador, neutro, direto)",
    Persona_do_feedback: "Define a personalidade da IA ao fornecer feedback (ex: professor experiente, mentor amigável)",
    Contexto_da_atividade: "Contexto sobre a atividade avaliada para melhorar a relevância do feedback gerado",
    Orientacoes_extras: "Instruções adicionais para guiar a IA na geração de feedback personalizado",
    Arquivos_para_leitura: "Arquivos que serão lidos e incluídos no contexto do feedback"
  }
};