<template>
    <div v-if="mostrar">
        <vue-draggable-resizable 
            :w="480" 
            :h="480" 
            :x="window.innerWidth / 2 - 280" 
            :y="window.innerHeight / 2 - 300" 
            :resizable="false"
            class="custom-draggable"
            >
      <div class="internal-frame">
        <div class="header">
          Agregar clientes
          <button class="close-btn" @click="$emit('cerrar'); limpiarCampos()">X</button>
        </div>
        <div class="content">

          <div class="top-bar">
            <div class="search-section">
              <label>Buscar:</label>
              <input v-model="buscar" type="text" class="search-input" placeholder="# Tel, Nombre" />
            </div>
            <div class="top-buttons">
              <button class="button" @click="searchCliente()">Buscar</button>
              <button class="button" @click="aggCliente();">Agregar</button>
            </div>
          </div>

          <!-- Datos del cliente -->
          <div class="bordered-box form-box">
            <div class="input-row">
              <label>Contacto:</label>
              <input v-model="nombre" type="text" class="input-control" />
            </div>
            <div class="input-row">
              <label>Teléfono:</label>
              <input v-model="telefono" type="number" class="input-chico" />
            </div>
            <div class="input-row">
              <label>Calle:</label>
              <input v-model="calle" type="text" class="input-control" />
            </div>
            <div class="input-row">
              <label>Colonia:</label>
              <input v-model="colonia" type="text" class="input-control" />
            </div>
            <div class="input-row">
              <label>Número:</label>
              <input v-model="numCasa" type="number" class="input-chico" />
            </div>
            <div class="input-row">
            <label>Cruzamientos:</label>
            <div class="input-group">
              <input v-model="cruzamiento1" type="text" class="input-control" />
              <span class="separador">Y</span>
              <input v-model="cruzamiento2" type="text" class="input-control" />
            </div>
          </div>
            <div class="input-row">
              <label>Referencias:</label>
              <input v-model="referencias" type="text" class="input-control" />
            </div>
          </div>

          <!-- Botones finales -->
          <div class="button-group">
            <button @click=" abrirCuenta();limpiarCampos(); emit('cerrar')" class="button">Aceptar</button>
            <button class="cancel-btn">Cancelar</button>
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
import { supabase } from "@/supabase/supabase";
import { idCliente, idDireccion, idPedido, numPedidos, idTurno } from "@/store/auth.js";


const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar", "actualizado"]);
const window = ref(globalThis.window);


//Variables
const buscar = ref(null);
const nombre = ref(null);
const telefono = ref(null);
const calle = ref(null);
const colonia = ref(null);
const numCasa = ref(null);
const cruzamiento1 = ref(null);
const cruzamiento2 = ref(null);
const referencias = ref(null);
const clientes = ref([]);
const direccion = ref([]);



const limpiarCampos = () => {
  nombre.value = null;
  telefono.value = null;
  calle.value = null;
  colonia.value = null;
  numCasa.value = null;
  cruzamiento1.value = null;
  cruzamiento2.value = null;
  referencias.value = null;
};

const consultarDireccion = async (id) => {
  const { data, error } = await supabase
    .from('direcciones')
    .select()
    .eq('idcliente', id);

  if (error) {
    console.error("Error al obtener direcciones", error);
    return;
  }
  if (!data || data.length === 0) {
    // No hay direcciones: salimos limpiamente
    direccion.value   = {};
    idDireccion.value = null;
    return;
  }

  // ya hay al menos una
  direccion.value   = data[0];
  idDireccion.value = data[0].iddireccion;
};

const consultarCliente = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select();
  
  if(error){
    console.error("Error al obtener clientes");
    return;
  }else{
    clientes.value = data[0];
  }
};

async function searchCliente() {
  // 1. Comprueba que el término de búsqueda no esté vacío
  if (!buscar.value) {
    console.warn('Debes introducir un número o nombre para buscar');
    clientes.value = [];
    return;
  }

  // 2. Lanza la consulta
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .or(
      `numero.eq.${buscar.value},` +
      `nombre.eq.${buscar.value}`
    );

  // 3. Manejo de errores
  if (error) {
    console.error('Error al buscar clientes:', error);
    clientes.value = [];
    return;
  }

  // 4. Comprueba si no hay resultados
  if (!data || data.length === 0) {
    console.info('No se encontró ningún cliente con ese número o nombre.');
    telefono.value = buscar.value;
    buscar.value = null;
    clientes.value = [];
    return;
  }

  // 5. Asigna los resultados de forma segura
  

  // 6. Si solo te interesa el primero:
  const primero = data[0];
  console.log(
    'Primer cliente encontrado:',
    primero?.nombre,  // con ?. te aseguras de no leer “undefined.nombre”
    primero?.numero
  );

  
  await consultarDireccion(primero.idcliente);

 


  // 3. asignar tus refs de forma segura
  buscar.value = null
  nombre.value = primero.nombre
  telefono.value = primero.numero
  calle.value = direccion.value.calle
  colonia.value = direccion.value.colonia;
  numCasa.value = direccion.value.numcasa
  cruzamiento1.value = direccion.value.interseccion1
  cruzamiento2.value = direccion.value.interseccion2
  referencias.value  = direccion.value.referencias

  idCliente.value = primero.idcliente;
  idDireccion.value = direccion.iddireccion;

  

}


