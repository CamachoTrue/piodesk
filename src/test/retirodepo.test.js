import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Retiros from '@/views/retiros.vue';

// Mock: supabase
const mockInsert = vi.fn();

vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  },
}));

// Mock: store de auth
vi.mock('../store/auth.js', () => ({
  idTurno: { value: 1 },
  userLogin: { value: 1 },
}));

// Mock: vue-draggable-resizable
vi.mock('vue-draggable-resizable', () => ({
  default: { template: '<div><slot /></div>' },
}));

// Suite 
describe('Retiros Component - PioDesk', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC_RETDEP_001 
  it('TC_RETDEP_001 - Movimiento Retiro con concepto Aguas e importe 200: retiro registrado correctamente', async () => {
    mockInsert.mockResolvedValue({ data: [{ id: 1 }], error: null });

    const wrapper = mount(Retiros, {
      props: { mostrar: true },
      global: {
        stubs: {
          VueDraggableResizable: { template: '<div><slot /></div>' },
        },
      },
    });

    // Llenar campos con los datos del excel
    await wrapper.find('select').setValue('Retiro');
    await wrapper.find('input[type="text"]').setValue('Aguas');
    await wrapper.find('input[type="number"]').setValue(200);

    // Click en Aceptar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Supabase debe haberse llamado con los datos correctos
    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          tipomovimiento: 'Retiro',
          concepto: 'Aguas',
          cantidad: 200,
          idturno: 1,
          idusuario: 1,
        }),
      ])
    );
  });

  // TC_RETDEP_002
  it('TC_RETDEP_002 - Movimiento Deposito con concepto Feria e importe 200: deposito registrado correctamente', async () => {
    mockInsert.mockResolvedValue({ data: [{ id: 2 }], error: null });

    const wrapper = mount(Retiros, {
      props: { mostrar: true },
      global: {
        stubs: {
          VueDraggableResizable: { template: '<div><slot /></div>' },
        },
      },
    });

    // Llenar campos con los datos del excel
    await wrapper.find('select').setValue('Deposito');
    await wrapper.find('input[type="text"]').setValue('Feria');
    await wrapper.find('input[type="number"]').setValue(200);

    // Click en Aceptar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Supabase debe haberse llamado con los datos correctos
    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          tipomovimiento: 'Deposito',
          concepto: 'Feria',
          cantidad: 200,
          idturno: 1,
          idusuario: 1,
        }),
      ])
    );
  });


  // TC_RETDEP_003
  it('TC_RETDEP_003 - Campos incompletos: muestra error "Llenar todos los campos"', async () => {
    const wrapper = mount(Retiros, {
      props: { mostrar: true },
      global: {
        stubs: {
          VueDraggableResizable: { template: '<div><slot /></div>' },
        },
      },
    });

    // Movimiento vacio, solo concepto e importe llenos
    await wrapper.find('input[type="text"]').setValue('Feria');
    await wrapper.find('input[type="number"]').setValue(200);
    // Se deja el select sin seleccionar (movimiento = null)

    // Click en Aceptar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Debe mostrarse un mensaje de error visible en la UI
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('Llenar todos los campos');

    // NO debe llamarse a Supabase
    expect(mockInsert).not.toHaveBeenCalled();
  });

});