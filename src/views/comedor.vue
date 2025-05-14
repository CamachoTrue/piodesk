<template>
    <div v-if="mostrar">
        <vue-draggable-resizable
        :w="1220"
        :h="667"
        :x="window.innerWidth / 2 - 620"
        :y="window.innerHeight / 2 - 380"
        :resizable="false"
        class="custom-draggable"
        >
        <div class="internal-frame">
            <div class="header">
            Comedor
            <button class="close-btn" @click="$emit('cerrar')">X</button>
            </div>

            <div class="content">
            <div class="main-grid">
                <div class="left-table tabla-wrapper1">
                <table class="tablaComedor">
                    <colgroup>
                    <col style="width: 150px" />
                    <col style="width: 80px" />
                    <col style="width: 100px" />
                    </colgroup>
                    <thead>
                    <tr>
                        <th>Cuenta</th>
                        <th>Imp.</th>
                        <th>Orden</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="pedido in pedidosAbiertos" :key="pedido.idpedido" @dblclick="obtenerPedido(pedido)">
                        <td>{{ pedido.nombre }}</td>
                        <td>
                            <input
                            type="checkbox"
                            :checked="Boolean(pedido.impreso)"
                            disabled
                            />
                        </td>
                        <td>{{ pedido.idpedido }}</td>
                        </tr>
                    </tbody>
                </table>
                </div>

                <div class="right-panel">
                <div class="top-section">
                    <div class="form-section bordered-box">
                    <div class="form-columns">
                    <div class="column">
                        <div class="input-row">
                        <label>Cuenta:</label>
                        <input v-model="cuenta" class="input-control cuenta-input" type="text" readonly/>
                        </div>
                        <div class="input-row">
                        <label>Folio:</label>
                        <input v-model="folio" class="input-control folio-input" type="number"readonly/>
                        </div>
                        <div class="input-row">
                        <label>Orden:</label>
                        <input v-model="orden" class="input-control orden-input" type="number" readonly/>
                        </div>
                    </div>
                    <div class="column">
                        <div class="input-row">
                        <label>Apertura:</label>
                        <input v-model="horaApertura" class="input-control apertura-input" type="text" readonly/>
                        </div>
                        <div class="input-row">
                        <label>Impresion:</label>
                        <input v-model="horaImpresa" class="input-control cierre-input" type="text" readonly/>
                        </div>
                        <div class="input-row">
                        <label>Impreso:</label>
                        <input v-model="checkimpreso" class="impreso-input" type="checkbox" disabled/>
                        </div>
                    </div>
                    </div>
                    </div>

                    <div class="button-section">
                        <div class="button-grid">
                            <button @click="abrirAbrir()" class="button">Abrir cuenta</button>
                         <!-- <button @click="abrirBorrar()" class="button">Eliminar Prod.</button>-->  
                            <button @click="abrirDescuento()" class="button">Descuento</button>
                            <button @click="abrirCaptura()" class="button">Captura</button>
                            <button @click="abrirRenombrar()" class="button">Renombrar</button>
                            <button @click="imprimirPedido()" class="button">Imprimir</button>
                            <button @click="abrirPagar()"class="button">Pagar cuenta</button>
                        </div>
                    </div>
                </div>

                <div class="tabla-wrapper2">
                    <table class="tablaComedor">
                        <colgroup>
                            <col style="width: 80px" />
                            <col style="width: 80px" />
                            <col style="width: 300px" />
                            <col style="width: 120px" />
                            <col style="width: 120px" />
                        </colgroup>
                    <thead>
                        <tr>
                            <th>Cantidad</th>
                            <th>Clave</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in productosPedido" :key="index">
                            <td>{{ item.cantidad }}</td>
                            <td>{{ item.id }}</td>
                            <td class="descripcion-col">
                            {{ item.descripcion }}
                            <ul v-if="item.modificadores && item.modificadores.length">
                                <li v-for="(mod, i) in item.modificadores" :key="i">
                                → {{ mod.nombre }} <span v-if="mod.precio">(+{{ mod.precio }})</span>
                                </li>
                            </ul>
                            </td>
                            <td>{{ item.precio ? item.precio.toFixed(2) : '0.00' }}</td>
                            <td>
                            {{
                                (
                                (Number(item.precio ?? 0) + (item.modificadores?.reduce((a, m) => a + Number(m.precio || 0), 0) || 0))
                                * Number(item.cantidad || 1)
                                ).toFixed(2)
                            }}
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>

                <div class="bottom-controls">
                    <div class="left-buttons">
                  <!-- <button @click="abrirReabrir()"class="button">Reabrir cuenta</button> -->  
                  <!-- <button @click="abrirCancelar()"class="button">Cancelar cuenta</button> -->  
                    
                    </div>
                <div class="right-totals-wrapper">
                    <div class="bordered-box" style="min-width: 395px;">
                    <div class="input-row">
                        <label>Subtotal:</label>
                        <input v-model="subtotal" class="input-control" type="text" />
                    </div>
                    <div class="input-row">
                        <label>Descuento:</label>
                        <input v-model="descuent" class="input-control" type="text" />
                    </div>
                    <div class="input-row">
                        <label>Impuestos:</label>
                        <input v-model="impuestos" class="input-control" type="text" />
                    </div>
                    <div class="input-row">
                        <label>Total sin desc.:</label>
                        <input v-model="totalsindesc" class="input-control" type="text" />
                    </div>
                    <div class="input-row">
                        <label>Total:</label>
                        <input v-model="total" class="input-control" type="text" />
                    </div>
                    </div>
                </div>
                </div>

            </div>
            </div>
            </div>
            </div>
        </vue-draggable-resizable>
    </div>

    <abrir :mostrar="mostrarAbrir" @cerrar="mostrarAbrir = false" @actualizado="actualizarDespuesDeEditar()"/>
    <borrar :mostrar="mostrarBorrar" @cerrar="mostrarBorrar = false" />
    <descuento :mostrar="mostrarDescuento" @cerrar="mostrarDescuento = false" @actualizar="cargarProductosPedido()"/>
    <captura :mostrar="mostrarCaptura" @cerrar="mostrarCaptura = false" @actualizar="cargarProductosPedido()" />
    <renombrar :mostrar="mostrarRenombrar" @cerrar="mostrarRenombrar = false" @actualizado="actualizarDespuesDeEditar()" />
    <reabrir :mostrar="mostrarReabrir" @cerrar="mostrarReabrir = false" />
    <cancelar :mostrar="mostrarCancelar" @cerrar="mostrarCancelar = false" />
    <pagar :mostrar="mostrarPagar" @cerrar="mostrarPagar = false" @actualizado="cargarPedidosAbiertos();limpiarCampos()" />
