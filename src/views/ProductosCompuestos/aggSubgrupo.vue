<template>
    <div v-if="mostrar">
        <vue-draggable-resizable :w="460" :h="520" :x="window.innerWidth / 2 - 220" :y="window.innerHeight / 2 - 300" :resizable="false" class="custom-draggable">
            <div class="internal-frame">
                <div class="header">
                Administrar subgrupos
                <button class="close-btn" @click="$emit('cerrar')">X</button>
            </div>
            <div class="content">
            <!-- Inputs y botones arriba -->
            <div class="right-panel">
                <div class="agregar-producto">
                <span>Agregar nuevo subgrupo:</span>
                </div>

                <div class="button-group">
                <button @click="aggSubGrupo()" class="button">Guardar</button>
                <button @click="delSubGrupo()" class="button">Eliminar</button>
                <button @click="limpiarCampos()" class="button">Limpiar</button>
                </div>

                <div class="input-frame">
                <div class="input-row">
                    <label>Clave</label>
                    <input v-model="clave" type="number" class="input-tabla input-mediano" />
                </div>
                <div class="input-row">
                    <label>Descripción</label>
                    <input v-model="nombre" type="text" class="input-tabla" />
                </div>
                <div class="input-row">
                    <label>Grupo</label>
                    <select v-model="tipo" class="input-tabla input-mediano">
                        <option v-for="grupo in grupos" :key="grupo.idgrupo">
                            {{ grupo.nombre }}
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
                    <th>Clave</th>
                    <th>Descripción</th>
                    <th>Grupo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="subGrupo in subGrupos" :key="subGrupo.idsubgrupo" @dblclick="seleccionarSubGrupo(subGrupo)">
                    <td>{{ subGrupo.idsubgrupo }}</td>
                    <td>{{ subGrupo.nombre }}</td>
                    <td>{{ obtenerNombreGrupo(subGrupo.idgrupo) }}</td>
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
import { defineProps, defineEmits, ref, onMounted } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import {supabase} from "@/supabase/supabase";




const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);
const window = ref(globalThis.window);
const clave = ref(null);
const nombre = ref(null);
const tipo = ref(null);
const subGrupos = ref([]);
const grupos = ref([]);

const limpiarCampos = () => {
    clave.value = null;
    nombre.value = null;
    tipo.value = null;
};

const cargarSubGrupos = async () => {
    const { data: dataConsult, error: errorConsult } = await supabase
        .from('subgrupos')
        .select();
    
    if(errorConsult){
        console.error("Error al cargar subgrupos", errorConsult);
    }else{
        subGrupos.value = dataConsult;
    }
};

const cargarGrupos = async () => {
    const { data: dataConsultGrupos, error: errorConsultGrupos } = await supabase
        .from('grupos')
        .select();
    
    if(errorConsultGrupos){
        console.error("Error al cargar grupos", errorConsultGrupos);
    }else{
        grupos.value = dataConsultGrupos;
    }
};

const aggSubGrupo = async () => {
    await cargarSubGrupos();
    await cargarGrupos();

    const existe = subGrupos.value.find(u => u.idsubgrupo === clave.value);
    const grupo = grupos.value.find(u => u.nombre === tipo.value);

    if(existe){
        const { data: dataUp, error: errorUp } = await supabase
            .from('subgrupos')
            .update({
                nombre: nombre.value,
                idgrupo: grupo.idgrupo
            })
            .eq('idsubgrupo', clave.value);
        
        if(errorUp){
            console.error("Erro al actualizar subgrupo");
        }else{
            console.log("SubGrupo actualizado correctamente");
            await cargarSubGrupos();
        }
    }else{
        const { data: dataAgg, erro: errorAgg } = await supabase
            .from('subgrupos')
            .insert([{
                nombre: nombre.value,
                idgrupo: grupo.idgrupo
            }])
            .select();

        if(errorAgg){
            console.error("Error al agregar subgrupo", errorAgg);
        }else{
            console.log("Subgrupo agregado correctamente");
            clave.value = dataAgg[0].idsubgrupo;
            await cargarSubGrupos();
        }
    }
};

const delSubGrupo = async () =>{
    const { data: dataDel, error: errorDel} = await supabase
        .from('subgrupos')
        .delete()
        .eq('idsubgrupo',clave.value);

    if(errorDel){
        console.error("Error al eliminar subgrupo", errorDel);
    }else{
        console.log("Subgrupo eliminado correctamente");
        await cargarSubGrupos();
        limpiarCampos();
    }
};

const obtenerNombreGrupo = (idgrupo) => {
  const grupo = grupos.value.find(g => g.idgrupo === idgrupo)
  return grupo ? grupo.nombre : 'Sin grupo'
}

const seleccionarSubGrupo = (subgrupo) => {
    clave.value = subgrupo.idsubgrupo;
    nombre.value = subgrupo.nombre;
    tipo.value = obtenerNombreGrupo(subgrupo.idgrupo);
};

onMounted(() => {
    cargarGrupos();
    cargarSubGrupos();
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
    margin-top: 15px;
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
    width: 30px;
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
