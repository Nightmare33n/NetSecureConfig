from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

app = Flask(__name__)
CORS(app)

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

def configure_router(gateway, password):
    try:
        # Configurar opciones de Chrome
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Ejecutar en modo headless
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')

        # Inicializar el driver
        driver = webdriver.Chrome(options=chrome_options)
        
        # Acceder a la página del router
        driver.get(f'http://{gateway}')
        
        # Esperar a que la página cargue
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "input"))
        )

        # Buscar el campo de contraseña
        password_field = driver.find_element(By.CSS_SELECTOR, 'input[type="password"], input[name*="password"], input[id*="password"]')
        
        # Encontrar el formulario
        form = password_field.find_element(By.XPATH, "./ancestor::form")
        
        # Ingresar la contraseña
        password_field.send_keys(password)
        
        # Encontrar y hacer clic en el botón de envío
        submit_button = form.find_element(By.CSS_SELECTOR, 'button[type="submit"], input[type="submit"]')
        submit_button.click()
        
        # Esperar un momento para que se procese el envío
        driver.implicitly_wait(5)
        
        # Verificar si el login fue exitoso
        success = "login" not in driver.current_url.lower()
        
        driver.quit()
        return success
    except Exception as e:
        print(f"Error configuring router: {e}")
        if 'driver' in locals():
            driver.quit()
        return False

@app.route('/api/get-gateway', methods=['GET'])
def get_gateway():
    gateway = get_default_gateway()
    if gateway:
        return jsonify({'gateway': gateway})
    return jsonify({'error': 'No se pudo encontrar la puerta de enlace'}), 404

@app.route('/api/configure-router', methods=['POST'])
def configure():
    data = request.json
    gateway = data.get('gateway')
    password = data.get('password')
    
    if not gateway or not password:
        return jsonify({'error': 'Se requieren gateway y contraseña'}), 400
    
    success = configure_router(gateway, password)
    if success:
        return jsonify({'message': 'Router configurado exitosamente'})
    return jsonify({'error': 'Error al configurar el router'}), 500

if __name__ == '__main__':
    app.run(port=5000) 