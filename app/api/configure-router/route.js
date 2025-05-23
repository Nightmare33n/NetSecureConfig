import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

export async function POST(request) {
  try {
    const { gateway, password } = await request.json();

    if (!gateway || !password) {
      return Response.json({ error: 'Gateway and password are required' }, { status: 400 });
    }

    // First, fetch the router's configuration page
    const response = await fetch(`http://${gateway}`);
    const html = await response.text();
    
    // Parse the HTML to find the password field
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Look for common password field identifiers
    const passwordField = document.querySelector('input[type="password"], input[name*="password"], input[id*="password"]');
    
    if (!passwordField) {
      return Response.json({ error: 'Could not find password field on router page' }, { status: 404 });
    }

    // Get the form that contains the password field
    const form = passwordField.closest('form');
    if (!form) {
      return Response.json({ error: 'Could not find form on router page' }, { status: 404 });
    }

    // Create a FormData object with the password
    const formData = new FormData();
    formData.append(passwordField.name, password);

    // Submit the form to the router
    const submitResponse = await fetch(`http://${gateway}${form.action}`, {
      method: form.method || 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!submitResponse.ok) {
      throw new Error('Failed to submit password to router');
    }

    return Response.json({ 
      message: 'Router configuration successful',
      success: true 
    });
  } catch (error) {
    console.error('Error configuring router:', error);
    return Response.json({ 
      error: 'Failed to configure router',
      message: error.message 
    }, { status: 500 });
  }
} 