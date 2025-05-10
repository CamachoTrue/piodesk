<template>
  <div v-if="mostrar">
    <vue-draggable-resizable
      :w="450"
      :h="375"
      :x="window.innerWidth / 2 - 225"
      :y="window.innerHeight / 2 - 240"
      :resizable="false"
      class="custom-draggable"
    >
      <div class="internal-frame">
        <div class="header">
          Pagar
          <button class="close-btn" @click="$emit('cerrar')">X</button>
        </div>

        <div class="content">
          <div class="row-3-inputs">
        <div class="input-group">
            <label>Total:</label>
            <input type="number" />
        </div>
        <div class="input-group">
            <label>Cambio:</label>
            <input type="number" />
        </div>
        <div class="input-group">
            <label>Saldo:</label>
            <input type="number" />
        </div>
        </div>
          <!-- Tabla -->
          <div class="table-wrapper">
            <table class="tabla">
            <thead>
                <tr>
                <th>Clave</th>
                <th>Descripción</th>
                <th>Importe</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>EF</td>
                <td>Efectivo</td>
                <td><input type="number" class="input-control" /></td>
                </tr>
                <tr>
                <td>MC</td>
                <td>Tarjeta</td>
                <td><input type="number" class="input-control" /></td>
                </tr>
                <tr>
                <td>05</td>
                <td>Transferencia</td>
                <td><input type="number" class="input-control" /></td>
                </tr>
            </tbody>
            </table>
          </div>

          <!-- Botones -->
          <div class="button-group">
            <button class="button">Aceptar</button>
            <button class="button cancel-btn" @click="$emit('cerrar')">Cancelar</button>
          </div>
        </div>
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";

const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);
const window = ref(globalThis.window);
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
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
.close-btn:hover {
  background-color: rgb(209, 0, 0);
}
.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 8px;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
input {
  padding: 5px;
  border: 1px solid #b4b4b4;
  border-radius: 4px;
  width: 100%;
}
.table-wrapper {
  max-height: 165px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-top: 15px;
}
.tablaComedor {
  width: 100%;
  border-collapse: collapse;
}
.tablaComedor th,
.tablaComedor td {
  border: 1px solid #ccc;
  padding: 4px;
  text-align: left;
}
.tablaComedor th {
  background-color: #e7e7e7;
}
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  margin-left: 60px;
  margin-right: 60px;
}
button {
  width: 135px;
  padding: 5px 15px;
  border: none;
  background-color: rgb(130, 165, 243);
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.button:hover {
  background-color: rgb(105, 133, 194);
}
.cancel-btn {
  background-color: rgb(126, 126, 126);
}
.cancel-btn:hover {
  background-color: rgb(92, 92, 92);
}

.row-3-inputs,
.row-2-inputs {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.input-grande{
    flex: 1.8;
    }

.input-chico{
    flex: 1.2;
}
.tabla {
    border-collapse: collapse;
    table-layout: fixed;
    cursor: pointer;
}

.tabla th,
.tabla td {
    padding: 3px 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;
}

.tabla thead th {
    position: sticky;
    top: 0;
    background-color: #e7e7e7;
    z-index: 1;
}
.tabla th:nth-child(1) {
    width: 80px;
}
.tabla th:nth-child(2) {
    width: 200px;
}
.tabla th:nth-child(3) {
    width: 140px;
}

.input-control {
  width: 100%;
  padding: 4px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>