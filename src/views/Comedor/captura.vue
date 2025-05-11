<template>
  <div v-if="mostrar">
    <vue-draggable-resizable
      :w="1000"
      :h="500"
      :x="windowWidth / 2 - 350"
      :y="windowHeight / 2 - 250"
      :resizable="false"
      class="custom-draggable"
    >
      <div class="internal-frame">
        <div class="header">
          Captura
          <button class="close-btn" @click="$emit('cerrar')">X</button>
        </div>
        <div class="content layout">
          <!-- Carrito de compras -->
          <div class="carrito">
            <div class="label-superior">Productos seleccionados</div>
            <div class="tabla-wrapper">
              <table class="tabla">
                <thead>
                  <tr>
                    <th>Cantidad</th>
                    <th>Descripción</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in carrito" :key="index">
                    <td>{{ item.cantidad }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td class="accion-cell">
                      <button class="remove-btn" @click="eliminarDelCarrito(index)">🗑</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Panel derecho -->
<div class="right-panel">
  <div class="bordered-box">
    <div class="label-superior">Captura de productos</div>

    <label>Grupos</label>
    <div class="group-buttons">
      <button v-for="grupo in grupos" :key="grupo.nombre" @click="seleccionarGrupo(grupo)">
        {{ grupo.nombre }}
      </button>
    </div>

    <div v-if="subgrupos.length">
      <label>Subgrupos</label>
      <div class="group-buttons">
        <button v-for="subgrupo in subgrupos" :key="subgrupo.nombre" @click="seleccionarSubgrupo(subgrupo)">
          {{ subgrupo.nombre }}
        </button>
      </div>
    </div>

    <div v-if="productos.length">
      <label>Productos</label>
      <div class="productos-lista">
        <button v-for="producto in productos" :key="producto.id" @click="agregarAlCarrito(producto)">
          {{ producto.nombre }}
        </button>
      </div>
    </div>
  </div>
</div>
</div>
<!-- Botones fuera del recuadro -->
  <div class="button-group">
    <button class="acep" @click="aceptar">Aceptar</button>
    <button class="cancel" @click="cancelar">Cancelar</button>
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

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

// Simulación de datos
const grupos = ref([
  {
    nombre: 'Boneless',
    subgrupos: [
      {
        nombre: 'Clásicos',
        productos: [
          { id: 1, nombre: 'Boneless BBQ' },
          { id: 2, nombre: 'Boneless Buffalo' },
        ]
      },
      {
        nombre: 'Picantes',
        productos: [
          { id: 3, nombre: 'Boneless Habanero' },
          { id: 4, nombre: 'Boneless Chipotle' },
        ]
      }
    ]
  },
  {
    nombre: 'Bebidas',
    subgrupos: [
      {
        nombre: 'Aguas',
        productos: [
          { id: 5, nombre: 'Agua Natural' },
          { id: 6, nombre: 'Agua Mineral' },
        ]
      },
      {
        nombre: 'Refrescos',
        productos: [
          { id: 7, nombre: 'Coca-Cola' },
          { id: 8, nombre: 'Sprite' },
          { id: 9, nombre: 'Fanta Naranja' },
        ]
      }
    ]
  },
  {
    nombre: 'PapaBoneless',
    subgrupos: [
      {
        nombre: 'Individual',
        productos: [
          { id: 10, nombre: 'Papa Boneless BBQ' },
          { id: 11, nombre: 'Papa Boneless Búfalo' },
        ]
      },
      {
        nombre: 'Familiar',
        productos: [
          { id: 12, nombre: 'Papa Boneless Familiar Chipotle' },
          { id: 13, nombre: 'Papa Boneless Familiar Mango Habanero' },
        ]
      }
    ]
  },
  {
    nombre: 'Alitas',
    subgrupos: [
      {
        nombre: '6 Piezas',
        productos: [
          { id: 14, nombre: 'Alitas BBQ 6p' },
          { id: 15, nombre: 'Alitas Mango Habanero 6p' },
        ]
      },
      {
        nombre: '12 Piezas',
        productos: [
          { id: 16, nombre: 'Alitas Buffalo 12p' },
          { id: 17, nombre: 'Alitas Chipotle 12p' },
        ]
      }
    ]
  },
  {
    nombre: 'Samplers',
    subgrupos: [
      {
        nombre: 'Mixtos',
        productos: [
          { id: 18, nombre: 'Sampler Boneless + Alitas' },
          { id: 19, nombre: 'Sampler Alitas + Papas' },
        ]
      },
      {
        nombre: 'Especiales',
        productos: [
          { id: 20, nombre: 'Sampler Fiesta' },
          { id: 21, nombre: 'Sampler Premium' },
        ]
      }
    ]
  }
]);

const subgrupos = ref([]);
const productos = ref([]);
const carrito = ref([]);

function seleccionarGrupo(grupo) {
  subgrupos.value = grupo.subgrupos || [];
  productos.value = [];
}

function seleccionarSubgrupo(subgrupo) {
  productos.value = subgrupo.productos || [];
}

function agregarAlCarrito(producto) {
  const itemExistente = carrito.value.find(item => item.descripcion === producto.nombre);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.value.push({ cantidad: 1, descripcion: producto.nombre });
  }
}

function eliminarDelCarrito(index) {
  if (carrito.value[index].cantidad > 1) {
    carrito.value[index].cantidad -= 1;
  } else {
    carrito.value.splice(index, 1);
  }
}

function aceptar() {
  alert('Compra aceptada');
  carrito.value = [];
}

function cancelar() {
  carrito.value = [];
}
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
  padding: 20px;
}
.layout {
  display: flex;
  height: 100%;
}

.remove-btn {
  width: 25px;
  height: 25px;
  background: red;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 0px;

}
.right-panel {
  width: 55%;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
}
.group-buttons, .productos-lista {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
}
.footer-buttons {
  margin-top: auto;
  display: flex;
  gap: 10px;
}
button {
  padding: 5px 10px;
  background-color: rgb(130, 165, 243);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: rgb(105, 133, 194);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
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
    width: 220px;
}
.tabla th:nth-child(3) {
    width: 80px;
}
.tabla-wrapper {
    max-height: 310px;
    overflow: auto;
    border: 1px solid #ccc;
    display: inline-block; 
}

.bordered-box {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
}

.label-superior {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.accion-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.centered-buttons {
  justify-content: center;
  margin-top: 30px;
}

.acep{
    width: 133px;
    padding: 5px 10px;
}

.cancel{
  background-color: rgb(126 ,126, 126);
  width: 133px;
  padding: 5px 10px;
}


.cancel:hover {
    background-color: rgb(92, 92, 92);
}
</style>