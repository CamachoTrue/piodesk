<template>
  <div class="flex justify-center items-center h-screen bg-gray-200">
      <div class="bg-white w-[430px] h-[430px] shadow-lg text-center rounded-xl flex flex-col items-center p-6" @keydown="manejarTeclado">
          <div v-if="mensajeError" role="alert" class="alert alert-error w-[28%] absolute top-2 flex items-center text-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ mensajeError }}</span>
          </div>
          <img src="../PIO.jpg" alt="Logo" class="w-20 mt-6">
          <h1 class="text-3xl font-bold mt-2">Bienvenido!</h1>
          <input type="text" v-model="usuario" placeholder="Usuario" class="h-11 w-[300px] mt-5 pb-1 px-3 text-base border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" ref="usuarioInput">
          <input type="password" v-model="password" placeholder="Contraseña" class="h-11 w-[300px] pb-1 mt-5 px-3 text-base border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" ref="passwordInput">
          <!-- Botón "Iniciar sesión" con tipografía bold (similar al h1 "Bienvenido!") -->
          <button @click="iniciarSesion" class="bg-yellow-300 h-11 w-[300px] rounded-lg mt-5 transition-transform duration-200 ease-in-out transform hover:scale-105 active:bg-white login-button-text">
              Login
          </button>
          <!-- Botón "Usuario rápido" mantiene el subrayado y se le añade también font-bold -->
          <button v-show="isVisible" @click="userRapido" class="mt-3 underline font-bold">
              Usuario rápido
          </button>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from "@/supabase/supabase";
import { userLogin, obtenerTurno, resultadoLogin } from "@/store/auth.js";

const router = useRouter();
const usuario = ref('');
const password = ref('');
const mensajeError = ref("");
const isVisible = ref(true);

const usuarioInput = ref(null);
const passwordInput = ref(null);

const userRapido = () => {
  usuarioInput.value.value = 'abm';
  passwordInput.value.value = '242717';
  usuario.value = 'abm';
  password.value = '242717';
};

const manejarTeclado = (e) => {
  if (e.key === "ArrowDown") {
      if (document.activeElement === usuarioInput.value) {
          passwordInput.value.focus();
      }
  }
  if (e.key === "ArrowUp") {
      if (document.activeElement === passwordInput.value) {
          usuarioInput.value.focus();
      }
  }
  if (e.key === "Enter") {
      e.preventDefault();
      iniciarSesion();
  }
};

const iniciarSesion = async () => {
  mensajeError.value = "";
  const { data, error } = await supabase
      .from("usuarios")
      .select("idusuario,userName,password")
      .eq("userName", usuario.value)
      .single();  // Si solo hay un usuario con ese nombre

  if (error) {
      mostrarError("Usuario o contraseña incorrectos.");
      console.error(error);
      return;
  }

  if (data && data.password === password.value) {
      userLogin.value = data.idusuario;
      console.log(userLogin.value);
      localStorage.setItem('userLogin', data.idusuario);
      obtenerTurno();
      resultadoLogin.value = 'Inicio sesion correcto';
      router.push('/home');
  } else {
      mostrarError("Usuario o contraseña incorrectos.");
      resultadoLogin.value = 'Credenciales Incorrectas';
      router.push('/');
  }
};

const mostrarError = (mensaje) => {
  mensajeError.value = mensaje;
  setTimeout(() => {
      mensajeError.value = "";
  }, 3000);
};
</script>

