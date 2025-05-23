import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import open from 'open';

export async function GET() {
    return new Promise((resolve) => {
        exec('ipconfig', (error, stdout) => {
            if (error) {
                resolve(NextResponse.json({ error: 'Error al ejecutar ipconfig' }, { status: 500 }));
                return;
            }

            const gatewayLine = stdout.split('\n').find(line => line.includes('Default Gateway'));
            
            if (gatewayLine) {
                const gateway = gatewayLine.split(':')[1].trim();
                // Abrir el gateway en el navegador
                open(`http://${gateway}`);
                resolve(NextResponse.json({ 
                    message: `Gateway encontrado: ${gateway}`,
                    gateway: gateway
                }));
            } else {
                resolve(NextResponse.json({ error: 'No se encontró el gateway' }, { status: 404 }));
            }
        });
    });
} 