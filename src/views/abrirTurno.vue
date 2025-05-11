<template>
  <div v-if="mostrar">
    <div v-if="alertaVisible" role="alert" class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>¡Turno registrado correctamente!</span>
    </div>

    <vue-draggable-resizable 
      :w="280" 
      :h="195" 
      :x="window.innerWidth / 2 - 150" 
      :y="window.innerHeight / 2 - 170" 
      :resizable="false"
      class="custom-draggable"
    >
      <div class="internal-frame">
        <div class="header">
          Abrir turno
          <button class="close-btn" @click="$emit('cerrar')">X</button>
        </div>
        <div class="content">
          <p>Efectivo en caja:</p>
          <input v-model="montoInicial" type="number" placeholder="$0.00" class="border-2 w-[295px] mt-4" />
          <div class="button-group">
            <button @click="confirmar" class="button">Confirmar</button>
            <button @click="$emit('cerrar')" class="cancel-btn">Cancelar</button>
          </div>
        </div>
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script setup>
import { supabase } from "@/supabase/supabase";
import { defineEmits, defineProps, ref } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import { userLogin, turno, obtenerTurno,idTurno, numPedidos} from "@/store/auth.js";

// Props y eventos
const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);

// Variables
const montoInicial = ref(null);
const alertaVisible = ref(false);
const window = ref(globalThis.window);

// Fecha y Hora en formato correcto
const now = new Date();
const fecha = ref(now.toISOString().split("T")[0]);
const hora = ref(now.toTimeString().split(" ")[0]);

const confirmar = async () => {
  await obtenerTurno();

  if (turno.value) {
    console.log("Ya hay un turno abierto");
    return;
  }
  if (montoInicial.value === null){
    console.log("Debes de ingresar fondo inicial");
    return;
  }
  const { data, error } = await supabase.from("turnos").insert([
    {
      idusuario: userLogin.value,
      fecha: fecha.value,
      horaapertura: hora.value,
      montoinicial: montoInicial.value,
    },
  ]);

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  await obtenerTurno();
  turno.value = true;

  numPedidos.value = 1;
  emit("turnoAbierto");
  emit("cerrar");
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
  background-color: #82a5f3;
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
