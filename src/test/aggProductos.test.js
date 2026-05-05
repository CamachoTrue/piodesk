import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AggProductos from '@/views/aggProductos.vue';

vi.mock('vue-draggable-resizable', () => ({
  default: { template: '<div><slot /></div>' },
}));

// Mock: componentes hijos
vi.mock('./productoComp.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./ProductosCompuestos/aggGrupo.vue', () => ({ default: { template: '<div />' } }));
vi.mock('./ProductosCompuestos/aggSubgrupo.vue', () => ({ default: { template: '<div />' } }));

vi.mock('@vue/compiler-sfc', () => ({ errorMessages: vi.fn() }));
vi.mock('postcss/lib/list', () => ({ comma: vi.fn() }));

vi.mock('../store/auth.js', () => ({
  claveProducto: { value: null },
}));

//Mock: supabase 
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('../supabase/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    })),
  },
}));

//Datos de prueba
const productoExistente = {
  idproducto: 1,
  nombre: 'Boneless Personales',
  precio: 135,
  preciosinimporte: 116.38,
  compuesto: false,
  idgrupo: 1,
  idsubgrupo: null,
};

const mountComponent = () =>
  mount(AggProductos, {
    props: { mostrar: true },
    global: {
      stubs: {
        VueDraggableResizable: { template: '<div><slot /></div>' },
        productoComp: { template: '<div />' },
        aggGrupo: { template: '<div />' },
        aggSubgrupo: { template: '<div />' },
      },
    },
  });

describe('AggProductos Component - PioDesk', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockResolvedValue({ data: [], error: null });
  });

  // TC_PROD_001 
  it('TC_PROD_001 - Datos completos: producto agregado exitosamente', async () => {
    // onMounted carga productos (lista vacia)
    mockSelect.mockResolvedValueOnce({ data: [], error: null });

    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ idproducto: 1, nombre: 'Boneless Personales', precio: 130 }],
        error: null,
      }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Llenar formulario con los datos
    await wrapper.find('input.grupo').setValue(1);
    await wrapper.find('input.descripcion').setValue('Boneless Personales');
    await wrapper.find('input.precio').setValue(130);

    // Click en Guardar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: 'Boneless Personales',
          precio: 130,
          idgrupo: 1,
        }),
      ])
    );
  });

  // TC_PROD_002 
  it('TC_PROD_002 - Doble click en producto existente y guardar: producto actualizado', async () => {
    // onMounted devuelve el producto
    mockSelect.mockResolvedValueOnce({ data: [productoExistente], error: null });
    // consultarProductos post-update
    mockSelect.mockResolvedValueOnce({ data: [productoExistente], error: null });

    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Doble click en la fila para autorellenar
    await wrapper.find('tbody tr').trigger('dblclick');
    await flushPromises();

    // Modificar precio
    await wrapper.find('input.precio').setValue(135);

    // Click en Guardar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Boneless Personales',
        precio: 135,
      })
    );
  });

  // TC_PROD_003
  it('TC_PROD_003 - Doble click en producto existente y eliminar: producto eliminado', async () => {
    mockSelect.mockResolvedValueOnce({ data: [productoExistente], error: null });
    mockSelect.mockResolvedValueOnce({ data: [], error: null }); // post-delete

    mockDelete.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Doble click para seleccionar
    await wrapper.find('tbody tr').trigger('dblclick');
    await flushPromises();

    // Click en Eliminar (segundo boton)
    await wrapper.findAll('button.button')[1].trigger('click');
    await flushPromises();

    expect(mockDelete).toHaveBeenCalled();
  });

  // TC_PROD_004 
  it('TC_PROD_004 - Producto compuesto marcado: producto compuesto agregado exitosamente', async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null });

    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ idproducto: 2, nombre: 'Boneless Personales', precio: 130, compuesto: true }],
        error: null,
      }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    await wrapper.find('input.grupo').setValue(1);
    await wrapper.find('input.descripcion').setValue('Boneless Personales');
    await wrapper.find('input.precio').setValue(130);

    // Marcar el checkbox de producto compuesto
    await wrapper.find('input.producto-checkbox').setValue(true);

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: 'Boneless Personales',
          precio: 130,
          compuesto: true,
        }),
      ])
    );
  });

  // TC_PROD_005 
  it('TC_PROD_005 - Grupo inexistente (56): muestra error "No existe grupo con clave 56"', async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null });

    const wrapper = mountComponent();
    await flushPromises();

    await wrapper.find('input.grupo').setValue(56); // grupo que no existe
    await wrapper.find('input.descripcion').setValue('Boneless Personales');
    await wrapper.find('input.precio').setValue(130);

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Debe mostrarse error visible
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('No existe grupo');

    // No debe llamarse a insert
    expect(mockInsert).not.toHaveBeenCalled();
  });

  // TC_PROD_006 
  it('TC_PROD_006 - Campos obligatorios vacios: muestra error "Llenar los campos obligatorios"', async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null });

    const wrapper = mountComponent();
    await flushPromises();

    // Solo llenar descripcion, dejar grupo y precio vacios
    await wrapper.find('input.descripcion').setValue('Coca');
    await wrapper.find('input.precio').setValue(35);
    // grupo se deja vacio

    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Debe mostrarse error visible
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('Llenar los campos obligatorios');

    // No debe llamarse a insert
    expect(mockInsert).not.toHaveBeenCalled();
  });

});