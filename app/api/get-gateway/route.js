import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Execute ipconfig command
    const { stdout } = await execAsync('ipconfig');
    
    // Parse the output to find the default gateway
    const lines = stdout.split('\n');
    let defaultGateway = '';
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Default Gateway')) {
        defaultGateway = lines[i].split(':')[1].trim();
        break;
      }
    }

    if (!defaultGateway) {
      return Response.json({ error: 'Default gateway not found' }, { status: 404 });
    }

    return Response.json({ gateway: defaultGateway });
  } catch (error) {
    console.error('Error getting default gateway:', error);
    return Response.json({ error: 'Failed to get default gateway' }, { status: 500 });
  }
} 