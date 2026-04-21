import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AggGrupos from '@/views/ProductosCompuestos/aggGrupo.vue'; 

// ─── Mock: vue-draggable-resizable ────────────────────────────────────────────
vi.mock('vue-draggable-resizable', () => ({
  default: { template: '<div><slot /></div>' },
}));

// ─── Mock: typescript (el componente importa getJSDocReadonlyTag innecesariamente)
vi.mock('typescript', () => ({
  getJSDocReadonlyTag: vi.fn(),
}));

// ─── Mock: supabase ───────────────────────────────────────────────────────────
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    })),
  },
}));

// ─── Helper ───────────────────────────────────────────────────────────────────
const mountComponent = () =>
  mount(AggGrupos, {
    props: { mostrar: true },
    global: {
      stubs: {
        VueDraggableResizable: { template: '<div><slot /></div>' },
      },
    },
  });

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('AggGrupos Component - PioDesk', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockResolvedValue({ data: [], error: null });
  });

  // TC_GRUP_001 ─────────────────────────────────────────────────────────────────
  it('TC_GRUP_001 - Descripcion "Bebidas" nuevo: grupo creado exitosamente', async () => {
    mockSelect
      .mockResolvedValueOnce({ data: [], error: null })  // onMounted
      .mockResolvedValueOnce({ data: [], error: null })  // aggGrupo cargarGrupos
      .mockResolvedValueOnce({ data: [], error: null }); // cargarGrupos post-insert

    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ idgrupo: 1, nombre: 'Bebidas' }],
        error: null,
      }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    await wrapper.find('input[type="text"]').setValue('Bebidas');

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ nombre: 'Bebidas' }),
      ])
    );
  });

  // TC_GRUP_002 ─────────────────────────────────────────────────────────────────
  it('TC_GRUP_002 - Doble click en grupo existente y editar descripcion: grupo actualizado exitosamente', async () => {
    const grupoExistente = { idgrupo: 1, nombre: 'Bebidas' };

    mockSelect
      .mockResolvedValueOnce({ data: [grupoExistente], error: null }) // onMounted
      .mockResolvedValueOnce({ data: [grupoExistente], error: null }) // aggGrupo cargarGrupos
      .mockResolvedValueOnce({ data: [grupoExistente], error: null }); // cargarGrupos post-update

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Doble click en la fila para autorellenar el formulario
    await wrapper.find('tbody tr').trigger('dblclick');
    await flushPromises();

    // Editar descripcion
    await wrapper.find('input[type="text"]').setValue('Samplers');

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Samplers' })
    );
  });

  // TC_GRUP_003 ─────────────────────────────────────────────────────────────────
  // FALLA INTENCIONALMENTE: el componente no valida campo descripcion vacio.
  it('TC_GRUP_003 - Campo descripcion vacio: muestra error "Llenar campo de descripcion"', async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null }); // onMounted

    const wrapper = mountComponent();
    await flushPromises();

    // Dejar descripcion vacia y click en Guardar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Debe mostrarse error visible
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('Llenar campo de descripcion');

    // No debe llamarse a insert ni update
    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  // TC_GRUP_004 ─────────────────────────────────────────────────────────────────
  it('TC_GRUP_004 - Doble click en grupo existente y eliminar: grupo eliminado exitosamente', async () => {
    const grupoExistente = { idgrupo: 1, nombre: 'Bebidas' };

    mockSelect
      .mockResolvedValueOnce({ data: [grupoExistente], error: null }) // onMounted
      .mockResolvedValueOnce({ data: [], error: null });              // cargarGrupos post-delete

    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Doble click para autorellenar
    await wrapper.find('tbody tr').trigger('dblclick');
    await flushPromises();

    // Click en Eliminar (segundo boton)
    await wrapper.findAll('button.button')[1].trigger('click');
    await flushPromises();

    expect(mockDelete).toHaveBeenCalled();
  });

});