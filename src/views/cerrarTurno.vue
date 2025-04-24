<template>
<div v-if="mostrar">
    <div v-if="alertaVisible" role="alert" class="alert alert-success">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>¡Turno cerrado correctamente!</span>
    </div>

<vue-draggable-resizable :w="300" :h="200" :x="window.innerWidth / 2 - 270" :y="window.innerHeight / 2 - 230" :resizable="false" class="custom-draggable">
<div class="internal-frame">
    <div class="header">Cerrar turno
        <button class="close-btn transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white" @click="$emit('cerrar')">X</button>
    </div>
        <div class="content">
        <p>Ingresa los importes declarados para el cierre de caja</p>
        

        <table class="tabla-cierre">
            <thead>
                <tr>
                    <th>Clave</th>
                    <th>Descripción</th>
                    <th>Importe</th>
                </tr>
            </thead>
                <tbody>
                    <tr v-for="(item, index) in caja" :key="index">
                    <td>{{ item.clave }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>
                    <input
                    type="number"
                    v-model.number="item.importe"
                    class="input-importe"
                    placeholder="$0.00"/>
                    </td>
                    </tr>
                </tbody>
        </table>
        
        <div class="button-group">
            <button @click="confirmar" class="transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Confirmar</button>
            <button @click="$emit('cerrar')" class="cancel-btn transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white">Cancelar</button>
        </div>
        </div>
    </div>
    </vue-draggable-resizable>
</div>
</template>

<script setup>


const cerrarTurno = () => {
  emit('turnoCerrado'); // dispara la alerta
  emit('cerrar'); // cierra la ventana modal
};
import { obtenerTurno, turno, userLogin, idTurno } from "@/store/auth.js";
import { supabase } from "@/supabase/supabase";
import { defineEmits, defineProps, ref } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";

// Props y eventos
const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);

// Variables
const montoInicial = ref(0);
const alertaVisible = ref(false);
const window = ref(globalThis.window);

// Fecha y Hora en formato correcto
const now = new Date();
const fecha = ref(now.toISOString().split("T")[0]);
const hora = ref(now.toISOString().split("T")[1].split(".")[0]);

//tabla
const caja = ref([
{ clave: "EF", descripcion: "Efectivo", importe: null },
{ clave: "TJ", descripcion: "Tarjeta", importe: null },
{ clave: "TR", descripcion: "Transferencia", importe: null },
]);

const confirmar = async () => {
    if(caja.value[0].importe === null || caja.value[1].importe === null || caja.value[2].importe === null){
        console.log('Llenar todos los campos'); //Alert para cuando no se llenaron todos los campos
        return;
    }
    console.log(idTurno.value);

    const{error} = await supabase
    .from('turnos')
    .update({
        horacierre: hora.value,
        efectivoFinal: caja.value[0].importe,
        tarjetasFinal: caja.value[1].importe,
        transferFinal: caja.value[2].importe
    },)
    .eq('idturno', idTurno.value);

    if(error){
        console.error('Error al guardar cierre de turno: ', error);
    }else{
        console.log('Cierre de turno exitoso'); //Alert de turno cerrador correctamente
        turno.value = false;
        idTurno.value = ref(null);
        emit('cerrar');
    }
    
    emit("turnoCerrado");
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

.tabla-cierre {
    width: 96%;
    border-collapse: collapse;
    margin-top: 20px;
    
}

.tabla-cierre th, .tabla-cierre td {
    padding: 3px;
    padding-left: 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;

}


.tabla-cierre th:nth-child(1),
.tabla-cierre td:nth-child(1) {
    width: 80px;
}
.tabla-cierre th:nth-child(2),
.tabla-cierre td:nth-child(2) {
    width: 270px;
}

.tabla-cierre th {
    background-color: #e7e7e7;
    
}

.input-importe {
    width: 100%;
    padding: 5px;
    border: 1px solid #ffffff;
    border-radius: 4px;
    text-align: left;
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
    outline: none;
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 200%;
    height: 175%;
    display: flex;
    flex-direction: column;
}

.header {
    background: rgb(247, 219, 75);
    color: white;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    position: relative;
    text-align: left;
    padding-left: 27px;
}

.close-btn {
    width: 25px;
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
    text-align: center;
    text-align: left;
    padding-left: 35px;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 26px;
    margin-left: 110px;
    margin-right: 130px;
}

button {
    width: 130px;
    padding: 5px 15px;
    border: none;
    background-color: rgb(130, 165, 243);
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-btn {
    background-color: rgb(126, 126, 126);
}
</style>
