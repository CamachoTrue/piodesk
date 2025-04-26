<template>
    <div class="printer-container">
      <h2>Impresora POS</h2>
      
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
  </template>
  
  <script>
  export default {
    name: 'PosPrinter',
    data() {
      return {
        printerName: 'default-printer',
        printers: [],
        businessName: 'Mi Negocio',
        businessAddress: 'Calle Principal #123',
        receiptNumber: '10001',
        currentDate: new Date().toLocaleString(),
        items: [
          { name: 'Producto 1', quantity: 2, price: 15.5 },
          { name: 'Producto 2', quantity: 1, price: 10.0 },
          { name: 'Producto 3', quantity: 3, price: 5.75 }
        ],
        message: '',
        messageType: ''
      };
    },
    async mounted() {
      // Configurar listener para recibir respuesta del proceso principal
      if (window.ipcRenderer) {
        window.ipcRenderer.on('print-complete', (event, result) => {
          if (result.success) {
            this.showMessage('¡Impresión completada con éxito!', 'success');
          } else {
            this.showMessage(`Error al imprimir: ${result.error}`, 'error');
          }
        });
        
        // Obtener lista de impresoras disponibles
        try {
          this.printers = await window.ipcRenderer.invoke('get-printers');
        } catch (error) {
          console.error('Error al obtener impresoras:', error);
        }
      }
    },
    methods: {
      formatPrice(price) {
        return `$${price.toFixed(2)}`;
      },
      calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      showMessage(text, type) {
        this.message = text;
        this.messageType = type;
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      printReceipt() {
        if (!window.ipcRenderer) {
          this.showMessage('Esta función solo está disponible en Electron', 'error');
          return;
        }
  
        // Crear el contenido del recibo para la impresora
        const content = [
          {
            type: 'text',
            value: this.businessName,
            style: { fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }
          },
          {
            type: 'text',
            value: this.businessAddress,
            style: { textAlign: 'center', fontSize: '12px' }
          },
          {
            type: 'text',
            value: '-----------------------------',
            style: { textAlign: 'center' }
          },
          {
            type: 'text',
            value: `Fecha: ${this.currentDate}`,
            style: { fontSize: '12px' }
          },
          {
            type: 'text',
            value: `Recibo: #${this.receiptNumber}`,
            style: { fontSize: '12px' }
          },
          {
            type: 'text',
            value: '-----------------------------',
            style: { textAlign: 'center' }
          }
        ];
  
        // Agregar productos
        this.items.forEach(item => {
          content.push({
            type: 'text', 
            value: `${item.name} x${item.quantity} - ${this.formatPrice(item.price * item.quantity)}`,
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
            value: `Total: ${this.formatPrice(this.calculateTotal())}`,
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
          // Agregamos saltos de línea para avanzar el papel
          {
            type: 'text',
            value: '\n\n\n\n',
            style: { textAlign: 'center' }
          }
        );
  
        // Enviar al proceso principal para imprimir
        window.ipcRenderer.send('print-receipt', {
          printerName: this.printerName,
          content: content
        });
  
        this.showMessage('Enviando a imprimir...', 'info');
      }
    },
    beforeUnmount() {
      // Eliminar listeners cuando el componente se desmonta
      if (window.ipcRenderer) {
        window.ipcRenderer.off('print-complete');
      }
    }
  };
  </script>
  
  <style scoped>
  .printer-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
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
  }
  
  .print-button:hover {
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