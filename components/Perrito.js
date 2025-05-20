'use client';

import React from "react";


const Perrito = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Dog icon using SVG */}
      <svg
        className="w-16 h-16 text-yellow-500"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
      
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        onClick={() => alert('¡Guau!')}
      >
        ¡Acariciar Perrito!
      </button>
    </div>
  );
};

export default Perrito;
