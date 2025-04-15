<template>
    <div v-if="mostrar">
      <vue-draggable-resizable 
        :w="590" 
        :h="580" 
        :x="window.innerWidth / 2 - 300" 
        :y="window.innerHeight / 2 - 330" 
        :resizable="false"
        class="custom-draggable"
      >
        <div class="internal-frame">
          <div class="header">
            Producto compuesto
            <button class="close-btn transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white" @click="$emit('cerrar')">X</button>
          </div>
          <div class="content">

            <h2 class="section-title">Grupos de modificadores</h2>
  
            <div class="button-group">
              <button class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Agregar</button>
              <button class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Guardar</button>
            </div>
  
            <div class="tabla-wrapper">
                <table class="tablaProductos">
                    <thead>
                    <tr>
                        <th>Botón</th>
                        <th>Clave</th>
                        <th>Descripción</th>
                        <th>Modificadores máx.</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="i in 4" :key="i">
                        <td>201</td>
                        <td>{{ 100 + i }}</td>
                        <td>Grupo {{ i }}</td>
                        <td>{{ i }}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
  
            <h2 class="section-title">Modificadores de productos</h2>
  
            <div class="button-group">
              <button class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Agregar</button>
              <button class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Guardar</button>
            </div>
  
            <div class="tabla-wrapper">
  <table class="tablaProductos">
    <thead>
            <tr>
                <th>Clave</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Grupo</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="i in 4" :key="'mod-' + i">
                <td>{{ 200 + i }}</td>
                <td>Modificador {{ i }}</td>
                <td>{{ (i * 10).toFixed(2) }}</td>
                <td>Grupo {{ i }}</td>
            </tr>
            </tbody>
        </table>
        </div>
  
          </div>
        </div>
      </vue-draggable-resizable>
    </div>
  </template>
  
  <script setup>
  import { supabase } from "@/supabase/supabase";
  import { defineEmits, defineProps, ref } from "vue";
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
  
  .vue-draggable-resizable .handle,
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
    padding: 10px 27px;
    font-weight: bold;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    position: relative;
    text-align: left;
  }
  
  .close-btn {
    width: 25px;
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
    padding: 20px;
    text-align: left;
  }
  
  .section-title {

    margin-bottom: 10px;
    color: #333;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  button {
    width: 110px;
    padding: 5px 15px;
    border: none;
    background-color: rgb(126, 126, 126);
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }
  
  
  .tabla-wrapper {
  width: 550px;
  max-height: 150px;
  overflow-y: auto; /* ✅ Esto es lo correcto */
  border: 1px solid #ccc;
  padding-right: 4px;
  margin-bottom: 20px;
  display: inline-block;
}
  
  .tablaProductos {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }

  .tablaProductos th:nth-child(3),
.tablaProductos td:nth-child(3) {
  width: 250px;
}
  
  .tablaProductos th,
  .tablaProductos td {
    padding: 5px;
    padding-left: 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;
  }
  
  .tablaProductos thead th {
    position: sticky;
    top: 0;
    background-color: #e7e7e7;
    z-index: 1;
  }
  </style>
  