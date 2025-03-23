import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AbrirTurno from './src/views/abrirTurno.vue'; // Ajusta esta ruta según donde esté tu componente
import { userLogin, turno, obtenerTurno } from '@/store/auth.js';
import { supabase } from '@/supabase/supabase';

// Mock de vue-draggable-resizable
vi.mock('vue-draggable-resizable', () => ({
  default: {
    props: ['w', 'h', 'x', 'y', 'resizable'],
    template: '<div><slot></slot></div>'
  }
}));

// Mock módulos
vi.mock('@/store/auth.js', () => ({
  userLogin: { value: 1 },
  turno: { value: false },
  obtenerTurno: vi.fn().mockResolvedValue(undefined)
}));

// Versión corregida del mock de supabase
vi.mock('@/supabase/supabase', () => {
  const insertMock = vi.fn().mockResolvedValue({
    data: [{ id: 1 }],
    error: null
  });
  
  const fromMock = vi.fn().mockReturnValue({
    insert: insertMock
  });
  
  return {
    supabase: {
      from: fromMock
    }
  };
});

describe('AbrirTurno Component', () => {
  beforeEach(() => {
    // Reiniciar mocks y estado
    vi.clearAllMocks();
    turno.value = false;
    userLogin.value = 1;
  });

  it('debe mostrar el componente cuando mostrar es true', async () => {
    const wrapper = mount(AbrirTurno, {
      props: {
        mostrar: true
      }
    });

    expect(wrapper.find('.internal-frame').exists()).toBe(true);
    expect(wrapper.find('.header').text()).toContain('Abrir turno');
  });

  it('no debe mostrar el componente cuando mostrar es false', async () => {
    const wrapper = mount(AbrirTurno, {
      props: {
        mostrar: false
      }
    });

    expect(wrapper.find('.internal-frame').exists()).toBe(false);
  });

  it('debe emitir evento cerrar al hacer clic en el botón X', async () => {
    const wrapper = mount(AbrirTurno, {
      props: {
        mostrar: true
      }
    });


    // Método simplificado para evitar problemas con trigger
    const closeBtn = wrapper.find('.close-btn');
    await closeBtn.trigger('click');
    
    expect(wrapper.emitted('cerrar')).toBeTruthy();
    expect(wrapper.emitted('cerrar').length).toBe(1);
  });

  it('debe emitir evento cerrar al hacer clic en cancelar', async () => {
    const wrapper = mount(AbrirTurno, {
      props: {
        mostrar: true
      }
    });

    // Método simplificado para evitar problemas con trigger
    const cancelBtn = wrapper.find('.cancel-btn');
    await cancelBtn.trigger('click');
    
    expect(wrapper.emitted('cerrar')).toBeTruthy();
    expect(wrapper.emitted('cerrar').length).toBe(1);
  });

  it('debe crear un nuevo turno cuando se confirma con monto inicial', async () => {
    const wrapper = mount(AbrirTurno, {
      props: {
        mostrar: true
      }
    });

    // Método alternativo para setValue
    const input = wrapper.find('input[placeholder="Monto"]');
    await input.setValue(100);

    // Método simplificado para evitar problemas con trigger
    const confirmBtn = wrapper.find('button:not(.close-btn):not(.cancel-btn)');
    await confirmBtn.trigger('click');

    // Verificar que se llamó a obtenerTurno
    expect(obtenerTurno).toHaveBeenCalledTimes(2); // Se llama al inicio y después de insertar

    // Verificar que se insertó el turno
    expect(supabase.from).toHaveBeenCalledWith('turnos');
    expect(supabase.from().insert).toHaveBeenCalledWith([
      expect.objectContaining({
        idusuario: 1,
        montoinicial: 100,
        fecha: expect.any(String),
        horaapertura: expect.any(String)
      })
    ]);

    // Verificar que se actualizó el estado del turno
    expect(turno.value).toBe(true);

    // Verificar que se emitieron los eventos
    expect(wrapper.emitted('turnoAbierto')).toBeTruthy();
    expect(wrapper.emitted('cerrar')).toBeTruthy();
  });

  it('no debe crear un turno si ya hay uno abierto', async () => {
    // Establecer que ya hay un turno abierto
    turno.value = true;

    const wrapper = mount(AbrirTurno, {
      props: {
        mostrar: true
      }
    });

    // Método alternativo para setValue
    const input = wrapper.find('input[placeholder="Monto"]');
    await input.setValue(100);

    // Espiar console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Método simplificado para evitar problemas con trigger
    const confirmBtn = wrapper.find('button:not(.close-btn):not(.cancel-btn)');
    await confirmBtn.trigger('click');

    // Verificar que se llamó a obtenerTurno
    expect(obtenerTurno).toHaveBeenCalledTimes(1); // Solo se llama una vez al inicio

    // Verificar que no se insertó ningún turno
    expect(supabase.from).not.toHaveBeenCalledWith('turnos');

    // Verificar que se mostró mensaje en consola
    expect(consoleSpy).toHaveBeenCalledWith('Ya hay un turno abierto');

    // Verificar que no se emitieron eventos
    expect(wrapper.emitted('turnoAbierto')).toBeFalsy();
    expect(wrapper.emitted('cerrar')).toBeFalsy();
  });

  it('debe manejar errores al crear un turno', async () => {
    // Mock para simular un error
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Error al insertar' }
      })
    });

    const wrapper = mount(AbrirTurno, {
      props: {
        mostrar: true
      }
    });

    // Método alternativo para setValue
    const input = wrapper.find('input[placeholder="Monto"]');
    await input.setValue(100);

    // Espiar console.error
    const consoleSpy = vi.spyOn(console, 'error');

    // Método simplificado para evitar problemas con trigger
    const confirmBtn = wrapper.find('button:not(.close-btn):not(.cancel-btn)');
    await confirmBtn.trigger('click');

    // Verificar que se llamó a console.error
    expect(consoleSpy).toHaveBeenCalledWith('Error:', 'Error al insertar');

    // Verificar que no se actualizó el estado del turno
    expect(turno.value).toBe(false);

    // Verificar que no se emitieron eventos
    expect(wrapper.emitted('turnoAbierto')).toBeFalsy();
    expect(wrapper.emitted('cerrar')).toBeFalsy();
  });
});
  