</template>

<script setup>
import { ref } from "vue";
import { defineEmits, defineProps, onMounted, nextTick } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import abrir from "./Comedor/abrir.vue";
import borrar from "./Comedor/borrar.vue";
import descuento from "./Comedor/descuento.vue";
import captura from "./Comedor/captura.vue";
import renombrar from "./Comedor/renombrar.vue";
import imprimir from "./Comedor/imprimir.vue";
import reabrir from "./Comedor/reabrir.vue";
import cancelar from "./Comedor/cancelar.vue";
import pagar from "./Comedor/pagar.vue";
import Descuento from "./Comedor/descuento.vue";
import { supabase } from "../supabase/supabase";
import { idPedido } from "../store/auth.js";

const checkimpreso = ref(false);
const props = defineProps(["mostrar"]);
const emit = defineEmits(["cerrar"]);
const window = ref(globalThis.window);
const mostrarAbrir = ref(false);
const mostrarBorrar = ref(false);
const mostrarDescuento = ref(false);
const mostrarCaptura = ref(false);
const mostrarRenombrar = ref(false);
const mostrarImprimir = ref(false);
const mostrarReabrir = ref(false);
const mostrarCancelar = ref(false);
const mostrarPagar = ref(false);

const cuenta = ref(null);
const folio = ref(null);
const orden = ref(null);
const horaApertura = ref(null);
const horaImpresa = ref(null);
const impreso = ref(null);
const subtotal = ref(null);
const descuent = ref(null);
const impuestos = ref(null);
const totalsindesc = ref(null);
const total = ref(null);

