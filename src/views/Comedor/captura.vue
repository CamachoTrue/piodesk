<template>
    <div v-if="mostrar">
      <vue-draggable-resizable
        :w="1200"
        :h="500"
        :x="windowWidth / 2 - 350"
        :y="windowHeight / 2 - 250"
        :resizable="false"
        class="custom-draggable"
      >
        <div class="internal-frame">
          <div class="header">
            Grupos de Productos
            <button class="close-btn" @click="$emit('cerrar')">X</button>
          </div>
          <div class="content">
            <div class="layout">
              <!-- Tabla carrito a la izquierda -->
              <div class="carrito">
                <h4>Carrito</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in carrito" :key="index">
                      <td>{{ item.nombre }}</td>
                      <td>{{ item.cantidad }}</td>
                      <td>
                        <button class="remove-btn" @click="removerDelCarrito(index)">🗑</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
  
              <!-- Grupos y productos a la derecha -->
              <div class="right-panel">
                <h3>Grupos</h3>
                <div class="group-buttons">
                  <button v-for="grupo in grupos" :key="grupo.id" @click="seleccionarGrupo(grupo)">
                    {{ grupo.nombre }}
                  </button>
                </div>
                <div v-if="productosSeleccionados.length" class="productos-lista">
                  <h4>Productos de {{ grupoActual.nombre }}</h4>
                  <button v-for="producto in productosSeleccionados" :key="producto.id" @click="agregarAlCarrito(producto)">
                    {{ producto.nombre }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vue-draggable-resizable>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, onMounted } from 'vue';
  import VueDraggableResizable from 'vue-draggable-resizable';
  import 'vue-draggable-resizable/style.css';
  
  const props = defineProps({
    mostrar: Boolean,
  });
  const emit = defineEmits(['cerrar']);
  
  const windowWidth = ref(0);
  const windowHeight = ref(0);
  
  const grupos = [
    { id: 1, nombre: 'Boneless', productos: [ { id: 'b1', nombre: 'Boneless chico' }, { id: 'b2', nombre: 'Boneless mediano' }, { id: 'b3', nombre: 'Boneless grande' } ] },
    { id: 2, nombre: 'Hamburguesas', productos: [ { id: 'h1', nombre: 'Hamburguesa simple' }, { id: 'h2', nombre: 'Hamburguesa doble' } ] }
  ];
  const grupoActual = ref({});
  const productosSeleccionados = ref([]);
  const carrito = ref([]);
  
  function seleccionarGrupo(grupo) {
    grupoActual.value = grupo;
    productosSeleccionados.value = grupo.productos;
  }
  function agregarAlCarrito(producto) {
    const encontrado = carrito.value.find(item => item.id === producto.id);
    if (encontrado) {
      encontrado.cantidad++;
    } else {
      carrito.value.push({ ...producto, cantidad: 1 });
    }
  }
  function removerDelCarrito(index) {
    carrito.value.splice(index, 1);
  }
  
  onMounted(() => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  });
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
  }
  .close-btn {
    width: 21px;
    height: 21px;
    position: absolute;
    right: 10px;
    top: 5px;
    background: red;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 13px;
  }
  .close-btn:hover {
    background-color: rgb(209, 0, 0);
  }
  .content {
    flex-grow: 1;
    padding: 10px;
  }
  .layout {
    display: flex;
    height: 100%;
  }
  .carrito {
    width: 45%;
    padding-right: 10px;
    border-right: 1px solid #ccc;
    overflow-y: auto;
  }
  .carrito table {
    width: 100%;
    border-collapse: collapse;
  }
  .carrito th, .carrito td {
    border: 1px solid #ddd;
    padding: 5px;
    text-align: center;
  }
  .carrito th {
    background-color: #f2f2f2;
  }
  .remove-btn {
    background: red;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 2px 5px;
    cursor: pointer;
  }
  .right-panel {
    width: 55%;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
  }
  .group-buttons, .productos-lista {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }
  button {
    padding: 5px 10px;
    background-color: rgb(130, 165, 243);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: rgb(105, 133, 194);
  }
  </style>