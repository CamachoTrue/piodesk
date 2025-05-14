<template>
  <div v-if="mostrar">
    <vue-draggable-resizable
      :w="1000"
      :h="500"
      :x="windowWidth / 2 - 500"
      :y="windowHeight / 2 - 300"
      :resizable="false"
      class="custom-draggable"
    >
      <div class="internal-frame">
        <div class="header">
          Captura
          <button class="close-btn" @click="$emit('cerrar');limpiar()">X</button>
        </div>
        <div class="content layout">
          <!-- Carrito de compras -->
          <div class="carrito">
            <div class="tabla-wrapper">
              <table class="tabla">
                <thead>
                  <tr>
                    <th>Cantidad</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in carrito" :key="index">
                    <td>{{ item.cantidad }}</td>
                    <td>
                      {{ item.descripcion }}
                      <ul v-if="item.modificadores && item.modificadores.length">
                        <li v-for="(mod, i) in item.modificadores" :key="i">
                          → {{ mod.nombre }} <span v-if="mod.precio">(+{{ mod.precio }})</span>
                        </li>
                      </ul>
                    </td>
                    <td>
                      {{ item.precio }}
                    </td>
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
      <button v-for="grupo in grupos" :key="grupo.idgrupo" @click="seleccionarGrupo(grupo.idgrupo);">
        {{ grupo.nombre }}
      </button>
    </div>

    <div v-if="subgrupos.length">
      <label>Subgrupos</label>
      <div class="group-buttons">
        <button v-for="subgrupo in subgrupos" :key="subgrupo.idsubgrupo" @click="productos.value = [];seleccionarSubgrupo(subgrupo.idsubgrupo)">
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
    <button class="cancel" @click="cancelar;limpiar">Cancelar</button>
  </div>

      </div>
    </vue-draggable-resizable>
  </div>
  <capturarCompuesto :mostrar="mostrarCompuesto" @cerrar="mostrarCompuesto = false" @actualizar="agregarModificadorAlCarrito()" />

</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/style.css';
import { supabase } from '../../supabase/supabase';
import capturarCompuesto from "./capturarCompuesto.vue";
import { idPedido, idProducto, idModificador } from "@/store/auth.js";


const props = defineProps({
  mostrar: Boolean,
});
const emit = defineEmits(['cerrar','actualizar']);

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const mostrarCompuesto = ref(null);
// Simulación de datos

const grupos = ref([]);
const subgrupos = ref([]);
const productos = ref([]);
const gruposModificadores = ref([]);
const carrito = ref([]);

const cargarGrupos = async () => {
  const { data, error } = await supabase
    .from('grupos')
    .select();

  if(error){
    console.error("Error al obtener grupos ",error);
    return;
  }

  grupos.value = data;
};


const cargarSubGrupos = async (idgrupo) => {
    subgrupos.value = [];     // ← limpia los subgrupos anteriores
  productos.value = [];     // ← limpia los productos anteriores
  const { data, error } = await supabase
    .from('subgrupos')
    .select()
    .eq('idgrupo',idgrupo);
    
  if(error){
    console.error("Error al obtener SubGrupos ",error);
    return;
  }

  subgrupos.value = data;
  console.log("tamano",subgrupos.value.length);
  
  if(subgrupos.value.length === 0){
    await productosGrupos(idgrupo);
    console.log(productos.value);
    
  }
  
  
};

const grupModifcadores = ref([]);
const modificadores = ref([]);
const grupoSeleccionadoId = ref(null); // también limpia selección previa
const cargarGrupModificadores = async () => {
  const { data, error } = await supabase
    .from('grupomodificador')
    .select();

  if(error){
    console.error("Error al obtener grupos modificadores ",error);
    return;
  }

  gruposModificadores.value = data;
};


function limpiar(){
  carrito.value = [];
    subgrupos.value = [];
    productos.value = [];
};

function seleccionarGrupo(idgrupo) {
  cargarSubGrupos(idgrupo);
}

