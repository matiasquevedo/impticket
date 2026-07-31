<template>
  <AppLayout>
    <div class="flex flex-col gap-12 mt-2">
      <section class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Editor de Código / Entrada -->
          <div class="space-y-4">
            <h1 class="text-xl font-bold text-slate-800">Diseñador de Ticket ({{ contentRaw.length }} caracteres)</h1>

            <!-- Componente de Naive UI (n-input) -->
            <n-input 
              v-model:value="contentRaw"
              type="textarea" 
              :autosize="{ minRows: 10, maxRows: 18 }"
              maxlength="4096" 
              show-count 
              placeholder="Escribí acá tu ticket usando {b}, {center}, {br}, etc..."
              class="font-mono text-sm"
            />

            <!-- Botonera de Atajos Rápidos -->
            <div class="flex flex-wrap gap-2">
              <button @click="insertTag('{b}', '{/b}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold font-mono">Negrita</button>
              <button @click="insertTag('{center}', '{/center}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono">Centrar</button>
              <button @click="insertTag('{w}', '{/w}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono">Letra Grande</button>
              <button @click="insertTag('{s}', '{/s}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono">Letra Chica</button>
              <button @click="insertTag('{br}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono">Salto línea</button>
              <button @click="insertTag('{qr}', '{/qr}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono">QR</button>
              <button @click="insertDateTime()" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono">Hora y Fecha</button>
            </div>

            <n-button 
              type="primary" 
              :disabled="contentRaw.length < 105" 
              block
              @click="print"
            >
              {{ contentRaw.length < 105 
                  ? `Faltan ${105 - contentRaw.length} caracteres para imprimir` 
                  : 'Imprimir Ticket' 
              }}
            </n-button>
          </div>

          <!-- Preview Estilo Ticket Físico -->
          <div class="flex flex-col items-center bg-slate-100 p-6 rounded-xl border border-slate-200">
            <span class="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Vista Previa del Papel</span>
            
            <!-- Contenedor del Ticket Físico (Ancho fijo de impresora de 58mm/80mm simulado) -->
            <div class="ticket-paper shadow-md bg-white border border-slate-300 p-4 text-black font-mono text-sm leading-tight w-[280px] min-h-[350px] relative overflow-hidden">
              <!-- Renderizado dinámico del HTML parseado -->
              <div v-html="parsedContent" class="whitespace-pre-wrap break-words"></div>
            </div>
          </div>

        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layout/AppLayout.vue'
import printer from '@/lib/printer';
import { ref, computed, onMounted } from 'vue'

// Estado inicial del ticket con algunos ejemplos de formato
const contentRaw = ref('')

/**
 * Computada que toma el string plano ({b}Texto{/b}) y lo convierte
 * en HTML real aplicando estilos de Tailwind CSS.
 */
const parsedContent = computed(() => {
  let html = contentRaw.value;

  // Escapar caracteres HTML básicos para evitar XSS en la preview local
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Reemplazar saltos de línea físicos por <br> si es necesario
  html = html.replace(/\n/g, '<br>');

  // 1. Negrita: {b}...{/b}
  html = html.replace(/\{b\}(.*?)\{\/b\}/g, '<span class="font-black text-black">$1</span>');

  // 2. Letra Grande (Double Width/Height): {w}...{/w}
  html = html.replace(/\{w\}(.*?)\{\/w\}/g, '<span class="text-xl font-bold tracking-wider">$1</span>');

  // 3. Letra Pequeña: {s}...{/s}
  html = html.replace(/\{s\}(.*?)\{\/s\}/g, '<span class="text-[10px] text-slate-700">$1</span>');

  // 4. Salto de línea explícito: {br}
  html = html.replace(/\{br\}/g, '<br class="my-1" />');

  // 5. Alineación Izquierda: {left}...{/left}
  html = html.replace(/\{left\}(.*?)\{\/left\}/g, '<div class="text-left">$1</div>');

  // 6. Centrado: {center}...{/center}
  html = html.replace(/\{center\}(.*?)\{\/center\}/g, '<div class="text-center w-full">$1</div>');

  // 7. Render de QR: {qr}texto{/qr} (Simulado visualmente en la preview)
  html = html.replace(/\{qr\}(.*?)\{\/qr\}/g, `
    <div class="flex flex-col items-center my-2 p-1 border border-dashed border-slate-400 rounded bg-slate-50">
      <div class="w-24 h-24 bg-slate-800 flex items-center justify-center text-white text-[10px] font-bold text-center p-2 rounded">
        [ QR CODE ]
        <br>
        <span class="text-[8px] font-mono text-slate-300 truncate w-full block">$1</span>
      </div>
    </div>
  `);

  // 8. Render de Código de Barras: {pdf417}texto{/pdf417}
  html = html.replace(/\{pdf417\}(.*?)\{\/pdf417\}/g, `
    <div class="flex flex-col items-center my-2">
      <div class="w-full h-8 bg-slate-900 relative flex items-center justify-center text-white text-[9px] tracking-[6px] font-bold overflow-hidden">
        ||||||||||||||||||||||||||||||||
      </div>
      <span class="text-[9px] text-slate-500">$1</span>
    </div>
  `);

  return html;
});

