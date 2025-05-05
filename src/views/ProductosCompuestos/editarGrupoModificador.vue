<template>
    <div v-if="mostrar">
        <vue-draggable-resizable :w="750" :h="320" :x="window.innerWidth / 2 - 450" :y="window.innerHeight / 2 - 280" :resizable="false" class="custom-draggable">
        <div class="internal-frame">
            <div class="header">Editar grupos modificadores
                <button class="close-btn" @click="$emit('cerrar')">X</button>
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
                                <th>Descripción</th>
                                <th>Modif. maximo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="grupoMod in gruposModificadores" :key="grupoMod.idgrupmod" >
                                <td>{{ grupoMod.idgrupomod }}</td>
                                <td>{{ grupoMod.nombre }}</td>
                                <td>{{ grupoMod.modificadoresmax }}</td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </div>
  
            <!-- Panel derecho -->
            <div class="right-panel">
            <div class="agregar-producto">
            </div>
  
            <div class="button-group">
                <button @click="" class="button" >Guardar</button>
                <button @click="" class="button">Eliminar</button>
                <button @click="" class="button">Limpiar</button>
            </div>
  
  
            <div class="input-frame">
                <div class="input-row">
                    <label>Clave</label>
                    <input v-model="clave" type="number" class="input-tabla input-mediano" />
                </div>
                <div class="input-row">
                    <label>Descripción</label>
                    <input v-model="descripcion" type="text" class="input-tabla" />
                </div>
                <div class="input-row">
                    <label>Modificador maximo</label>
                    <input v-model="modifmax" type="number" class="input-tabla input-mediano" />
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
  import { supabase } from "@/supabase/supabase";
  import { defineEmits, defineProps, ref, onMounted } from "vue";
  import VueDraggableResizable from "vue-draggable-resizable";
  import "vue-draggable-resizable/style.css";
  


  // Props y eventos
  const props = defineProps(["mostrar"]);
  const emit = defineEmits(["cerrar"]);
  
  // Variables
  const window = ref(globalThis.window);
  
  const clave = ref(null);
  const descripcion = ref(null);
  const modifMax = ref(null);
  const gruposModificadores = ref([]);

  const cargarGruposModif = async () => {
    const { data: dataGrupos, error: errorGrupos } = await supabase
        .from('grupomodificador')
        .select();
    
    if(errorGrupos){
        console.error("Error al obtener Grupos Modificadores", errorGrupos);
    }else{
        gruposModificadores.value = dataGrupos;
    }
  };

  const obtenerGruposMod = (grupoMod) => {
    clave.value = grupoMod.idgrupmod;
    descripcion.value = grupoMod.nombre;
    modifMax.value = grupoMod.modificadoresmax;
  };



  onMounted(() => {
    cargarGruposModif();
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
      padding: 20px;
      flex-grow: 1;
  }
  
  .main-grid {
      display: flex;
      height: 100%;
  }
  
.left-panel {
    flex: 1.5;
    padding-right: 10px;
}

  .right-panel {
      flex: 1.5;
      display: flex;
      flex-direction: column;
      padding-left: 18px;
      padding-top: 15px;
  
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
      max-height: 270px;
      overflow: auto;
      border: 1px solid #ccc;
      display: inline-block;
  }
  
  .tablaUsuarios {
      border-collapse: collapse;
      table-layout: fixed;
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
      width: 80px;
  }
  .tablaUsuarios th:nth-child(2) {
      width: 200px;
  }
  .tablaUsuarios th:nth-child(3) {
      width: 140px;
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
  
  select.input-tabla {
    border: 1px solid #b6b6b6;
    border-radius: 4px;
    color: #000000;
    cursor: pointer;
  }
  
  
  
  </style>