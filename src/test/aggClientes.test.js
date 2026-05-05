import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AggClientes from '@/views/Domicilio/aggClientes.vue'; // Ajusta si el nombre es diferente

vi.mock('vue-draggable-resizable', () => ({
  default: { template: '<div><slot /></div>' },
}));

const mockIdCliente = { value: null };

vi.mock('@/store/auth.js', () => ({
  get idCliente() { return mockIdCliente; },
  idDireccion: { value: null },
  idPedido: { value: null },
  numPedidos: { value: 0 },
  idTurno: { value: 1 },
}));

//  Mock: supabase 
// El componente usa: clientes, direcciones, pedidos
const mockSelectClientes = vi.fn();
const mockSelectDirecciones = vi.fn();
const mockSelectPedidos = vi.fn();
const mockInsertClientes = vi.fn();
const mockInsertDirecciones = vi.fn();
const mockUpdateClientes = vi.fn();
const mockUpdateDirecciones = vi.fn();
vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn((tabla) => {
      if (tabla === 'clientes') return {
        select: mockSelectClientes,
        insert: mockInsertClientes,
        update: mockUpdateClientes,
      };
      if (tabla === 'direcciones') return {
        select: mockSelectDirecciones,
        insert: mockInsertDirecciones,
        update: mockUpdateDirecciones,
      };
      if (tabla === 'pedidos') return {
        select: mockSelectPedidos,
      };
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

const mockRpc = vi.fn();

// Datos de prueba
const clienteExistente = { idcliente: 1, nombre: 'Jose Carlos', numero: 6441234567 };
const direccionExistente = {
  iddireccion: 1, idcliente: 1,
  calle: 'Rio Panuco', colonia: 'Francisco Villa',
  numcasa: 614, interseccion1: null, interseccion2: null, referencias: null,
};

const mountComponent = () =>
  mount(AggClientes, {
    props: { mostrar: true },
    global: {
      stubs: {
        VueDraggableResizable: { template: '<div><slot /></div>' },
      },
    },
  });

describe('AggClientes Component - PioDesk', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    mockIdCliente.value = null;
    });

  // TC_CLI_001 
  it('TC_CLI_001 - Buscar por telefono: cliente encontrado y se autorrellena', async () => {
    // searchCliente consulta clientes con .or(numero.eq / nombre.eq)
    mockSelectClientes.mockReturnValue({
      or: vi.fn().mockResolvedValue({
        data: [clienteExistente], error: null,
      }),
    });

    // consultarDireccion
    mockSelectDirecciones.mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [direccionExistente], error: null,
      }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Ingresar numero en el buscador
    await wrapper.find('input.search-input').setValue('6441234567');

    // Click en Buscar
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Los campos deben haberse rellenado con los datos del cliente
    expect(wrapper.find('input[type="text"].input-control').element.value).toBe('Jose Carlos');
  });

  // TC_CLI_002 
  it('TC_CLI_002 - Llenar campos y agregar: cliente guardado exitosamente', async () => {
    // consultarCliente (idCliente es null, va al else = insert)
    mockSelectClientes.mockResolvedValueOnce({ data: [], error: null });

    // insert clientes
    mockInsertClientes.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ idcliente: 1, nombre: 'Jose Carlos', numero: 6441234567 }],
        error: null,
      }),
    });

    // insert direcciones
    mockInsertDirecciones.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ iddireccion: 1 }],
        error: null,
      }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Llenar formulario
    const inputs = wrapper.findAll('input[type="text"].input-control');
    await inputs[0].setValue('Jose Carlos'); // Contacto
    await inputs[1].setValue('Rio Panuco');  // Calle
    await inputs[2].setValue('Francisco Villa'); // Colonia

    await wrapper.find('input[type="number"].input-chico').setValue(6441234567); // Telefono

    // Click en Agregar 
    await wrapper.findAll('button.button')[1].trigger('click');
    await flushPromises();

    expect(mockInsertClientes).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: 'Jose Carlos',
          numero: 6441234567,
        }),
      ])
    );
    expect(mockInsertDirecciones).toHaveBeenCalled();
  });

  // TC_CLI_003 
  it('TC_CLI_003 - Buscar cliente existente y actualizar: cliente actualizado exitosamente', async () => {
    // searchCliente encuentra al cliente
    mockSelectClientes.mockReturnValue({
      or: vi.fn().mockResolvedValue({
        data: [clienteExistente], error: null,
      }),
    });

    // consultarDireccion
    mockSelectDirecciones.mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [direccionExistente], error: null,
      }),
    });

    const wrapper = mountComponent();
    await flushPromises();

    // Buscar cliente
    await wrapper.find('input.search-input').setValue('6441234567');
    await wrapper.find('button.button').trigger('click');
    await flushPromises();

    // Simular que idCliente ya tiene valor 
    mockIdCliente.value = 1;

    // mockSelectClientes para consultarCliente dentro de aggCliente
    mockSelectClientes.mockResolvedValueOnce({ data: [clienteExistente], error: null });

    // update clientes
    mockUpdateClientes.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    // consultarDireccion dentro de aggCliente 
    mockSelectDirecciones.mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [direccionExistente], error: null,
      }),
    });

    // update direcciones
    mockUpdateDirecciones.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    // Modificar cruzamientos
    const inputsText = wrapper.findAll('input[type="text"].input-control');
    await inputsText[3].setValue('Esq Guadalupe'); // cruzamiento1
    await inputsText[4].setValue('Victoria');      // cruzamiento2

    // Click en Agregar
    await wrapper.findAll('button.button')[1].trigger('click');
    await flushPromises();

    expect(mockUpdateClientes).toHaveBeenCalled();
    expect(mockUpdateDirecciones).toHaveBeenCalled();
  });

  // TC_CLI_004 
  it('TC_CLI_004 - Campos obligatorios vacios: muestra error "Llenar campos obligatorios"', async () => {
    mockSelectClientes.mockResolvedValueOnce({ data: [], error: null });

    const wrapper = mountComponent();
    await flushPromises();

    // Llenar solo algunos campos, dejar calle vacia
    const inputs = wrapper.findAll('input[type="text"].input-control');
    await inputs[0].setValue('Jose Carlos'); // Contacto
    // Calle se deja vacia
    await inputs[2].setValue('Francisco Villa'); // Colonia

    // Click en Agregar
    await wrapper.findAll('button.button')[1].trigger('click');
    await flushPromises();

    // Debe mostrarse error visible
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').text()).toContain('Llenar campos obligatorios');

    // No debe llamarse a insert
    expect(mockInsertClientes).not.toHaveBeenCalled();
  });

});