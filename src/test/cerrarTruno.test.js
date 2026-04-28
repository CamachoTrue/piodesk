import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
 
vi.mock('vue-draggable-resizable', () => ({
  default: { template: '<div><slot /></div>' },
}));

//Mock: supabase 
const mockUpdate = vi.fn();

vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: mockUpdate,
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

const turno = { value: false };

vi.mock('@/store/auth.js', () => ({
  get turno() { return turno; },
  obtenerTurno: vi.fn(),
  userLogin: { value: 1 },
  idTurno: { value: 1 },
  numPedidos: { value: 0 },
  resultadoLogin: { value: '' },
}));


vi.mock('@/views/abrirTurno.vue', () => ({ default: { template: '<div />' } }));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/home', component: { template: '<div />' } },
  ],
});

const stubComponent = { template: '<div />' };

describe('CerrarTurno - PioDesk', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    turno.value = false;
  });

  // TC_CERRARTUR_001 
  it('TC_CERRARTUR_001 - Ingresar importes y confirmar: turno cerrado exitosamente', async () => {
    const CerrarTurno = (await import('@/views/cerrarTurno.vue')).default;

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mount(CerrarTurno, {
      props: { mostrar: true },
      global: {
        stubs: {
          VueDraggableResizable: { template: '<div><slot /></div>' },
        },
      },
    });

    const inputs = wrapper.findAll('input[type="number"]');
    await inputs[0].setValue(7895); // Efectivo
    await inputs[1].setValue(2050); // Tarjeta
    await inputs[2].setValue(3000); // Transferencia

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        efectivoFinal: 7895,
        tarjetasFinal: 2050,
        transferFinal: 3000,
      })
    );

    expect(wrapper.emitted('turnoCerrado')).toBeTruthy();
  });

  // TC_CERRARTUR_002 
  it('TC_CERRARTUR_002 - Sin turno activo: muestra error "No hay un turno abierto"', async () => {
    turno.value = false;

    const Home = (await import('@/Home.vue')).default;

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

    await wrapper.find('button.cerrar-btn').trigger('click');
    await flushPromises();

    expect(wrapper.find('.alert-red2').exists()).toBe(true);
    expect(wrapper.find('.alert-red2').text()).toContain('No hay un turno abierto');
  });
});