const pedidosAbiertos = ref([]);

const cargarPedidosAbiertos = async () => {
    const { data, error } = await supabase 
        .from('pedidos')
        .select()
        .eq('abierto', true)
        .eq('tipo', 'Normal');

    if(error){
        console.error("Error al obtener pedidos");
        return;
    }

    pedidosAbiertos.value = data;
};

const obtenerPedido = (pedido) => {
    cuenta.value = pedido.nombre;
    folio.value = pedido.idpedido;
    orden.value = pedido.numeropedido;
    horaApertura.value = pedido.horaapertura;
    horaImpresa.value = pedido.horaimpresion || "---";
    checkimpreso.value = pedido.impreso;
    subtotal.value = `$${pedido.subtotal}`;
    idPedido.value = pedido.idpedido;  
    cargarProductosPedido();
};

const pedidoActualizado = ref(null);
async function jalarPedidoEspecificp() {
  const { data, error } = await supabase
    .from('pedidos')  
    .select()
    .eq('idpedido', idPedido.value);

   if(error){
        console.error("Error al obtener pedido ",error);
        return;
   } 
    obtenerPedido(data[0]);

};

const productosPedido = ref([]);
async function cargarProductosPedido() {
  const { data: productos, error: errorProductos } = await supabase
    .from('productos_pedidos')
    .select(`
      idprodpedi,
      idproducto,
      cantidad,
      productos (
        nombre,
        precio,
        preciosinimporte
      )
    `)
    .eq('idpedido', idPedido.value);

  if (errorProductos) {
    console.error("Error al obtener productos", errorProductos);
    return;
  }

  // Cargar modificadores de todos los productos_pedidos
  const idsProds = productos.map(p => p.idprodpedi);

  const { data: mods, error: errorMods } = await supabase
    .from('productos_pedidos_modificadores')
    .select(`
      idprodpedi,
      modificadores (
        idmodificador,
        nombre,
        precio
      )
    `)
    .in('idprodpedi', idsProds);

  if (errorMods) {
    console.error("Error al obtener modificadores", errorMods);
    return;
  }

  // Agrupar modificadores por idprodpedi
  const modificadoresPorProducto = {};
  mods.forEach(m => {
  if (!m.modificadores) return; // protección defensiva

  if (!modificadoresPorProducto[m.idprodpedi]) {
    modificadoresPorProducto[m.idprodpedi] = [];
  }

  modificadoresPorProducto[m.idprodpedi].push({
    idmodificador: m.modificadores.idmodificador,
    nombre: m.modificadores.nombre,
    precio: m.modificadores.precio
  });
});

  // Reconstruir los productos con sus modificadores
  const productosConModificadores = productos.map(p => ({
  id: p.idproducto,
  cantidad: p.cantidad ?? 1,
  descripcion: p.productos?.nombre || 'Sin nombre',
  precio: p.productos?.precio ?? 0,
  modificadores: modificadoresPorProducto[p.idprodpedi] || []
}));

  // Si quieres ponerlos en el carrito:
  productosPedido.value = productosConModificadores;

productosExterno.value = productosConModificadores;
await cargarpedido();
 calcularTotales(productosConModificadores, pedidoExterno.value.descuento);
 
};
const productosExterno = ref([]);
const pedidoExterno = ref([]);

async function cargarpedido() {
    const {data, error} = await supabase
        .from('pedidos')
        .select()
        .eq('idpedido', idPedido.value)
    if(error){
        console.error("Error obtener pedido ",error);
        return;
    }
    pedidoExterno.value = data[0];
};

