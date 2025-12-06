import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Mock validation
        if (email === 'admin@cine.com' && password === 'admin') {
            return new Response(JSON.stringify({
                status: 'success',
                id: 1,
                nombre: 'Administrador',
                rol: 'ADMIN',
                token: 'mock-token-admin'
            }), { status: 200 });
        }

        // Default user login (accepts any other credentials for testing)
        return new Response(JSON.stringify({
            status: 'success',
            id: 2,
            nombre: 'Usuario Demo',
            rol: 'USER',
            token: 'mock-token-user'
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Invalid request body'
        }), { status: 400 });
    }
}
