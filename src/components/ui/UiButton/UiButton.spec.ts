import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UiButton from './UiButton.vue';
import type { UiButtonProps } from './types';

// Создаем stub для VBtn с явным именем
const VBtnStub = {
  name: 'VBtn',
  template: `
    <button
      :disabled="disabled || loading"
      :class="['text-none', $attrs.class]"
      @click="!disabled && !loading && $emit('click')"
      v-bind="$attrs"
    >
      <slot />
    </button>
  `,
  props: ['loading', 'disabled', 'color'],
  emits: ['click']
};

describe('UiButton.vue', () => {
  // Базовые тесты на рендеринг и пропсы
  describe('Rendering and Props', () => {
    it('renders button with default props', () => {
      const wrapper = mount(UiButton, {
        slots: {
          default: 'Click me'
        },
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      const button = wrapper.find('button');
      expect(button.text()).toBe('Click me');
      expect(wrapper.props('loading')).toBe(false);
      expect(wrapper.props('disabled')).toBe(false);
      expect(wrapper.props('color')).toBeUndefined();
    });

    it('applies loading prop correctly', () => {
      const wrapper = mount(UiButton, {
        props: {
          loading: true
        } as UiButtonProps,
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      expect(wrapper.props('loading')).toBe(true);

      // Проверяем через атрибут disabled (так как loading тоже делает кнопку неактивной)
      const button = wrapper.find('button');
      expect(button.attributes('disabled')).toBeDefined();
    });

    it('applies disabled prop correctly', () => {
      const wrapper = mount(UiButton, {
        props: {
          disabled: true
        } as UiButtonProps,
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      expect(wrapper.props('disabled')).toBe(true);

      const button = wrapper.find('button');
      expect(button.attributes('disabled')).toBeDefined();
    });

    it('applies color prop correctly', () => {
      const color = 'primary';
      const wrapper = mount(UiButton, {
        props: {
          color
        } as UiButtonProps,
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      expect(wrapper.props('color')).toBe(color);

      // Для color просто проверяем, что пропс передается в компонент
      // В реальном Vuetify color преобразуется в классы/стили
      const vBtn = wrapper.findComponent(VBtnStub);
      expect(vBtn.props('color')).toBe(color);
    });

    it('renders slot content correctly', () => {
      const slotContent = 'Custom Button Text';
      const wrapper = mount(UiButton, {
        slots: {
          default: slotContent
        },
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      const button = wrapper.find('button');
      expect(button.text()).toBe(slotContent);
    });
  });

  // Тесты на события
  describe('Events', () => {
    it('emits click event when clicked', async () => {
      const wrapper = mount(UiButton, {
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      await wrapper.find('button').trigger('click');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('does not emit click when disabled', async () => {
      const wrapper = mount(UiButton, {
        props: {
          disabled: true
        } as UiButtonProps,
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      await wrapper.find('button').trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('does not emit click when loading', async () => {
      const wrapper = mount(UiButton, {
        props: {
          loading: true
        } as UiButtonProps,
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      await wrapper.find('button').trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });
  });

  // Тесты на атрибуты и классы
  describe('Attributes and Classes', () => {
    it('passes through additional attributes to v-btn', () => {
      const wrapper = mount(UiButton, {
        attrs: {
          id: 'submit-button',
          'data-test-id': 'ui-button',
          type: 'submit'
        },
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      const button = wrapper.find('button');
      expect(button.attributes('id')).toBe('submit-button');
      expect(button.attributes('data-test-id')).toBe('ui-button');
      expect(button.attributes('type')).toBe('submit');
    });

    it('applies text-none class for text transformation', () => {
      const wrapper = mount(UiButton, {
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('text-none');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles complex slot content', () => {
      const wrapper = mount(UiButton, {
        slots: {
          default: '<span class="icon">★</span><span class="text">Favorite</span>'
        },
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      const button = wrapper.find('button');
      expect(button.find('.icon').exists()).toBe(true);
      expect(button.find('.text').exists()).toBe(true);
      expect(button.find('.icon').text()).toBe('★');
      expect(button.find('.text').text()).toBe('Favorite');
    });

    it('handles multiple click events correctly', async () => {
      const wrapper = mount(UiButton, {
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      const button = wrapper.find('button');
      await button.trigger('click');
      await button.trigger('click');
      await button.trigger('click');

      expect(wrapper.emitted('click')).toHaveLength(3);
    });

    it('handles both loading and disabled states', () => {
      const wrapper = mount(UiButton, {
        props: {
          loading: true,
          disabled: true
        } as UiButtonProps,
        global: {
          stubs: {
            VBtn: VBtnStub
          }
        }
      });

      const button = wrapper.find('button');
      expect(button.attributes('disabled')).toBeDefined();
      expect(wrapper.props('loading')).toBe(true);
      expect(wrapper.props('disabled')).toBe(true);
    });
  });
});