/**
 * Envía el ticket directamente a la impresora usando nuestro servicio
 */
const print = async () => {
  try {
    // Reemplazamos los saltos de línea estándar (\n) por {br} para que la API de MP los procese correctamente si es necesario.
    // (A veces el driver requiere el {br} explícito).
    let formattedContent = contentRaw.value;

    const response = await printer.printDirectly(formattedContent, `test_print_${Date.now()}`);
    console.log('¡Impresión exitosa!', response);
  } catch (err) {
    console.error('Error al imprimir:', err);
  }
}

/**
 * Helper para que el usuario pueda insertar etiquetas rápidamente en el text-area
 */
const insertTag = (openTag: string, closeTag: string = '') => {
  // Buscamos el elemento textarea nativo que usa Naive UI
  const textarea = document.querySelector('textarea');
  if (!textarea) {
    contentRaw.value += `${openTag}${closeTag}`;
    return;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = contentRaw.value;
  const selectedText = text.substring(start, end);

  // Insertamos las etiquetas envolviendo el texto seleccionado
  const replacement = `${openTag}${selectedText}${closeTag}`;
  contentRaw.value = text.substring(0, start) + replacement + text.substring(end);
  
  // Devolvemos el foco al textarea
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
  }, 50);
}



/**
 * Inserta la fecha y hora actual en el formato "DD/MM/AAAA HH:mm"
 * en la posición actual del cursor dentro del textarea.
 */
const insertDateTime = () => {
  const ahora = new Date();
  
  // Formateamos el día, mes, año, hora y minutos agregando ceros a la izquierda cuando haga falta
  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = String(ahora.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const anio = ahora.getFullYear();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');

  const fechaHoraFormateada = `{w}${dia}/${mes}/${anio}-----------${horas}:${minutos}{/w}{br}`;

  // Buscamos el textarea para meter la fecha donde esté el cursor posicionado
  const textarea = document.querySelector('textarea');
  if (!textarea) {
    contentRaw.value += fechaHoraFormateada;
    return;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = contentRaw.value;

  // Insertamos la fecha en la posición exacta del cursor
  contentRaw.value = text.substring(0, start) + fechaHoraFormateada + text.substring(end);
  
  // Devolvemos el foco al textarea justo después del texto que acabamos de insertar
  setTimeout(() => {
    textarea.focus();
    const nuevaPosicion = start + fechaHoraFormateada.length;
    textarea.setSelectionRange(nuevaPosicion, nuevaPosicion);
  }, 50);
}


onMounted(()=>{
  insertDateTime()
})
</script>

<style scoped>
/* Efecto de papel térmico cortado para la preview */
.ticket-paper {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(rgba(0,0,0,0.01) 1px, transparent 1px);
  background-size: 100% 24px;
}

/* Simulación de borde dentado abajo (estilo ticket cortado de la máquina) */
.ticket-paper::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  background-image: linear-gradient(-135deg, #f1f5f9 4px, transparent 0), linear-gradient(135deg, #f1f5f9 4px, transparent 0);
  background-size: 8px 12px;
  background-position: left bottom;
}
</style>