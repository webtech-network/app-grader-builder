import React from 'react';
import ResourceCard from './ResourceCard';

const ResourceList = ({ resources, onDeleteResource }) => {
  return (
    <div>
      <p className="text-gray-400 font-medium mb-3 text-sm">Recursos Adicionados</p>
      {resources.length === 0 ? (
        <p className="text-gray-500 italic text-sm">Nenhum conteúdo adicionado</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <ResourceCard 
              key={index} 
              {...resource} 
              onDelete={() => onDeleteResource(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList;