import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AggSubGrupo from '@/views/ProductosCompuestos/aggSubgrupo.vue'; 

//  Mock: vue-draggable-resizable 
vi.mock('vue-draggable-resizable', () => ({
  default: { template: '<div><slot /></div>' },
}));

// ─── Mock: supabase ───────────────────────────────────────────────────────────
const mockSelectSubgrupos = vi.fn();
const mockSelectGrupos = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn((tabla) => {
      if (tabla === 'subgrupos') {
        return {
          select: mockSelectSubgrupos,
          insert: mockInsert,
          update: mockUpdate,
          delete: mockDelete,
        };
      }
      if (tabla === 'grupos') {
        return {
          select: mockSelectGrupos,
        };
      }
    }),
  },
}));

// Datos de prueba
const gruposBebidas = [{ idgrupo: 1, nombre: 'Bebidas' }];
const gruposAguasFrescas = [{ idgrupo: 1, nombre: 'Bebidas' }, { idgrupo: 2, nombre: 'Aguas Frescas' }];
const subGrupoExistente = { idsubgrupo: 1, nombre: 'Refrescos', idgrupo: 1 };

const mountComponent = () =>
  mount(AggSubGrupo, {
    props: { mostrar: true },
    global: {
      stubs: {
        VueDraggableResizable: { template: '<div><slot /></div>' },
      },
    },
  });

describe('AggSubGrupo Component - PioDesk', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC_SUBGRUP_001 
  it('TC_SUBGRUP_001 - Descripcion "Refrescos" con Grupo "Bebidas": subgrupo creado exitosamente', async () => {
    mockSelectGrupos.mockResolvedValueOnce({ data: gruposBebidas, error: null });
    mockSelectSubgrupos.mockResolvedValueOnce({ data: [], error: null });
    mockSelectSubgrupos.mockResolvedValueOnce({ data: [], error: null });
    mockSelectGrupos.mockResolvedValueOnce({ data: gruposBebidas, error: null });

    mockSelectSubgrupos.mockResolvedValueOnce({ data: [], error: null });

    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ idsubgrupo: 1, nombre: 'Refrescos', idgrupo: 1 }],
        error: null,
      }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Llenar descripcion
    await wrapper.find('input[type="text"]').setValue('Refrescos');

    // Seleccionar grupo "Bebidas"
    await wrapper.find('select').setValue('Bebidas');

    // Click en Guardar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: 'Refrescos',
          idgrupo: 1,
        }),
      ])
    );
  });

  // TC_SUBGRUP_002 
  it('TC_SUBGRUP_002 - Doble click y editar con Grupo "Aguas Frescas": subgrupo actualizado exitosamente', async () => {
    // onMounted
    mockSelectGrupos.mockResolvedValueOnce({ data: gruposAguasFrescas, error: null });
    mockSelectSubgrupos.mockResolvedValueOnce({ data: [subGrupoExistente], error: null });

    // aggSubGrupo: recarga para verificar si existe
    mockSelectSubgrupos.mockResolvedValueOnce({ data: [subGrupoExistente], error: null });
    mockSelectGrupos.mockResolvedValueOnce({ data: gruposAguasFrescas, error: null });

    // cargarSubGrupos post-update
    mockSelectSubgrupos.mockResolvedValueOnce({ data: [subGrupoExistente], error: null });

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Doble click en la fila para autorellenar
    await wrapper.find('tbody tr').trigger('dblclick');
    await flushPromises();

    // Cambiar grupo a "Aguas Frescas"
    await wrapper.find('select').setValue('Aguas Frescas');

    // Click en Guardar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Refrescos',
        idgrupo: 2, // id de "Aguas Frescas"
      })
    );
  });

  // TC_SUBGRUP_003 

  it.skip('TC_SUBGRUP_003 - Formulario incompleto: muestra error "Llenar todos los campos"', async () => {
    // onMounted
    mockSelectGrupos.mockResolvedValueOnce({ data: gruposBebidas, error: null });
    mockSelectSubgrupos.mockResolvedValueOnce({ data: [], error: null });

    mockSelectSubgrupos.mockResolvedValueOnce({ data: [], error: null });
    mockSelectGrupos.mockResolvedValueOnce({ data: gruposBebidas, error: null });

    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Dejar campos vacios y click en Guardar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Debe mostrarse error visible
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('Llenar todos los campos');

    // No debe llamarse a insert ni update
    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  // TC_SUBGRUP_004 
  it('TC_SUBGRUP_004 - Doble click y eliminar: subgrupo eliminado exitosamente', async () => {
    // onMounted
    mockSelectGrupos.mockResolvedValueOnce({ data: gruposBebidas, error: null });
    mockSelectSubgrupos.mockResolvedValueOnce({ data: [subGrupoExistente], error: null });

    // cargarSubGrupos post-delete
    mockSelectSubgrupos.mockResolvedValueOnce({ data: [], error: null });

    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Doble click para seleccionar subgrupo
    await wrapper.find('tbody tr').trigger('dblclick');
    await flushPromises();

    // Click en Eliminar 
    await wrapper.findAll('button.button')[1].trigger('click');
    await flushPromises();

    expect(mockDelete).toHaveBeenCalled();
  });

});