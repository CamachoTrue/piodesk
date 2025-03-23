import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import AbrirTurno from '@/views/abrirTurno.vue'

// Mock del componente vue-draggable-resizable
vi.mock('vue-draggable-resizable', () => ({
  default: {
    template: '<div><slot/></div>'
  }
}))

describe('AbrirTurno Component', () => {
  it('se muestra cuando la prop "mostrar" es true', () => {
    const wrapper = mount(AbrirTurno, {
      props: { mostrar: true, userLogin: 1 }
    })

    const modal = wrapper.find('.internal-frame')
    expect(modal.exists()).toBe(true) // Se asegura de que la ventana está en el DOM
  })

  it('permite ingresar un monto en el input', async () => {
    const wrapper = mount(AbrirTurno, {
      props: { mostrar: true, userLogin: 1 }
    })

    const input = wrapper.find('input[type="number"]')
    await input.setValue(500)

    expect(input.element.value).toBe('500')
  })

  it('emite el evento "cerrar" al presionar el botón de cerrar', async () => {
    const wrapper = mount(AbrirTurno, {
      props: { mostrar: true, userLogin: 1 }
    })

    const closeButton = wrapper.find('.close-btn')
    expect(closeButton.exists()).toBe(true)
    //cerrar ventana
    await closeButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('cerrar')
  })
})
