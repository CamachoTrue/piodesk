<template>
    <div v-if="mostrar">
        <vue-draggable-resizable
        :w="1420"
        :h="635"
        :x="window.innerWidth / 2 - 710"
        :y="window.innerHeight / 2 - 370"
        :resizable="false"
        class="custom-draggable"
        >
        <div class="internal-frame">
            <div class="header">
            Domicilio
            <button class="close-btn" @click="$emit('cerrar')">X</button>
            </div>

            <div class="content">
            <div class="main-grid">
                <div class="left-table tabla-wrapper1">
                <table class="tablaComedor">
                    <colgroup>
                    <col style="width: 60px" />
                    <col style="width: 40px" />
                    <col style="width: 170px" />
                    <col style="width: 100px" />
                    <col style="width: 100px" />
                    </colgroup>
                    <thead>
                    <tr>
                        <th>Orden</th>
                        <th>Imp.</th>
                        <th>Cliente</th>
                        <th>Telefono</th>
                        <th>Contacto</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="i in 20" :key="i">
                        <td>{{ i }}</td>
                        <td><input type="checkbox" disabled /></td>
                        <td>nombre</td>
                        <td>6421415249</td>
                        <td>Nombre</td>
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
                        <label>Cliente:</label>
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
                        <input v-model="checkimpreso" class="impreso-input" type="checkbox" disabled/>
                        </div>
                    </div>
                    <div class="column">
                            <div class="textarea-column">
                        <label>Dirección:</label>
                        <textarea class="direccion-textarea"></textarea>
                        </div>
                    </div>
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

                <div class="bottom-content">
                    <div class="all-buttons">
                        <button @click="abrirAggClientes()" class="button">Abrir cuenta</button>
                        <button @click="abrirBorrar()" class="button">Eliminar Prod.</button>
                        <button @click="abrirDescuento()" class="button">Descuento</button>
                        <button @click="abrirReabrir()" class="button">Reabrir cuenta</button>
                        <button @click="abrirCancelar()" class="button">Cancelar cuenta</button>
                        <button @click="abrirPagar()" class="button">Pagar cuenta</button>
                        <button @click="abrirCaptura()" class="button">Captura</button>
                        <button @click="abrirRenombrar()" class="button">Renombrar</button>
                        <button @click="abrirImprimir()" class="button">Imprimir</button>
                    </div>

                    <div class="right-totals-wrapper">
                        <div class="bordered-box totals-box" style="min-width: 300px;">
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

    <abrir :mostrar="mostrarAbrir" @cerrar="mostrarAbrir = false" />
    <borrar :mostrar="mostrarBorrar" @cerrar="mostrarBorrar = false" />
    <descuento :mostrar="mostrarDescuento" @cerrar="mostrarDescuento = false" />
    <captura :mostrar="mostrarCaptura" @cerrar="mostrarCaptura = false" />
    <renombrar :mostrar="mostrarRenombrar" @cerrar="mostrarRenombrar = false" />
    <imprimir :mostrar="mostrarImprimir" @cerrar="mostrarImprimir = false" />
    <reabrir :mostrar="mostrarReabrir" @cerrar="mostrarReabrir = false" />
    <cancelar :mostrar="mostrarCancelar" @cerrar="mostrarCancelar = false" />
    <pagar :mostrar="mostrarPagar" @cerrar="mostrarPagar = false" />
    <aggClientes :mostrar="mostrarAggClientes" @cerrar="mostrarAggClientes = false" />
</template>

<script setup>
import { defineEmits, defineProps, onMounted, ref } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import abrir from "./Comedor/abrir.vue";
import borrar from "./Comedor/borrar.vue";
import cancelar from "./Comedor/cancelar.vue";
import captura from "./Comedor/captura.vue";
import descuento from "./Comedor/descuento.vue";
import imprimir from "./Comedor/imprimir.vue";
import pagar from "./Comedor/pagar.vue";
import reabrir from "./Comedor/reabrir.vue";
import renombrar from "./Comedor/renombrar.vue";
import aggClientes from "./Domicilio/aggClientes.vue";


const checkimpreso = ref(false);
const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);
const window = ref(globalThis.window);
const mostrarAbrir = ref(false);
const mostrarBorrar = ref(false);
const mostrarDescuento = ref(false);
const mostrarCaptura = ref(false);
const mostrarRenombrar = ref(false);
const mostrarImprimir = ref(false);
const mostrarReabrir = ref(false);
const mostrarCancelar = ref(false);
const mostrarPagar = ref(false);
const mostrarAggClientes = ref(false);


onMounted(() => {
    checkimpreso.value = true;
})

//Abrir cuenta
const abrirAbrir = () => {
    mostrarAbrir.value = true;
};

//borrar cuenta
const abrirBorrar = () => {
    mostrarBorrar.value = true;
};

//descuento
const abrirDescuento = () => {
    mostrarDescuento.value = true;
};

//captura
const abrirCaptura = () => {
    mostrarCaptura.value = true;
};

//renombrar
const abrirRenombrar = () => {
    mostrarRenombrar.value = true;
};

//imprimir
const abrirImprimir = () => {
    mostrarImprimir.value = true;
};

//reabrir
const abrirReabrir = () => {
    mostrarReabrir.value = true;
};

//cancelar
const abrirCancelar = () => {
    mostrarCancelar.value = true;
};

//pagar
const abrirPagar = () => {
    mostrarPagar.value = true;
};

//agg clientes
const abrirAggClientes = () => {
    mostrarAggClientes.value = true;
};


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
    padding: 5px 20px;
    font-weight: bold;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    position: relative;
    text-align: left;
}
.close-btn {
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

.close-btn:hover{
    background-color: rgb(209, 0, 0);
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
    width: 500px;
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
    width: 458px;
    height: 123px;

}

.button-section {
    width: 100%;
    display: flex;
    justify-content: center;
}

.button-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.bordered-box {
    border: 1px solid #b4b4b4;
    padding: 10px;
    border-radius: 10px;
    width: 865px;
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
    flex-direction: column;
    gap: 10px;
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
    width: 126px;
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
    width: 250px !important;
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
    width: 190px !important;
}

.cierre-input {
    width: 190px !important;
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

.textarea-column {
  display: flex;
  flex-direction: column;
margin-left: 5px;
  justify-content: flex-start;
}

.direccion-textarea {
  width: 240px;
  height: 75px;
  resize: none;
  border: 1px solid #b3b3b3;
  border-radius: 5px;

}

.all-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}


.bottom-controls {
  margin-top: 10px;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-top: 10px;
}

.totals-box {
  width: 450px;
}
  </style>
