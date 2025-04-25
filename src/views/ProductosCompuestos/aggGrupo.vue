<template>
    <div v-if="mostrar">
      <vue-draggable-resizable
        :w="833"
        :h="500"
        :x="window.innerWidth / 2 - 500"
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
            >X
              
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
                      <tr v-for="producto in productos" :key="productos.idproducto" @dblclick="seleccionarProducto(producto)">
                        <td>{{ producto.idproducto }}</td>
                        <td>{{ producto.idgrupo === null ? producto.idsubgrupo : producto.idgrupo+','+producto.idsubgrupo }}</td>
                        <td>{{ producto.nombre }}</td>
                        <td>{{ producto.precio }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
  
              <div class="right-panel">
                <div class="agregar-producto">
                  <span>Agregar nuevos productos:</span>
                </div>
  
                <div class="button-group right-buttons">
                  <button
                    @click="aggProducto()" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">
                    Guardar
                  </button>
                  <button
                    @click="" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">
                    Eliminar
                  </button>
                  <div class="composite-wrapper">
                    <button
                      @click="abrirProductoComp()"
                      class="productoComp-btn transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white" :style="{ backgroundColor: color }">
                      Producto compuesto
                    </button>
                    <input v-model="isChecked" type="checkbox" class="producto-checkbox" />
                  </div>
                </div>
  
  
                <div class="input-frame">
                  <div class="input-row">
                    <label>Grupo</label>
                    <input v-model="grupo" type="number" class="input-tabla input-chico grupo" />
                    <button class="icon-btn" @click="accionGrupo"><img src="/admin.png  " class="icon-img"><span></span></button>
                  </div>
                  <div class="input-row">
                    <label>Subgrupo</label>
                    <input v-model="subgrupo" type="number" class="input-tabla input-chico subgrupo" />
                    <button class="icon-btn" @click="accionGrupo"><img src="/admin.png" class="icon-img"><span></span></button>
                  </div>
                  <div class="input-row">
                    <label>Clave</label>
                    <input v-model="clave" type="text" class="input-tabla input-mediano clave" />
                  </div>
                  <div class="input-row">
                    <label>Descripción</label>
                    <input v-model="descripcion" type="text" class="input-tabla descripcion" />
                  </div>
                  <div class="input-row">
                    <label>Precio</label>
                    <input v-model="precio" type="number" class="input-tabla input-mediano precio" @keyup.enter="calcularPrecioSinIVA()"/>
                  </div>
                  <div class="input-row">
                    <label>Precio sin imp.</label>
                    <input v-model="preciosinimp" type="number" class="input-tabla input-mediano precio-sin-imp" readonly />
                  </div>
                  <div class="input-row">
                    <label>IVA</label>
                    <input v-model="iva" value="16" type="text"con class="input-tabla input-chico iva" readonly/>
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
    import { defineEmits, defineProps, onMounted, ref , watch} from "vue";
    import VueDraggableResizable from "vue-draggable-resizable";
    import "vue-draggable-resizable/style.css";
    import { supabase } from "../supabase/supabase";
    import { errorMessages } from "@vue/compiler-sfc";
    import { comma } from "postcss/lib/list";
    
    
    
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
      padding-right: 20px;
    }
    
    .right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 10px;
    }
    
    .right-buttons {
      justify-content: flex-start;
      gap: 8px;
    }
    
    .input-frame {
      border: 1px solid #b6b6b6;
      border-radius: 10px;
      padding: 10px;
      margin-right: 30px;
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
      width: 125px;
      color: #3e3e3e;
    }
    
    .input-tabla {
      width: 67%;
      padding: 5px;
      border: 1px solid #b6b6b6;
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
      cursor: pointer;
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
      width: 100px;
      padding: 5px 15px;
      border: none;
      background-color: rgb(130, 165, 243);
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .productoComp-btn {
      /*background-color: rgb(126, 126, 126);*/
      width: 200px;
    }
  
  
    .agregar-producto {
      font-size: 16px;
      
    }
  
    .composite-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .producto-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  .icon-btn {
    width: 32px;
    height: 32px;
    padding: 4px;
    background-color: #e0e0e0;
    border: 1px solid #ccc;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .icon-btn:hover {
    background-color: #bdbdbd;
  }
  
  
  </style>
    