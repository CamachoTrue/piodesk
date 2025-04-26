<template>
    <div v-if="mostrar" class="modal-overlay">
      <div class="modal-window" ref="modalRef">
        <div class="modal-header">
          <span>Impresora POS</span>
          <button @click="cerrarModal" class="close-btn">X</button>
        </div>
        <div class="modal-content">
          <div class="printer-container">
            <div class="form-group">
              <label for="printerName">Nombre de la impresora:</label>
              <select v-model="printerName" class="printer-select">
                <option value="default-printer">Impresora predeterminada</option>
                <option v-for="printer in printers" :key="printer.name" :value="printer.name">
                  {{ printer.name }}
                </option>
              </select>
            </div>
            
            <div class="receipt-preview">
              <h3>Vista previa del recibo</h3>
              <div class="receipt-content">
                <p><strong>{{ businessName }}</strong></p>
                <p>{{ businessAddress }}</p>
                <p>-----------------------------</p>
                <p>Fecha: {{ currentDate }}</p>
                <p>Recibo: #{{ receiptNumber }}</p>
                <p>-----------------------------</p>
                <div v-for="(item, index) in items" :key="index">
                  <p>{{ item.name }} x{{ item.quantity }}</p>
                  <p class="price">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
                <p>-----------------------------</p>
                <p>Total: {{ formatPrice(calculateTotal()) }}</p>
                <p>-----------------------------</p>
                <p>¡Gracias por su compra!</p>
              </div>
            </div>
            
            <button @click="printReceipt" class="print-button">Imprimir recibo</button>
            
            <div v-if="message" :class="['message', messageType]">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  
  const props = defineProps({
    mostrar: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['cerrar']);
  
  
  // Función para cerrar el modal
  const cerrarModal = () => {
    emit('cerrar');
  };
  
  // Referencia al elemento modal para arrastre manual
  const modalRef = ref(null);
  let isDragging = false;
  let initialX, initialY, currentX, currentY;
  
  // Datos de la impresora
  const printerName = ref('default-printer');
  const printers = ref([]);
  const businessName = ref('Mi Negocio');
  const businessAddress = ref('Calle Principal #123');
  const receiptNumber = ref('10001');
  const currentDate = ref(new Date().toLocaleString());
  const items = ref([
    { name: 'Producto 1', quantity: 2, price: 15.5 },
    { name: 'Producto 2', quantity: 1, price: 10.0 },
    { name: 'Producto 3', quantity: 3, price: 5.75 }
  ]);
  const message = ref('');
  const messageType = ref('');
  
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };
  
  const calculateTotal = () => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const showMessage = (text, type) => {
    message.value = text;
    messageType.value = type;
    setTimeout(() => {
      message.value = '';
    }, 3000);
  };
  
  // Funciones para arrastrar la ventana manualmente
  const startDrag = (e) => {
    if (e.target.closest('.close-btn') || e.target.closest('.printer-select') || 
        e.target.closest('input') || e.target.closest('button')) {
      return;
    }
    
    isDragging = true;
    initialX = e.clientX;
    initialY = e.clientY;
    
    if (modalRef.value) {
      currentX = parseInt(window.getComputedStyle(modalRef.value).left) || 0;
      currentY = parseInt(window.getComputedStyle(modalRef.value).top) || 0;
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  };
  
  const drag = (e) => {
    if (!isDragging || !modalRef.value) return;
    
    const dx = e.clientX - initialX;
    const dy = e.clientY - initialY;
    
    modalRef.value.style.left = `${currentX + dx}px`;
    modalRef.value.style.top = `${currentY + dy}px`;
  };
  
  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  };
  
  const printReceipt = () => {
    if (typeof window === 'undefined' || !window.ipcRenderer) {
      showMessage('Esta función solo está disponible en Electron', 'error');
      return;
    }
  
    // Crear el contenido del recibo para la impresora
    const content = [
      {
        type: 'text',
        value: businessName.value,
        style: { fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }
      },
      {
        type: 'text',
        value: businessAddress.value,
        style: { textAlign: 'center', fontSize: '12px' }
      },
      {
        type: 'text',
        value: '-----------------------------',
        style: { textAlign: 'center' }
      },
      {
        type: 'text',
        value: `Fecha: ${currentDate.value}`,
        style: { fontSize: '12px' }
      },
      {
        type: 'text',
        value: `Recibo: #${receiptNumber.value}`,
        style: { fontSize: '12px' }
      },
      {
        type: 'text',
        value: '-----------------------------',
        style: { textAlign: 'center' }
      }
    ];
  
    // Agregar productos
    items.value.forEach(item => {
      content.push({
        type: 'text', 
        value: `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`,
        style: { fontSize: '12px' }
      });
    });
  
    // Finalizar recibo
    content.push(
      {
        type: 'text',
        value: '-----------------------------',
        style: { textAlign: 'center' }
      },
      {
        type: 'text',
        value: `Total: ${formatPrice(calculateTotal())}`,
        style: { fontWeight: 'bold', fontSize: '14px' }
      },
      {
        type: 'text',
        value: '-----------------------------',
        style: { textAlign: 'center' }
      },
      {
        type: 'text',
        value: '¡Gracias por su compra!',
        style: { textAlign: 'center', fontSize: '12px' }
      },
      {
        type: 'text',
        value: '\n\n\n\n',
        style: { textAlign: 'center' }
      }
    );
  
    try {
      // Enviar al proceso principal para imprimir
      window.ipcRenderer.send('print-receipt', {
        printerName: printerName.value,
        content: content
      });
  
      showMessage('Enviando a imprimir...', 'info');
    } catch (error) {
      showMessage(`Error: ${error.message}`, 'error');
    }
  };
  
  onMounted(() => {
    // Usar nextTick para asegurarse de que el DOM esté listo
    nextTick(() => {
      // Configurar la funcionalidad de arrastre
      if (modalRef.value) {
        modalRef.value.addEventListener('mousedown', startDrag);
        
        // Centrar la ventana inicialmente
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const modalWidth = 400; // Ancho aproximado de la ventana modal
        const modalHeight = 600; // Alto aproximado de la ventana modal
        
        modalRef.value.style.left = `${(windowWidth / 2) - (modalWidth / 2)}px`;
        modalRef.value.style.top = `${(windowHeight / 2) - (modalHeight / 2)}px`;
      }
    });
    
    // Configurar listener para recibir respuesta del proceso principal
    if (typeof window !== 'undefined' && window.ipcRenderer) {
      window.ipcRenderer.on('print-complete', (event, result) => {
        if (result.success) {
          showMessage('¡Impresión completada con éxito!', 'success');
        } else {
          showMessage(`Error al imprimir: ${result.error}`, 'error');
        }
      });
      
      // Obtener lista de impresoras disponibles
      try {
        window.ipcRenderer.invoke('get-printers').then((result) => {
          printers.value = result;
        }).catch(error => {
          console.error('Error al obtener impresoras:', error);
        });
      } catch (error) {
        console.error('Error al obtener impresoras:', error);
      }
    }
  });
  
  onBeforeUnmount(() => {
    // Eliminar listeners cuando el componente se desmonta
    if (modalRef.value) {
      modalRef.value.removeEventListener('mousedown', startDrag);
    }
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    
    if (typeof window !== 'undefined' && window.ipcRenderer) {
      window.ipcRenderer.removeAllListeners('print-complete');
    }
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    pointer-events: none;
  }
  
  .modal-window {
    position: absolute;
    width: 400px;
    background-color: #f0f0f0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    pointer-events: auto;
  }
  
  .modal-header {
    padding: 10px 15px;
    background-color: #4caf50;
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    user-select: none;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0 5px;
    border-radius: 4px;
    transition: transform 0.2s;
  }
  
  .close-btn:hover {
    transform: scale(1.05);
  }
  
  .close-btn:active {
    background-color: white;
    color: #4caf50;
  }
  
  .modal-content {
    padding: 15px;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .printer-container {
    max-width: 100%;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .printer-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .receipt-preview {
    background-color: #f9f9f9;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  
  .receipt-content {
    font-family: 'Courier New', monospace;
    font-size: 12px;
  }
  
  .price {
    text-align: right;
  }
  
  .print-button {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;
  }
  
  .print-button:hover {
    transform: scale(1.05);
  }
  
  .print-button:active {
    background-color: #45a049;
  }
  
  .message {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .info {
    background-color: #d1ecf1;
    color: #0c5460;
  }
  </style>