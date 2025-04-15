<template>
  <div class="home-container">
    <button @click="" class="comedor-btn"><img src="/mesa.png" class="comedor-icon" />Comedor</button>
    <button @click="" class="domicilio-btn"><img src="/moto.png" class="domicilio-icon" />Domicilio</button>
    <button @click="" class="deposito-btn"><img src="/retirar.png" class="deposito-icon" />Retiro y <br> depósito</button>
    <button @click="" class="consultar-btn"><img src="/consulta.png" class="consultar-icon" />Consultar <br> citas</button>
    <button @click="abrirPestana()" class="abrir-btn"><img src="/candado-abierto.png" class="abrir-icon" />Abrir turno</button>
    <button @click="PestanaCerrar()" class="cerrar-btn"><img src="/candado.png" class="cerrar-icon" />Cerrar turno</button>
    <button @click="abrirProductoComp()" class="corte-btn"><img src="/caja-registradora.png" class="corte-icon" />Corte caja</button>
    <div class="dropdown">
      <button @click.stop="mostrarDropdown = !mostrarDropdown" class="ajustes-btn">
        <img src="/icons8-ajustes-48.png" class="ajustes-icon" />Ajustes
      </button>
      <transition name="fade">
        <div v-show="mostrarDropdown" class="dropdown-content">
          <a href="#" @click="abrirAggProductos(); mostrarDropdown = false">Añadir productos</a>
          <a href="#">Agregar usuarios</a>
          <a href="#">Impresoras</a>
        </div>
      </transition>
    </div>
    <button @click="salir" class="salir-btn">
      <img src="/cerrar.png" alt="Salir" class="salir-icon" />Salir
    </button>
  </div>

  <!-- ALERTAS -->
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

  <div v-if="alertaTurnoCerrado" class="alert-green2">
    <div role="alert" class="alert alert-success shadow-lg w-55">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-semibold">¡Turno cerrado correctamente!</span>
    </div>
  </div>

  <!-- COMPONENTES MODALES -->
  <AbrirTurno :mostrar="mostrarVentana" @cerrar="mostrarVentana = false" @turnoAbierto="mostrarAlertaTurno" />
  <cerrarTurno :mostrar="mostrarVentanaCerrar" @cerrar="mostrarVentanaCerrar = false" @turnoCerrado="MostrarAlertaTurnoCerrado" />
  <aggProductos :mostrar="mostrarAggProductos" @cerrar="mostrarAggProductos = false" />
  <productoComp :mostrar="mostrarProductoComp" @cerrar="mostrarProductoComp = false" />

  <div class="background-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import AbrirTurno from "@/views/abrirTurno.vue";
import cerrarTurno from "@/views/cerrarTurno.vue";
import aggProductos from "./views/agg.Productos.vue";
import productoComp from "./views/productoComp.vue";
import { turno } from "@/store/auth.js";

const mostrarVentana = ref(false);
const mostrarAlertaTurnoAbierto = ref(false);
const mostrarAlertaTurnoCreado = ref(false);
const mostrarAlertaNoTurnoAbierto = ref(false);
const alertaTurnoCerrado = ref(false);
const mostrarVentanaCerrar = ref(false);
const mostrarDropdown = ref(false);
const router = useRouter();
const mostrarAggProductos = ref(false);
const mostrarProductoComp = ref(false);

// Funcion para abrir turno
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

// Funcion para cerrar turno
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

// Funcion para mostrar alerta turno creado
const mostrarAlertaTurno = () => {
  mostrarAlertaTurnoCreado.value = true;
  setTimeout(() => {
    mostrarAlertaTurnoCreado.value = false;
  }, 3000);
};

// Funcion para mostrar alerta turno cerrado
const MostrarAlertaTurnoCerrado = () => {
  alertaTurnoCerrado.value = true;
  setTimeout(() => {
    alertaTurnoCerrado.value = false;
  }, 3000);
};

// Abrir producto compuesto
const abrirProductoComp = () => {
  mostrarProductoComp.value = true;
};

// Abrir modal de productos
const abrirAggProductos = () => {
  mostrarAggProductos.value = true;
};

// Manejo del dropdown fuera de foco
function handleClickOutside(event) {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    mostrarDropdown.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});

// Salir
const salir = () => {
  router.push("/");
};
</script>

<style scoped>
.home-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #e8e8e8;
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
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;

  
}

.salir-btn {
  margin-left: auto;
}

.alert-red,.alert-green,.alert-red2, .alert-green2 {
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


.ajustes-btn, .salir-btn, .comedor-btn, .domicilio-btn, .deposito-btn, .consultar-btn, .abrir-btn, .cerrar-btn, .corte-btn{
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.ajustes-icon, .salir-icon, .comedor-icon, .domicilio-icon, .deposito-icon, .consultar-icon, .abrir-icon, .cerrar-icon, .corte-icon{
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.consultar-btn, .deposito-btn {
  line-height: 1;
}

/*boton ajustes*/

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: block;
  position: absolute;
  background-color: white;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 10;
  border: 1px solid #ddd;
  border-radius: 10px;
  top: 110%;

  left: -40%;
  opacity: 1;
  pointer-events: auto;
}

.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.dropdown-content a:hover {
  background-color: #e7e7e7;
  color: #000;
}

.dropdown-content[v-cloak],
.dropdown-content[style*="display: none"] {
  display: none !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  pointer-events: none;
}

</style>
