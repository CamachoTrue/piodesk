<template>
    <div v-if="mostrar">
      <vue-draggable-resizable
        :w="350"
        :h="260"
        :x="window.innerWidth / 2 + 200"
        :y="window.innerHeight / 2 - 170"
        :resizable="false"
        class="custom-draggable">
        <div class="internal-frame">
          <div class="header"> Retiro y depósito
            <button class="close-btn" @click="$emit('cerrar'); limpiarCampos()">X</button>
          </div>
          <div class="content">
            <div class="input-row">
              <label>Movimiento:</label>
              <select v-model="movimiento" class="input-control">
                <option value="" disabled>Selecciona una opción</option>
                <option value="Retiro">Retiro</option>
                <option value="Deposito">Deposito</option>
              </select>
            </div>
            <div class="input-row">
              <label>Concepto:</label>
              <input v-model="concepto" type="text" class="input-control" />
            </div>
            <div class="input-row">
              <label>Importe:</label>
              <input v-model="importe" type="number" class="input-chico" />
            </div>
            <div class="button-group">
              <button class="button" @click="aggMovimiento()">Aceptar</button>
              <button class="cancel-btn">Cancelar</button>
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
    import { idTurno, userLogin } from "../store/auth.js";


  // Props y eventos
    const props = defineProps(["mostrar"]);
    const emit = defineEmits(["cerrar"]);

  // Variables
    const window = ref(globalThis.window);

  // Fecha y Hora en formato correcto
    const now = new Date();
    const fecha = ref(now.toISOString().split("T")[0]);
    const hora = ref(now.toTimeString().split(" ")[0]);

    const movimiento = ref(null);
    const concepto = ref(null);
    const importe = ref(null);

    const limpiarCampos = () => {
      movimiento.value = null;
      concepto.value = null;
      importe.value = null;
    };

    const aggMovimiento = async () =>{
      console.log(hora.value);
      
      const { data: dataAgg, error: errorAgg } = await supabase
        .from('retirosdepositos')
        .insert([{
          idturno: idTurno.value,
          idusuario: userLogin.value,
          tipomovimiento: movimiento.value,
          concepto: concepto.value,
          cantidad: importe.value,
          fecha: fecha.value,
          hora: hora.value
        }]);

      if(errorAgg){
        console.error("Error al realizar ",movimiento.value, errorAgg);
        return;
      }else{
        console.log(movimiento.value, " realizado correctamente");
        limpiarCampos();
      }
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
        margin-left: 70px;
        margin-right: 70px;
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
    width: 250px;
    padding: 5px;
    border: 1px solid #b4b4b4;
    border-radius: 4px;
    }

    .input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.input-control {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #b4b4b4;
}

.input-row label {
  width: 120px; 
  
}

.input-chico{
    width: 120px;
}

select{
    width: 250px;
}
</style>
