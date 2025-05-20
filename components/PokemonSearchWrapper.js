'use client';

import PokemonSearch from './PokemonSearch';

const PokemonSearchWrapper = () => {
  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Buscador de Pokémon
      </h2>
      <p className="text-gray-600 mb-6">
        Encuentra información sobre cualquier Pokémon ingresando su nombre
      </p>
      <PokemonSearch />
    </div>
  );
};

export default PokemonSearchWrapper; 