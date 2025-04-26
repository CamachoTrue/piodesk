<template>
    <div v-if="mostrar">
        <vue-draggable-resizable
        :w="1220"
        :h="635"
        :x="window.innerWidth / 2 - 620"
        :y="window.innerHeight / 2 - 370"
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
                        <input class="input-control cuenta-input" type="text" readonly/>
                        </div>
                        <div class="input-row">
                        <label>Folio:</label>
                        <input class="input-control folio-input" type="number"readonly/>
                        </div>
                        <div class="input-row">
                        <label>Orden:</label>
                        <input class="input-control orden-input" type="number" readonly/>
                        </div>
                    </div>
                    <div class="column">
                        <div class="input-row">
                        <label>Apertura:</label>
                        <input class="input-control apertura-input" type="text" readonly/>
                        </div>
                        <div class="input-row">
                        <label>Cierre:</label>
                        <input class="input-control cierre-input" type="text" readonly/>
                        </div>
                        <div class="input-row">
                        <label>Impreso:</label>
                        <input v-model="checkimpreso" class="impreso-input" type="checkbox" readonly/>
                        </div>
                    </div>
                    </div>
                    </div>

                    <div class="button-section">
                        <div class="button-grid">
                            <button class="button">Abrir cuenta</button>
                            <button class="button">Cancelar cuenta</button>
                            <button class="button">Descuento</button>
                            <button class="button">Captura</button>
                            <button class="button">Renombrar cuenta</button>
                            <button class="button">Imprimir</button>
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
                    <button class="button">Reabrir cuenta</button>
                    <button class="button">Cancelar cuenta</button>
                    <button class="button">Pagar cuenta</button>
                    </div>
                <div class="right-totals-wrapper">
                    <div class="bordered-box" style="min-width: 395px;">
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
            </div>
        </vue-draggable-resizable>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { defineEmits, defineProps } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";

const checkimpreso = ref(false);
const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);
const window = ref(globalThis.window);
</script>

<style scoped>
/*Para quitar las flechas del spinner*/
input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  .custom-draggable {
    outline: none !important;
    border: none !important;
  }


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
    padding: 20px;
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
    gap: 10px;
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
    height: 123px;

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
    padding-top: 15px;
    padding-bottom: 25px;
    
}
.bordered-box {
    border: 1px solid #b4b4b4;
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
    justify-content: flex-end;
    align-items: flex-start;
    gap: 15px;
    margin-top: 10px;
}
.left-buttons {
    display: flex;
    gap: 5px;
}

.left-buttons button {
    width: 148px;
}

button {
    border: none;
    background-color: rgb(144, 176, 245);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    width: 145px;
    height: 45px;
    font-size: 15px;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: rgb(105, 133, 194);
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
    width: auto !important;
    height: auto !important;
    margin-left: 4px;
    margin-top: 4px;
    transform: scale(1.5); /* Escala el checkbox */
    transform-origin: left center;
    cursor: pointer;

}

/* Asegurarse de que los inputs de la clase .input-control tengan un ancho general */
.input-control {
    padding: 5px;
    height: 30px;
    border: 1px solid #b3b3b3;
    border-radius: 5px;
    width: auto; /* Por si necesitas que los inputs no se estiren a lo largo */
}

.right-totals-wrapper {
display: flex;
justify-content: flex-end;
flex: 1;
}

.right-totals-wrapper .input-row {
display: flex;
justify-content: space-between;
align-items: center;
gap: 0px;
}

.right-totals-wrapper label {
flex: 1;
white-space: nowrap;
}

.right-totals-wrapper input {
 flex: 1;
  max-width: 150px;
}

.right-totals-wrapper input {
  flex: 1;
  width: 200px; /* Aumenta este valor según lo que necesites */
  max-width: 300px;
}

.right-totals-wrapper .input-row:last-child label {
  font-weight: bold;
}

  </style>
