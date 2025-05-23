import subprocess
import re
import webbrowser
import time
import sys

def get_default_gateway():
    try:
        # Ejecutar ipconfig y capturar la salida
        result = subprocess.run(['ipconfig'], capture_output=True, text=True)
        output = result.stdout

        # Buscar la línea que contiene "Default Gateway" o "Puerta de enlace predeterminada"
        gateway_match = re.search(r'Default Gateway[^\n]*: ([0-9.]+)', output)
        if not gateway_match:
            gateway_match = re.search(r'Puerta de enlace predeterminada[^\n]*: ([0-9.]+)', output)

        if gateway_match:
            return gateway_match.group(1)
        return None
    except Exception as e:
        print(f"Error getting gateway: {e}")
        return None

def main():
    print("Buscando la IP de tu router...")
    gateway = get_default_gateway()
    
    if not gateway:
        print("No se pudo encontrar la IP del router")
        return

    print(f"\nIP del router encontrada: {gateway}")
    print("\nAbriendo la página de configuración del router...")
    
    # Abrir el navegador con la IP del router
    webbrowser.open(f'http://{gateway}')
    
    print("\nInstrucciones:")
    print("1. Se abrirá tu navegador con la página de configuración del router")
    print("2. Ingresa la contraseña de tu router")
    print("3. Configura los cambios que necesites")
    print("\nPresiona Ctrl+C para salir")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n¡Hasta luego!")

if __name__ == '__main__':
    main() 