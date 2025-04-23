<template>
    <div v-if="mostrar">
      <vue-draggable-resizable 
        :w="1200" 
        :h="650" 
        :x="window.innerWidth / 2 - 500" 
        :y="window.innerHeight / 2 - 325" 
        :resizable="false"
        class="custom-draggable"
      >
        <div class="internal-frame">
          <div class="header">
            Comedor
            <button class="close-btn" @click="$emit('cerrar')">X</button>
          </div>
  
          <div class="content">
            <div class="main-grid">
              <div class="left-table tabla-wrapper1">
                <table class="tablaComedor">
                  <colgroup>
                    <col style="width: 150px" />
                    <col style="width: 80px" />
                    <col style="width: 100px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Cuenta</th>
                      <th>Imp.</th>
                      <th>Orden</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in 20" :key="i">
                      <td>Cuenta {{ i }}</td>
                      <td><input type="checkbox" /></td>
                      <td> {{ i }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
  
              <div class="right-panel">
                <div class="top-section">
                  <div class="form-section bordered-box">
                    <div class="form-columns">
  <div class="column">
    <div class="input-row">
      <label>Cuenta:</label>
      <input class="input-control cuenta-input" type="text" />
    </div>
    <div class="input-row">
      <label>Folio:</label>
      <input class="input-control folio-input" type="number" />
    </div>
    <div class="input-row">
      <label>Orden:</label>
      <input class="input-control orden-input" type="number" />
    </div>
  </div>
  <div class="column">
    <div class="input-row">
      <label>Apertura:</label>
      <input class="input-control apertura-input" type="text" />
    </div>
    <div class="input-row">
      <label>Cierre:</label>
      <input class="input-control cierre-input" type="text" />
    </div>
    <div class="input-row">
      <label>Impreso:</label>
      <input class="impreso-input" type="checkbox" />
    </div>
  </div>
</div>
                  </div>
  
                  <div class="button-section">
                    <div class="button-grid">
                      <button>Abrir cuenta</button>
                      <button>Cancelar cuenta</button>
                      <button>Descuento</button>
                      <button>Captura</button>
                      <button>Renombrar cuenta</button>
                      <button>Imprimir</button>
                    </div>
                  </div>
                </div>
  
                <div class="tabla-wrapper2">
                  <table class="tablaComedor">
                    <colgroup>
                      <col style="width: 80px" />
                      <col style="width: 80px" />
                      <col style="width: 300px" />
                      <col style="width: 120px" />
                      <col style="width: 120px" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Cantidad</th>
                        <th>Clave</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Importe</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="i in 10" :key="i">
                        <td>{{ i }}</td>
                        <td>CLV{{ i }}</td>
                        <td>Descripción {{ i }}</td>
                        <td>$10.00</td>
                        <td>$10.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
  
                <div class="bottom-controls">
                  <div class="left-buttons">
                    <button>Reabrir cuenta</button>
                    <button>Cancelar cuenta</button>
                    <button>Pagar cuenta</button>
                  </div>
  
                  <div class="bordered-box" style="min-width: 250px;">
                    <div class="input-row">
                      <label>Subtotal:</label>
                      <input class="input-control" type="text" />
                    </div>
                    <div class="input-row">
                      <label>Descuento:</label>
                      <input class="input-control" type="text" />
                    </div>
                    <div class="input-row">
                      <label>Impuestos:</label>
                      <input class="input-control" type="text" />
                    </div>
                    <div class="input-row">
                      <label>Propina:</label>
                      <input class="input-control" type="text" />
                    </div>
                    <div class="input-row">
                      <label>Total:</label>
                      <input class="input-control" type="text" />
                    </div>
                  </div>
                </div>
  
              </div>
            </div>
          </div>
        </div>
      </vue-draggable-resizable>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { defineEmits, defineProps } from "vue";
  import VueDraggableResizable from "vue-draggable-resizable";
  import "vue-draggable-resizable/style.css";
  
  const props = defineProps(["mostrar"]);
  const emit = defineEmits(["cerrar"]);
  const window = ref(globalThis.window);
  </script>
  
  <style scoped>
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
    background: white;
    border: 1px solid #ccc;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    background: rgb(247, 219, 75);
    color: white;
    padding: 5px 15px;
    font-weight: bold;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    position: relative;
    text-align: left;
  }
  .close-btn {
    width: 23px;
    height: 23px;
    position: absolute;
    right: 5px;
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
  }
  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 15px;
  }
  .main-grid {
    display: flex;
    gap: 15px;
    height: 100%;
  }
  .left-table {
    width: 300px;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .tabla-wrapper1 {
    max-height: 550px;
    overflow-y: auto;
    border: 1px solid #ccc;
  }
  .tabla-wrapper2 {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
  }
  .tablaComedor {
    width: 100%;
    border-collapse: collapse;
  }
  .tablaComedor th, .tablaComedor td {
    border: 1px solid #ccc;
    padding: 4px;
    text-align: left;
  }
  .top-section {
    display: flex;
    gap: 10px;
    width: 100%;
    height: 135px;
  }
  .form-section {
    width: 400px;

  }
  .button-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;

  }
  .button-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    padding-top: 20px;
    padding-bottom: 20px;
    
  }
  .bordered-box {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 10px;
  }
  .input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
    width: 100%;
  }

  .bottom-controls {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-top: 10px;
  }
  .left-buttons {
    display: flex;
    gap: 10px;
  }
  button {
    border: none;
    background-color: rgb(130, 165, 243);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    width: 145px;
    height: 45px;
    font-size: 15px;
  }
  .form-columns {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .column {
    flex: 1;
  }
  .tablaComedor th,
  .tablaComedor td {
    padding: 3px;
    padding-left: 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;
  }
  .tablaComedor thead th {
    position: sticky;
    top: 0;
    background-color: #e7e7e7;
    z-index: 1;
  }


/* Ancho específico solo para los inputs con clases personalizadas */
.cuenta-input {
    width: 150px !important;
}

.folio-input {
    width: 80px !important;
    margin-left: 15px;
}

.orden-input {
    width: 80px !important;
    margin-left: 5px;
}

.apertura-input {
    width: 80px !important;
}

.cierre-input {
    width: 80px !important;
    margin-left: 20px;
}

.impreso-input {
    width: 20px !important;
}

/* Asegurarse de que los inputs de la clase .input-control tengan un ancho general */
.input-control {
    padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: auto; /* Por si necesitas que los inputs no se estiren a lo largo */
}
  </style>
