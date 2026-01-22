import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

const DocumentationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50">
      {/* Top Header with Logo */}
      <header className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <img 
            src={logo} 
            alt="Webtech Autograder Logo" 
            className="w-16 h-16 rounded-xl object-cover shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Webtech Autograder
            </h1>
            <p className="text-indigo-400 text-sm font-medium">
              Documentação
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-gray-400 hover:text-gray-200 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
        >
          ← Voltar ao Início
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Documentação do Grader Builder
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Aprenda a configurar e personalizar seu autograder do GitHub Classroom com nosso guia completo.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">📋 Índice</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <a href="#overview" className="text-indigo-400 hover:text-indigo-300 transition-colors">1. Visão Geral</a>
            <a href="#grading-templates" className="text-indigo-400 hover:text-indigo-300 transition-colors">2. Modelos de Avaliação</a>
            <a href="#feedback-modes" className="text-indigo-400 hover:text-indigo-300 transition-colors">3. Modos de Feedback</a>
            <a href="#configuration" className="text-indigo-400 hover:text-indigo-300 transition-colors">4. Guia de Configuração</a>
            <a href="#criteria" className="text-indigo-400 hover:text-indigo-300 transition-colors">5. Configuração de Critérios</a>
            <a href="#best-practices" className="text-indigo-400 hover:text-indigo-300 transition-colors">6. Melhores Práticas</a>
          </div>
        </div>

        {/* Overview Section */}
        <section id="overview" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              🎯 Visão Geral
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                O Webtech Autograder Builder é uma ferramenta poderosa que gera configurações completas de autograder 
                para tarefas do GitHub Classroom. Ele simplifica o processo de criação de critérios abrangentes de 
                avaliação e sistemas de feedback para projetos educacionais.
              </p>
              <div className="bg-indigo-900/30 border border-indigo-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Recursos Principais:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Múltiplos modelos de avaliação para diferentes tipos de tarefa</li>
                  <li>Modos de feedback com IA e tradicionais</li>
                  <li>Configuração visual da árvore de critérios</li>
                  <li>Geração automatizada de testes</li>
                  <li>Personalização de feedback customizado</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Grading Templates Section */}
        <section id="grading-templates" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              📝 Modelos de Avaliação
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Os modelos de avaliação fornecem suítes de teste pré-configuradas adaptadas a tipos específicos de tarefa. 
                Cada modelo inclui testes especializados, regras de validação e requisitos de estrutura de arquivos 
                otimizados para diferentes cenários de desenvolvimento.
              </p>
              <div className="bg-indigo-900/30 border border-indigo-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Como Selecionar um Modelo:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Na página inicial, clique no menu suspenso "Modelo de Avaliação"</li>
                  <li>Passe o mouse sobre qualquer modelo para ver o ícone de informação (ℹ️)</li>
                  <li>Clique no ícone de informação para visualizar descrições detalhadas dos testes</li>
                  <li>Selecione o modelo que melhor corresponde aos requisitos da sua tarefa</li>
                </ol>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-400">
                  💡 <span className="font-medium text-gray-300">Dica:</span> Cada modelo vem com uma visão geral completa 
                  mostrando todos os testes disponíveis, arquivos necessários e parâmetros. Revise os detalhes do modelo antes 
                  de fazer sua seleção para garantir que atende às necessidades da sua tarefa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Modes Section */}
        <section id="feedback-modes" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              💬 Modos de Feedback
            </h2>
            <div className="space-y-6">
              <p className="text-gray-300">
                Escolha como seu autograder comunica os resultados dos testes aos alunos. Cada modo oferece diferentes 
                níveis de detalhe e personalização para corresponder ao seu estilo de ensino e objetivos da tarefa.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Default Mode */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📋</span>
                    <h3 className="text-xl font-semibold text-indigo-400">Modo Padrão</h3>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">
                    Feedback baseado em modelo padrão com mensagens predefinidas e pontuação consistente em todas as submissões.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-200 text-sm mb-2">✓ Recursos:</h4>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>Execução rápida com feedback instantâneo</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>Mensagens consistentes para todos os alunos</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>Indicadores claros de aprovação/reprovação para cada teste</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>Relatórios estruturados em JSON e HTML</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200 text-sm mb-2">📌 Melhor Para:</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Turmas grandes que requerem avaliação consistente</li>
                        <li>• Tarefas com critérios de teste objetivos</li>
                        <li>• Requisitos de entrega rápida</li>
                        <li>• Exercícios de programação padrão</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI-Powered Mode */}
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-purple-600/50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🤖</span>
                    <h3 className="text-xl font-semibold text-purple-400">Modo com IA</h3>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">
                    Geração inteligente de feedback com tom personalizado, sugestões contextuais e insights de aprendizado adaptativo.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-200 text-sm mb-2">✨ Recursos:</h4>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>Tom de feedback personalizado (encorajador, profissional, etc.)</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>Sugestões de melhoria conscientes do contexto</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>Explicações detalhadas para testes reprovados</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>Geração de relatórios em linguagem natural</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200 text-sm mb-2">📌 Melhor Para:</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Turmas menores com níveis de habilidade diversos</li>
                        <li>• Tarefas complexas que requerem feedback detalhado</li>
                        <li>• Encorajar alunos com dificuldades</li>
                        <li>• Projetos criativos ou focados em design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration Note */}
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <span>⚙️</span> Opções de Configuração
                </h3>
                <p className="text-xs text-gray-300">
                  O modo com IA oferece configuração adicional na aba Feedback, incluindo seleção de tom 
                  (Profissional, Encorajador, Rigoroso, Amigável), persona de IA personalizada e diretrizes específicas para 
                  geração de feedback. O modo Padrão usa os modelos padrão sem configuração adicional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Guide */}
        <section id="configuration" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              ⚙️ Guia de Configuração
            </h2>
            <div className="space-y-6">
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">📋 Processo Passo a Passo</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                  <li>Selecione seu modelo de avaliação com base no tipo de tarefa</li>
                  <li>Escolha o modo de feedback (Padrão ou com IA)</li>
                  <li>Clique em "Começar Configuração" para prosseguir com a configuração detalhada</li>
                  <li>Configure a árvore de critérios com assuntos e testes</li>
                  <li>Configure preferências de feedback e configurações de IA (se aplicável)</li>
                  <li>Baixe seu pacote completo de autograder</li>
                </ol>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">🎛️ Abas de Configuração</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Aba Critérios</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Estrutura de árvore visual</li>
                      <li>• Nós de assunto com pesos</li>
                      <li>• Nós de teste com parâmetros</li>
                      <li>• Seções de critérios de bônus</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Aba Feedback</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Personalização do título do relatório</li>
                      <li>• Preferências de exibição</li>
                      <li>• Tom e persona da IA (modo IA)</li>
                      <li>• Diretrizes adicionais</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Criteria Setup */}
        <section id="criteria" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              🌳 Configuração de Critérios
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Nós de Assunto</h3>
                <p className="text-gray-300 mb-4">
                  Nós de assunto representam categorias principais dos seus critérios de avaliação (por exemplo, HTML, CSS, JavaScript).
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Propriedades:</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Nome (ex: "Estrutura HTML")</li>
                      <li>• Peso (porcentagem da nota total)</li>
                      <li>• Descrição</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Exemplo:</h4>
                    <div className="bg-gray-800 p-3 rounded border">
                      <code className="text-green-400 text-xs">
                        HTML: 40%<br/>
                        CSS: 35%<br/>
                        JavaScript: 25%
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Nós de Teste</h3>
                <p className="text-gray-300 mb-4">
                  Nós de teste definem verificações específicas dentro de cada categoria de assunto.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Testes Comuns:</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• <code className="text-green-400">has_tag</code> - Verificar elementos HTML</li>
                      <li>• <code className="text-green-400">has_attribute</code> - Verificar atributos</li>
                      <li>• <code className="text-green-400">has_selector</code> - Seletores CSS</li>
                      <li>• <code className="text-green-400">has_function</code> - Funções JavaScript</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Parâmetros:</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Arquivo alvo</li>
                      <li>• Argumentos do teste</li>
                      <li>• Valores de pontos</li>
                      <li>• Mensagens de erro</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              🚀 Melhores Práticas
            </h2>
            <div className="space-y-6">
              
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">✅ O Que Fazer</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <ul className="space-y-2">
                    <li>• Mantenha os pesos dos critérios balanceados e lógicos</li>
                    <li>• Use nomes de teste claros e descritivos</li>
                    <li>• Teste funcionalidades principais minuciosamente</li>
                    <li>• Forneça mensagens de erro úteis</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>• Inclua critérios de bônus para recursos avançados</li>
                    <li>• Teste casos extremos e tratamento de erros</li>
                    <li>• Use convenções consistentes de nomenclatura de arquivos</li>
                    <li>• Documente seus critérios de avaliação claramente</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-900/30 border border-red-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">❌ O Que Não Fazer</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <ul className="space-y-2">
                    <li>• Não faça testes muito específicos ou frágeis</li>
                    <li>• Evite testar detalhes de implementação</li>
                    <li>• Não crie árvores de critérios excessivamente complexas</li>
                    <li>• Evite nomes de teste confusos ou enganosos</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>• Não esqueça de testar recursos de acessibilidade</li>
                    <li>• Evite valores codificados desnecessariamente</li>
                    <li>• Não pule o teste de condições de erro</li>
                    <li>• Evite pesos de avaliação inconsistentes</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">💡 Dicas Profissionais</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p><strong>Comece Simples:</strong> Comece com testes básicos e adicione complexidade gradualmente</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p><strong>Teste Cedo:</strong> Execute sua configuração em submissões de amostra antes da implantação</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <p><strong>Itere:</strong> Refine seus critérios com base nas submissões e feedback dos alunos</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <p><strong>Faça Backup:</strong> Mantenha cópias de configurações funcionais para tarefas futuras</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer with External Link */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">📖 Recursos Adicionais</h3>
          <p className="text-gray-300 mb-4">
            Para documentação técnica mais detalhada e opções avançadas de configuração, 
            visite nosso repositório de documentação abrangente.
          </p>
          <a
            href="https://github.com/webtech-network/autograder/tree/main/docs/system/configuration"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            Ver Documentação no GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
