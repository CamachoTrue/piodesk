import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AggUsuarios from '@/views/aggUsuarios.vue';

// Mock: vue-draggable-resizable 
vi.mock('vue-draggable-resizable', () => ({
  default: { template: '<div><slot /></div>' },
}));

//  Mock: supabase
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
    })),
  },
}));

const mountComponent = () =>
  mount(AggUsuarios, {
    props: { mostrar: true },
    global: {
      stubs: {
        VueDraggableResizable: { template: '<div><slot /></div>' },
      },
    },
  });

describe('AggUsuarios Component - PioDesk', () => {

  beforeEach(() => {
    vi.clearAllMocks();

    // Por defecto cargarUsuarios retorna lista vacia
    mockSelect.mockResolvedValue({ data: [], error: null });
  });

  // TC_USR_001 
  it('TC_USR_001 - Datos completos y usuario nuevo: usuario creado exitosamente', async () => {
    mockSelect
      .mockResolvedValueOnce({ data: [], error: null })  
      .mockResolvedValueOnce({ data: [], error: null })  
      .mockResolvedValueOnce({ data: [], error: null }); 

    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ idusuario: 1, name: 'Jose Carlos', rol: 'Gerente', password: '123456', userName: 'JC' }],
        error: null,
      }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    await wrapper.find('input[type="text"]').setValue('Jose Carlos');
    await wrapper.find('select').setValue('Gerente');
    await wrapper.find('input[type="password"]').setValue('123456');
    await wrapper.findAll('input[type="text"]')[1].setValue('JC');

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Jose Carlos',
          rol: 'Gerente',
          password: '123456',
          userName: 'JC',
        }),
      ])
    );
  });

  // TC_USR_002 
  it('TC_USR_002 - userName ya existente: muestra error "usuario ya existe"', async () => {
    // Usuario con userName "JC" ya existe en la BD
    const usuarioExistente = { idusuario: 99, name: 'Otro', rol: 'Cajero', password: 'abc', userName: 'JC' };

    mockSelect
      .mockResolvedValueOnce({ data: [usuarioExistente], error: null }) 
      .mockResolvedValueOnce({ data: [usuarioExistente], error: null });

    const wrapper = mountComponent();
    await flushPromises();

    // Llenar formulario con un id diferente pero userName ya usado
    await wrapper.find('input[type="number"]').setValue(50); // clave nueva
    await wrapper.find('input[type="text"]').setValue('Jose Carlos');
    await wrapper.find('select').setValue('Gerente');
    await wrapper.find('input[type="password"]').setValue('123456');
    await wrapper.findAll('input[type="text"]')[1].setValue('JC'); // userName ya existe

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('usuario ya existe');

    expect(mockInsert).not.toHaveBeenCalled();
  });

  // TC_USR_003
  it('TC_USR_003 - Doble click en usuario existente y guardar: usuario actualizado exitosamente', async () => {
    const usuarioExistente = { idusuario: 1, name: 'Jose Carlos', rol: 'Gerente', password: '123456', userName: 'JC' };

    mockSelect
      .mockResolvedValueOnce({ data: [usuarioExistente], error: null }) 
      .mockResolvedValueOnce({ data: [usuarioExistente], error: null }) 
      .mockResolvedValueOnce({ data: [usuarioExistente], error: null });

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Simular doble click en la fila del usuario
    await wrapper.find('tbody tr').trigger('dblclick');
    await flushPromises();

    // Modificar nombre como indica el excel (Jose Carlos Castro)
    await wrapper.find('input[type="text"]').setValue('Jose Carlos Castro');

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jose Carlos Castro',
      })
    );
  });

  // TC_USR_004 
  it('TC_USR_004 - Doble click en usuario existente y eliminar: usuario eliminado exitosamente', async () => {
    const usuarioExistente = { idusuario: 1, name: 'Jose Carlos Castro', rol: 'Gerente', password: '123456', userName: 'JC' };

    mockSelect
      .mockResolvedValueOnce({ data: [usuarioExistente], error: null })
      .mockResolvedValueOnce({ data: [usuarioExistente], error: null })
      .mockResolvedValueOnce({ data: [], error: null });               

    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Simular doble click en la fila para seleccionar el usuario
    await wrapper.find('tbody tr').trigger('dblclick');
    await flushPromises();

    // Click en Eliminar\
    await wrapper.findAll('button.button')[1].trigger('click');
    await flushPromises();

    expect(mockDelete).toHaveBeenCalled();
  });

  // TC_USR_005 
  it('TC_USR_005 - Formulario incompleto (sin Tipo): muestra error "Llenar todos los campos"', async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null }); 

    const wrapper = mountComponent();
    await flushPromises();

    // Llenar todo menos el select de Tipo
    await wrapper.find('input[type="text"]').setValue('Brianda');
    // tipo se deja vacio
    await wrapper.find('input[type="password"]').setValue('123456');
    await wrapper.findAll('input[type="text"]')[1].setValue('Rakka');

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Debe mostrarse un error visible
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('Llenar todos los campos');

    // No debe llamarse a insert
    expect(mockInsert).not.toHaveBeenCalled();
  });

});