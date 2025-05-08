<template>
    <div v-if="mostrar">
        <vue-draggable-resizable :w="460" :h="520" :x="window.innerWidth / 2 - 220" :y="window.innerHeight / 2 - 300" :resizable="false" class="custom-draggable">
            <div class="internal-frame">
                <div class="header">
                Asignar Modificador
                <button class="close-btn" @click="$emit('cerrar'); limpiarCampos()">X</button>
            </div>
            <div class="content">
            <!-- Inputs y botones arriba -->
            <div class="right-panel">

                <div class="button-group">
                <button @click="addGrupoModProd()" class="button">Guardar</button>
                <button @click="delGrupoModProd()" class="button">Eliminar</button> 
                <button @click="limpiarCampos()" class="button">Limpiar</button>
                </div>

                <div class="input-frame">
                <div class="input-row">
                    <label>Clave</label>
                    <input v-model="claveMod" type="number" class="input-tabla input-mediano" readonly/>
                </div>
                <div class="input-row">
                    <label>Grupo Modificador</label>
                    <select v-model="tipo" class="input-tabla input-mediano">
                        <option v-for="grupoMod in gruposModificadores" :key="grupoMod.idgrupomod">
                            {{ grupoMod.nombre }}
                        </option>
                    </select>
                </div>
                </div>
            </div>

            <!-- Tabla debajo -->
            <div class="tabla-wrapper" style="margin-top: 20px;">
                <table class="tablaUsuarios">
                <thead>
                    <tr>
                    <th>IdAsig</th>
                    <th>Clave</th>
                    <th>Descripción</th>
                    <th>Modif. maximo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="grupoAnadido in gruposAnadidos" :key="grupoAnadido.idgrupomod" @dblclick="seleccionarModProd(grupoAnadido)">
                    <td>{{ grupoAnadido.idasignacion }}</td>
                    <td>{{ grupoAnadido.idgrupomod }}</td>
                    <td>{{ grupoAnadido.nombre }}</td>
                    <td>{{ grupoAnadido.modificadoresmax }}</td>
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
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import {supabase} from "@/supabase/supabase";
import { claveProducto, gruposModificadores, cargarGruposModif } from "@/store/auth.js";


const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar","actualizado"]);
const window = ref(globalThis.window);
const claveMod = ref(null);
const tipo = ref(null);
const gruposAnadidos = ref([]);


const seleccionarModProd = async (grupoAnadido) => {
    claveMod.value = grupoAnadido.idasignacion;
    //tipo.value = obtenerNombreGrupoMod(grupoAnadido.idgrupmod);
    console.log(claveMod.value,' y ',tipo.value);
    
};

const addGrupoModProd = async () => {
    await selecGrupoMod();
    const grupoModi = arraySelecGrupoMod.value.find(u => u.nombre === tipo.value);
    
    const { data: data,error } = await supabase
        .from('prodgrupmodificador')
        .select();
    if(error){
        console.error("Error al obtener uniones de producto y grupo modificador", error);
    }

    const existe = data.find(u => u.idprodgrupmod === claveMod.value);

    if(existe){
        const { data: dataUp, error: errorUp } = await supabase 
        .from('prodgrupmodificador')
        .update({
            idgrupmod: grupoModi.idgrupmod
        })
        .eq("idprodgrupmod", claveMod.value);

        if(errorUp){
            console.error("Error al actualizar conexcion con grupo modficador", errorUp);
        }else{
            console.log("Modificador unido y actualziado correctamente");
            tipo.value = null;
            await cargarGruposAsignados();
            await cargarGruposModif();
            emit('actualizado');
        }
    }else{
        const {data: dataAgg, error: errorAgg } = await supabase
        .from('prodgrupmodificador')
        .insert({
            idproducto: claveProducto.value,
            idgrupomod: grupoModi.idgrupomod
        })
        .select();

        if(errorAgg){
            console.error("Error al unir grupo modificador",errorAgg);
        }else{
            console.log("Modificador unido correctamente");
            await cargarGruposAsignados();
            await cargarGruposModif();
            claveMod.value = dataAgg[0].idprodgrupmod;
            emit('actualizado');
        }
    }   
};


const delGrupoModProd = async () => {
    const { data: dataDel, error: errorDel } = await supabase
        .from('prodgrupmodificador')
        .delete()
        .eq('idprodgrupmod', claveMod.value);

    if(errorDel){
        console.error("Error al eliminar union de modificador", errorDel);
    }else{
        console.log("Union eliminada correctamente");
        await cargarGruposModif();
        await cargarGruposAsignados();
        limpiarCampos();
        emit('actualizado');
    }
};

const cargarGruposAsignados = async () => {
  try {
    const productoId = claveProducto.value;
    
    // Consulta que une la tabla intermedia con la tabla de grupos modificadores
    const { data, error } = await supabase
      .from('prodgrupmodificador')
      .select(`
        idprodgrupmod,
        idgrupomod,
        grupomodificador!inner(nombre, modificadoresmax)
      `)
      .eq('idproducto', productoId);
    
    if (error) {
      throw new Error(`Error al obtener grupos asignados: ${error.message}`);
    }
    
    // Formateamos los datos para tener una estructura plana
    const gruposFormateados = data.map(item => ({
      idasignacion: item.idprodgrupmod,          // ID de la tabla intermedia
      idgrupomod: item.idgrupomod,    // ID del grupo modificador
      nombre: item.grupomodificador.nombre,
      modificadoresmax: item.grupomodificador.modificadoresmax
    }));
    
    // Asignamos a la variable reactiva
    gruposAnadidos.value = gruposFormateados;
    
    console.log(`Cargados ${gruposFormateados.length} grupos asignados al producto`);
    
  } catch (error) {
    console.error("Error al cargar grupos asignados:", error);
    gruposAnadidos.value = [];
  }
};


const arraySelecGrupoMod = ref(null);
const selecGrupoMod = async () => {
    const { data, error } = await supabase
        .from('grupomodificador')
        .select();

    if(error){
        console.error("Error al obtener grupos modificadores".error);
    }else{
        arraySelecGrupoMod.value = data;
    }
};






const limpiarCampos = () => {
    claveMod.value = null;
    tipo.value = null;
};

watch(claveProducto, (newValue) => {
  if (newValue !== null && newValue !== undefined) {
    console.log('ID del producto disponible:', newValue);
    cargarGruposAsignados();
  }
}, { immediate: true });


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
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.button-group {
    display: flex;
    justify-content: space-between;

    margin-bottom: 20px;
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
    width: 100%;
    max-width: 260px;
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
    max-height: 190px;
    overflow: auto;
    border: 1px solid #ccc;
    margin-top: 20px;
}

.tablaUsuarios {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    cursor: pointer;
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
    width: 30px;
}

.tablaUsuarios th:nth-child(2) {
    width: 100px;
}

.tablaUsuarios th:nth-child(3) {
    width: 60px;
}

button {
    width: 133px;
    padding: 5px 10px;
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

.agregar-producto {
    font-size: 16px;
}
</style>
