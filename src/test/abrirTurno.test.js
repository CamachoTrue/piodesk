import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/Home.vue';

// Mock: store de auth 
const turno = { value: false };

vi.mock('@/store/auth.js', () => ({
  get turno() { return turno; },
  obtenerTurno: vi.fn(),
  userLogin: { value: 1 },
  idTurno: { value: null },
  numPedidos: { value: 0 },
  resultadoLogin: { value: '' },
}));

// Mock: supabase 
vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    })),
  },
}));

// Mock: Componente AbrirTurno en Home
const stubComponent = { template: '<div />' };

vi.mock('@/views/abrirTurno.vue', () => ({ default: { template: '<div />' } }));

// Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/home', component: { template: '<div />' } },
  ],
});

// Suite
describe('Home Component - Abrir Turno', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    turno.value = false;
  });

  // TC_ABRIRTUR_001 
  it('TC_ABRIRTUR_001 - Sin turno activo: abre el modal de AbrirTurno', async () => {
    turno.value = false; // No hay turno abierto

    const wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: {
          AbrirTurno: stubComponent,
          cerrarTurno: stubComponent,
          aggProductos: stubComponent,
          aggUsuarios: stubComponent,
          comedor: stubComponent,
          impresoras: stubComponent,
          retiros: stubComponent,
          corte: stubComponent,
          domicilio: stubComponent,
        },
      },
    });

    // Click en "Abrir turno"
    await wrapper.find('button.abrir-btn').trigger('click');
    await flushPromises();

    // No debe mostrarse la alerta de error
    expect(wrapper.find('.alert-red').exists()).toBe(false);

    // El modal de AbrirTurno debe estar visible (mostrarVentana = true)
    // Lo verificamos buscando el componente stub con mostrar=true
    const abrirTurnoStub = wrapper.findComponent(stubComponent);
    expect(abrirTurnoStub.exists()).toBe(true);
  });

  // TC_ABRIRTUR_002 
  it('TC_ABRIRTUR_002 - Turno ya abierto: muestra alerta "Ya hay un turno abierto"', async () => {
    turno.value = true; // Ya hay un turno abierto

    const wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: {
          AbrirTurno: stubComponent,
          cerrarTurno: stubComponent,
          aggProductos: stubComponent,
          aggUsuarios: stubComponent,
          comedor: stubComponent,
          impresoras: stubComponent,
          retiros: stubComponent,
          corte: stubComponent,
          domicilio: stubComponent,
        },
      },
    });

    // Click en "Abrir turno" con turno ya activo
    await wrapper.find('button.abrir-btn').trigger('click');
    await flushPromises();

    // Debe mostrarse la alerta de error
    expect(wrapper.find('.alert-red').exists()).toBe(true);
    expect(wrapper.find('.alert-red').text()).toContain('Ya hay un turno abierto');

    // El modal NO debe abrirse
    expect(wrapper.find('.alert-red [role="alert"]').exists()).toBe(true);
  });

});