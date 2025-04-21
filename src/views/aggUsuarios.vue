<template>
    <div v-if="mostrar">
        <vue-draggable-resizable :w="750" :h="390" :x="window.innerWidth / 2 - 450" :y="window.innerHeight / 2 - 280" :resizable="false" class="custom-draggable">
        <div class="internal-frame">
            <div class="header">Usuarios
                <button class="close-btn transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white" @click="$emit('cerrar')">X</button>
            </div>
            <div class="content">
                <div class="main-grid">
                <!-- Tabla -->
                    <div class="left-panel">
                        <div class="tabla-wrapper">
                        <table class="tablaUsuarios">
                        <thead>
                        <tr>
                        <th>Clave</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in 10" :key="i">
                        <td>{{ 2000 + i }}</td>
                        <td>Usuario {{ i }}</td>
                        <td>{{ i % 2 === 0 ? 'Admin' : 'Normal' }}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <!-- Panel derecho -->
            <div class="right-panel">
            <div class="agregar-producto">
                <span>Agregar nuevo usuario:</span>
            </div>

            <div class="button-group">
                <button @click="" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white" >Nuevo</button>
                <button @click="" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Agregar</button>
                <button @click="" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Limpiar</button>
            </div>


            <div class="input-frame">
                <div class="input-row">
                    <label>Clave</label>
                    <input type="number" class="input-tabla input-chico" />
                </div>
                <div class="input-row">
                    <label>Nombre</label>
                    <input type="text" class="input-tabla" />
                </div>
                <div class="input-row">
                    <label>Tipo</label>
                    <input type="text" class="input-tabla input-mediano" />
                </div>
                <div class="input-row">
                    <label>Contraseña</label>
                    <input type="password" class="input-tabla" />
                </div>
                <div class="input-row">
                    <label>Usuario</label>
                    <input type="text" class="input-tabla input-mediano" />
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
import { defineProps, defineEmits, ref } from "vue";
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
    padding: 10px 27px;
    font-weight: bold;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    position: relative;
    text-align: left;
}

.close-btn {
    width: 30px;
    height: 25px;
    position: absolute;
    right: 5px;
    top: 5px;
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
    padding: 15px;
    flex-grow: 1;
}

.main-grid {
    display: flex;
    height: 100%;
}

.left-panel {
    flex: 1.5;
    padding: 10px;
    padding-right: 5px;
    padding-top: 20px;
    
}

.right-panel {
    flex: 1.5;
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-left: 18px;

}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-right: 1px;
}

.input-frame {
    border: 1px solid #b6b6b6;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.input-row {
    display: flex;
    align-items: center;
    gap: 40px;
}

.input-row label {
    width: 90px;
    color: #3e3e3e;
}

.input-tabla {
    width: 65%;
    padding: 5px;
    border: 1px solid #b6b6b6;
    border-radius: 4px;
    text-align: left;
}

.input-chico {
    width: 80px;
}

.input-mediano {
    width: 120px;
}

.tabla-wrapper {
    max-height: 300px;
    overflow: auto;
    border: 1px solid #ccc;
    display: inline-block; /* Esto hace que el div se ajuste al ancho del contenido interno */
}

.tablaUsuarios {
    border-collapse: collapse;
    table-layout: fixed;
}

.tablaUsuarios th,
.tablaUsuarios td {
    padding: 3px 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;
}

.tablaUsuarios thead th {
    position: sticky;
    top: 0;
    background-color: #e7e7e7;
    z-index: 1;
}

.tablaUsuarios th:nth-child(1) {
    width: 80px;
}
.tablaUsuarios th:nth-child(2) {
    width: 200px;
}
.tablaUsuarios th:nth-child(3) {
    width: 140px;
}

button {
    width: 125px;
    padding: 5px 10px;
    border: none;
    background-color: rgb(130, 165, 243);
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

.agregar-producto {
    font-size: 16px;
}
</style>
