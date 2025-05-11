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
                            <input type="number" />
                        </div>
                        <div class="column">
                            <label>Efectivo inicial:</label>
                            <input type="number" />
                            <label>Efectivo:</label>
                            <input type="number" />
                            <label>Tarjeta:</label>
                            <input type="number" />
                            <label>Transferencia:</label>
                            <input type="number" />
                            <label>Retiros:</label>
                            <input type="number" />
                            <label>Depósito:</label>
                            <input type="number" />
                            <label>Saldo final:</label>
                            <input type="number" />
                            <label>Efectivo final:</label>
                            <input type="number" />
                        </div>
                        <div class="column">
                            <label>Efectivo:</label>
                            <input type="number" />
                            <label>Tarjeta:</label>
                            <input type="number" />
                            <label>Transferencia:</label>
                            <input type="number" />
                        </div>
                        <div class="column">
                            <label>Venta bruta:</label>
                            <input type="number" />
                        </div>
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

const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);
const window = ref(globalThis.window);
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