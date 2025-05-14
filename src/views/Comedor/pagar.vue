<template>
  <div v-if="mostrar">
    <vue-draggable-resizable
      :w="450"
      :h="375"
      :x="window.innerWidth / 2 - 225"
      :y="window.innerHeight / 2 - 240"
      :resizable="false"
      class="custom-draggable"
    >
      <div class="internal-frame">
        <div class="header">
          Pagar
          <button class="close-btn" @click="$emit('cerrar')">X</button>
        </div>

        <div class="content">
          <div class="row-3-inputs">
        <div class="input-group">
            <label>Total:</label>
            <input v-model="totalCuenta" type="number" readonly />
        </div>
        <div class="input-group">
            <label>Cambio:</label>
            <input v-model="cambio" type="number" readonly/>
        </div>
        <div class="input-group">
            <label>Saldo:</label>
            <input v-model="saldo" type="number" readonly/>
        </div>
        </div>
          <!-- Tabla -->
          <div class="table-wrapper">
            <table class="tabla">
            <thead>
                <tr>
                <th>Clave</th>
                <th>Descripción</th>
                <th>Importe</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>EF</td>
                <td>Efectivo</td>
                <td><input v-model="efectivo" type="number" class="input-control" /></td>
                </tr>
                <tr>
                <td>MC</td>
                <td>Tarjeta</td>
                <td><input v-model="tarjeta" type="number" class="input-control" /></td>
                </tr>
                <tr>
                <td>05</td>
                <td>Transferencia</td>
                <td><input v-model="transferencia" type="number" class="input-control" /></td>
                </tr>
            </tbody>
            </table>
          </div>

          <!-- Botones -->
          <div class="button-group">
            <button class="button" @click="confirmarPago()">Aceptar</button>
            <button class="button cancel-btn" @click="$emit('cerrar');limpiarCampos()">Cancelar</button>
          </div>
        </div>
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch, onMounted, watchEffect } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import { idPedido } from "@/store/auth.js";
import { supabase } from "@/supabase/supabase";

const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar", "actualizado"]);
const window = ref(globalThis.window);

const totalCuenta= ref(0); // este viene de tu sistema (por ejemplo, del total del pedido)
const efectivo = ref(0);
const tarjeta = ref(0);
const transferencia = ref(0);

const totalPago = ref(0);
const cambio = ref(0);
const saldo = ref(0);

async function obtenerTotalCuenta() {
  const { data, error} = await supabase
    .from('pedidos')
    .select()
    .eq('idpedido', idPedido.value);

  if(error){
    console.error("Error al obtener total del pedidiop ",error);
    return;
  }

  totalCuenta.value = data[0].totalPedido;
  console.log(data[0].totalPedido);
  
};

watch([efectivo, tarjeta, transferencia], () => {
  totalPago.value = Number(efectivo.value || 0) + Number(tarjeta.value || 0) + Number(transferencia.value || 0);

  const diferencia = totalPago.value - totalCuenta.value;

  if (diferencia >= 0) {
    cambio.value = diferencia;
    saldo.value = 0;
  } else {
    saldo.value = Math.abs(diferencia);
    cambio.value = 0;
  }
});

function limpiarCampos() {
  totalCuenta.value = 0;
  cambio.value = 0;
  saldo.value = 0;
  efectivo.value = 0;
  tarjeta.value = 0;
  transferencia.value = 0;
}
async function confirmarPago() {
  if (!idPedido.value) {
    console.log("Debes seleccionar un pedido.");
    return;
  }

  // 🚫 Validación para evitar cambio si no hay efectivo
  if (cambio.value > 0 && Number(efectivo.value) === 0) {
    console.log("⚠️ No se puede dar cambio si no hay pago en efectivo.");
    return;
  }

  // ✅ Continuar con el registro si pasa la validación
  const { error } = await supabase
    .from('pedidos')
    .update(
      {
        pagoEfectivo: efectivo.value,
        pagoTarjeta: tarjeta.value,
        pagoTransfer: transferencia.value,
        abierto: false        
      }
    )
    .eq('idpedido', idPedido.value);

  if (error) {
    console.error("Error al registrar el pago", error);
    console.log("Hubo un error al registrar el pago.");
  } else {
    console.log("Pago registrado correctamente.");
    limpiarCampos();
    emit('actualizado');
    emit("cerrar");
  }
};

watch(() => props.mostrar, async (visible) => {
  if (visible) {
    limpiarCampos();              // primero limpia
    await obtenerTotalCuenta();   // luego trae el total actualizado
  }
});

onMounted(() => {
  limpiarCampos();
  obtenerTotalCuenta(); // ya se actualizará correctamente
});

</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 8px;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
input {
  padding: 5px;
  border: 1px solid #b4b4b4;
  border-radius: 4px;
  width: 100%;
}
.table-wrapper {
  max-height: 165px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-top: 15px;
}
.tablaComedor {
  width: 100%;
  border-collapse: collapse;
}
.tablaComedor th,
.tablaComedor td {
  border: 1px solid #ccc;
  padding: 4px;
  text-align: left;
}
.tablaComedor th {
  background-color: #e7e7e7;
}
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  margin-left: 60px;
  margin-right: 60px;
}
button {
  width: 135px;
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

.row-3-inputs,
.row-2-inputs {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.input-grande{
    flex: 1.8;
    }

.input-chico{
    flex: 1.2;
}
.tabla {
    border-collapse: collapse;
    table-layout: fixed;
    cursor: pointer;
}

.tabla th,
.tabla td {
    padding: 3px 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;
}

.tabla thead th {
    position: sticky;
    top: 0;
    background-color: #e7e7e7;
    z-index: 1;
}
.tabla th:nth-child(1) {
    width: 80px;
}
.tabla th:nth-child(2) {
    width: 200px;
}
.tabla th:nth-child(3) {
    width: 140px;
}

.input-control {
  width: 100%;
  padding: 4px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>