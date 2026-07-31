import PocketBase from 'pocketbase';

// Creamos una única instancia para TODA la aplicación
const pb = new PocketBase('http://127.0.0.1:6767');

// Opcional: Desactivar el auto-cancellation si tienes peticiones muy seguidas
pb.autoCancellation(false);

export default pb;