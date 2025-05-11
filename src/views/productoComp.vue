<template>
    <div v-if="mostrar">
      <vue-draggable-resizable 
        :w="540" 
        :h="570" 
        :x="window.innerWidth / 2 - 300" 
        :y="window.innerHeight / 2 - 330" 
        :resizable="false"
        class="custom-draggable"
      >
        <div class="internal-frame">
          <div class="header">
            Producto compuesto
            <button class="close-btn" @click="$emit('cerrar')">X</button>
          </div>
          <div class="content">

            <h2 class="section-title">Grupos de modificadores</h2>
  
            <div class="button-group">
              
              <button  @click="abrirAsignarMod()" class="button">Asignar</button>
              <button  @click="abrirEditarGrupo()" class="button">Editar</button>
            </div>
  
            <div class="tabla-wrapper">
                <table class="tablaProductos1">
                    <thead>
                    <tr>
                        <th>Clave</th>
                        <th>Descripción</th>
                        <th>Modificadores máx.</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr v-for="grupoAnadido in gruposAnadidos" :key="grupoAnadido.idgrupomod">
                        <td>{{ grupoAnadido.idgrupomod }}</td>
                        <td>{{ grupoAnadido.nombre }}</td>
                        <td>{{ grupoAnadido.modificadoresmax }}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
  
            <h2 class="section-title">Modificadores de productos</h2>
  
            <div class="button-group">
            
              <button @click="abrirEditarModProd()" class="button">Editar</button>
            </div>
  
            <div class="tabla-wrapper">
  <table class="tablaProductos2">
    <thead>
            <tr>
                <th>Clave</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Grupo</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="modifi in modificadores" :key="modifi.idmodificador">
                <td>{{ modifi.idmodificador }}</td>
                <td>{{ modifi.nombre }}</td>
                <td>{{ modifi.precio }}</td>
                <td>{{ obtenerNombreGrupoMod(modifi.idgrupomod) }}</td>
            </tr>
            </tbody>
        </table>
        </div>
  
          </div>
        </div>
      </vue-draggable-resizable>
    </div>
    
    <editarGrupo :mostrar="mostrarEditarGrupo" @cerrar="mostrarEditarGrupo = false" @actualizado="actualizarDespuesDeEditar()" />
    
    <editarModProd :mostrar="mostrarEditarModProd" @cerrar="mostrarEditarModProd = false" @actualizado="actualizarDespuesDeEditar()" />

    <asignarMod :mostrar="mostrarAsignarMod" @cerrar="mostrarAsignarMod = false" @actualizado="actualizarDespuesDeEditar()"/>
  </template>
  
  <script setup>
  import { defineEmits, defineProps, ref, onMounted, watch } from "vue";
  import { supabase } from "../supabase/supabase.js";
  import VueDraggableResizable from "vue-draggable-resizable";
  import "vue-draggable-resizable/style.css";
  import editarGrupo from "./ProductosCompuestos/editarGrupoModificador.vue";
  import editarModProd from "./ProductosCompuestos/editarModProd.vue";
  import asignarMod from "./ProductosCompuestos/asignarMod.vue";
  import { cargarGruposModif, claveProducto } from "../store/auth.js";

  const props = defineProps(["mostrar"]);
  const emit = defineEmits(["cerrar"]);
  const window = ref(globalThis.window);
  const mostrarAggGrupo = ref(false);
  const mostrarEditarGrupo = ref(false);
  const mostrarAggModProd = ref(false);
  const mostrarEditarModProd = ref(false);
  const mostrarAsignarMod = ref(false);

  const gruposAnadidos = ref([]);

  // Abrir Agg grupos
const abrirAggGrupo = () => {
  mostrarAggGrupo.value = true;
};

  // Abrir editar grupos
  const abrirEditarGrupo = () => {
  mostrarEditarGrupo.value = true;
};

  // Abrir editar grupos
  const abrirAggModProd = () => {
  mostrarAggModProd.value = true;
};

  // Abrir editar grupos
  const abrirEditarModProd = () => {
  mostrarEditarModProd.value = true;
};


  // Abrir asignar
  const abrirAsignarMod = async () => {
  mostrarAsignarMod.value = true;
  await cargarGruposModif();
};

const actualizarDespuesDeEditar = () => {
  console.log("Actualizando datos después de edición...");
  cargarGruposAsignados();
  obtenerModificadores();
};

const cargarGruposAsignados = async () => {
  try {
    const productoId = claveProducto.value;
    
    // Consulta que une la tabla intermedia con la tabla de grupos modificadores
    const { data, error } = await supabase
      .from('prodgrupmodificador')
      .select(`
        grupomodificador!inner(*)
      `)
      .eq('idproducto', productoId);
    
    if (error) {
      throw new Error(`Error al obtener grupos asignados: ${error.message}`);
    }
    
    gruposAnadidos.value = data.map(item => item.grupomodificador);
   
  
    
  } catch (error) {
    console.error("Error al cargar grupos asignados:", error);
    gruposAnadidos.value = [];
  }
};

  const obtenerNombreGrupoMod = (idgrupomod) =>{
    const mod = gruposAnadidos.value.find(g => g.idgrupomod === idgrupomod);
    return mod ? mod.nombre : 'Sin grupo modificador';
  };

const modificadores = ref([]);
const obtenerModificadores = async () => {
  const { data: dataMod, error: errorMod } = await supabase 
      .from('modificadores')
      .select();

  if(errorMod){
      console.error("Error al obtener modificadores ",errorMod);
  }else{
      modificadores.value = dataMod;
  }
};


watch(claveProducto, (newValue) => {
  if (newValue !== null && newValue !== undefined) {
    console.log('ID del producto disponible:', newValue);
    cargarGruposAsignados();
  }
}, { immediate: true });

onMounted(() => {
  cargarGruposAsignados();
  obtenerModificadores();
});

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
    padding-left: 20px;
    text-align: left;
  }
  
  .section-title {
    padding-top: 10px;
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
    background-color: rgb(130, 165, 243);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
  }

  .button:hover {
    background-color: rgb(105, 133, 194);
}

  
  .tabla-wrapper {
  width: 500px;
  max-height: 150px;
  min-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding-right: 4px;
  margin-bottom: 20px;
  display: inline-block;
}
  
  .tablaProductos1, .tablaProductos2 {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }

  .tablaProductos1 th:nth-child(3),
.tablaProductos1 td:nth-child(3) {
  width: 160px;
}
  

.tablaProductos1 th, .tablaProductos2 th,
.tablaProductos1 td, .tablaProductos2 td {
    padding: 5px;
    padding-left: 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;
  }
  
  .tablaProductos1 thead th, .tablaProductos2 thead th {
    position: sticky;
    top: 0;
    background-color: #e7e7e7;
    z-index: 1;
  }
  </style>
  