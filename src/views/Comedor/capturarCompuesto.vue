<template>
  <div v-if="mostrar">
    <vue-draggable-resizable 
      :w="500" 
      :h="500" 
      :x="window.innerWidth / 2 - 270" 
      :y="window.innerHeight / 2 - 330" 
      :resizable="false"
      class="custom-draggable">
      <div class="internal-frame">
        <div class="header">
          Captura productos compuestos
          <button class="close-btn" @click="$emit('cerrar')">X</button>
        </div>

        <div class="content">
          <p class="mod">Modificadores</p>
          <div class="grupo-modificador-wrapper">
  <label>Grupos</label>
  <div class="group-buttons">
    <button 
      v-for="(grupo, index) in grupModifcadores" 
      :key="grupo.idgrupomod" 
      @click="mostrarGrupo(index)">
      {{ grupo.nombre }}
    </button>
  </div>

  <div v-if="modificadores?.length">
    <label class="modificadores-label">Modificadores de productos</label>
    <div class="modificadores-buttons">
      <button 
        v-for="modificador in modificadores" 
        :key="modificador.idmodificador" 
        @click="agregarModificador(modificador.idmodificador)">
        {{ modificador.nombre }}
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
import { supabase } from "@/supabase/supabase";
import { defineEmits, defineProps, nextTick, ref, watch } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import { idProducto, idModificador} from "@/store/auth.js";

// Props y eventos
const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar","actualizar"]);

// Variables
const montoInicial = ref(null);
const alertaVisible = ref(false);
const window = ref(globalThis.window);

const grupModifcadores = ref([]);
// Fecha y Hora en formato correcto
async function cargarGruposModificadores() {
  const { data, error } = await supabase
    .from('prodgrupmodificador')
    .select(`
      idprodgrupmod,
      idgrupomod,
      grupomodificador (
        nombre,
        modificadoresmax
      )
    `)
    .eq('idproducto', idProducto.value);

  if (error) {
    console.error("Error gruposmod ", error);
    return;
  }

  const gruposFormateados = data.map(item => ({
    idgrupomod: item.idgrupomod,
    nombre: item.grupomodificador?.nombre ?? '',
    modificadoresmax: item.grupomodificador?.modificadoresmax ?? 0
  }));

  grupModifcadores.value = gruposFormateados;
  cantidadgrupMod.value = grupModifcadores.value.length;
  modMaximo.value = grupModifcadores.value[0].modificadoresmax;
  await nextTick()
  cargarModificadores();
  


  console.log(grupModifcadores.value.length);
  
};
const modificadores = ref(null);
const cantidadgrupMod = ref(0);
const contadorgrup = ref(0);
const modMaximo = ref(0);

async function cargarModificadores() {
    if(contadorgrup.value === cantidadgrupMod.value){
        emit('cerrar');
        return;
    }
    const { data, error } = await supabase
        .from('modificadores')
        .select()
        .eq('idgrupomod', grupModifcadores.value[contadorgrup.value].idgrupomod);
    if(error){
        console.error("Error al obtener modificadores ", error);
        return;
    }
    console.log("Asi va el contadotr de grupos: ",contadorgrup.value);
    
    modificadores.value = data;
    
    const{ data: data2, error: error2 } = await supabase
        .from('grupomodificador')
        .select()
        .eq('idgrupomod', grupModifcadores.value[contadorgrup.value].idgrupomod);
    if(error2){
        console.error("Error al obtener grupoMod ",error2);
        return;
    }

    modMaximo.value = data2[0].modificadoresmax;
    
    
}

async function agregarModificador(idmodificador){
    console.log("Modificador antes ",modMaximo.value);
    modMaximo.value --;
    console.log("Modificador despues ",modMaximo.value);
    idModificador.value = idmodificador;
    emit("actualizar");
    if(modMaximo.value === 0){
        contadorgrup.value ++;
        cargarModificadores();
    }
};


watch(idProducto, (newValue) => {
        if (newValue !== null && newValue !== undefined) {
            cargarGruposModificadores();
                      
        }
    }, { immediate: true });


//nuevo

const grupoSeleccionadoId = ref(null);

function mostrarGrupo(index) {
  grupoSeleccionadoId.value = grupModifcadores.value[index].idgrupomod;
  contadorgrup.value = index; // para mantener compatibilidad con tu lógica
  cargarModificadores();
}

watch(() => props.mostrar, async (visible) => {
  if (visible) {
    // Se abrió: cargar datos
    await cargarGruposModificadores();
  } else {
    // Se cerró: limpiar después de un pequeño delay
    setTimeout(() => {
      grupModifcadores.value = [];
      modificadores.value = null;
      cantidadgrupMod.value = 0;
      contadorgrup.value = 0;
      modMaximo.value = 0;
      grupoSeleccionadoId.value = null;
      montoInicial.value = null;
      alertaVisible.value = false;
    }, 200); // pequeño delay para evitar conflicto visual
  }
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
/* Estilos para eliminar líneas punteadas de vue-draggable-resizable */
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

.vue-draggable-resizable .handle-tl,
.vue-draggable-resizable .handle-tr,
.vue-draggable-resizable .handle-bl,
.vue-draggable-resizable .handle-br {
  display: none !important;
}

.internal-frame {
  outline: none;
  position: fixed;
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
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.button-group {
  display: flex;

  gap: 10px;
  margin-top: 10px;
  margin-bottom: 30px;
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

.cancel-btn {
  background-color: rgb(126 ,126, 126);
}

.cancel-btn:hover {
    background-color: rgb(92, 92, 92);
}

input {
    padding-left: 10px;
    padding: 5px;
    border: 1px solid #6b1616;
    border-radius: 4px;
    }

.grupo-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Modificadores en fila */
.group-buttons-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.grupo-modificador-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
}

.group-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.modificadores-label {
  margin-top: 15px;
  font-size: 15px;
  color: #333;
}

.modificadores-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.mod{
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
