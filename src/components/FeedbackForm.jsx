import React from 'react';

// Componente auxiliar para o ícone de link externo (External Link Icon)
const ExternalLinkIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-4 w-4 ml-1" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
    />
  </svg>
);

// Componente auxiliar para um item de link de recurso
const ResourceCard = ({ title, url, tags, onDelete }) => (
  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 group">
    <div className="flex justify-between items-start mb-2">
      <p className="font-semibold text-sm text-gray-50 flex-1">{title}</p>
      <button
        onClick={onDelete}
        className="ml-2 p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title="Remover recurso"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 break-all text-xs inline-flex items-center hover:text-blue-300 transition duration-150">
      Acessar Recurso
      <ExternalLinkIcon />
    </a>
    <div className="mt-3 border-t border-gray-700 pt-3 flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span 
          key={index}
          className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// Componente auxiliar para o Toggle Switch
const ToggleSwitch = ({ id, label, isChecked, onChange }) => {
  const containerId = `toggle-${id}`;
  return (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-xl border border-gray-700 shadow-md">
      <span className="font-medium text-gray-300 text-sm">{label}</span>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input 
          type="checkbox" 
          name={id}
          id={containerId} 
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in z-10" 
          checked={isChecked}
          onChange={onChange}
        />
        <label 
          htmlFor={containerId} 
          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer transition-colors duration-200 ease-in"
        />
      </div>
    </div>
  );
};


const FeedbackForm = () => {
  const [reportTitle, setReportTitle] = React.useState("Relatório de Desempenho - Portal de Notícias Dinâmico");
  
  const [toggleStates, setToggleStates] = React.useState({
    show_score: true,
    show_passed_tests: true,
    add_report_summary: true
  });

  const [resources, setResources] = React.useState([]);

  const [newResource, setNewResource] = React.useState({
    title: "",
    url: "",
    tags: []
  });

  const [currentTag, setCurrentTag] = React.useState("");

  const handleToggle = (id) => {
    setToggleStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim()) {
      setNewResource(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewResource(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmitResource = (e) => {
    e.preventDefault();
    if (newResource.title && newResource.url && newResource.tags.length > 0) {
      setResources(prev => [...prev, { ...newResource }]);
      setNewResource({ title: "", url: "", tags: [] });
    }
  };

  const handleDeleteResource = (index) => {
    setResources(prev => prev.filter((_, i) => i !== index));
  };

  // O bloco de estilo customizado para o toggle switch.
  // Dentro do React, isso é necessário para o seletor de irmãos (+) funcionar de forma confiável.
  const ToggleStyle = () => (
    <style jsx="true">{`
      .toggle-checkbox {
        transform: translate(0);
      }
      .toggle-checkbox:checked {
        transform: translateX(16px);
        border-color: #4f46e5;
      }
      .toggle-checkbox:checked + .toggle-label {
        background-color: #4f46e5;
      }
      .toggle-checkbox:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
      }
    `}</style>
  );


  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-4 sm:p-8">
      <ToggleStyle /> {/* Inject the necessary CSS for the toggle logic */}
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <header className="text-center mb-10 p-4 border-b border-gray-700/50">
          <h1 className="text-4xl font-extrabold text-white">Visualizador de Configuração</h1>
          <p className="text-lg text-gray-400 mt-2">Uma apresentação clara dos parâmetros do relatório.</p>
        </header>

        {/* Section Wrapper - General, AI, Standard */}
        <div className="space-y-8">

          {/* Seção Geral */}
          <section className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold border-b-2 border-gray-700 pb-3 mb-6 text-indigo-400">Geral</h2>
            
            <div className="space-y-6">
              {/* Título do Relatório */}
              <div>
                <label className="text-gray-400 font-medium mb-1 text-sm block">Título do Relatório</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-50 text-base font-semibold placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Digite o título do relatório"
                />
              </div>

              {/* Configurações Booleanas (Toggles) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <ToggleSwitch 
                  id="show_score" 
                  label="Exibir Pontuação" 
                  isChecked={toggleStates.show_score}
                  onChange={() => handleToggle('show_score')}
                />
                <ToggleSwitch 
                  id="show_passed_tests" 
                  label="Exibir Testes Aprovados" 
                  isChecked={toggleStates.show_passed_tests}
                  onChange={() => handleToggle('show_passed_tests')}
                />
                <ToggleSwitch 
                  id="add_report_summary" 
                  label="Adicionar Resumo" 
                  isChecked={toggleStates.add_report_summary}
                  onChange={() => handleToggle('add_report_summary')}
                />
              </div>

              {/* Conteúdo Online */}
              <div className="pt-4 space-y-6">
                <div>
                  <p className="text-gray-400 font-medium mb-3 text-sm">Adicionar Conteúdo Online de Apoio</p>
                  <form onSubmit={handleSubmitResource} className="bg-gray-900 rounded-xl border border-gray-700 p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Título do Recurso
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={newResource.title}
                        onChange={handleResourceChange}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                        placeholder="Ex: Guia sobre Manipulação do DOM"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        URL do Recurso
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={newResource.url}
                        onChange={handleResourceChange}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                        placeholder="https://"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {newResource.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="bg-indigo-600/30 text-indigo-200 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-indigo-100"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                          placeholder="Digite uma tag e pressione Adicionar"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={!newResource.title || !newResource.url || newResource.tags.length === 0}
                        className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Adicionar Recurso
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <p className="text-gray-400 font-medium mb-3 text-sm">Conteúdos Adicionados</p>
                  {resources.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">Nenhum conteúdo adicionado</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resources.map((resource, index) => (
                        <ResourceCard 
                          key={index} 
                          {...resource} 
                          onDelete={() => handleDeleteResource(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Seção IA */}
          <section className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold border-b-2 border-gray-700 pb-3 mb-6 text-indigo-400">Inteligência Artificial</h2>
            <div className="space-y-5 text-sm">
              {/* Fornecimento de Soluções */}
              <div>
                <p className="text-gray-400 font-medium mb-1">Fornecimento de Soluções</p>
                <p className="text-gray-50"><span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">hint</span></p>
              </div>
              
              {/* Tom do Feedback */}
              <div>
                <p className="text-gray-400 font-medium mb-1">Tom do Feedback</p>
                <p className="text-gray-50 italic">"amigável, encorajador e direto ao ponto"</p>
              </div>
              
              {/* Persona do Feedback */}
              <div>
                <p className="text-gray-400 font-medium mb-1">Persona do Feedback</p>
                <p className="text-gray-50 font-semibold">Code Buddy, um colega programador mais experiente que está me ajudando a melhorar</p>
              </div>
              
              {/* Contexto da Atividade */}
              <div>
                <p className="text-gray-400 font-medium mb-1">Contexto da Atividade</p>
                <p className="bg-gray-700 p-4 rounded-xl text-gray-300 text-xs leading-relaxed border border-gray-600">O objetivo desta atividade é criar um portal de notícias com duas páginas: uma home (`index.html`) que exibe uma lista de notícias em formato de 'cards', e uma página de detalhes (`detalhes.html`) que mostra o conteúdo completo de uma notícia. Todo o conteúdo deve ser carregado dinamicamente a partir de uma estrutura de dados (array de objetos) no ficheiro `app.js`. É proibido o uso de frameworks como React, Vue ou Angular.</p>
              </div>
              
              {/* Orientações Extras */}
              <div>
                <p className="text-gray-400 font-medium mb-1">Orientações Extras</p>
                <p className="bg-gray-700 p-4 rounded-xl text-gray-300 text-xs leading-relaxed border border-gray-600">Por favor, foque a análise nos seguintes pontos: 1. A correta implementação da estrutura de dados em `app.js`, garantindo que cada item possua um 'id'. 2. A renderização dinâmica dos cards na `index.html` usando manipulação do DOM. 3. A criação de links em cada card que apontem para `detalhes.html` com o 'id' do item na query string (ex: `detalhes.html?id=1`). 4. A capacidade da página `detalhes.html` de ler o 'id' da URL, encontrar o item correspondente na estrutura de dados e exibir suas informações. 5. Verificar se nenhum framework de JavaScript foi utilizado.</p>
              </div>
              
              {/* Arquivos para Leitura */}
              <div>
                <p className="text-gray-400 font-medium mb-1">Arquivos para Leitura</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md">index.html</span>
                  <span className="bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md">detalhes.html</span>
                  <span className="bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md">css/styles.css</span>
                  <span className="bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md">app.js</span>
                </div>
              </div>
            </div>
          </section>

          {/* Seção Padrão */}
          <section className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold border-b-2 border-gray-700 pb-3 mb-6 text-indigo-400">Padrão</h2>
            <div>
              <p className="text-gray-400 font-medium mb-3 text-sm">Cabeçalhos de Categoria</p>
              <div className="space-y-2 text-base text-gray-300">
                <p><span className="font-bold inline-block w-24 text-gray-400">base:</span> ✅ Requisitos Essenciais</p>
                <p><span className="font-bold inline-block w-24 text-gray-400">bonus:</span> ⭐ Pontos Extras e Boas Práticas</p>
                <p><span className="font-bold inline-block w-24 text-gray-400">penalty:</span> 🚨 Pontos de Atenção e Más Práticas</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
