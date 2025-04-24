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
                        <th>Usuario</th>
                        <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="usuario in usuarios" :key="usuarios.idusuario">
                        <td>{{ usuario.idusuario }}</td>
                        <td>{{ usuario.userName }}</td>
                        <td>{{ usuario.rol }}</td>
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
                <button @click="aggUsuario" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white" >Guardar</button>
                <button @click="delUsuario" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Eliminar</button>
                <button @click="limpiarCampos" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Limpiar</button>
            </div>


            <div class="input-frame">
                <div class="input-row">
                    <label>Clave</label>
                    <input v-model="clave" type="number" class="input-tabla input-chico" />
                </div>
                <div class="input-row">
                    <label>Nombre</label>
                    <input v-model="nombre" type="text" class="input-tabla" />
                </div>
                <div class="input-row">
                    <label>Tipo</label>
                    <input v-model="tipo" type="text" class="input-tabla input-mediano" />
                </div>
                <div class="input-row">
                    <label>Contraseña</label>
                    <input v-model="password" type="password" class="input-tabla" />
                </div>
                <div class="input-row">
                    <label>Usuario</label>
                    <input v-model="usuario" type="text" class="input-tabla input-mediano" />
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
import { defineProps, defineEmits, ref, onMounted } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import {supabase} from "@/supabase/supabase";


//Inputs
const clave = ref(null);
const nombre = ref(null);
const tipo = ref(null);
const password = ref(null);
const usuario = ref(null);

const usuarios = ref([]);

const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);

const window = ref(globalThis.window);

const cargarUsuarios = async () => {
    const { data, error } = await supabase
    .from('usuarios')
    .select()

    if (error) {
        errorMsg.value = ('Error al cargar usuarios: ' + error.message);
    } else {
        usuarios.value = data;
    }
}

const limpiarCampos = () => {
    clave.value = null;
    nombre.value = null;
    tipo.value = null; 
    password.value = null;
    usuario.value = null;
}

const delUsuario = async () => {
    if(clave.value === null){
        console.error("Llena el campo clave");
    }else{
        const { data, error } = await supabase
        .from("usuarios")
        .select();

        const existe = data.find(u => u.idusuario === clave.value);
        if(existe){
            const {datadel,errordel} = await supabase
                .from("usuarios")
                .delete()
                .eq("idusuario",clave.value);
            if(error){
                console.error("Erroal eliminar el usuario", errordel); //Cambiar por alert
            }else{
                console.log("Usuario eliminado correctamente");
                await cargarUsuarios();
                limpiarCampos();
            }
        }else{
            console.error("No existe un usuario con esa clave");
        }

    }
}


const aggUsuario = async () => {
  // Primero obtenemos todos los usuarios
  
  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select();

  if (error) {
    console.error("Error al obtener usuarios: ", error);
    return;
  }

  // Buscamos si ya existe un usuario con el id 'clave'
  const existe = usuarios.find(u => u.idusuario === clave.value); // <- clave es un ref

  if (existe) {
    // Actualizamos
    const { data: dataUp, error: errorUp } = await supabase
      .from("usuarios")
      .update({
        name: nombre.value,
        password: password.value,
        rol: tipo.value,
        userName: usuario.value
      })
      .eq("idusuario", clave.value);

    if (errorUp) {
      console.error("Error al actualizar: ", errorUp);
    } else {
      console.log("Usuario actualizado correctamente");
      await cargarUsuarios();
    }
  } else {
    // Insertamos
    const { data: dataAgg, error: errorAg } = await supabase
      .from("usuarios")
      .insert([{
        name: nombre.value,
        password: password.value,
        rol: tipo.value,
        userName: usuario.value
      }])
      .select(); // <- para obtener el ID generado

    if (errorAg) {
      console.error("Error al agregar usuario", errorAg);
    } else {
      console.log("Usuario agregado:", dataAgg[0]);
      await cargarUsuarios();
      clave.value = dataAgg[0].idusuario; // <- guardamos el ID generado
    }
  }
};

onMounted(() => {
  cargarUsuarios();
})


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
    padding-top: 10px;
    
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
    max-height: 310px;
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
