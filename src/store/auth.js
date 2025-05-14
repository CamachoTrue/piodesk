
import { ref } from "vue";
import { supabase } from "@/supabase/supabase";

// Variable global para el usuario logueado
export const userLogin = ref(localStorage.getItem("userLogin") || 0);
export const turno = ref(localStorage.getItem("turno") || 0);
export const idTurno = ref(localStorage.getItem("idTurno") || 0);
export const resultadoLogin = ref(localStorage.getItem("resultadoLogin") || 0);
export const claveProducto = ref(null);
export const gruposModificadores = ref([]);

export const idPedido = ref(null);

export const idModificador = ref(null);

export const idCliente = ref(null);
export const idDireccion = ref(null);

export const numPedidos = ref(null);

export const idProducto = ref(null);

export const cargarGruposModif = async () => {
  try {
    const productoId = claveProducto.value;
    console.log("Cargando grupos modificadores para producto ID:", productoId);
    
    // 1. Primero obtenemos los IDs de grupos ya asignados
    const { data: asignados, error: errorAsignados } = await supabase
      .from('prodgrupmodificador')
      .select('idgrupomod')
      .eq('idproducto', productoId);

    if (errorAsignados) {
      throw new Error(`Error al obtener grupos asignados: ${errorAsignados.message}`);
    }
    
    // Extraer los IDs y asegurarnos de que sea un array
    const idsAsignados = asignados.map(item => item.idgrupomod);
    console.log("IDs de grupos asignados:", idsAsignados);
    
    // 2. Ahora obtenemos los grupos no asignados
    // IMPORTANTE: Si no hay grupos asignados, obtenemos todos los grupos
    let query = supabase.from('grupomodificador').select('*');
    
    // Solo aplicar el filtro "not.in" si hay IDs asignados
    if (idsAsignados.length > 0) {
      query = query.not('idgrupomod', 'in', `(${idsAsignados.join(',')})`);
    }
    
    const { data: disponibles, error: errorDisponibles } = await query;
    
    if (errorDisponibles) {
      throw new Error(`Error al obtener grupos disponibles: ${errorDisponibles.message}`);
    }
    
    console.log(`Encontrados ${disponibles.length} grupos disponibles`);
    
    // Asignar los grupos disponibles
    gruposModificadores.value = disponibles;
    
  } catch (error) {
    console.error("Error al cargar grupos modificadores:", error);
    gruposModificadores.value = [];
  }
};



export const obtenerTurno = async () => {
    const { data: turnoAbierto, error } = await supabase
      .from("turnos")
      .select()
      .is("horacierre", null);
  
    if (error) {
      console.error("Error al obtener turno abierto:", error);
      return;
    }
  
    if (turnoAbierto?.length > 0) {
      idTurno.value = turnoAbierto[0].idturno; // Asegúrate de usar el nombre correcto
      turno.value = true;
      numPedidos.value = turnoAbierto[0].totalNotas;
      console.log(numPedidos.value);
      
    } 
  };