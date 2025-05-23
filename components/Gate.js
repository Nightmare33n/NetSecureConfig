const { exec } = require('child_process');
const open = require('open');

// Ejecutar ipconfig y procesar el resultado
exec('ipconfig', (error, stdout) => {
    if (error) {
        console.log('Error:', error);
        return;
    }

    // Buscar la línea del gateway
    const gatewayLine = stdout.split('\n').find(line => line.includes('Default Gateway'));
    
    if (gatewayLine) {
        const gateway = gatewayLine.split(':')[1].trim();
        console.log('Gateway encontrado:', gateway);
        
        // Abrir en el navegador
        open(`http://${gateway}`);
    } else {
        console.log('No se encontró el gateway');
    }
});

function findGateway() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Buscando gateway...';
    
    // Crear un elemento script para ejecutar el comando ipconfig
    const script = document.createElement('script');
    script.src = 'http://localhost:3000/api/gateway';
    
    script.onload = function() {
        // Esta función se ejecutará cuando el servidor responda
        resultDiv.innerHTML = 'Gateway encontrado y abriendo en el navegador...';
    };
    
    script.onerror = function() {
        resultDiv.innerHTML = 'Error al buscar el gateway. Asegúrate de que el servidor esté corriendo.';
    };
    
    document.body.appendChild(script);
}
