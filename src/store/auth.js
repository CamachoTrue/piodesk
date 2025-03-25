
import { ref } from "vue";
import { supabase } from "@/supabase/supabase";

// Variable global para el usuario logueado
export const userLogin = ref(localStorage.getItem("userLogin") || 0);
export const turno = ref(localStorage.getItem("turno") || 0);
export const idTurno = ref(localStorage.getItem("idTurno") || 0);
export const resultadoLogin = ref(localStorage.getItem("resultadoLogin") || 0);

export const obtenerTurno = async () => {
    const { data: turnoAbierto, error } = await supabase
      .from("turnos")
      .select("idturno")
      .eq("horacierre", null);
  
    if (error) {
      console.error("Error al obtener turno abierto:", error);
      return;
    }
  
    if (turnoAbierto?.length > 0) {
      idTurno.value = turnoAbierto[0].idturno; // Asegúrate de usar el nombre correcto
      turno.value = true;
    } 
  };