import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UiInput from './UiInput.vue';
import type { UiInputProps } from './types';

const VTextFieldStub = {
  name: 'VTextField',
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="{ 'error': errorMessages }"
      v-bind="$attrs"
    />
  `,
  props: ['modelValue', 'errorMessages', 'variant', 'density'],
  emits: ['update:modelValue']
};

describe('UiInput.vue', () => {
  describe('Rendering and Props', () => {
    it('renders input with default props', () => {
      const wrapper = mount(UiInput, {
        global: {
          stubs: {
            VTextField: VTextFieldStub
          }
        }
      });

      const input = wrapper.find('input');

      expect(input.exists()).toBe(true);
      expect(wrapper.props('error')).toBeUndefined();
    });

    it('applies error prop correctly', () => {
      const errorMessage = 'This field is required';
      const wrapper = mount(UiInput, {
        props: {
          error: errorMessage,
        } as UiInputProps,
        global: {
          stubs: {
            VTextField: VTextFieldStub
          }
        }
      });

      expect(wrapper.props('error')).toBe(errorMessage);

      const vTextField = wrapper.findComponent(VTextFieldStub);
      expect(vTextField.props('errorMessages')).toBe(errorMessage);
    });
  });

  describe('v-model and Events', () => {
    it('updates model value when input changes', async () => {
      const wrapper = mount(UiInput, {
        props: {
          modelValue: ''
        } as UiInputProps & { modelValue: string },
        global: {
          stubs: {
            VTextField: VTextFieldStub
          }
        }
      });

      const input = wrapper.find('input');
      await input.setValue('input value');

      // Проверяем, что emit сработал
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['input value']);
    });

    it('initializes with correct model value', () => {
      const wrapper = mount(UiInput, {
        props: {
          modelValue: 'init value'
        } as UiInputProps & { modelValue: string },
        global: {
          stubs: {
            VTextField: VTextFieldStub
          }
        }
      });

      const vTextField = wrapper.findComponent(VTextFieldStub);
      expect(vTextField.props('modelValue')).toBe('init value');
    });
  });

  describe('Attributes and Classes', () => {
    it('passes through additional attributes to v-text-field', () => {
      const wrapper = mount(UiInput, {
        attrs: {
          id: 'email-input',
          name: 'email',
          placeholder: 'enter email'
        },
        global: {
          stubs: {
            VTextField: VTextFieldStub
          }
        }
      });

      const input = wrapper.find('input');
      expect(input.attributes('id')).toBe('email-input');
      expect(input.attributes('name')).toBe('email');
      expect(input.attributes('placeholder')).toBe('enter email');
    });

    it('forwards slots to v-text-field', () => {
      const wrapper = mount(UiInput, {
        slots: {
          icon: '<span class="icon">🔍</span>',
        },
        global: {
          stubs: {
            VTextField: {
              ...VTextFieldStub,
              template: `
                      <div>
                        <input
                          :value="modelValue"
                          @input="$emit('update:modelValue', $event.target.value)"
                          :class="{ 'error': errorMessages }"
                          v-bind="$attrs"
                        />
                        <slot name="icon" />
                      </div>
                    `
            }
          }
        }
      });

      expect(wrapper.find('.icon').exists()).toBe(true);
      expect(wrapper.find('.icon').text()).toBe('🔍');
    });

    it('passes type attribute to input element', () => {
      const wrapper = mount(UiInput, {
        attrs: {
          type: 'password'
        },
        global: {
          stubs: {
            VTextField: VTextFieldStub
          }
        }
      });

      const input = wrapper.find('input');
      expect(input.attributes('type')).toBe('password');
    });
  });

  describe('Edge Cases', () => {
    it('handles long error messages', () => {
      const longErrorMessage = 'This is a very long error message that should be properly handled by the component without breaking the layout or causing any issues with the display';

      const wrapper = mount(UiInput, {
        props: {
          error: longErrorMessage
        } as UiInputProps,
        global: {
          stubs: {
            VTextField: VTextFieldStub
          }
        }
      });

      expect(wrapper.props('error')).toBe(longErrorMessage);

      const vTextField = wrapper.findComponent(VTextFieldStub);
      expect(vTextField.props('errorMessages')).toBe(longErrorMessage);
    });

    it('handles various input types correctly', () => {
      const inputTypes = [
        { type: 'email' },
        { type: 'password' },
        { type: 'number' },
        { type: 'tel' },
        { type: 'url' }
      ];

      inputTypes.forEach(({ type }) => {
        const wrapper = mount(UiInput, {
          attrs: { type },
          global: {
            stubs: {
              VTextField: VTextFieldStub
            }
          }
        });

        const input = wrapper.find('input');
        expect(input.attributes('type')).toBe(type);
      });
    });

    it('handles input with initial value and error simultaneously', () => {
      const wrapper = mount(UiInput, {
        props: {
          modelValue: 'initial value',
          error: 'Validation error'
        } as UiInputProps & { modelValue: string },
        global: {
          stubs: {
            VTextField: VTextFieldStub
          }
        }
      });

      const vTextField = wrapper.findComponent(VTextFieldStub);
      expect(vTextField.props('modelValue')).toBe('initial value');
      expect(vTextField.props('errorMessages')).toBe('Validation error');
    });

    it('applies error class when error is present', () => {
      const wrapper = mount(UiInput, {
        props: {
          error: 'Error message'
        } as UiInputProps,
        global: {
          stubs: {
            VTextField: {
              ...VTextFieldStub,
              template: `
                <input
                  :value="modelValue"
                  @input="$emit('update:modelValue', $event.target.value)"
                  :class="{ 'error': errorMessages }"
                  v-bind="$attrs"
                />
              `
            }
          }
        }
      });

      const input = wrapper.find('input');
      expect(input.classes()).toContain('error');
    });
  });
});