async function actualizarTotalEnBD(montoFinal) {
  const { error } = await supabase
    .from('pedidos')
    .update({ totalPedido: montoFinal })
    .eq('idpedido', idPedido.value);

  if (error) {
    console.error("Error al actualizar total en la base de datos", error);
  } else {
    console.log("Total actualizado correctamente");
  }
}

function limpiarCampos(){
    cuenta.value = null;
    folio.value = null;
    orden.value = null;
    horaApertura.value = null;
    horaImpresa.value = null;
    checkimpreso.value = false;
    productosPedido.value = [];
    subtotal.value = "0.00";
    descuent.value = "0%";
    totalsindesc.value = "0.00";
    total.value = "0.00";
};



async function imprimirPedido(){
    const { data, error } = await supabase
        .from('pedidos')
        .update({
            impreso: true
        })
        .eq('idpedido', idPedido.value);
    
    if(error){
        console.error("Error al actualizar pedido impreso ",error);
        return;
    }
    console.log("BD Actualziada con pedido impreso");
    cargarPedidosAbiertos();
    jalarPedidoEspecificp();
    
};


function calcularTotales(productos = [], descuentoPorcentaje = 0) {
  const totalBruto = productos.reduce((acc, item) => {
    const modTotal = item.modificadores?.reduce((sum, mod) => sum + Number(mod.precio || 0), 0) || 0;
    return acc + ((Number(item.precio || 0) + modTotal) * Number(item.cantidad || 1));
  }, 0);

  // Separar impuestos (IVA incluido en precios)
  const subtotalSinIVA = totalBruto / 1.16;
  const impuestosCalculados = totalBruto - subtotalSinIVA;

  // Calcular descuento sobre totalBruto
  const descuentoCalculado = totalBruto * (descuentoPorcentaje / 100);

  // Calcular total final ya con descuento
  const totalFinal = totalBruto - descuentoCalculado;

  // Asignar a campos
  subtotal.value = `$${subtotalSinIVA.toFixed(2)}`;
  descuent.value = `${descuentoPorcentaje}%`;
  impuestos.value = `$${impuestosCalculados.toFixed(2)}`;
  totalsindesc.value = `$${totalBruto.toFixed(2)}`;
  total.value = `$${totalFinal.toFixed(2)}`;

  actualizarTotalEnBD(totalFinal.toFixed(2));
};


async function actualizarTotalPedido() {
  const productos = productosPedido.value;
  const descuentoPorcentaje = parseFloat((pedidoExterno.value?.descuento || 0));

  const totalBruto = productos.reduce((acc, item) => {
    const modTotal = item.modificadores?.reduce((sum, mod) => sum + Number(mod.precio || 0), 0) || 0;
    return acc + ((Number(item.precio || 0) + modTotal) * Number(item.cantidad || 1));
  }, 0);

  const descuentoCalculado = totalBruto * (descuentoPorcentaje / 100);
  const totalFinal = totalBruto - descuentoCalculado;

  const { error } = await supabase
    .from('pedidos')
    .update({ totalPedido: totalFinal.toFixed(2) })
    .eq('idpedido', idPedido.value);

  if (error) {
    console.error("❌ Error al actualizar total antes de pagar:", error);
  } else {
    console.log("✅ Total actualizado antes de abrir pago");
  }
}




const actualizarDespuesDeEditar = () => {
  cargarPedidosAbiertos();
  jalarPedidoEspecificp();
};

onMounted(() => {
    cargarPedidosAbiertos();
})

//Abrir cuenta
const abrirAbrir = () => {
    idPedido.value = idPedido.value; 
    mostrarAbrir.value = true;
};

//borrar cuenta
const abrirBorrar = () => {
    mostrarBorrar.value = true;
};

//descuento
const abrirDescuento = () => {
    mostrarDescuento.value = true;
};

//captura
const abrirCaptura = () => {
    mostrarCaptura.value = true;
};

//renombrar
const abrirRenombrar = () => {
    mostrarRenombrar.value = true;
};

