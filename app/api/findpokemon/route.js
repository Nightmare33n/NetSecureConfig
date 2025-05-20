import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  console.log('Endpoint /api/findpokemon llamado');
  
  try {
    const data = await request.json();
    console.log('Datos recibidos en el endpoint:', data);

    if (!data.pokemonId) {
      throw new Error('ID del Pokémon no proporcionado');
    }

    // Ejemplo de uso de Axios para hacer una petición adicional
    console.log('Haciendo petición a la API de especies...');
    const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${data.pokemonId}`);
    console.log('Respuesta de la API de especies recibida');
    
    // Combinamos los datos recibidos con la información adicional
    const enhancedData = {
      ...data,
      speciesInfo: {
        baseHappiness: speciesResponse.data.base_happiness,
        captureRate: speciesResponse.data.capture_rate,
        habitat: speciesResponse.data.habitat?.name || 'unknown',
        generation: speciesResponse.data.generation.name
      }
    };

    console.log('Datos mejorados preparados para enviar:', enhancedData);

    // Por ahora solo devolvemos un mensaje de confirmación con los datos mejorados
    return NextResponse.json({
      success: true,
      message: 'Datos del Pokémon recibidos correctamente',
      receivedData: enhancedData
    });
  } catch (error) {
    console.error('Error detallado en el endpoint:', error);
    
    // Manejo específico de errores de Axios
    if (axios.isAxiosError(error)) {
      console.error('Error de Axios:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error en la petición a la API',
          error: error.response?.data || error.message 
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al procesar la solicitud',
        error: error.message 
      },
      { status: 400 }
    );
  }
} 