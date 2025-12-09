import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UiSelect from './UiSelect.vue';
import type { UiSelectProps, UiSelectItem } from './types';

// Создаем stub для VSelect с явным именем
const VSelectStub = {
  name: 'VSelect',
  template: `
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    >
      <option
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        {{ item.title }}
      </option>
      <slot />
    </select>
  `,
  props: ['modelValue', 'items', 'errorMessages', 'variant', 'density'],
  emits: ['update:modelValue']
};

describe('UiSelect.vue', () => {
  const mockItems: UiSelectItem[] = [
    { title: 'Option 1', value: 'option1' },
    { title: 'Option 2', value: 'option2' },
    { title: 'Option 3', value: 'option3' }
  ];

  // Базовые тесты на рендеринг и пропсы
  describe('Rendering and Props', () => {
    it('renders select with default props', () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems
        } as UiSelectProps,
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const select = wrapper.find('select');
      const options = wrapper.findAll('option');

      expect(select.exists()).toBe(true);
      expect(options).toHaveLength(3);
      expect(options[0].text()).toBe('Option 1');
      expect(options[1].text()).toBe('Option 2');
      expect(options[2].text()).toBe('Option 3');
      expect(wrapper.props('error')).toBeUndefined();
    });

    it('applies items prop correctly', () => {
      const customItems: UiSelectItem[] = [
        { title: 'Test 1', value: 'test1' },
        { title: 'Test 2', value: 'test2' }
      ];

      const wrapper = mount(UiSelect, {
        props: {
          items: customItems
        } as UiSelectProps,
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const vSelect = wrapper.findComponent(VSelectStub);
      expect(vSelect.props('items')).toEqual(customItems);

      const options = wrapper.findAll('option');
      expect(options).toHaveLength(2);
      expect(options[0].text()).toBe('Test 1');
      expect(options[1].text()).toBe('Test 2');
    });

    it('applies error prop correctly', () => {
      const errorMessage = 'This field is required';

      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems,
          error: errorMessage
        } as UiSelectProps,
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      expect(wrapper.props('error')).toBe(errorMessage);

      const vSelect = wrapper.findComponent(VSelectStub);
      expect(vSelect.props('errorMessages')).toBe(errorMessage);
    });

    it('applies variant and density props correctly', () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems
        } as UiSelectProps,
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const vSelect = wrapper.findComponent(VSelectStub);
      expect(vSelect.props('variant')).toBe('outlined');
      expect(vSelect.props('density')).toBe('comfortable');
    });
  });

  // Тесты на v-model и события
  describe('v-model and Events', () => {
    it('updates model value when selection changes', async () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems,
          modelValue: ''
        } as UiSelectProps & { modelValue: string },
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const select = wrapper.find('select');
      await select.setValue('option2');

      // Проверяем, что emit сработал
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option2']);
    });

    it('initializes with correct model value', () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems,
          modelValue: 'option3'
        } as UiSelectProps & { modelValue: string },
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const vSelect = wrapper.findComponent(VSelectStub);
      expect(vSelect.props('modelValue')).toBe('option3');
    });

    it('handles multiple value changes', async () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems,
          modelValue: ''
        } as UiSelectProps & { modelValue: string },
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const select = wrapper.find('select');

      await select.setValue('option1');
      await select.setValue('option2');
      await select.setValue('option3');

      expect(wrapper.emitted('update:modelValue')).toHaveLength(3);
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option1']);
      expect(wrapper.emitted('update:modelValue')![1]).toEqual(['option2']);
      expect(wrapper.emitted('update:modelValue')![2]).toEqual(['option3']);
    });
  });

  // Тесты на атрибуты и классы
  describe('Attributes and Classes', () => {
    it('passes through additional attributes to v-select', () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems
        } as UiSelectProps,
        attrs: {
          id: 'country-select',
          'data-test-id': 'ui-select',
          name: 'country'
        },
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const select = wrapper.find('select');
      expect(select.attributes('id')).toBe('country-select');
      expect(select.attributes('data-test-id')).toBe('ui-select');
      expect(select.attributes('name')).toBe('country');
    });

    it('forwards slots to v-select', () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems
        } as UiSelectProps,
        slots: {
          prepend: '<span class="prepend-icon">🔍</span>',
          append: '<span class="append-text">Search</span>'
        },
        global: {
          stubs: {
            VSelect: {
              ...VSelectStub,
              template: `
                <select v-bind="$attrs">
                  <slot name="prepend" />
                  <option
                    v-for="item in items"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.title }}
                  </option>
                  <slot name="append" />
                </select>
              `
            }
          }
        }
      });

      expect(wrapper.find('.prepend-icon').exists()).toBe(true);
      expect(wrapper.find('.prepend-icon').text()).toBe('🔍');
      expect(wrapper.find('.append-text').exists()).toBe(true);
      expect(wrapper.find('.append-text').text()).toBe('Search');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: []
        } as UiSelectProps,
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const options = wrapper.findAll('option');
      expect(options).toHaveLength(0);

      const vSelect = wrapper.findComponent(VSelectStub);
      expect(vSelect.props('items')).toEqual([]);
    });

    it('handles items with special characters', () => {
      const specialItems: UiSelectItem[] = [
        { title: 'Option & "Special"', value: 'special' },
        { title: 'Option <with> tags', value: 'tags' }
      ];

      const wrapper = mount(UiSelect, {
        props: {
          items: specialItems
        } as UiSelectProps,
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const options = wrapper.findAll('option');
      expect(options[0].text()).toBe('Option & "Special"');
      expect(options[1].text()).toBe('Option <with> tags');
    });

    it('handles long error messages', () => {
      const longErrorMessage = 'This is a very long error message that should be properly handled by the component without breaking the layout or causing any issues with the display';

      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems,
          error: longErrorMessage
        } as UiSelectProps,
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      expect(wrapper.props('error')).toBe(longErrorMessage);

      const vSelect = wrapper.findComponent(VSelectStub);
      expect(vSelect.props('errorMessages')).toBe(longErrorMessage);
    });

    it('handles model value not in items', async () => {
      const wrapper = mount(UiSelect, {
        props: {
          items: mockItems,
          modelValue: 'non-existent-value'
        } as UiSelectProps & { modelValue: string },
        global: {
          stubs: {
            VSelect: VSelectStub
          }
        }
      });

      const vSelect = wrapper.findComponent(VSelectStub);
      expect(vSelect.props('modelValue')).toBe('non-existent-value');

      // Меняем на существующее значение
      const select = wrapper.find('select');
      await select.setValue('option2');

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option2']);
    });
  });
});