//reabrir
const abrirReabrir = () => {
    mostrarReabrir.value = true;
};

//cancelar
const abrirCancelar = () => {
    mostrarCancelar.value = true;
};

//pagar
const abrirPagar = async () => {
  if (checkimpreso.value) {
    await actualizarTotalPedido(); // 🔁 ahora existe
    mostrarPagar.value = false;
    await nextTick();
    idPedido.value = idPedido.value + 1;
    idPedido.value = idPedido.value - 1;
    mostrarPagar.value = true;
  } else {
    console.log("Imprimir pedido");
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
.main-grid {
    display: flex;
    gap: 15px;
    height: 100%;
}
.left-table {
    width: 300px;
    flex-shrink: 0;
    flex-grow: 0;
}
.right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
}
.tabla-wrapper1 {
    max-height: 588px;
    overflow-y: auto;
    border: 1px solid #ccc;
}
.tabla-wrapper2 {
    max-height: 230px;
    min-height: 230px; /* <--- AÑADE ESTA LÍNEA */
    overflow-y: auto;
    border: 1px solid #ccc;
}
.tablaComedor {
    width: 100%;
    border-collapse: collapse;
}
.tablaComedor th, .tablaComedor td {
    border: 1px solid #ccc;
    padding: 4px;
    text-align: left;
}
.top-section {
    display: flex;
    gap: 10px;
    width: 100%;
    height: 135px;
}
.form-section {
    width: 465px;
    height: 123px;

}
.button-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;


}
.button-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    padding-top: 15px;
    padding-bottom: 25px;

}
.bordered-box {
    border: 1px solid #b4b4b4;
    padding: 10px;
    border-radius: 10px;
}
.input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
    width: 100%;
}

.bottom-controls {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 15px;
    margin-top: 10px;
}
.left-buttons {
    display: flex;
    gap: 5px;
}

.left-buttons button {
    width: 148px;
}

button {
    border: none;
    background-color: rgb(144, 176, 245);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    width: 124px;
    height: 45px;
    font-size: 15px;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: rgb(105, 133, 194);
}

.form-columns {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}
.column {
    flex: 1;
}
.tablaComedor th,
.tablaComedor td {
    padding: 3px;
    padding-left: 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-weight: normal;
    color: #3e3e3e;
}
.tablaComedor thead th {
    position: sticky;
    top: 0;
    background-color: #e7e7e7;
    z-index: 1;
}


/* Ancho específico solo para los inputs con clases personalizadas */
.cuenta-input {
    width: 150px !important;
}

.folio-input {
    width: 80px !important;
    margin-left: 15px;
}

.orden-input {
    width: 80px !important;
    margin-left: 5px;
}

.apertura-input {
    width: 135px !important;
    margin-left: 8px;
}

.cierre-input {
    width: 135px !important;

}

.impreso-input {
    width: auto !important;
    height: auto !important;
    margin-left: 4px;
    margin-top: 4px;
    transform: scale(1.5); /* Escala el checkbox */
    transform-origin: left center;
    cursor: pointer;

}

/* Asegurarse de que los inputs de la clase .input-control tengan un ancho general */
.input-control {
    padding: 5px;
    height: 30px;
    border: 1px solid #b3b3b3;
    border-radius: 5px;
    width: auto; /* Por si necesitas que los inputs no se estiren a lo largo */
}

.right-totals-wrapper {
display: flex;
justify-content: flex-end;
flex: 1;
}

.right-totals-wrapper .input-row {
display: flex;
justify-content: space-between;
align-items: center;
gap: 0px;
}

.right-totals-wrapper label {
flex: 1;
white-space: nowrap;
}

.right-totals-wrapper input {
 flex: 1;
  max-width: 150px;
}

.right-totals-wrapper input {
  flex: 1;
  width: 200px; /* Aumenta este valor según lo que necesites */
  max-width: 300px;
}

.right-totals-wrapper .input-row:last-child label {
  font-weight: bold;
}

  </style>
