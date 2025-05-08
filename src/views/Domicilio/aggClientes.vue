<template>
    <div v-if="mostrar">
        <vue-draggable-resizable 
            :w="480" 
            :h="440" 
            :x="window.innerWidth / 2 - 280" 
            :y="window.innerHeight / 2 - 300" 
            :resizable="false"
            class="custom-draggable"
            >
      <div class="internal-frame">
        <div class="header">
          Agregar clientes
          <button class="close-btn" @click="$emit('cerrar')">X</button>
        </div>
        <div class="content">

          <div class="top-bar">
            <div class="search-section">
              <label>Buscar:</label>
              <input type="text" class="search-input" placeholder="# Tel, Nombre" />
            </div>
            <div class="top-buttons">
              <button class="button">Buscar</button>
              <button class="button">Nuevo Cliente</button>
            </div>
          </div>

          <!-- Datos del cliente -->
          <div class="bordered-box form-box">
            <div class="input-row">
              <label>Contacto:</label>
              <input type="text" class="input-control" />
            </div>
            <div class="input-row">
              <label>Teléfono:</label>
              <input type="number" class="input-chico" />
            </div>
            <div class="input-row">
              <label>Calle:</label>
              <input type="text" class="input-control" />
            </div>
            <div class="input-row">
              <label>Número:</label>
              <input type="number" class="input-chico" />
            </div>
            <div class="input-row">
              <label>Cruzamiento:</label>
              <input type="text" class="input-control" />
            </div>
            <div class="input-row">
              <label>Referencias:</label>
              <input type="text" class="input-control" />
            </div>
          </div>

          <!-- Botones finales -->
          <div class="button-group">
            <button @click="abrirDomicilio()" class="button">Aceptar</button>
            <button class="cancel-btn">Cancelar</button>
          </div>
        </div>
      </div>
    </vue-draggable-resizable>

  </div>

  <domicilio :mostrar="mostrarDomicilio" @cerrar="mostrarDomicilio = false" />
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import {supabase} from "@/supabase/supabase";
import domicilio from "../domicilio.vue";


const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);
const window = ref(globalThis.window);
const mostrarDomicilio = ref(false);

//domicilio
const abrirDomicilio = () => {
    mostrarDomicilio.value = true;
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

.vue-draggable-resizable .handle {
  display: none !important;
}

.internal-frame {
  background: white;
  border: 1px solid #ccc;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 120%;
  height: 110%;
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

.close-btn:hover{
    background-color: rgb(209, 0, 0);
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 15px;
}
.button-group {
  display: flex;
  justify-content: center; 
  gap: 14px;
  align-items: center;
  padding-top: 5px;
}

button {
  width: 130px;
  height: 35px;
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

input {
  padding: 5px;
  border: 1px solid #bababa;
  border-radius: 4px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-buttons {
  display: flex;
  gap: 10px;
}

.bordered-box {
  border: 1px solid #b4b4b4;
  padding: 15px;
  border-radius: 10px;
}

.form-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-row label{
    width: 150px;
  
}

.input-control {
    width: 350px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #bababa;
}

.search-input {
  width: 100%;
}
.input-chico{
    width: 130px;
}

</style>
