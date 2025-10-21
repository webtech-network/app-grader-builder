import React, { useState } from 'react';

const ResourceForm = ({ onSubmit }) => {
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    tags: []
  });
  const [currentTag, setCurrentTag] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newResource.title && newResource.url && newResource.tags.length > 0) {
      onSubmit(newResource);
      setNewResource({ title: "", url: "", tags: [] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl border border-gray-700 p-4 space-y-4">
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
          Testes
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
            placeholder="Digite um teste e pressione Adicionar"
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
  );
};

export default ResourceForm;