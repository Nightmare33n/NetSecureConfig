'use client';

import React, { useState, useEffect } from 'react';

// Mapa de tipos a colores para las tarjetas
const typeColors = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-600',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-stone-600',
  ghost: 'bg-violet-600',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-slate-400',
  fairy: 'bg-pink-300',
};

// Mapa de efectividad de tipos
const typeEffectiveness = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const PokemonSearch = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);

  // Cargar lista de todos los Pokémon al inicio
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        setAllPokemon(data.results);
      } catch (err) {
        console.error('Error loading Pokémon list:', err);
      }
    };
    fetchAllPokemon();
  }, []);

  // Función para calcular la similitud entre strings
  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    let matches = 0;
    const minLength = Math.min(s1.length, s2.length);
    for (let i = 0; i < minLength; i++) {
      if (s1[i] === s2[i]) matches++;
    }
    return matches / Math.max(s1.length, s2.length);
  };

  // Actualizar sugerencias mientras se escribe
  useEffect(() => {
    if (pokemonName.length > 0) {
      const similarPokemon = allPokemon
        .filter(pokemon => calculateSimilarity(pokemon.name, pokemonName) > 0.3)
        .slice(0, 5);
      setSuggestions(similarPokemon);
    } else {
      setSuggestions([]);
    }
  }, [pokemonName, allPokemon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Primero obtenemos los datos del Pokémon
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon no encontrado');
      }
      const data = await response.json();
      setPokemonData(data);

      // Luego enviamos los datos a nuestro endpoint
      try {
        const apiResponse = await fetch('/api/findpokemon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pokemonId: data.id,
            name: data.name,
            types: data.types.map(type => type.type.name),
            abilities: data.abilities.map(ability => ability.ability.name),
            height: data.height,
            weight: data.weight,
            sprites: {
              front_default: data.sprites.front_default,
              official_artwork: data.sprites.other['official-artwork'].front_default
            }
          }),
        });

        const apiData = await apiResponse.json();
        console.log('Respuesta del servidor:', apiData);

        if (!apiResponse.ok) {
          console.error('Error en la respuesta del servidor:', apiData);
        }
      } catch (apiError) {
        console.error('Error al enviar datos al servidor:', apiError);
      }

    } catch (err) {
      setError(err.message);
      setPokemonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular debilidades basadas en los tipos del Pokémon
  const calculateWeaknesses = (types) => {
    const weaknesses = {};
    types.forEach(type => {
      const typeData = typeEffectiveness[type.type.name];
      if (typeData) {
        Object.entries(typeData).forEach(([defendingType, multiplier]) => {
          if (multiplier > 1) {
            weaknesses[defendingType] = (weaknesses[defendingType] || 1) * multiplier;
          }
        });
      }
    });
    return Object.entries(weaknesses)
      .filter(([_, multiplier]) => multiplier > 1)
      .sort((a, b) => b[1] - a[1]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <label 
            htmlFor="pokemonName" 
            className="block text-sm font-medium text-gray-300 mb-2 transition-all duration-300 group-hover:text-blue-400"
          >
            Nombre del Pokémon
          </label>
          <div className="relative">
            <input
              type="text"
              id="pokemonName"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                outline-none transition-all duration-300 shadow-sm
                placeholder:text-gray-500
                hover:bg-gray-800/70
                text-gray-100"
              placeholder="Ej: Pikachu"
              required
            />
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
              ${isFocused ? 'ring-2 ring-blue-500/50' : 'ring-0'}`} />
            
            {/* Sugerencias */}
            {suggestions.length > 0 && isFocused && (
              <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                {suggestions.map((pokemon) => (
                  <button
                    key={pokemon.name}
                    type="button"
                    onClick={() => {
                      setPokemonName(pokemon.name);
                      setIsFocused(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                  >
                    {pokemon.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
            text-white py-3 px-6 rounded-xl 
            hover:from-blue-700 hover:to-blue-800
            transition-all duration-300 shadow-lg hover:shadow-xl
            transform hover:-translate-y-0.5 active:translate-y-0
            flex items-center justify-center gap-2 group
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span>Buscando...</span>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </>
          ) : (
            <>
              <span>Buscar Pokémon</span>
              <svg 
                className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 text-red-300 rounded-xl animate-fade-in">
          {error}
        </div>
      )}

      {pokemonData && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white capitalize">
                {pokemonData.name}
              </h3>
              <span className="text-sm text-gray-400">
                #{pokemonData.id.toString().padStart(3, '0')}
              </span>
            </div>
            
            <div className="relative w-full h-48 mb-4 group">
              <img
                src={pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default}
                alt={pokemonData.name}
                className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Tipos</h4>
                <div className="flex gap-2">
                  {pokemonData.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[type.type.name]} text-white`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Altura / Peso</h4>
                <div className="flex gap-4">
                  <span className="text-white">
                    {(pokemonData.height / 10).toFixed(1)}m
                  </span>
                  <span className="text-white">
                    {(pokemonData.weight / 10).toFixed(1)}kg
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Habilidades</h4>
              <div className="flex flex-wrap gap-2">
                {pokemonData.abilities.map((ability) => (
                  <span
                    key={ability.ability.name}
                    className="px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-200"
                  >
                    {ability.ability.name.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Debilidades</h4>
              <div className="flex flex-wrap gap-2">
                {calculateWeaknesses(pokemonData.types).map(([type, multiplier]) => (
                  <span
                    key={type}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[type]} text-white`}
                  >
                    {type} x{multiplier}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonSearch; 