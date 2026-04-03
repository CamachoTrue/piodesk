import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/Login.vue';

// Mock: supabase 
const mockSingle = vi.fn();

vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mockSingle,
        })),
      })),
    })),
  },
}));

// Mock: store de auth 
vi.mock('@/store/auth.js', () => ({
  obtenerTurno: vi.fn(),
  resultadoLogin: { value: '' },
  userLogin: { value: null },
}));

// Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Login</div>' } },
    { path: '/home', component: { template: '<div>Home</div>' } },
  ],
});
vi.spyOn(router, 'push');

// Suite
describe('Login Component - PioDesk', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC_LOG_001
  it('TC_LOG_001 - Login con credenciales correctas redirige al dashboard', async () => {
    // Supabase devuelve el usuario registrado con la password correcta
    mockSingle.mockResolvedValue({
      data: { idusuario: 1, userName: 'Abm', password: '242717' },
      error: null,
    });

    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        stubs: ['router-link', 'router-view'],
      },
    });

    await wrapper.find('input[placeholder="Usuario"]').setValue('Abm');
    await wrapper.find('input[placeholder="Contraseña"]').setValue('242717');
    await wrapper.find('button.bg-yellow-300').trigger('click');
    await flushPromises();

    // Debe redirigir al home (dashboard)
    expect(router.push).toHaveBeenCalledWith('/home');

    // No debe mostrarse ningun mensaje de error
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  // TC_LOG_002 
  it('TC_LOG_002 - Login con credenciales incorrectas muestra error de autenticacion', async () => {
    // Supabase devuelve error: usuario no encontrado o contrasena no coincide
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'No rows found' },
    });

    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        stubs: ['router-link', 'router-view'],
      },
    });

    await wrapper.find('input[placeholder="Usuario"]').setValue('usuarioIncorrecto');
    await wrapper.find('input[placeholder="Contraseña"]').setValue('passwordIncorrecta');
    await wrapper.find('button.bg-yellow-300').trigger('click');
    await flushPromises();

    // Debe mostrarse el mensaje de error
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('Usuario o contraseña incorrectos');

    // No debe redirigir al home
    expect(router.push).not.toHaveBeenCalledWith('/home');
  });

});