const productosGrupos = async (idgrupo) =>{
  const { data, error } = await supabase
    .from('productos')
    .select()
    .eq('idgrupo', idgrupo);

  productos.value = data;
};

async function seleccionarSubgrupo(idsubgrupo) {
  const { data, error } = await supabase
    .from('productos')
    .select()
    .eq('idsubgrupo', idsubgrupo);

  productos.value = data;
  
}

async function agregarModificadorAlCarrito() {
  const { data, error } = await supabase
    .from('modificadores')
    .select()
    .eq('idmodificador', idModificador.value)
    .single();

  if (error) {
    console.error("Error al obtener modificador", error);
    return;
  }

  const mod = {
    idmodificador: data.idmodificador,
    nombre: data.nombre,
    precio: data.precio
  };

  // Obtener el último producto del carrito
  const ultimoProducto = carrito.value[carrito.value.length - 1];

  // Inicializar si no existe
  if (!ultimoProducto.modificadores) {
    ultimoProducto.modificadores = [];
  }

  ultimoProducto.modificadores.push(mod);
  console.log(carrito.value);
};

function agregarAlCarrito(producto) {
  // Crear base del producto
  const productoCarrito = {
    id: producto.idproducto,
    cantidad: 1,
    descripcion: producto.nombre,
    precio: producto.precio,
    modificadores: [] // lista vacía lista para llenarse luego
  };

  carrito.value.push(productoCarrito);

  // Si es compuesto, abrir capturador de modificadores
  if (producto.compuesto) {
    mostrarCompuesto.value = true;
    idProducto.value = producto.idproducto; // si lo usas para cargar modificadores disponibles
  }
} 

function eliminarDelCarrito(index) {
  if (carrito.value[index].cantidad > 1) {
    carrito.value[index].cantidad -= 1;
  } else {
    carrito.value.splice(index, 1);
  }
}
onMounted(()=>{
  cargarGrupos();
  cargarGrupModificadores();
  
})

async function aceptar() {
  try{

    const total = carrito.value.reduce((acc, item) => {
      const modTotal = item.modificadores?.reduce((sum, mod) => sum + (mod.precio || 0), 0) || 0;
      return acc + ((item.precio + modTotal) * item.cantidad);
    }, 0);
    
    const { data: pedido, error:errorPedido } = await supabase
      .from('pedidos')
      .update({
        totalPedido: total
      })
      .eq('idpedido', idPedido.value);

    if(errorPedido){
      console.error("Error al actualizar pedido ", errorPedido);
      return;
    }

    for(const item of carrito.value){
      const { data: productoPedido, error: errorProdPed } = await supabase
        .from('productos_pedidos')
        .insert([{
          idproducto: item.id,
          idpedido: idPedido.value,
          cantidad: item.cantidad
        }])
        .select()
        .single();

      if(errorProdPed){
        console.error(`Erro al agregar producto ${item.nombre}`,errorProdPed);
        return;
      }

      const idProductoPedido = productoPedido.idprodpedi;

      // 3. Insertar los modificadores si existen
      if (item.modificadores && item.modificadores.length > 0) {
        const modificadoresData = item.modificadores.map(mod => ({
          idprodpedi: idProductoPedido,
          idmodificador: mod.idmodificador,
        }));

        const { error: errorMods } = await supabase
          .from('productos_pedidos_modificadores')
          .insert(modificadoresData);

        if (errorMods) {
          console.error("Error al insertar modificadores", errorMods);
          return;
        }
      }
    }

     carrito.value = [];
    subgrupos.value = [];
    productos.value = [];
    emit('actualizar');
    emit('cerrar');
   
  }catch(err){
    console.error("Error en aceptar() ",err);
  }
};

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
    min-height: 310px;
    overflow: auto;
    border: 1px solid #ccc;
    display: inline-block; 
}
.tabla th {
    border-bottom: 1px solid #ccc;
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