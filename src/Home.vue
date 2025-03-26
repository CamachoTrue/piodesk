<template>
  <div class="home-container">
    <button @click="">Comedor</button>
    <button @click="">Domicilio</button>
    <button @click="">Retiro y <br> depósito</button>
    <button @click="">Consultar <br> citas</button>
    <button @click="abrirPestana()">Abrir turno</button>
    <button @click="PestanaCerrar()">Cerrar turno</button>
    <button @click="salir">Salir</button>
  </div>

  <div v-if="mostrarAlertaTurnoAbierto" class="alert-red">
    <div role="alert" class="alert alert-error shadow-lg w-55">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-semibold">Ya hay un turno abierto.</span>
    </div>
  </div>

  <div v-if="mostrarAlertaNoTurnoAbierto" class="alert-red2">
    <div role="alert" class="alert alert-error shadow-lg w-55">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-semibold">No hay un turno abierto.</span>
    </div>
  </div>

  <div v-if="mostrarAlertaTurnoCreado" class="alert-green">
    <div role="alert" class="alert alert-success shadow-lg w-55">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-semibold">¡Turno registrado correctamente!</span>
    </div>
  </div>

  <AbrirTurno :mostrar="mostrarVentana" @cerrar="mostrarVentana = false" @turnoAbierto="mostrarAlertaTurno" />
  <cerrarTurno :mostrar="mostrarVentanaCerrar" @cerrar="mostrarVentanaCerrar = false" />

  <div class="background-container"></div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AbrirTurno from "@/views/abrirTurno.vue";
import cerrarTurno from "@/views/cerrarTurno.vue";
import { turno } from "@/store/auth.js";

const mostrarVentana = ref(false);
const mostrarAlertaTurnoAbierto = ref(false);
const mostrarAlertaTurnoCreado = ref(false);
const mostrarAlertaNoTurnoAbierto = ref(false);
const mostrarVentanaCerrar = ref(false);
const router = useRouter();


//abrir turno
const abrirPestana = () => {
  if (!turno.value) {
    mostrarVentana.value = true;
  } else {
    mostrarAlertaTurnoAbierto.value = true;
    setTimeout(() => {
      mostrarAlertaTurnoAbierto.value = false;
    }, 3000);
  }
};

// Función para cerrar el turno
const PestanaCerrar = () => {
  if (turno.value) {
    mostrarVentanaCerrar.value = true;
  } else {
    mostrarAlertaNoTurnoAbierto.value = true;
    setTimeout(() => {
      mostrarAlertaNoTurnoAbierto.value = false;
    }, 3000);
  }
};

const mostrarAlertaTurno = () => {
  mostrarAlertaTurnoCreado.value = true;
  setTimeout(() => {
    mostrarAlertaTurnoCreado.value = false;
  }, 3000);
};


const salir = () => {
  router.push("/");
};
</script>

<style scoped>
.home-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #dcdcdc;
  padding: 15px;
  gap: 10px;
}

button {
  background-color: rgb(247, 219, 75);
  border: none;
  padding: 15px;
  min-width: 100px;
  height: 65px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.alert-red,.alert-green,.alert-red2 {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: 300px;
}

.background-container {
  width: 500px;
  height: auto;
  max-width: 100%;
  aspect-ratio: 1 / 1;
  background-image: url('/PIO2.jpeg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin: 80px auto 0 auto;
}

button:hover {
  transform: scale(1.07);
}

button:active {
  background-color: white;
}

.salir-btn {
  margin-left: auto;
}
</style>
