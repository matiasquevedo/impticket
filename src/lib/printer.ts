import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

// IMPORTANTE: Vite solo expone en el cliente (VueJS) aquellas variables del .env
// que comiencen estrictamente con el prefijo "VITE_".
// Configura tu archivo .env con: VITE_MP_ACCESS y VITE_PRINTER_ID
const MP_ACCESS = import.meta.env.VITE_MP_ACCESS || '';
const PRINTER_ID = import.meta.env.VITE_PRINTER_ID || '';
const BACKEND_URL = `${import.meta.env.VITE_API_URL || ''}/api/v1`;

// URL de tu contenedor CORS Proxy (definido en docker-compose.yml en el puerto 8080)
const PROXY_URL = 'http://localhost:8080';

// Cliente Axios configurado para apuntar al puerto del Proxy CORS.
// Le pasamos la URL de destino completa en la petición para que el proxy la intercepte limpiamente.
const proxyMpApi = axios.create({
  baseURL: PROXY_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cliente Axios para llamar a tu propio Backend (por si a futuro querés migrar la lógica allí).
const proxyBackendApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const printer = {
  /**
   * Envía la petición de impresión usando el contenedor CORS Proxy local para saltear el bloqueo.
   * Genera dinámicamente un UUID (X-Idempotency-Key) para cada llamada usando la librería 'uuid'.
   * 
   * @param content El texto completo estructurado con las etiquetas de formato (ej: {b}, {center}, {qr})
   * @param externalReference Identificador de control único para registrar la acción (ej: 'test_print_002')
   * @returns Promesa con los datos de respuesta de Mercado Pago
   */
  async printDirectly(content: string, externalReference: string = `print_${Date.now()}`) {
    if (!MP_ACCESS) {
      throw new Error('[printer] Falta configurar la variable de entorno VITE_MP_ACCESS.');
    }
    if (!PRINTER_ID) {
      throw new Error('[printer] Falta configurar la variable de entorno VITE_PRINTER_ID.');
    }

    // Generar un UUID único para X-Idempotency-Key
    const idempotencyKey = uuidv4();

    const printContent = _.trim(content);

    try {
      // Mandamos la URL completa de Mercado Pago precedida por una barra. 
      // El proxy nativo de Docker leerá este string, lo limpiará y redirigirá la petición de forma segura.
      const response = await proxyMpApi.post('/https://api.mercadopago.com/terminals/v1/actions', {
        type: 'print',
        external_reference: externalReference,
        config: {
          point: {
            terminal_id: PRINTER_ID,
            subtype: 'custom'
          }
        },
        content: printContent
      }, {
        headers: {
          'X-Idempotency-Key': idempotencyKey,
          'Authorization': `Bearer ${MP_ACCESS}`
        }
      });

      return response.data;
    } catch (error: any) {
      // Imprime el error detallado de Mercado Pago expandido en la consola
      if (error.response?.data) {
        console.error('Detalle del error de Mercado Pago:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error al intentar imprimir a través de CORS Proxy:', error.message);
      }
      throw error;
    }
  },

  /**
   * Envía el ticket formateado a tu propio backend (PocketBase) para procesar la llamada.
   * 
   * @param content El texto con las etiquetas de formato
   * @param externalReference Identificador único para el ticket
   * @returns Promesa con la respuesta de tu servidor proxy
   */
  async printThroughBackend(content: string, externalReference: string = `print_${Date.now()}`) {
    try {
      const response = await proxyBackendApi.post('/print', {
        content: content,
        external_reference: externalReference
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al enviar la impresión a través del backend seguro:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default printer;