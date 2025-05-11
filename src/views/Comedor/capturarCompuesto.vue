<template>
  <div v-if="mostrar">
    <div v-if="alertaVisible" role="alert" class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>¡Turno registrado correctamente!</span>
    </div>

    <vue-draggable-resizable 
      :w="480" 
      :h="395" 
      :x="window.innerWidth / 2 - 150" 
      :y="window.innerHeight / 2 - 170" 
      :resizable="false"
      class="custom-draggable"
    >
      <div class="internal-frame">
        <button class="close-btn" @click="$emit('cerrar')">X</button>
        <div class="content">
          <p>modificadores</p>
          
          <div class="button-group">
            <label>Grupos</label>
            <button v-for="grupModificador in grupModifcadores" :key="grupModificador.idgrupomod" @click="cargarModificadores(grupModificador.idgrupomod)" >
                    {{ grupModificador.nombre }}
                </button>
                <div class="group-buttons">
                <button v-for="modificador in modificadores" :key="modificador.idmodificador" @click="agregarModificador()">
                    {{ modificador.nombre }}
                </button>
                 
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
import { idProducto} from "@/store/auth.js";

// Props y eventos
const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);

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



async function agregarModificador(){
    console.log("Modificador antes ",modMaximo.value);
    modMaximo.value --;
    console.log("Modificador despues ",modMaximo.value);
    
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
  justify-content: space-between;
  margin-top: 25px;
  margin-left: 20px;
  margin-right: 33px;
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
    border: 1px solid #b4b4b4;
    border-radius: 4px;
    }
</style>