const aggCliente = async () =>{
  await consultarCliente();
  console.log(idCliente.value);
  
  if(idCliente.value){
    const { data: dataUp, error: errorUp } = await supabase
      .from('clientes')
      .update({
        nombre: nombre.value,
        numero: telefono.value
      })
      .eq('idcliente', idCliente.value);

    if(errorUp){
      console.error("Error al actualizar Cliente ",errorUp);
      return;
    }else{
      await consultarDireccion(idCliente.value);
      const { data: direccUp, error: errordirecUp } = await supabase
        .from('direcciones')
        .update({
          calle: calle.value,
          numcasa: numCasa.value,
          colonia: colonia.value,
          interseccion1: cruzamiento1.value,
          interseccion2: cruzamiento2.value,
          referencias: referencias.value
        })
        .eq('iddireccion', idDireccion.value);

      if(errordirecUp){
        console.error("Error al actualizar direccion de cliente ",errordirecUp);
        return;
      }else{
        console.log("Direccion actualizada correctamente");
      }
    }


  }else{
    const { data: dataAgg, error: errorAgg } = await supabase
    .from('clientes')
    .insert([{
      nombre: nombre.value,
      numero: telefono.value
    }])
    .select();

  if(errorAgg){
    console.error("Error al agregar cliente ",errorAgg);
    return;
  }else{
    console.log("Cliente agregado correctamente");
    idCliente.value = dataAgg[0].idcliente;
  
      const { data: direccAgg, error: errordirecAgg } = await supabase
        .from('direcciones')
        .insert([{
          idcliente: idCliente.value,
          calle: calle.value,
          numcasa: numCasa.value,
          colonia: colonia.value,
          interseccion1: cruzamiento1.value,
          interseccion2: cruzamiento2.value,
          referencias: referencias.value
        }])
        .select(    );

      if(errordirecAgg){
        console.error("Error al agregar direccion de cliente ",errordirecAgg);
        return;
      }else{
        console.log("Direccion agregada correctamente");
        idDireccion.value = direccAgg[0].iddireccion;
      }
    }
  
  }

};

const now = new Date();
    const fecha = ref(now.toISOString().split("T")[0]);
    const hora = ref(now.toTimeString().split(" ")[0]);



const abrirCuenta = async () => {
  const { data: dataPedidos, error: errorPedidos } = await supabase
    .from('pedidos')
    .select()
    .eq('abierto', true)
    .eq('tipo', 'Domicilio');

  if (errorPedidos) {
    console.error("Error al obtener pedidos ", errorPedidos);
    return;
  }

  const existe = dataPedidos.find(u => u.idcliente === idCliente.value);
  if (existe) {
    console.log("Ya existe una cuenta con ese cliente");
    return;
  }
console.log("🧪 Valores actuales:", {
  idTurno: idTurno.value,
  hora: hora.value,
  numPedidos: numPedidos.value,
  idCliente: idCliente.value
});
  // Verificar campos obligatorios antes de insertar
  if (!idTurno.value || !hora.value || !idCliente.value) {
    console.error("Campos obligatorios faltantes");
    return;
  }

  const { data, error } = await supabase
    .from('pedidos')
    .insert([{
      nombre: '', // si no aplica, está bien en blanco
      idturno: idTurno.value,         // ✅ .value extraído
      tipo: 'Domicilio',
      horaapertura: hora.value,      // ✅ .value extraído
      impreso: false,
      abierto: true,
      eliminado: false,
      numeropedido: (numPedidos.value + 1), // ✅ .value extraído
      idcliente: idCliente.value       // ✅ .value extraído
    }])
    .select();

  if (error) {
    console.error("❌ Error al crear pedido ", error);
    return;
  }

  console.log("✅ Cuenta creada");
  idPedido.value = data[0].idpedido;
  limpiarCampos();
   const { data: result, error: error2 } = await supabase.rpc('incrementar_total_notas', {
  turno_id: idTurno.value
  });

  if (error2) {
    console.error("❌ Error al aumentar pedidos", error2);
    return;
  }
  numPedidos.value = result;

  emit('actualizado');
  emit('cerrar');
};





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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 15px;
}
.button-group {
  display: flex;
  justify-content: center; 
  gap: 14px;
  align-items: center;
  padding-top: 5px;
}

button {
  width: 130px;
  height: 35px;
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
  background-color: rgb(126, 126, 126);
}

.cancel-btn:hover {
  background-color: rgb(92, 92, 92);
}

input {
  padding: 5px;
  border: 1px solid #bababa;
  border-radius: 4px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-buttons {
  display: flex;
  gap: 10px;
}

.bordered-box {
  border: 1px solid #b4b4b4;
  padding: 15px;
  border-radius: 10px;
}

.form-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-row label{
    width: 150px;
  
}

.input-control {
    width: 350px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #bababa;
}

.search-input {
  width: 100%;
}
.input-chico{
    width: 130px;
}

.input-group .input-control {
  width: 154px;
}
.input-group .separador {
  margin: 0 12px;
}
</style>
