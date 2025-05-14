<template>
    <div v-if="mostrar">
        <vue-draggable-resizable
        :w="800"
        :h="530"
        :x="window.innerWidth / 2 - 500"
        :y="window.innerHeight / 2 - 350"
        :resizable="false"
        class="custom-draggable">
            <div class="internal-frame">
                <div class="header"> Corte de caja
                    <button class="close-btn" @click="$emit('cerrar')">X</button>
                </div>
                <div class="content">
                    <div class="grid">
                        <div class="column">
                            <label>Comandas:</label>
                            <input v-model="comandas" type="number" />
                        </div>
                        <div class="column">
                            <label>Efectivo inicial:</label>
                            <input v-model="efectivoInical" type="number" readonly/>
                            <label>Efectivo:</label>
                            <input v-model="efectivo" type="number" readonly/>
                            <label> Tarjeta:</label>
                            <input v-model="tarjeta" type="number" readonly/>
                            <label>Transferencia:</label>
                            <input v-model="transferencia" type="number" readonly/>
                            <label>Retiros:</label>
                            <input v-model="retiros" type="number" readonly/>
                            <label>Depósito:</label>
                            <input v-model="depositos" type="number" readonly/>
                            <label>Saldo final:</label>
                            <input v-model="saldoFinal" type="number" readonly/>
                            <label>Efectivo final:</label>
                            <input v-model="efectivoFinal" type="number" readonly/>
                        </div>
                        <div class="column">
                            <label>Efectivo:</label>
                            <input v-model="efectivo2" type="number" readonly/>
                            <label>Tarjeta:</label>
                            <input v-model="tarjeta2" type="number" readonly/>
                            <label>Transferencia:</label>
                            <input v-model="transferencia2" type="number" readonly/>
                        </div>
                        <div class="column">
                            <label>Venta bruta:</label>
                            <input v-model="ventaBruta" type="number" readonly/>
                        </div>
                    </div>
                </div>
            </div>
        </vue-draggable-resizable>
    </div>
</template>

<script setup>
import { supabase } from "@/supabase/supabase";
import { defineEmits, defineProps, ref, onMounted} from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import { idTurno } from "../store/auth.js";
import { transform } from "typescript";


const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);
const window = ref(globalThis.window);

const comandas = ref(null);
const efectivoInical = ref(null);
const efectivo = ref(null);
const tarjeta = ref(null);
const transferencia = ref(null);
const retiros = ref(null);
const depositos = ref(null);
const saldoFinal = ref(null);
const efectivoFinal = ref(null);
const efectivo2 = ref(null);
const tarjeta2 = ref(null);
const transferencia2 = ref(null);
const ventaBruta = ref(null);


const resumenCaja = ref({
  efectivo: 0,
  tarjeta: 0,
  transferencia: 0,
  ventaBruta: 0
});

const cargarResumenCaja = async () => {
  const { data, error } = await supabase
    .from('corte_caja_resumen')
    .select('*')
    .eq('idturno', idTurno.value);

  if (error) {
    console.error("❌ Error al cargar resumen de caja:", error);
    return;
  }

  if (data.length > 0) {
    resumenCaja.value = {
      efectivo: data[0].total_efectivo,
      tarjeta: data[0].total_tarjeta,
      transferencia: data[0].total_transferencia,
      ventaBruta: data[0].venta_bruta
    };
  }
};

const resumenMovimientos = ref({
  retiro: 0,
  deposito: 0
});

const cargarResumenMovimientos = async () => {
  const { data, error } = await supabase
    .from('movimientos_resumen')
    .select('*')
    .eq('idturno', idTurno.value);

  if (error) {
    console.error("❌ Error al cargar movimientos:", error);
    return;
  }

  // recorrer el arreglo para asignar los valores
  data.forEach(item => {
    if (item.tipomovimiento === 'retiro') {
      resumenMovimientos.value.retiro = item.total;
    } else if (item.tipomovimiento === 'deposito') {
      resumenMovimientos.value.deposito = item.total;
    }
  });
};

const turno = ref([]);

async function obtenerTurno() {
  const { data, error } = await supabase
    .from('turnos')
    .select()
    .eq('idturno', idTurno.value);

 if(error){
    console.error("Error al obtener turno ",error);
    return;
 }

 turno.value = data[0];
};


function cargarDatos() {
    comandas.value = turno.value.totalNotas;
    efectivoInical.value = turno.value.montoinicial;
    efectivo.value = resumenCaja.value.efectivo;
    tarjeta.value = resumenCaja.value.tarjeta;
    transferencia.value = resumenCaja.value.transferencia;
    retiros.value = resumenMovimientos.value.retiro;
    depositos.value = resumenMovimientos.value.deposito;
    saldoFinal.value = efectivoInical.value + efectivo.value + tarjeta.value + transferencia.value - retiros.value + depositos.value;
    efectivoFinal.value = efectivoInical.value + efectivo.value - retiros.value + depositos.value;
    efectivo2.value = efectivo.value;
    tarjeta2.value = tarjeta.value;
    transferencia2.value = transferencia.value;
    ventaBruta.value = resumenCaja.value.ventaBruta;
};

onMounted(async () => {
    
    
    await obtenerTurno();
    await cargarResumenCaja();
    await cargarResumenMovimientos();
    cargarDatos()
    
});
</script>

<style scoped>
/* Eliminar flechas del input number */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
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

.close-btn:hover {
    background-color: rgb(209, 0, 0);
}

.content {
    flex-grow: 1;
    padding: 20px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.column {
    display: flex;
    flex-direction: column;
}

.column label {
    font-size: 12px;
    margin-bottom: 3px;
    margin-top: 5px;
}

.column input {
    border: none;
    border-bottom: 1px solid #b4b4b4;
    outline: none;
    padding: 2px 5px;
    margin-bottom: 5px;
}

hr {
    margin: 10px 0;
    border: none;
    border-top: 1px solid #b4b4b4;
}
</style>