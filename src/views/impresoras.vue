<template>
    <div v-if="mostrar" class="modal-overlay">
      <VueDraggableResizable
        class="modal-draggable custom-draggable"
        :w="800"
        :h="600"
        :resizable="false"
      >
        <div class="internal-frame">
          <div class="header">
            Impresoras
            <button class="close-btn" @click="cerrar">X</button>
          </div>
          <div class="content">
            <label for="printer-select">Seleccionar impresora:</label>
            <select id="printer-select" v-model="selectedPrinter">
              <option v-for="printer in printers" :key="printer.name" :value="printer.name">
                {{ printer.name }}
              </option>
            </select>
  
            <h3>Vista previa del ticket:</h3>
            <div class="ticket-preview">
              <pre>{{ formattedTicket }}</pre>
            </div>
  
            <button class="print-btn" @click="printTest">Imprimir prueba</button>
            <p class="log">{{ message }}</p>
          </div>
        </div>
      </VueDraggableResizable>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, computed, onMounted } from 'vue';
  import VueDraggableResizable from 'vue-draggable-resizable';
  import "vue-draggable-resizable/style.css";
  
  const props = defineProps({ mostrar: Boolean });
  const emit = defineEmits(['cerrar']);
  
  const printers = ref([]);
  const selectedPrinter = ref('');
  const message = ref('');
  
  const ticketData = {
    titulo: '***Pio Pio Bonless and wings***',
    pedido: '1234',
    items: [
      { nombre: 'Boneless', cantidad: 1, precio: 180 },
      { nombre: 'Coca-Cola', cantidad: 2, precio: 25 }
    ],
    mensaje: 'Mensaje de ejemplo'
  };
  
  ticketData.total = ticketData.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  
  const formattedTicket = computed(() => {
    const fecha = new Date().toLocaleString();
    const lines = [
      `*** ${ticketData.titulo} ***`,
      `${fecha}`,
      `Pedido #: ${ticketData.pedido}`,
      '',
      ...ticketData.items.map(item => `${item.cantidad}x ${item.nombre} - $${(item.precio * item.cantidad).toFixed(2)}`),
      '',
      `Total: $${ticketData.total.toFixed(2)}`,
      '',
      ticketData.mensaje
    ];
    return lines.join('\n');
  });
  
  const cerrar = () => emit('cerrar');
  
  const printTest = async () => {
    try {
      const success = await window.printer.printTicket(ticketData, selectedPrinter.value);
      message.value = success ? '✅ Impreso correctamente' : '❌ Falló la impresión';
    } catch (err) {
      message.value = '❌ Error: ' + err.message;
    }
  };
  
  onMounted(async () => {
    try {
      const list = await window.printer.getPrinters();
      printers.value = list;
      if (list.length) selectedPrinter.value = list[0].name;
    } catch (err) {
      console.error('Error obteniendo impresoras:', err);
      message.value = 'Error cargando impresoras';
    }
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-draggable {
    width: 800px !important;
    height: 600px !important;
  }

  /* Estilos para eliminar líneas punteadas de vue-draggable-resizable */
.custom-draggable {
  outline: none !important;
  border: none !important;
}

.custom-draggable > div {
  outline: none !important;
  border: none !important;
}

.vue-draggable-resizable .handle {
  display: none !important;
}

.vue-draggable-resizable .handle-tl,
.vue-draggable-resizable .handle-tr,
.vue-draggable-resizable .handle-bl,
.vue-draggable-resizable .handle-br {
  display: none !important;
}
  .internal-frame {
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  .header {
    background: rgb(247, 219, 75);
    padding: 5px 20px;
    font-weight: bold;
    color: #fff;
    position: relative;
  }
  
  .close-btn {
    padding: 0 !important;
    width: 21px;
    height: 21px;
    position: absolute;
    right: 2px;
    top: 2px;
    bottom: 2px;
    background: red;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 4px;
    margin-right: 4px;
    font-size: 13px;
}
  .content {
    position: relative;
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  label {
    font-weight: 500;
    margin-bottom: 5px;
  }
  select {
    margin-bottom: 15px;
    padding: 5px;
    border: #ccc;
    border: 1px solid #b4b4b4;
    border-radius: 4px;
  }
  .ticket-preview {
    width: 220px;
    max-height: 350px;
    background: #f8f8f8;
    border: 1px dashed #ccc;
    padding: 10px;
    overflow-y: auto;
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 14px;
  }
  .print-btn {
    width: 170px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    padding: 8px 16px;
    background-color: #82a5f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

  }
  .log {
    margin-top: 10px;
    font-size: 0.9em;
  }
  </style>
  