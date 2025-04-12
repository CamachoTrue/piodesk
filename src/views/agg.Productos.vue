<template>
    <div v-if="mostrar">
      <vue-draggable-resizable
        :w="800"
        :h="500"
        :x="window.innerWidth / 2 - 490"
        :y="window.innerHeight / 2 - 320"
        :resizable="false"
        class="custom-draggable"
      >
        <div class="internal-frame">
          <div class="header">
            Productos
            <button
              class="close-btn transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white"
              @click="$emit('cerrar')"
            >
              X
            </button>
          </div>
          <div class="content">
            <div class="main-grid">
              <!-- Tabla -->
              <div class="left-panel">
                <div class="tabla-wrapper">
                  <table class="tablaProductos">
                    <thead>
                      <tr>
                        <th>Clave</th>
                        <th>Grupo</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="i in 20" :key="i">
                        <td>{{ 1000 + i }}</td>
                        <td>{{ i }}</td>
                        <td>Producto número {{ i }}</td>
                        <td>{{ (Math.random() * 100).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
  
              <!-- Panel derecho con botones e inputs -->
              <div class="right-panel">
                <div class="agregar-producto">
                  <span>Agregar nuevos productos:</span>
                </div>
                <div class="button-group right-buttons">
                  <button
                    @click=""
                    class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white"
                  >
                    Guardar
                  </button>
                  <button
                    @click=""
                    class="productoComp-btn transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white"
                  >
                    Producto compuesto
                  </button>
                </div>
                <div class="input-frame">
                  <div class="input-row">
                    <label>Grupo</label>
                    <input type="number" class="input-tabla input-chico grupo" />
                  </div>
                  <div class="input-row">
                    <label>Subgrupo</label>
                    <input type="number" class="input-tabla input-chico subgrupo" />
                  </div>
                  <div class="input-row">
                    <label>Clave</label>
                    <input type="text" class="input-tabla input-mediano clave" />
                  </div>
                  <div class="input-row">
                    <label>Descripción</label>
                    <input type="text" class="input-tabla descripcion" />
                  </div>
                  <div class="input-row">
                    <label>Precio</label>
                    <input type="number" class="input-tabla input-mediano precio" />
                  </div>
                  <div class="input-row">
                    <label>Precio sin imp.</label>
                    <input type="number" class="input-tabla input-mediano precio-sin-imp" />
                  </div>
                  <div class="input-row">
                    <label>IVA</label>
                    <input type="text" class="input-tabla input-chico iva" />
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
    padding: 15px;
    flex-grow: 1;
  }
  
  .main-grid {
    display: flex;
    height: 100%;
  }
  
  .left-panel {
    flex: 2;
    padding: 10px;
    padding-right: 30px;
  }
  
  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
  
  .right-buttons {
    justify-content: flex-start;
    gap: 10px;
  }
  
  .input-frame {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .input-row {
    display: flex;
    align-items: center;
    gap: 10px;

  }
  
  .input-row label {
    width: 110px;
    color: #3e3e3e;
  }
  
  .input-tabla {
    width: 65%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: left;
  }
  
  /* Estilos de la tabla */
  .tabla-wrapper {
    max-height: 440px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #ccc;
    padding-right: 4px;
  }
  
  .tablaProductos {
    width: 450px;
    min-width: 450px;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  .tablaProductos th,
  .tablaProductos td {
    padding: 3px;
    padding-left: 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;
  }
  
  /* Sticky header */
  .tablaProductos thead th {
    position: sticky;
    top: 0;
    background-color: #e7e7e7;
    z-index: 1;
  }
  
  .tablaProductos th:nth-child(1) {
    width: 70px;
  }
  .tablaProductos th:nth-child(2) {
    width: 70px;
  }
  .tablaProductos th:nth-child(3) {
    width: 220px;
  }
  .tablaProductos th:nth-child(4) {
    width: 95px;
  }
  
  /* Tamaños personalizados para inputs */
  .input-chico {
    width: 80px;
  }
  
  .input-mediano {
    width: 180px;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-right: 30px;
  }
  
  button {
    width: 150px;
    padding: 5px 15px;
    border: none;
    background-color: rgb(130, 165, 243);
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .productoComp-btn {
    background-color: rgb(126, 126, 126);
    width: 200px;
  }


  .agregar-producto {
    font-size: 16px;
    
  }
  </style>
  